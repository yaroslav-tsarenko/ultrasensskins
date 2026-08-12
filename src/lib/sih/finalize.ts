import { prisma } from "@/lib/prisma";
import { sendAlert } from "@/lib/alerts/telegram";
import { logSihEvent } from "./orders";

// Post-update finalization. Runs after we've applied a fresh SIH order object
// (from webhook or poll). Two things can require operator/refund action:
//
//  1. status === "failed"  — SIH could not deliver the item, but the buyer paid.
//     Park as refund_pending and alert (Transfermit has no refund API here).
//
//  2. protection rollback  — SIH delivered then the supplier rolled the trade
//     back (`protection.status` says so, or a rollbackAt is set). The buyer no
//     longer has the item, so their money must be returned: rolled_back +
//     refund_pending semantics + alert.
//
// Idempotent: every transition is guarded so repeated calls are no-ops.

const ROLLBACK_HINTS = ["rollback", "rolled_back", "rolledback", "reverted", "penalized"];

function isRollback(protectionStatus: string | null): boolean {
  if (!protectionStatus) return false;
  const s = protectionStatus.toLowerCase();
  return ROLLBACK_HINTS.some((h) => s.includes(h));
}

export async function finalizeSihOrder(orderId: string): Promise<void> {
  const order = await prisma.sihOrder.findUnique({ where: { id: orderId } });
  if (!order) return;

  // 1) Delivery failed after payment → needs refund.
  if (order.status === "failed") {
    const paid = order.paidAt != null;
    if (paid) {
      const claim = await prisma.sihOrder.updateMany({
        where: { id: orderId, status: "failed" },
        data: { status: "refund_pending" },
      });
      if (claim.count > 0) {
        await logSihEvent({
          orderId,
          source: "system",
          fromStatus: "failed",
          toStatus: "refund_pending",
          payload: { reason: "sih_failed_after_payment" },
        });
        await sendAlert(
          `SIH order <b>${orderId}</b> failed at the supplier after payment ` +
            `(${order.sihError ?? "no reason"}). Item: ${order.marketHashName}. ` +
            `Manual refund required.`,
          "critical",
        );
      }
    }
    return;
  }

  // 2) Protection rollback after a delivered/finished order → refund.
  const rolledBack = isRollback(order.protectionStatus) || order.protectionRollbackAt != null;
  if (rolledBack && order.status !== "rolled_back" && order.status !== "refunded") {
    const claim = await prisma.sihOrder.updateMany({
      where: { id: orderId, status: { in: ["sent", "finished", "processing", "submitted"] } },
      data: { status: "rolled_back" },
    });
    if (claim.count > 0) {
      await logSihEvent({
        orderId,
        source: "system",
        toStatus: "rolled_back",
        payload: {
          reason: "protection_rollback",
          protectionStatus: order.protectionStatus,
          rollbackAt: order.protectionRollbackAt,
          rollbackAmount: order.protectionRollbackAmount,
        },
      });
      await sendAlert(
        `SIH order <b>${orderId}</b> was rolled back by protection ` +
          `(${order.protectionStatus ?? "rollback"}). Item: ${order.marketHashName}. ` +
          `Buyer refund required.`,
        "critical",
      );
    }
  }
}
