import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { sendAlert } from "@/lib/alerts/telegram";
import { sihClient } from "./client";
import { IN_FLIGHT_STATUSES } from "./status";

export interface MonitorResult {
  balance: number | null;
  lowBalance: boolean;
  refundPending: number;
  stuckPaid: number;
  stuckAwaiting: number;
  stuckInFlight: number;
  alerts: number;
  durationMs: number;
}

// How long an order may sit in a transient state before we consider it stuck and
// worth a human's attention. These are generous — the poll cron converges most
// orders within a minute, so anything past these windows is anomalous.
const STUCK_PAID_MS = 10 * 60 * 1000; // paid but never submitted to SIH
const STUCK_AWAITING_MS = 60 * 60 * 1000; // payment never completed nor failed
const STUCK_IN_FLIGHT_MS = 6 * 60 * 60 * 1000; // SIH accepted but never finished

// Hourly health check. Surfaces two classes of problem an operator must act on:
//   1. Low supplier balance — we cannot fulfil new orders once SIH runs dry.
//   2. Stuck orders — money in limbo (paid-not-submitted, awaiting-forever,
//      or in-flight far longer than delivery should take).
// Read-only except for the alerts it fires; safe to run repeatedly.
export async function monitorSih(): Promise<MonitorResult> {
  const t0 = Date.now();
  const now = Date.now();
  let alerts = 0;

  // 1) Supplier balance.
  let balance: number | null = null;
  let lowBalance = false;
  try {
    const project = await sihClient.getProject();
    balance = project.balance;
    lowBalance = balance < env.SIH_LOW_BALANCE_THRESHOLD;
    if (lowBalance) {
      alerts++;
      await sendAlert(
        `SIH supplier balance is low: <b>${balance.toFixed(2)}</b> ` +
          `(threshold ${env.SIH_LOW_BALANCE_THRESHOLD}). Top up to keep fulfilling orders.`,
        "critical",
      );
    }
  } catch (err) {
    alerts++;
    await sendAlert(`SIH /project balance check failed: ${String(err)}`, "warn");
  }

  // 2) Refund backlog — every refund_pending order is money owed to a buyer.
  const refundPending = await prisma.sihOrder.count({ where: { status: "refund_pending" } });
  if (refundPending > 0) {
    alerts++;
    await sendAlert(
      `SIH has <b>${refundPending}</b> order(s) awaiting manual refund (status refund_pending).`,
      "warn",
    );
  }

  // 3) Stuck states.
  const stuckPaid = await prisma.sihOrder.count({
    where: { status: "paid", updatedAt: { lt: new Date(now - STUCK_PAID_MS) } },
  });
  const stuckAwaiting = await prisma.sihOrder.count({
    where: {
      status: "awaiting_payment",
      createdAt: { lt: new Date(now - STUCK_AWAITING_MS) },
    },
  });
  const stuckInFlight = await prisma.sihOrder.count({
    where: {
      status: { in: IN_FLIGHT_STATUSES },
      submittedAt: { lt: new Date(now - STUCK_IN_FLIGHT_MS) },
    },
  });

  if (stuckPaid > 0) {
    alerts++;
    await sendAlert(
      `SIH has <b>${stuckPaid}</b> paid order(s) not submitted to the supplier ` +
        `for over ${STUCK_PAID_MS / 60000}m. The poll cron should resubmit — investigate if it persists.`,
      "warn",
    );
  }
  if (stuckInFlight > 0) {
    alerts++;
    await sendAlert(
      `SIH has <b>${stuckInFlight}</b> order(s) in flight for over ` +
        `${STUCK_IN_FLIGHT_MS / 3600000}h without finishing. Possible stuck delivery.`,
      "warn",
    );
  }

  const result: MonitorResult = {
    balance,
    lowBalance,
    refundPending,
    stuckPaid,
    stuckAwaiting,
    stuckInFlight,
    alerts,
    durationMs: Date.now() - t0,
  };
  console.log(
    `[sih-monitor] balance=${balance ?? "?"} refundPending=${refundPending} ` +
      `stuckPaid=${stuckPaid} stuckAwaiting=${stuckAwaiting} stuckInFlight=${stuckInFlight} ` +
      `alerts=${alerts} in ${result.durationMs}ms`,
  );
  return result;
}
