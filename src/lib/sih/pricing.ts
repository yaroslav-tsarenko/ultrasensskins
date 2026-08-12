import { env } from "@/lib/env";

// Storefront price from SIH cost:
//   sell = max(cost * (1 + margin), cost + minMarginAbs)
// Rounded up to the cent so we never under-charge below the intended margin.
export function computeSellPrice(
  cost: number,
  opts?: { margin?: number; minMarginAbs?: number },
): number {
  const margin = opts?.margin ?? env.SIH_MARGIN;
  const minAbs = opts?.minMarginAbs ?? env.SIH_MIN_MARGIN_ABS;
  const byPct = cost * (1 + margin);
  const byAbs = cost + minAbs;
  return ceil2(Math.max(byPct, byAbs));
}

// Round half-up to 2 decimals (money). Uses EPSILON to dodge float dust.
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

// Always round up to the next cent — protects the margin.
export function ceil2(n: number): number {
  return Math.ceil((n - Number.EPSILON) * 100) / 100;
}
