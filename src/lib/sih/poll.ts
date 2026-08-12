import { prisma } from "@/lib/prisma";
import { sihClient } from "./client";
import { IN_FLIGHT_STATUSES } from "./status";
import { applySihOrderObject } from "./orders";
import { finalizeSihOrder } from "./finalize";
import { submitOrderToSih } from "./checkout";

export interface PollResult {
  polled: number;
  updated: number;
  resubmitted: number;
  durationMs: number;
}

const BATCH = 100;

// Reconcile every order that is still in flight at SIH. This is the backstop for
// the webhook: even if a webhook is missed, the poll converges the order to its
// true state. Also picks up `paid` orders whose submission never completed
// (e.g. the process died right after payment) and re-runs the single-flight
// submit for them.
export async function pollInFlightOrders(): Promise<PollResult> {
  const t0 = Date.now();

  // 1) `paid` orders that were never submitted → retry submission.
  const stuckPaid = await prisma.sihOrder.findMany({
    where: { status: "paid" },
    select: { id: true },
    take: BATCH,
  });
  let resubmitted = 0;
  for (const o of stuckPaid) {
    await submitOrderToSih(o.id);
    resubmitted++;
  }

  // 2) In-flight orders → re-fetch from SIH in batches and reconcile.
  const inFlight = await prisma.sihOrder.findMany({
    where: { status: { in: IN_FLIGHT_STATUSES } },
    select: { id: true },
    orderBy: { updatedAt: "asc" },
    take: 500,
  });

  let updated = 0;
  for (let i = 0; i < inFlight.length; i += BATCH) {
    const chunk = inFlight.slice(i, i + BATCH);
    const customIds = chunk.map((o) => o.id);
    let orders;
    try {
      orders = await sihClient.getOrders({ customIds });
    } catch (err) {
      console.error(`[sih-poll] getOrders failed: ${String(err)}`);
      continue;
    }
    const byCustom = new Map<string, (typeof orders)[number]>();
    for (const o of orders) {
      if (o.customId != null) byCustom.set(String(o.customId), o);
    }
    for (const o of chunk) {
      const fresh = byCustom.get(o.id);
      if (!fresh) continue;
      await applySihOrderObject(o.id, fresh, "sih_poll");
      await finalizeSihOrder(o.id);
      updated++;
    }
  }

  const result: PollResult = {
    polled: inFlight.length,
    updated,
    resubmitted,
    durationMs: Date.now() - t0,
  };
  console.log(
    `[sih-poll] polled=${result.polled} updated=${result.updated} ` +
      `resubmitted=${result.resubmitted} in ${result.durationMs}ms`,
  );
  return result;
}
