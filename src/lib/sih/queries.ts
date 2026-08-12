import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import type { ExteriorCode } from "@/lib/skins/shared";
import { sihImageUrl } from "./image";

// Catalog reads over sih_items. Only rows that are available AND in stock
// (count > 0) are sellable. Prices come straight off sync (sellPrice), so the
// storefront never recomputes margins at read time.

export interface SihCatalogFilters {
  search?: string;
  weapons?: string[];
  categories?: string[];
  rarities?: string[];
  exteriors?: ExteriorCode[];
  priceMin?: number;
  priceMax?: number;
  statTrak?: boolean;
  souvenir?: boolean;
  sort?: string;
  page?: number;
  perPage?: number;
}

export interface SihCatalogItem {
  slug: string;
  marketHashName: string;
  name: string;
  weapon: string | null;
  skinName: string | null;
  category: string;
  rarity: string | null;
  rarityColor: string;
  exterior: ExteriorCode;
  phase: string | null;
  price: number;
  steamPrice: number | null;
  discountPct: number | null;
  count: number;
  isStatTrak: boolean;
  isSouvenir: boolean;
  imageUrl: string | null;
  stale: boolean;
}

export interface SihCatalogResult {
  items: SihCatalogItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// A row is considered stale (Buy disabled) if its last sync is older than this.
const STALE_MS = 30 * 60 * 1000;

const DEFAULT_RARITY_COLOR = "#b0c3d9";

const SORT_MAP: Record<string, Prisma.SihItemOrderByWithRelationInput[]> = {
  price_asc: [{ sellPrice: "asc" }],
  price_desc: [{ sellPrice: "desc" }],
  newest: [{ syncedAt: "desc" }],
  name_asc: [{ marketHashName: "asc" }],
};

// market_hash_name is the primary key but contains spaces, |, ★, () — encode it
// for use in a URL path segment.
export function encodeSihSlug(marketHashName: string): string {
  return Buffer.from(marketHashName, "utf8").toString("base64url");
}

export function decodeSihSlug(slug: string): string | null {
  try {
    const s = Buffer.from(slug, "base64url").toString("utf8");
    return s.length ? s : null;
  } catch {
    return null;
  }
}

function discount(sell: number, steam: number | null): number | null {
  if (steam == null || steam <= sell) return null;
  return Math.round(((steam - sell) / steam) * 100);
}

export function buildSihWhere(f: SihCatalogFilters): Prisma.SihItemWhereInput {
  const where: Prisma.SihItemWhereInput = {
    isAvailable: true,
    count: { gt: 0 },
    appId: env.SIH_APP_ID,
  };
  if (f.search) where.marketHashName = { contains: f.search, mode: "insensitive" };
  if (f.weapons?.length) where.weapon = { in: f.weapons };
  if (f.categories?.length) where.category = { in: f.categories };
  if (f.rarities?.length) where.rarity = { in: f.rarities };
  if (f.exteriors?.length) where.exterior = { in: f.exteriors };
  if (f.statTrak) where.isStatTrak = true;
  if (f.souvenir) where.isSouvenir = true;
  if (f.priceMin != null || f.priceMax != null) {
    where.sellPrice = {};
    if (f.priceMin != null) where.sellPrice.gte = f.priceMin;
    if (f.priceMax != null) where.sellPrice.lte = f.priceMax;
  }
  return where;
}

export function toSihCatalogItem(r: {
  marketHashName: string;
  weapon: string | null;
  skinName: string | null;
  category: string | null;
  rarity: string | null;
  rarityColor: string | null;
  exterior: string | null;
  phase: string | null;
  sellPrice: Prisma.Decimal;
  steamPrice: Prisma.Decimal | null;
  count: number;
  isStatTrak: boolean;
  isSouvenir: boolean;
  imageHash: string | null;
  syncedAt: Date;
}): SihCatalogItem {
  const price = Number(r.sellPrice);
  const steamPrice = r.steamPrice != null ? Number(r.steamPrice) : null;
  return {
    slug: encodeSihSlug(r.marketHashName),
    marketHashName: r.marketHashName,
    name: r.marketHashName,
    weapon: r.weapon,
    skinName: r.skinName,
    category: r.category ?? "Other",
    rarity: r.rarity,
    rarityColor: r.rarityColor ?? DEFAULT_RARITY_COLOR,
    exterior: (r.exterior ?? "NA") as ExteriorCode,
    phase: r.phase,
    price,
    steamPrice,
    discountPct: discount(price, steamPrice),
    count: r.count,
    isStatTrak: r.isStatTrak,
    isSouvenir: r.isSouvenir,
    imageUrl: sihImageUrl(r.imageHash),
    stale: Date.now() - r.syncedAt.getTime() > STALE_MS,
  };
}

const CARD_SELECT = {
  marketHashName: true,
  weapon: true,
  skinName: true,
  category: true,
  rarity: true,
  rarityColor: true,
  exterior: true,
  phase: true,
  sellPrice: true,
  steamPrice: true,
  count: true,
  isStatTrak: true,
  isSouvenir: true,
  imageHash: true,
  syncedAt: true,
} satisfies Prisma.SihItemSelect;

export async function querySihCatalog(f: SihCatalogFilters): Promise<SihCatalogResult> {
  const page = Math.max(1, f.page ?? 1);
  const perPage = Math.min(96, Math.max(12, f.perPage ?? 48));
  const where = buildSihWhere(f);
  const orderBy = SORT_MAP[f.sort ?? "price_asc"] ?? SORT_MAP.price_asc;

  const [rows, total] = await Promise.all([
    prisma.sihItem.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      select: CARD_SELECT,
    }),
    prisma.sihItem.count({ where }),
  ]);

  return {
    items: rows.map(toSihCatalogItem),
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export interface SihFacets {
  categories: string[];
  weapons: { weapon: string; category: string }[];
  rarities: string[];
}

// Distinct facet values across sellable rows for the filter sidebar.
export async function getSihFacets(): Promise<SihFacets> {
  const base: Prisma.SihItemWhereInput = {
    isAvailable: true,
    count: { gt: 0 },
    appId: env.SIH_APP_ID,
  };
  const [cats, weapons, rarities] = await Promise.all([
    prisma.sihItem.findMany({
      where: { ...base, category: { not: null } },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
    prisma.sihItem.findMany({
      where: { ...base, weapon: { not: null } },
      distinct: ["weapon"],
      select: { weapon: true, category: true },
      orderBy: { weapon: "asc" },
    }),
    prisma.sihItem.findMany({
      where: { ...base, rarity: { not: null } },
      distinct: ["rarity"],
      select: { rarity: true },
    }),
  ]);
  return {
    categories: cats.map((c) => c.category!).filter(Boolean),
    weapons: weapons
      .filter((w) => w.weapon)
      .map((w) => ({ weapon: w.weapon!, category: w.category ?? "Other" })),
    rarities: rarities.map((r) => r.rarity!).filter(Boolean),
  };
}

export interface SihItemDetail extends SihCatalogItem {
  costPrice: number;
  market: string | null;
  appId: number;
  syncedAt: string;
}

export async function getSihItemBySlug(slug: string): Promise<SihItemDetail | null> {
  const marketHashName = decodeSihSlug(slug);
  if (!marketHashName) return null;
  const row = await prisma.sihItem.findUnique({
    where: { marketHashName },
    select: {
      ...CARD_SELECT,
      costPrice: true,
      market: true,
      appId: true,
      isAvailable: true,
    },
  });
  if (!row) return null;
  const base = toSihCatalogItem(row);
  return {
    ...base,
    costPrice: Number(row.costPrice),
    market: row.market,
    appId: row.appId,
    syncedAt: row.syncedAt.toISOString(),
  };
}

// A handful of related items in the same weapon (fallback: same category).
export async function getSihRelated(item: SihCatalogItem, limit = 6): Promise<SihCatalogItem[]> {
  const base: Prisma.SihItemWhereInput = {
    isAvailable: true,
    count: { gt: 0 },
    appId: env.SIH_APP_ID,
    marketHashName: { not: item.marketHashName },
  };
  const rows = await prisma.sihItem.findMany({
    where: item.weapon ? { ...base, weapon: item.weapon } : { ...base, category: item.category },
    orderBy: { sellPrice: "asc" },
    take: limit,
    select: CARD_SELECT,
  });
  return rows.map(toSihCatalogItem);
}
