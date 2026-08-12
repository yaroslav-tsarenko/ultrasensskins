import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { sihClient } from "@/lib/sih/client";
import { sihOrderObjectSchema } from "@/lib/sih/types";
import { applySihOrderObject, logSihEvent } from "@/lib/sih/orders";
import { finalizeSihOrder } from "@/lib/sih/finalize";

export const runtime = "nodejs";

// SIH order-status webhook. This is the URL you paste into the SIH admin panel:
//   https://<your-domain>/api/webhooks/sih?secret=<SIH_WEBHOOK_SECRET>
//
// SIH pings us when an order changes. The payload is treated as untrusted: we
// only read the order id / customId from it, then re-fetch the authoritative
// order from SIH before touching our DB. We ALWAYS return 200 (once authorized)
// so SIH doesn't spin on retries; failures are logged, and the poll cron is the
// backstop.

function authorized(req: Request, rawBody: string): boolean {
  const secret = env.SIH_WEBHOOK_SECRET;
  const url = new URL(req.url);
  if (url.searchParams.get("secret") === secret) return true;

  // Also accept an HMAC signature header if SIH is configured to sign.
  const sig = req.headers.get("x-signature") || req.headers.get("signature");
  if (sig) {
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
  }
  return false;
}

// Pull id / customId out of a loosely-typed SIH webhook body.
function extractRefs(body: unknown): { id?: string; customId?: string } {
  if (!body || typeof body !== "object") return {};
  const o = body as Record<string, unknown>;
  const order = (o.order && typeof o.order === "object" ? o.order : o) as Record<string, unknown>;
  const id = order.id ?? o.id ?? o.orderId;
  const customId = order.customId ?? o.customId ?? o.custom_id;
  return {
    id: id != null ? String(id) : undefined,
    customId: customId != null ? String(customId) : undefined,
  };
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  if (!authorized(req, rawBody)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown = undefined;
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    // Non-JSON body — ack so SIH stops retrying, nothing to do.
    return NextResponse.json({ ok: true });
  }

  const { id, customId } = extractRefs(body);
  const orderId = customId ?? undefined;

  try {
    // customId is our SihOrder.id. Prefer it; fall back to the SIH id lookup.
    let localOrderId = orderId ?? null;
    if (!localOrderId && id) {
      const found = await prisma.sihOrder.findFirst({
        where: { sihOrderId: id },
        select: { id: true },
      });
      localOrderId = found?.id ?? null;
    }

    if (!localOrderId) {
      // Unknown order — record for diagnostics and ack.
      console.warn(`[sih-webhook] unmatched order id=${id} customId=${customId}`);
      return NextResponse.json({ ok: true, matched: false });
    }

    // Re-fetch authoritative state from SIH (do not trust the webhook body).
    const fresh =
      (await sihClient.getOrder({ customId: localOrderId }).catch(() => null)) ??
      (id ? await sihClient.getOrder({ id }).catch(() => null) : null);

    if (fresh) {
      await applySihOrderObject(localOrderId, fresh, "sih_webhook");
      await finalizeSihOrder(localOrderId);
    } else {
      // Fall back to applying the (parsed) webhook body if the re-fetch failed.
      const parsed = sihOrderObjectSchema.safeParse(
        (body as Record<string, unknown>).order ?? body,
      );
      if (parsed.success) {
        await applySihOrderObject(localOrderId, parsed.data, "sih_webhook");
        await finalizeSihOrder(localOrderId);
      } else {
        await logSihEvent({
          orderId: localOrderId,
          source: "sih_webhook",
          payload: { note: "re-fetch failed, body unparsable", body },
        });
      }
    }
  } catch (err) {
    // Never surface a 5xx to SIH — the poll cron will reconcile.
    console.error(`[sih-webhook] handler error: ${String(err)}`);
  }

  return NextResponse.json({ ok: true });
}
