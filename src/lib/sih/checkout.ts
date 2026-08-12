import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { brand } from "@/lib/brand";
import { TransfermitAPI } from "@/lib/payments/transfermit";
import { sendAlert } from "@/lib/alerts/telegram";
import { sihClient } from "./client";
import { computeSellPrice, round2 } from "./pricing";
import { logSihEvent, applySihOrderObject } from "./orders";
import { SihError, userMessageForSih } from "./errors";

export class CheckoutError extends Error {
  constructor(
    public code:
      | "unauthenticated"
      | "no_steam"
      | "no_trade_url"
      | "item_unavailable"
      | "price_unavailable"
      | "payment_failed",
    message: string,
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

// Transfermit rejects names containing digits (validation: ^[a-zA-Z _\W]*$).
// Keep only letters and spaces; fall back to a safe placeholder when empty.
function safeName(raw: string | null | undefined, fallback: string): string {
  const cleaned = (raw ?? "").replace(/[^\p{L} ]/gu, " ").replace(/\s+/g, " ").trim();
  return cleaned || fallback;
}

export interface CreateCheckoutParams {
  userId: string;
  marketHashName: string;
  ip: string;
  baseUrl: string;
}

export interface CreateCheckoutResult {
  orderId: string;
  paymentUrl: string;
  amount: number;
  currency: string;
}

// Build a Transfermit billing address from the user's default address, falling
// back to the registered company particulars (Transfermit requires all fields).
async function resolveBilling(userId: string, name: { first: string; last: string }) {
  const addr = await prisma.address.findFirst({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
  if (addr) {
    return {
      addressLine1: addr.address1,
      addressLine2: addr.address2 || undefined,
      city: addr.city,
      countryCode: addr.country,
      postalCode: addr.postalCode,
      state: addr.province || undefined,
    };
  }
  return {
    addressLine1: brand.company.address.line1,
    addressLine2: brand.company.address.line2 || undefined,
    city: brand.company.address.city,
    countryCode: "LT",
    postalCode: brand.company.address.postcode,
    state: brand.company.address.region || undefined,
  };
}

// Create an order + start a Transfermit payment. Re-confirms the live SIH price
// first: if the supplier cost grew beyond SIH_PRICE_TOLERANCE we re-price the
// storefront line (and the sih_items row) and charge the fresh amount. Never
// touches SIH's create-order here — that happens only after payment succeeds.
export async function createSihCheckout(
  params: CreateCheckoutParams,
): Promise<CreateCheckoutResult> {
  const { userId, marketHashName, ip, baseUrl } = params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { steamAccount: true },
  });
  if (!user) throw new CheckoutError("unauthenticated", "Please sign in to continue.");

  const steam = user.steamAccount;
  if (!steam) throw new CheckoutError("no_steam", "Link your Steam account first.");
  if (!steam.tradeUrlVerified || !steam.tradeToken || !steam.steamId64) {
    throw new CheckoutError("no_trade_url", "Add and verify your Steam trade URL first.");
  }

  const item = await prisma.sihItem.findUnique({ where: { marketHashName } });
  if (!item || !item.isAvailable || item.count <= 0) {
    throw new CheckoutError("item_unavailable", "This item is no longer available.");
  }

  // Re-confirm live price/stock at the supplier.
  let liveCost: number;
  let liveCount: number;
  try {
    const min = await sihClient.getMinItem(marketHashName, item.appId);
    if (!min.found || min.price == null || min.count <= 0) {
      throw new CheckoutError("item_unavailable", "This item just went out of stock.");
    }
    liveCost = round2(min.price);
    liveCount = min.count;
  } catch (err) {
    if (err instanceof CheckoutError) throw err;
    throw new CheckoutError(
      "price_unavailable",
      "Could not confirm the live price. Please try again.",
    );
  }

  const storedCost = Number(item.costPrice);
  const grew = liveCost > storedCost * (1 + env.SIH_PRICE_TOLERANCE);

  // Storefront price: recompute from live cost when it moved materially, else
  // honor the synced sellPrice the user was shown.
  const costPrice = liveCost;
  const shownPrice = grew ? computeSellPrice(liveCost) : Number(item.sellPrice);
  const margin = round2(shownPrice - costPrice);

  // Keep the catalog row honest if the price/stock moved.
  if (grew || liveCount !== item.count) {
    await prisma.sihItem.update({
      where: { marketHashName },
      data: {
        costPrice: new Prisma.Decimal(costPrice),
        sellPrice: new Prisma.Decimal(grew ? shownPrice : Number(item.sellPrice)),
        count: liveCount,
        syncedAt: new Date(),
      },
    });
  }

  const order = await prisma.sihOrder.create({
    data: {
      userId,
      marketHashName,
      shownPrice: new Prisma.Decimal(shownPrice),
      costPrice: new Prisma.Decimal(costPrice),
      margin: new Prisma.Decimal(margin),
      currency: "USD",
      status: "awaiting_payment",
      steamId: steam.steamId64,
      tradeToken: steam.tradeToken,
    },
  });
  await logSihEvent({ orderId: order.id, source: "system", toStatus: "awaiting_payment" });

  // Start the payment. On any failure the order is discarded (no money moved).
  try {
    const api = new TransfermitAPI();
    const first = safeName(user.firstName || user.name?.split(" ")[0], "Customer");
    const last = safeName(user.lastName || user.name?.split(" ").slice(1).join(" "), "Buyer");
    const billing = await resolveBilling(userId, { first, last });

    const res = await api.createPayment({
      amount: shownPrice,
      currency: "USD",
      referenceId: order.id,
      customer: {
        referenceId: order.id,
        firstName: first,
        lastName: last,
        email: user.email || `${steam.steamId64}@steam.local`,
        phone: user.phone || undefined,
        ip,
      },
      billingAddress: billing,
      returnUrl: `${baseUrl}/my-purchases?order=${order.id}`,
      webhookUrl: `${baseUrl}/api/webhooks/sih-payment`,
    });

    const paymentId = res.result?.id;
    const paymentUrl = res.result?.redirectUrl;
    if (!paymentId || !paymentUrl) {
      throw new Error(res.error || res.message || "Transfermit returned no redirect URL");
    }

    await prisma.sihOrder.update({
      where: { id: order.id },
      data: { paymentProviderId: paymentId },
    });

    return { orderId: order.id, paymentUrl, amount: shownPrice, currency: "USD" };
  } catch (err) {
    console.error(`[sih-checkout] payment init failed for order ${order.id}: ${String(err)}`);
    // Nothing has been charged; drop the pending order so stock isn't held.
    await prisma.sihOrder.delete({ where: { id: order.id } }).catch(() => {});
    throw new CheckoutError("payment_failed", "Payment could not be started. Please try again.");
  }
}

// Called once the payment webhook confirms funds. Idempotent + single-flight:
// it atomically claims the order (paid -> submitted) so a duplicate webhook /
// retry can never submit to SIH twice. On a SIH failure the order is parked in
// `refund_pending` and an operator is alerted (Transfermit has no refund API).
export async function submitOrderToSih(orderId: string): Promise<void> {
  // Atomic claim: only the caller that flips paid -> submitted proceeds.
  const claim = await prisma.sihOrder.updateMany({
    where: { id: orderId, status: "paid" },
    data: { status: "submitted", submittedAt: new Date() },
  });
  if (claim.count === 0) {
    // Not in `paid` (already submitted, or not paid yet) — nothing to do.
    return;
  }

  const order = await prisma.sihOrder.findUnique({ where: { id: orderId } });
  if (!order) return;

  await logSihEvent({
    orderId,
    source: "payment",
    fromStatus: "paid",
    toStatus: "submitted",
  });

  try {
    const result = await sihClient.createOrder({
      steamId: order.steamId,
      token: order.tradeToken,
      amount: Number(order.costPrice),
      item: order.marketHashName,
      customId: order.id,
    });
    await applySihOrderObject(orderId, result, "system");
  } catch (err) {
    const message =
      err instanceof SihError ? userMessageForSih(err.code) : "unexpected SIH failure";
    await prisma.sihOrder.update({
      where: { id: orderId },
      data: {
        status: "refund_pending",
        sihError: err instanceof SihError ? err.code : String(err),
      },
    });
    await logSihEvent({
      orderId,
      source: "system",
      fromStatus: "submitted",
      toStatus: "refund_pending",
      payload: { error: err instanceof SihError ? err.code : String(err) },
    });
    await sendAlert(
      `SIH order <b>${orderId}</b> failed after payment (${message}). ` +
        `Item: ${order.marketHashName}. Manual refund required — parked as refund_pending.`,
      "critical",
    );
  }
}
