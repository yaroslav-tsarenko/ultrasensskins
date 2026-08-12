import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMarketHashName } from "@/lib/sih/parse";

test("parses a plain weapon skin with exterior", () => {
  const p = parseMarketHashName("AK-47 | Redline (Field-Tested)");
  assert.equal(p.weapon, "AK-47");
  assert.equal(p.skinName, "Redline");
  assert.equal(p.category, "Rifles");
  assert.equal(p.exterior, "FT");
  assert.equal(p.isStatTrak, false);
  assert.equal(p.isSouvenir, false);
});

test("detects StatTrak prefix", () => {
  const p = parseMarketHashName("StatTrak™ AWP | Asiimov (Well-Worn)");
  assert.equal(p.isStatTrak, true);
  assert.equal(p.weapon, "AWP");
  assert.equal(p.skinName, "Asiimov");
  assert.equal(p.exterior, "WW");
});

test("detects Souvenir prefix", () => {
  const p = parseMarketHashName("Souvenir AWP | Dragon Lore (Factory New)");
  assert.equal(p.isSouvenir, true);
  assert.equal(p.exterior, "FN");
});

test("classifies a star knife", () => {
  const p = parseMarketHashName("★ Karambit | Doppler (Factory New)");
  assert.equal(p.isKnife, true);
  assert.equal(p.category, "Knives");
});

test("classifies star gloves", () => {
  const p = parseMarketHashName("★ Sport Gloves | Pandora's Box (Minimal Wear)");
  assert.equal(p.isGloves, true);
  assert.equal(p.isKnife, false);
  assert.equal(p.category, "Gloves");
});

test("handles a name with no exterior", () => {
  const p = parseMarketHashName("Glock-18 | Water Elemental");
  assert.equal(p.exterior, "NA");
  assert.equal(p.category, "Pistols");
});
