import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { logSihEvent } from "@/lib/sih/orders";
import { submitOrderToSih } from "@/lib/sih/checkout";

export const runtime = "nodejs";

// Transfermit payment webhook for SIH storefront orders. Distinct from the
// legacy /api/webhooks/transfermit (which drives the physical-goods Order
// model). referenceId here is a SihOrder.id.
//
// Flow: verify HMAC → on COMPLETED, flip awaiting_payment → paid and kick off
// submitOrderToSih (which is single-flight and idempotent). Always ack 2xx once
// the event is recognized so the provider stops retrying.

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const secret = process.env.TRANSFERMIT_WEBHOOK_SECRET;

  if (secret && secret.trim() && secret !== "your_webhook_secret_here") {
    const signature = req.headers.get("signature") || req.headers.get("Signature");
    if (!verifySignature(rawBody, signature, secret)) {
      console.error("[sih-payment] signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  let payload: {
    id?: string;
    state?: string;
    referenceId?: string;
    paymentType?: string;
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id: paymentId, state, referenceId, paymentType } = payload;
  if (!referenceId) {
    return NextResponse.json({ error: "Missing referenceId" }, { status: 400 });
  }

  const order = await prisma.sihOrder.findUnique({ where: { id: referenceId } });
  if (!order) {
    // Not one of ours (could be a legacy Order) — ack so it isn't retried here.
    return NextResponse.json({ ok: true, ignored: true });
  }

  await logSihEvent({
    orderId: order.id,
    source: "payment",
    payload: { paymentId, state, paymentType },
  });

  // Refund confirmations from the provider (if ever wired) close the loop.
  if (paymentType === "REFUND") {
    if (state === "COMPLETED" && order.status === "refund_pending") {
      await prisma.sihOrder.update({
        where: { id: order.id },
        data: { status: "refunded" },
      });
      await logSihEvent({
        orderId: order.id,
        source: "payment",
        fromStatus: "refund_pending",
        toStatus: "refunded",
      });
    }
    return NextResponse.json({ ok: true });
  }

  switch (state) {
    case "COMPLETED": {
      // Claim awaiting_payment -> paid exactly once, then submit to SIH.
      const claim = await prisma.sihOrder.updateMany({
        where: { id: order.id, status: "awaiting_payment" },
        data: { status: "paid", paidAt: new Date(), paymentProviderId: paymentId },
      });
      if (claim.count > 0) {
        await logSihEvent({
          orderId: order.id,
          source: "payment",
          fromStatus: "awaiting_payment",
          toStatus: "paid",
        });
      }
      // Fire submission whether we just flipped it or a retry arrived; the
      // submit is itself single-flight (paid -> submitted claim).
      await submitOrderToSih(order.id);
      break;
    }
    case "DECLINED":
    case "ERROR":
    case "CANCELLED": {
      if (order.status === "awaiting_payment") {
        await prisma.sihOrder.update({
          where: { id: order.id },
          data: { status: "failed", sihError: `payment_${String(state).toLowerCase()}` },
        });
        await logSihEvent({
          orderId: order.id,
          source: "payment",
          fromStatus: "awaiting_payment",
          toStatus: "failed",
        });
      }
      break;
    }
    default:
      // PENDING / unknown — just recorded above.
      break;
  }

  return NextResponse.json({ ok: true });
}
