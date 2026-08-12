import type { SihOrderStatus } from "@prisma/client";
import type { SihOrderObject } from "./types";

// Map a raw SIH order status onto our order status.
//
// IMPORTANT: SIH transitions are NOT one-directional — an order can go
// `sent → processing` again (SIH re-buys the item if the supplier bailed). So
// this is a pure function of the current SIH status; callers must never assume
// monotonic progress. It intentionally returns only the SIH-driven lifecycle
// states and leaves payment/refund states (awaiting_payment, paid,
// refund_pending, refunded, rolled_back) to the payment/finalization code.
export function mapSihStatus(sihStatus: string | null | undefined): SihOrderStatus | null {
  switch ((sihStatus ?? "").toLowerCase()) {
    case "created":
      return "submitted";
    case "processing":
      return "processing";
    case "sent":
      return "sent";
    case "finished":
      return "finished";
    case "failed":
    case "penalized":
      return "failed";
    default:
      return null;
  }
}

// A status we should stop polling on. `finished` is included but protection may
// still roll back afterwards — protection is tracked separately, see
// finalizeFromProtection.
export const TERMINAL_STATUSES: SihOrderStatus[] = [
  "finished",
  "failed",
  "refunded",
  "rolled_back",
];

// Statuses that are still "in flight" at SIH and must be polled.
export const IN_FLIGHT_STATUSES: SihOrderStatus[] = [
  "submitted",
  "processing",
  "sent",
];

export function isTerminal(status: SihOrderStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

// Extract sender.* into DB-shaped fields. `timeout` may be a unix seconds/ms
// number or an ISO string.
export function extractSender(order: SihOrderObject) {
  const s = order.sender;
  if (!s) return {};
  return {
    senderOfferId: s.offerId != null ? String(s.offerId) : null,
    senderNickname: s.nickname ?? null,
    senderAvatar: s.avatar ?? null,
    senderTimeout: parseTimestamp(s.timeout),
  };
}

// Extract protection.* into DB-shaped fields.
export function extractProtection(order: SihOrderObject) {
  const p = order.protection;
  if (!p) return {};
  return {
    protectionStatus: p.status ?? null,
    protectionError: p.error ?? null,
    protectionRollbackAt: parseTimestamp(p.rollbackAt),
    protectionRollbackAmount: p.rollbackAmount != null ? p.rollbackAmount : null,
  };
}

// Accepts unix seconds, unix ms, or ISO string.
export function parseTimestamp(v: string | number | null | undefined): Date | null {
  if (v == null || v === "") return null;
  if (typeof v === "number") {
    // Heuristic: < 1e12 -> seconds.
    const ms = v < 1e12 ? v * 1000 : v;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  const asNum = Number(v);
  if (!Number.isNaN(asNum) && /^\d+$/.test(v.trim())) {
    return parseTimestamp(asNum);
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}
