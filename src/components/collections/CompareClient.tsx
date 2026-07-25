"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Trash2, X } from "lucide-react";
import { useCompare } from "@/lib/hooks/useCompare";
import { formatUSD } from "@/components/skins/SkinCard";
import { CollectionHeader, EmptyState } from "./CollectionShell";
import type { SkinSnapshot } from "@/lib/skins/snapshot";

const ROWS: { label: string; render: (s: SkinSnapshot) => React.ReactNode; best?: "min" | "max"; value?: (s: SkinSnapshot) => number | null }[] = [
  { label: "Price", render: (s) => formatUSD(s.price), best: "min", value: (s) => s.price },
  { label: "Steam price", render: (s) => (s.steamPrice != null ? formatUSD(s.steamPrice) : "—") },
  { label: "Discount", render: (s) => (s.discountPct ? `−${Math.round(s.discountPct)}%` : "—"), best: "max", value: (s) => s.discountPct ?? 0 },
  { label: "Float", render: (s) => (s.float != null ? s.float.toFixed(4) : "—"), best: "min", value: (s) => s.float },
  { label: "Exterior", render: (s) => s.exterior },
  { label: "Rarity", render: (s) => <span style={{ color: s.rarityColor }}>{s.rarity}</span> },
  { label: "StatTrak™", render: (s) => (s.isStatTrak ? "Yes" : "—") },
  { label: "Souvenir", render: (s) => (s.isSouvenir ? "Yes" : "—") },
];

export function CompareClient() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const compare = useCompare();
  const items = compare.items;

  const bestFor = (row: (typeof ROWS)[number]): string | null => {
    if (!row.best || !row.value) return null;
    const vals = items
      .map((s) => ({ id: s.skinId, v: row.value!(s) }))
      .filter((x): x is { id: string; v: number } => x.v != null);
    if (vals.length < 2) return null;
    const winner = vals.reduce((a, b) => (row.best === "min" ? (b.v < a.v ? b : a) : (b.v > a.v ? b : a)));
    return winner.id;
  };

  return (
    <>
      <CollectionHeader
        eyebrow="Side by side"
        title="Compare skins"
        subtitle="Stack up to four cuts and see how price, float and rarity line up."
        action={
          items.length > 0 ? (
            <button
              onClick={compare.clear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--color-line-strong)] px-3 py-2 text-sm text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-danger)]"
            >
              <Trash2 className="h-4 w-4" /> Clear all
            </button>
          ) : null
        }
      />

      <div className="mx-auto w-full max-w-[var(--max-width)] px-4 py-6">
        {items.length === 0 ? (
          <EmptyState
            title="Nothing to compare yet"
            hint="Add skins with the compare icon on any card or detail page — up to four at once."
            cta={
              <Link
                href={`/${locale}/catalog`}
                className="inline-flex items-center rounded-lg bg-[color:var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[color:var(--color-primary-fg)] shadow-[var(--shadow-glow-violet)]"
              >
                Browse skins
              </Link>
            }
          />
        ) : (
          <div className="metal-stroke overflow-x-auto rounded-2xl bg-[color:var(--color-bg-elevated)]">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-32 border-b border-[color:var(--color-line)] p-3" />
                  {items.map((s) => (
                    <th key={s.skinId} className="border-b border-l border-[color:var(--color-line)] p-3 align-top">
                      <div className="relative">
                        <button
                          onClick={() => compare.remove(s.skinId)}
                          aria-label="Remove"
                          className="glass absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-danger)]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <Link href={`/${locale}/skin/${s.skinId}?listing=${s.listingId}`} className="block">
                          <div className="tech-grid relative mb-2 aspect-[4/3] overflow-hidden rounded-lg" style={{ ["--rarity" as string]: s.rarityColor }}>
                            <div className="rarity-strip absolute inset-x-0 top-0 h-[3px]" />
                            {s.imageUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={s.imageUrl} alt={s.name} className="absolute inset-0 h-full w-full object-contain p-3" />
                            )}
                          </div>
                          <div className="text-left text-[11px] font-medium uppercase tracking-wide text-[color:var(--color-text-tertiary)]">
                            {s.weapon}
                          </div>
                          <div className="line-clamp-2 text-left text-xs font-semibold text-[color:var(--color-text)]">
                            {s.name.split(" | ").slice(1).join(" | ") || s.name}
                          </div>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const best = bestFor(row);
                  return (
                    <tr key={row.label}>
                      <td className="border-b border-[color:var(--color-line)] p-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-tertiary)]">
                        {row.label}
                      </td>
                      {items.map((s) => (
                        <td
                          key={s.skinId}
                          className={`tnum border-b border-l border-[color:var(--color-line)] p-3 font-semibold ${
                            best === s.skinId ? "text-[color:var(--color-success)]" : "text-[color:var(--color-text)]"
                          }`}
                        >
                          {row.render(s)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
