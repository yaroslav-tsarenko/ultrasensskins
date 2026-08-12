import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { getItems } from "./client";
import { computeSellPrice, round2 } from "./pricing";
import { parseMarketHashName, rarityFromColor, normalizeRarityColor } from "./parse";

const CHUNK = 500;

export interface SyncResult {
  fetched: number;
  upserted: number;
  deactivated: number;
  durationMs: number;
}

interface Row {
  marketHashName: string;
  costPrice: number;
  sellPrice: number;
  steamPrice: number | null;
  count: number;
  phase: string | null;
  market: string | null;
  imageHash: string | null;
  rarityColor: string | null;
  weapon: string | null;
  skinName: string | null;
  category: string;
  exterior: string;
  rarity: string | null;
  isStatTrak: boolean;
  isSouvenir: boolean;
}

// Pull the full SIH catalog and upsert it into sih_items. Items absent from the
// response are marked count=0 / is_available=false (NEVER deleted) so that order
// history and links to delisted items keep working.
export async function syncCatalog(appId = env.SIH_APP_ID): Promise<SyncResult> {
  const startedAt = new Date();
  const t0 = Date.now();

  const res = await getItems(appId);
  const entries = Object.entries(res.items);

  const rows: Row[] = entries.map(([marketHashName, it]) => {
    const cost = round2(it.price);
    const parsed = parseMarketHashName(marketHashName);
    return {
      marketHashName,
      costPrice: cost,
      sellPrice: computeSellPrice(cost),
      steamPrice: it.steam != null ? round2(it.steam) : null,
      count: it.count ?? 0,
      phase: it.phase ?? null,
      market: it.market ?? null,
      imageHash: it.image ?? null,
      rarityColor: normalizeRarityColor(it.color),
      weapon: parsed.weapon,
      skinName: parsed.skinName,
      category: parsed.category,
      exterior: parsed.exterior,
      rarity: rarityFromColor(it.color),
      isStatTrak: parsed.isStatTrak,
      isSouvenir: parsed.isSouvenir,
    };
  });

  let upserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await upsertChunk(chunk, appId);
    upserted += chunk.length;
  }

  // Anything not touched this run (synced_at older than the run start) is gone
  // from SIH right now -> deactivate but keep the row.
  const deactivated = await prisma.$executeRaw(Prisma.sql`
    UPDATE sih_items
       SET count = 0, is_available = false, updated_at = now()
     WHERE synced_at < ${startedAt}
       AND is_available = true
  `);

  const result: SyncResult = {
    fetched: entries.length,
    upserted,
    deactivated: Number(deactivated),
    durationMs: Date.now() - t0,
  };

  console.log(
    `[sih-sync] fetched=${result.fetched} upserted=${result.upserted} ` +
      `deactivated=${result.deactivated} in ${result.durationMs}ms`,
  );
  return result;
}

async function upsertChunk(chunk: Row[], appId: number): Promise<void> {
  const values = chunk.map(
    (r) => Prisma.sql`(
      ${r.marketHashName}, ${appId}, ${r.costPrice}, ${r.sellPrice}, ${r.steamPrice},
      ${r.count}, ${r.phase}, ${r.market}, ${r.imageHash}, ${r.rarityColor},
      ${r.weapon}, ${r.skinName}, ${r.category}, ${r.exterior}, ${r.rarity},
      ${r.isStatTrak}, ${r.isSouvenir},
      true, now(), now(), now()
    )`,
  );

  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO sih_items (
      market_hash_name, app_id, cost_price, sell_price, steam_price,
      count, phase, market, image_hash, rarity_color,
      weapon, skin_name, category, exterior, rarity,
      is_stattrak, is_souvenir,
      is_available, synced_at, created_at, updated_at
    )
    VALUES ${Prisma.join(values)}
    ON CONFLICT (market_hash_name) DO UPDATE SET
      app_id       = EXCLUDED.app_id,
      cost_price   = EXCLUDED.cost_price,
      sell_price   = EXCLUDED.sell_price,
      steam_price  = EXCLUDED.steam_price,
      count        = EXCLUDED.count,
      phase        = EXCLUDED.phase,
      market       = EXCLUDED.market,
      image_hash   = EXCLUDED.image_hash,
      rarity_color = EXCLUDED.rarity_color,
      weapon       = EXCLUDED.weapon,
      skin_name    = EXCLUDED.skin_name,
      category     = EXCLUDED.category,
      exterior     = EXCLUDED.exterior,
      rarity       = EXCLUDED.rarity,
      is_stattrak  = EXCLUDED.is_stattrak,
      is_souvenir  = EXCLUDED.is_souvenir,
      is_available = true,
      synced_at    = now(),
      updated_at   = now()
  `);
}
