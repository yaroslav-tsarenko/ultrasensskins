import { Prisma, type SihOrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SihOrderObject } from "./types";
import { mapSihStatus, extractSender, extractProtection } from "./status";

// Append an audit event. Never throws for a bad payload — the trail is
// best-effort and must not break the caller's transaction intent.
export async function logSihEvent(params: {
  orderId: string;
  source: "sih_webhook" | "sih_poll" | "sih_reconcile" | "payment" | "system";
  fromStatus?: SihOrderStatus | null;
  toStatus?: SihOrderStatus | null;
  payload?: unknown;
}): Promise<void> {
  try {
    await prisma.sihOrderEvent.create({
      data: {
        orderId: params.orderId,
        source: params.source,
        fromStatus: params.fromStatus ?? null,
        toStatus: params.toStatus ?? null,
        payload:
          params.payload === undefined
            ? undefined
            : (params.payload as Prisma.InputJsonValue),
      },
    });
  } catch (err) {
    console.error(`[sih] failed to log event for order ${params.orderId}: ${String(err)}`);
  }
}

// Whether a status is one we consider "locked in" and must never regress from
// via a stale SIH read. Payment/refund states are owned by our own flow.
const PROTECTED_LOCAL: SihOrderStatus[] = ["refunded", "rolled_back", "refund_pending"];

// Reconcile a SIH order object onto our DB row. Returns the resulting status.
// `source` records provenance in the audit trail. Idempotent: re-applying the
// same object is a no-op beyond touching sih_status / sender / protection.
export async function applySihOrderObject(
  orderId: string,
  obj: SihOrderObject,
  source: "sih_webhook" | "sih_poll" | "sih_reconcile" | "system",
): Promise<SihOrderStatus | null> {
  const current = await prisma.sihOrder.findUnique({
    where: { id: orderId },
    select: { status: true },
  });
  if (!current) return null;

  const mapped = mapSihStatus(obj.status);
  const sender = extractSender(obj);
  const protection = extractProtection(obj);

  // Only advance `status` when SIH actually reports a lifecycle state AND our
  // local state is not one we own (refund/rollback). Otherwise we keep the local
  // status but still refresh sih_status / sender / protection metadata.
  const keepLocal = PROTECTED_LOCAL.includes(current.status);
  const nextStatus = mapped && !keepLocal ? mapped : current.status;

  const data: Prisma.SihOrderUpdateInput = {
    sihStatus: obj.status ?? undefined,
    sihError: obj.error ?? undefined,
    sihOrderId: obj.id != null ? String(obj.id) : undefined,
    ...sender,
    ...protection,
  };
  if (nextStatus !== current.status) {
    data.status = nextStatus;
    if (nextStatus === "finished") data.finishedAt = new Date();
  }
  if (protection.protectionRollbackAmount != null) {
    data.protectionRollbackAmount = new Prisma.Decimal(protection.protectionRollbackAmount);
  }

  await prisma.sihOrder.update({ where: { id: orderId }, data });

  if (nextStatus !== current.status) {
    await logSihEvent({
      orderId,
      source,
      fromStatus: current.status,
      toStatus: nextStatus,
      payload: obj as unknown,
    });
  }
  return nextStatus;
}
