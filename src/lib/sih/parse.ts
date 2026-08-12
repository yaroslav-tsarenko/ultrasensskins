import { exteriorFromLabel, rarityColor, type ExteriorCode } from "@/lib/skins/shared";

// Parse a CS2 market_hash_name into structured, filterable fields. SIH only
// gives us the name (+ color/phase), so we derive weapon / category / exterior /
// StatTrak here and persist them on sih_items during sync for fast filtering.

export interface ParsedName {
  weapon: string | null;
  skinName: string | null;
  category: string;
  exterior: ExteriorCode;
  isStatTrak: boolean;
  isSouvenir: boolean;
  isKnife: boolean;
  isGloves: boolean;
}

const PISTOLS = [
  "Desert Eagle", "Dual Berettas", "Five-SeveN", "Glock-18", "P2000", "P250",
  "CZ75-Auto", "Tec-9", "USP-S", "R8 Revolver",
];
const SMGS = ["MAC-10", "MP5-SD", "MP7", "MP9", "PP-Bizon", "P90", "UMP-45"];
const RIFLES = [
  "AK-47", "AUG", "FAMAS", "Galil AR", "M4A1-S", "M4A4", "SG 553", "SSG 08",
  "AWP", "G3SG1", "SCAR-20",
];
const HEAVY = ["MAG-7", "Nova", "Sawed-Off", "XM1014", "M249", "Negev"];

const GLOVE_KEYWORDS = ["Gloves", "Hand Wraps"];

function categoryForWeapon(weapon: string): string {
  if (PISTOLS.includes(weapon)) return "Pistols";
  if (SMGS.includes(weapon)) return "SMGs";
  if (RIFLES.includes(weapon)) return "Rifles";
  if (HEAVY.includes(weapon)) return "Heavy";
  return "Other";
}

export function parseMarketHashName(raw: string): ParsedName {
  let name = raw.trim();

  const isSouvenir = /^souvenir\s+/i.test(name);
  if (isSouvenir) name = name.replace(/^souvenir\s+/i, "");

  const isStatTrak = /^stattrak™?\s+/i.test(name);
  if (isStatTrak) name = name.replace(/^stattrak™?\s+/i, "");

  const isStar = name.startsWith("★");
  if (isStar) name = name.replace(/^★\s*/, "");

  // Exterior from a trailing "(...)".
  let exterior: ExteriorCode = "NA";
  const extMatch = name.match(/\(([^)]+)\)\s*$/);
  if (extMatch) {
    exterior = exteriorFromLabel(extMatch[1].trim());
    name = name.replace(/\s*\([^)]+\)\s*$/, "");
  }

  // "Weapon | Skin" split.
  let weapon: string | null = null;
  let skinName: string | null = null;
  const pipe = name.split("|");
  if (pipe.length >= 2) {
    weapon = pipe[0].trim();
    skinName = pipe.slice(1).join("|").trim();
  } else {
    weapon = name.trim() || null;
  }

  const isGloves = isStar && GLOVE_KEYWORDS.some((k) => (weapon ?? "").includes(k) || raw.includes(k));
  const isKnife = isStar && !isGloves;

  let category: string;
  if (isGloves) category = "Gloves";
  else if (isKnife) category = "Knives";
  else if (weapon) category = categoryForWeapon(weapon);
  else category = "Other";

  return { weapon, skinName, category, exterior, isStatTrak, isSouvenir, isKnife, isGloves };
}

// Best-effort rarity name from SIH's color hex (reverse of RARITY_TIERS palette).
const COLOR_TO_RARITY: Record<string, string> = {
  b0c3d9: "Consumer Grade",
  "5e98d9": "Industrial Grade",
  "4b69ff": "Mil-Spec Grade",
  "8847ff": "Restricted",
  d32ce6: "Classified",
  eb4b4b: "Covert",
  ffd700: "Extraordinary",
  e4ae39: "Contraband",
};

export function rarityFromColor(color: string | null | undefined): string | null {
  if (!color) return null;
  const hex = color.replace(/^#/, "").toLowerCase();
  return COLOR_TO_RARITY[hex] ?? null;
}

export function normalizeRarityColor(color: string | null | undefined): string | null {
  if (!color) return null;
  const hex = color.replace(/^#/, "");
  return `#${hex}`;
}

export { rarityColor };
