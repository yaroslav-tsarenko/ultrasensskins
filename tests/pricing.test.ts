import { test } from "node:test";
import assert from "node:assert/strict";
import { computeSellPrice, round2, ceil2 } from "@/lib/sih/pricing";

// Always pass opts so these stay hermetic (never touch env).
const opts = { margin: 0.07, minMarginAbs: 0.1 };

test("percentage margin dominates on expensive items", () => {
  // 100 * 1.07 = 107 (>= 100.10)
  assert.equal(computeSellPrice(100, opts), 107);
});

test("absolute floor dominates on cheap items", () => {
  // 1 * 1.07 = 1.07 but floor is 1 + 0.10 = 1.10
  assert.equal(computeSellPrice(1, opts), 1.1);
});

test("always rounds up to protect the margin", () => {
  // 3.33 * 1.07 = 3.5631 -> ceil to 3.57
  assert.equal(computeSellPrice(3.33, opts), 3.57);
});

test("never under-charges below cost + min abs", () => {
  const cost = 0.5;
  const sell = computeSellPrice(cost, opts);
  assert.ok(sell >= cost + opts.minMarginAbs - 1e-9);
});

test("ceil2 rounds up, round2 rounds half-up", () => {
  assert.equal(ceil2(1.001), 1.01);
  assert.equal(ceil2(1.01), 1.01);
  assert.equal(round2(1.005), 1.01);
  assert.equal(round2(1.004), 1.0);
});
