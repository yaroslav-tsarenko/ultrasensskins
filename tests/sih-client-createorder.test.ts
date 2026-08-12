import { test } from "node:test";
import assert from "node:assert/strict";

// Minimal valid env so the lazily-validated `env` proxy is satisfied when the
// client reads secrets at call time. The client reads env only inside its
// functions (call time), so setting these before any test runs is enough — the
// static imports below never touch env.
process.env.SIH_API_KEY = "test-key";
process.env.SIH_WEBHOOK_SECRET = "whsec";
process.env.CRON_SECRET = "cron";
process.env.APP_URL = "http://localhost:3000";
process.env.SIH_TEST_MODE = "true";

import { sihClient } from "@/lib/sih/client";
import { SihError } from "@/lib/sih/errors";

const realFetch = globalThis.fetch;

function stubFetch(status: number, body: unknown) {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })) as typeof fetch;
}

function restore() {
  globalThis.fetch = realFetch;
}

const input = {
  steamId: "76561198000000000",
  token: "abcdef",
  amount: 10,
  item: "AK-47 | Redline (Field-Tested)",
  customId: "order-1",
};

test("create-order success returns the embedded order", async (t) => {
  t.after(restore);
  stubFetch(200, {
    success: true,
    id: "sih-99",
    order: { id: "sih-99", customId: "order-1", status: "created" },
  });
  const order = await sihClient.createOrder(input);
  assert.equal(order.customId, "order-1");
  assert.equal(order.status, "created");
});

test("409 duplicate custom id adopts the existing order (idempotent resubmit)", async (t) => {
  t.after(restore);
  stubFetch(409, {
    success: false,
    error: "custom id already exists",
    order: { id: "sih-99", customId: "order-1", status: "processing" },
  });
  const order = await sihClient.createOrder(input);
  assert.equal(order.customId, "order-1");
  assert.equal(order.status, "processing");
});

test("a real supplier error throws SihError", async (t) => {
  t.after(restore);
  stubFetch(400, { success: false, error: "insufficient balance" });
  await assert.rejects(() => sihClient.createOrder(input), (err: unknown) => {
    assert.ok(err instanceof SihError);
    return true;
  });
});
