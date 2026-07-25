"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowRight, Wallet } from "lucide-react";
import type { CatalogItem } from "@/lib/skins/queries";
import { formatUSD } from "@/components/skins/SkinCard";
import { curateRow } from "@/lib/skins/assortment";

// "Find skins within your budget" — an interactive amber gauge. The pool is a
// real, pre-fetched mixed set of listings; moving the slider filters it live and
// re-mixes categories, and the CTA deep-links into the working catalog filter.
const TIERS = [25, 50, 100, 250, 500, 1000] as const;

export function BudgetFinder({ pool }: { pool: CatalogItem[] }) {
  const [idx, setIdx] = useState(2); // default $100
  const budget = TIERS[idx];

  const matches = useMemo(() => {
    const within = pool.filter((i) => i.price <= budget);
    return curateRow(within, 4);
  }, [pool, budget]);

  const withinCount = useMemo(
    () => pool.filter((i) => i.price <= budget).length,
    [pool, budget],
  );

  return (
    <div className="panel grain relative overflow-hidden p-5 sm:p-6">
      <div className="relative grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <div className="microlabel flex items-center gap-1.5 text-[color:var(--color-primary)]">
            <Wallet size={13} /> Budget finder
          </div>
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[color:var(--color-text)]">
            Find skins within your budget
          </h3>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Slide to set your ceiling — the shortlist re-mixes instantly across
            knives, gloves and weapons.
          </p>

          <div className="mt-5 flex items-baseline gap-2">
            <span className="readout text-3xl font-extrabold text-[color:var(--color-primary)]">
              {budget >= 1000 ? "$1000+" : formatUSD(budget)}
            </span>
            <span className="microlabel">{withinCount.toLocaleString()} matches</span>
          </div>

          <input
            type="range"
            min={0}
            max={TIERS.length - 1}
            step={1}
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            aria-label="Budget ceiling"
            aria-valuetext={budget >= 1000 ? "$1000 or more" : `$${budget}`}
            className="focus-amber mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--color-bg-tertiary)] accent-[color:var(--color-primary)]"
            style={{
              background: `linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary) ${
                (idx / (TIERS.length - 1)) * 100
              }%, var(--color-bg-tertiary) ${(idx / (TIERS.length - 1)) * 100}%, var(--color-bg-tertiary) 100%)`,
            }}
          />
          <div className="mt-2 flex justify-between">
            {TIERS.map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => setIdx(i)}
                className={`readout text-[10px] font-semibold transition ${
                  i === idx
                    ? "text-[color:var(--color-primary)]"
                    : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-secondary)]"
                }`}
              >
                {t >= 1000 ? "1k+" : `$${t}`}
              </button>
            ))}
          </div>

          <Link
            href={`/catalog?priceMax=${budget}&sort=price_desc`}
            className="focus-amber mt-5 inline-flex h-11 items-center gap-2 rounded-[var(--radius-md)] bg-[color:var(--color-primary)] px-5 text-sm font-bold text-[color:var(--color-primary-fg)] shadow-[0_10px_30px_-8px_var(--color-primary-glow)] transition hover:bg-[color:var(--color-primary-hover)]"
          >
            Browse under {budget >= 1000 ? "$1000+" : `$${budget}`} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {matches.map((item) => (
            <Link
              key={item.listingId}
              href={`/skin/${item.skinId}?listing=${item.listingId}`}
              style={{ ["--rarity" as string]: item.rarityColor }}
              className="panel card-lift reticle group relative flex flex-col overflow-hidden"
            >
              <div className="rarity-strip h-[3px] w-full" />
              <div className="tech-grid relative flex aspect-square items-center justify-center overflow-hidden bg-[color:var(--color-bg-tertiary)]">
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </div>
              <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                <span className="truncate text-[10px] text-[color:var(--color-text-secondary)]">
                  {item.name.split(" | ").slice(1).join(" | ") || item.name}
                </span>
                <span className="readout shrink-0 text-[11px] font-bold text-[color:var(--color-text)]">
                  {formatUSD(item.price)}
                </span>
              </div>
            </Link>
          ))}
          {matches.length === 0 && (
            <div className="col-span-full flex items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[color:var(--color-border)] py-10 text-sm text-[color:var(--color-text-tertiary)]">
              No skins under this budget.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
