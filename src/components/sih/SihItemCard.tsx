"use client";

import Link from "next/link";
import { exteriorMeta } from "@/lib/skins/shared";
import type { SihCatalogItem } from "@/lib/sih/queries";
import { useCurrency } from "@/providers/CurrencyProvider";

export function SihItemCard({ item }: { item: SihCatalogItem }) {
  const ext = exteriorMeta(item.exterior);
  const { format } = useCurrency();
  const title =
    item.skinName ||
    item.name.replace(/^(StatTrak™ |Souvenir |★ )/, "").split(" | ").slice(1).join(" | ") ||
    item.name;

  return (
    <Link
      href={`/store/${item.slug}`}
      className="card-lift metal-stroke group relative flex flex-col overflow-hidden rounded-xl bg-[color:var(--color-bg-elevated)]"
      style={{ ["--rarity" as string]: item.rarityColor }}
    >
      <div className="rarity-strip h-[3px] w-full" />

      <div className="relative aspect-[4/3] overflow-hidden tech-grid">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(120% 80% at 50% 120%, ${item.rarityColor}22 0%, transparent 60%)`,
          }}
        />
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-[1.08] group-hover:-rotate-1"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[color:var(--color-text-tertiary)]">
            no image
          </div>
        )}

        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {item.isStatTrak && (
            <span className="rounded bg-[color:var(--color-warning)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
              StatTrak™
            </span>
          )}
          {item.isSouvenir && (
            <span className="rounded bg-[color:var(--color-teal)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
              Souvenir
            </span>
          )}
          {item.phase && (
            <span className="glass rounded px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--color-text)]">
              {item.phase}
            </span>
          )}
        </div>

        <div className="absolute right-2 top-2 flex flex-col items-end gap-1.5">
          {item.discountPct != null && item.discountPct > 0 && (
            <span className="rounded-md bg-[color:var(--color-success)] px-1.5 py-0.5 text-[11px] font-bold text-black tnum">
              −{item.discountPct}%
            </span>
          )}
          {item.count <= 5 && (
            <span className="glass rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--color-text-secondary)] tnum">
              {item.count} left
            </span>
          )}
        </div>

        <div className="absolute inset-x-2 bottom-2 translate-y-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="block rounded-lg bg-[color:var(--color-primary)] py-1.5 text-center text-xs font-semibold text-[color:var(--color-primary-fg)] shadow-[var(--shadow-glow-violet)]">
            View & buy
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-medium uppercase tracking-wide text-[color:var(--color-text-tertiary)]">
            {item.weapon ?? item.category}
          </span>
          {ext && (
            <span
              className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold"
              style={{ color: item.rarityColor, background: `${item.rarityColor}1a` }}
            >
              {ext.short}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[2.4em] text-sm font-semibold leading-tight text-[color:var(--color-text)]">
          {title}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col">
            <span className="tnum text-base font-bold text-[color:var(--color-text)]">
              {format(item.price, "USD")}
            </span>
            {item.steamPrice != null && item.discountPct != null && item.discountPct > 0 && (
              <span className="tnum text-[11px] text-[color:var(--color-text-tertiary)] line-through">
                {format(item.steamPrice, "USD")}
              </span>
            )}
          </div>
          {item.steamPrice != null && item.discountPct != null && item.discountPct > 0 && (
            <span className="text-[10px] font-medium text-[color:var(--color-text-tertiary)]">
              vs Steam
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function SihItemCardSkeleton() {
  return (
    <div className="metal-stroke flex flex-col overflow-hidden rounded-xl bg-[color:var(--color-bg-elevated)]">
      <div className="h-[3px] w-full bg-[color:var(--color-bg-tertiary)]" />
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="flex flex-col gap-2 p-3">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}
