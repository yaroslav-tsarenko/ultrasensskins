import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTradeUrl } from "@/lib/steam";

test("parses a valid trade URL", () => {
  const r = parseTradeUrl(
    "https://steamcommunity.com/tradeoffer/new/?partner=123456&token=aBc-1_2X",
  );
  assert.deepEqual(r, { partnerId: "123456", token: "aBc-1_2X" });
});

test("trims surrounding whitespace", () => {
  const r = parseTradeUrl(
    "   https://steamcommunity.com/tradeoffer/new/?partner=1&token=abcdef   ",
  );
  assert.deepEqual(r, { partnerId: "1", token: "abcdef" });
});

test("rejects the wrong host", () => {
  assert.equal(
    parseTradeUrl("https://evil.com/tradeoffer/new/?partner=1&token=abcdef"),
    null,
  );
});

test("rejects the wrong path", () => {
  assert.equal(
    parseTradeUrl("https://steamcommunity.com/profiles/1?partner=1&token=abcdef"),
    null,
  );
});

test("rejects a non-numeric partner", () => {
  assert.equal(
    parseTradeUrl("https://steamcommunity.com/tradeoffer/new/?partner=abc&token=abcdef"),
    null,
  );
});

test("rejects a too-short token", () => {
  assert.equal(
    parseTradeUrl("https://steamcommunity.com/tradeoffer/new/?partner=1&token=abc"),
    null,
  );
});

test("rejects a missing token", () => {
  assert.equal(
    parseTradeUrl("https://steamcommunity.com/tradeoffer/new/?partner=1"),
    null,
  );
});

test("rejects garbage input", () => {
  assert.equal(parseTradeUrl("not a url"), null);
  assert.equal(parseTradeUrl(""), null);
});
