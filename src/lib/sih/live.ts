import { prisma } from "@/lib/prisma";
import { getMinItem } from "./client";
import { computeSellPrice, round2 } from "./pricing";
import type { SihItemDetail } from "./queries";

// Live single-item refresh for the product page: fetches the current SIH min
// price + stock, re-applies our margin, and reconciles the catalog row so the
// buyer always sees real price/availability instead of the (up to 7 min) stale
// synced value. Never throws — on any failure we fall back to the DB value.
export async function refreshSihItemLive(item: SihItemDetail): Promise<SihItemDetail> {
  try {
    const min = await getMinItem(item.marketHashName, item.appId);

    if (!min.found || min.price == null || min.count <= 0) {
      // Sold out / delisted live — reflect that immediately and stop selling it.
      if (item.count !== 0) {
        await prisma.sihItem
          .update({
            where: { marketHashName: item.marketHashName },
            data: { count: 0, isAvailable: false, syncedAt: new Date() },
          })
          .catch(() => {});
      }
      return { ...item, count: 0, stale: false };
    }

    const costPrice = round2(min.price);
    const sellPrice = computeSellPrice(costPrice);
    const now = new Date();

    await prisma.sihItem
      .update({
        where: { marketHashName: item.marketHashName },
        data: {
          costPrice,
          sellPrice,
          count: min.count,
          isAvailable: true,
          syncedAt: now,
        },
      })
      .catch(() => {});

    const steamPrice = item.steamPrice;
    const discountPct =
      steamPrice != null && steamPrice > sellPrice
        ? Math.round(((steamPrice - sellPrice) / steamPrice) * 100)
        : null;

    return {
      ...item,
      price: sellPrice,
      costPrice,
      count: min.count,
      discountPct,
      stale: false,
      syncedAt: now.toISOString(),
    };
  } catch {
    return item;
  }
}
