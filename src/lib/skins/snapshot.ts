import type { CatalogItem } from "./queries";

/**
 * A lightweight, self-contained copy of a skin listing. Client-only features
 * (favorites, recently viewed, compare) persist these in localStorage so the
 * corresponding pages can render without any backend round-trip — there is no
 * "fetch skins by id list" endpoint, and by design there shouldn't need to be.
 */
export interface SkinSnapshot {
  skinId: string;
  listingId: string;
  name: string;
  weapon: string;
  rarity: string;
  rarityColor: string;
  exterior: string;
  float: number | null;
  price: number;
  steamPrice: number | null;
  discountPct: number | null;
  isStatTrak: boolean;
  isSouvenir: boolean;
  imageUrl: string | null;
}

export function toSnapshot(item: CatalogItem): SkinSnapshot {
  return {
    skinId: item.skinId,
    listingId: item.listingId,
    name: item.name,
    weapon: item.weapon,
    rarity: item.rarity,
    rarityColor: item.rarityColor,
    exterior: item.exterior,
    float: item.float,
    price: item.price,
    steamPrice: item.steamPrice,
    discountPct: item.discountPct,
    isStatTrak: item.isStatTrak,
    isSouvenir: item.isSouvenir,
    imageUrl: item.imageUrl,
  };
}

export function isSnapshot(v: unknown): v is SkinSnapshot {
  return !!v && typeof v === "object" && typeof (v as SkinSnapshot).skinId === "string";
}

import type { ExteriorCode } from "./shared";

/** Rehydrate a snapshot into the shape SkinCard expects. */
export function snapshotToItem(s: SkinSnapshot): CatalogItem {
  return {
    listingId: s.listingId,
    skinId: s.skinId,
    name: s.name,
    weapon: s.weapon,
    category: "",
    rarity: s.rarity,
    rarityColor: s.rarityColor,
    exterior: s.exterior as ExteriorCode,
    float: s.float,
    paintSeed: null,
    price: s.price,
    steamPrice: s.steamPrice,
    discountPct: s.discountPct,
    isStatTrak: s.isStatTrak,
    isSouvenir: s.isSouvenir,
    imageUrl: s.imageUrl,
  };
}
