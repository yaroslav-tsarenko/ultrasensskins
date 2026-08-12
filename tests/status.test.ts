import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mapSihStatus,
  extractSender,
  extractProtection,
  parseTimestamp,
  isTerminal,
} from "@/lib/sih/status";

test("maps SIH statuses onto our lifecycle", () => {
  assert.equal(mapSihStatus("created"), "submitted");
  assert.equal(mapSihStatus("processing"), "processing");
  assert.equal(mapSihStatus("sent"), "sent");
  assert.equal(mapSihStatus("finished"), "finished");
  assert.equal(mapSihStatus("failed"), "failed");
  assert.equal(mapSihStatus("penalized"), "failed");
});

test("status mapping is case-insensitive and null-safe", () => {
  assert.equal(mapSihStatus("FINISHED"), "finished");
  assert.equal(mapSihStatus("Sent"), "sent");
  assert.equal(mapSihStatus(null), null);
  assert.equal(mapSihStatus(undefined), null);
  assert.equal(mapSihStatus("bogus"), null);
});

test("isTerminal recognizes end states", () => {
  assert.equal(isTerminal("finished"), true);
  assert.equal(isTerminal("refunded"), true);
  assert.equal(isTerminal("processing"), false);
});

test("extractSender pulls offer + coerces id to string", () => {
  const s = extractSender({ sender: { offerId: 987, nickname: "bot", avatar: "a.png" } } as never);
  assert.equal(s.senderOfferId, "987");
  assert.equal(s.senderNickname, "bot");
  assert.equal(s.senderAvatar, "a.png");
});

test("extractSender on a bare object is empty", () => {
  assert.deepEqual(extractSender({} as never), {});
});

test("extractProtection surfaces rollback fields", () => {
  const p = extractProtection({
    protection: { status: "rollback", rollbackAmount: 12.5 },
  } as never);
  assert.equal(p.protectionStatus, "rollback");
  assert.equal(p.protectionRollbackAmount, 12.5);
});

test("parseTimestamp handles seconds, ms and ISO", () => {
  assert.equal(parseTimestamp(null), null);
  assert.equal(parseTimestamp(""), null);
  const iso = parseTimestamp("2026-01-02T03:04:05.000Z");
  assert.equal(iso?.toISOString(), "2026-01-02T03:04:05.000Z");
  // unix seconds
  const secs = parseTimestamp(1_700_000_000);
  assert.equal(secs?.getTime(), 1_700_000_000_000);
  // unix ms
  const ms = parseTimestamp(1_700_000_000_000);
  assert.equal(ms?.getTime(), 1_700_000_000_000);
});
