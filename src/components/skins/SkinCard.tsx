"use client";

import Link from "next/link";
import { Heart, Scale } from "lucide-react";
import { exteriorMeta, formatUSD, type ExteriorCode } from "@/lib/skins/shared";
import type { CatalogItem } from "@/lib/skins/queries";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useCompare } from "@/lib/hooks/useCompare";
import { toSnapshot } from "@/lib/skins/snapshot";
import { useCurrency } from "@/providers/CurrencyProvider";

export { formatUSD };

// Marker position (0–1) of a float within its exterior band, for the mini wear bar.
function floatMarker(exterior: ExteriorCode, float: number | null): number | null {
  if (float == null) return null;
  return Math.max(0, Math.min(1, float));
}

export function SkinCard({ item }: { item: CatalogItem }) {
  const ext = exteriorMeta(item.exterior);
  const marker = floatMarker(item.exterior, item.float);
  const href = `/skin/${item.skinId}?listing=${item.listingId}`;
  const favorites = useFavorites();
  const compare = useCompare();
  const { format } = useCurrency();
  const isFav = favorites.has(item.skinId);
  const inCompare = compare.has(item.skinId);

  return (
    <Link
      href={href}
      className="card-lift metal-stroke group relative flex flex-col overflow-hidden rounded-xl bg-[color:var(--color-bg-elevated)]"
      style={{ ["--rarity" as string]: item.rarityColor }}
    >
      {/* rarity strip */}
      <div className="rarity-strip h-[3px] w-full" />

      {/* image */}
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

        {/* badges */}
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
        </div>
        <div className="absolute right-2 top-2 flex flex-col items-end gap-1.5">
          {item.discountPct != null && item.discountPct > 0 && (
            <span className="rounded-md bg-[color:var(--color-success)] px-1.5 py-0.5 text-[11px] font-bold text-black tnum">
              −{Math.round(item.discountPct)}%
            </span>
          )}
          <button
            type="button"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              favorites.toggle(toSnapshot(item));
            }}
            className={`glass flex h-8 w-8 items-center justify-center rounded-full transition ${
              isFav
                ? "text-[color:var(--color-danger)] opacity-100"
                : "text-[color:var(--color-text-secondary)] opacity-0 group-hover:opacity-100 hover:text-[color:var(--color-text)]"
            }`}
          >
            <Heart className="h-4 w-4" fill={isFav ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              compare.toggle(toSnapshot(item));
            }}
            className={`glass flex h-8 w-8 items-center justify-center rounded-full transition ${
              inCompare
                ? "text-[color:var(--color-primary)] opacity-100"
                : "text-[color:var(--color-text-secondary)] opacity-0 group-hover:opacity-100 hover:text-[color:var(--color-text)]"
            }`}
          >
            <Scale className="h-4 w-4" />
          </button>
        </div>

        {/* quick buy on hover */}
        <div className="absolute inset-x-2 bottom-2 translate-y-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="block rounded-lg bg-[color:var(--color-primary)] py-1.5 text-center text-xs font-semibold text-[color:var(--color-primary-fg)] shadow-[var(--shadow-glow-violet)]">
            Quick view
          </span>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-medium uppercase tracking-wide text-[color:var(--color-text-tertiary)]">
            {item.weapon}
          </span>
          {ext && (
            <span
              className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold"
              style={{
                color: item.rarityColor,
                background: `${item.rarityColor}1a`,
              }}
            >
              {ext.short}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[2.4em] text-sm font-semibold leading-tight text-[color:var(--color-text)]">
          {item.name.replace(/^(StatTrak™ |Souvenir )/, "").split(" | ").slice(1).join(" | ") || item.name}
        </h3>

        {/* mini wear bar */}
        {marker != null && (
          <div className="relative mt-0.5 h-1 w-full rounded-full">
            <div className="wear-bar absolute inset-0 rounded-full opacity-70" />
            <span
              className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/40 bg-white"
              style={{ left: `${marker * 100}%` }}
            />
          </div>
        )}
        {item.float != null && (
          <span className="tnum text-[10px] text-[color:var(--color-text-tertiary)]">
            float {item.float.toFixed(4)}
          </span>
        )}

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
        </div>
      </div>
    </Link>
  );
}

export function SkinCardSkeleton() {
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
