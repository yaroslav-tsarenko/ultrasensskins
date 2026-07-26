"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowDownRight, Sparkles, Tag } from "lucide-react";
import type { TickerListing } from "@/lib/skins/queries";
import { useCurrency } from "@/providers/CurrencyProvider";

// Live-feeling marketplace feed. Real listings (getRecentListings) are cycled
// one-at-a-time into a capped, animated stack. The event label is derived from
// real fields — a positive discount reads as a "price drop", otherwise a "new
// listing" — so nothing is fabricated. Pauses under reduced-motion via the
// global animation rule; the interval still advances but transitions are instant.
const VISIBLE = 6;
const INTERVAL = 2600;

type Event = TickerListing & { kind: "drop" | "new" };

function toEvent(l: TickerListing): Event {
  return { ...l, kind: l.discountPct != null && l.discountPct > 0 ? "drop" : "new" };
}

export function ActivityFeed({ items }: { items: TickerListing[] }) {
  const source = items.map(toEvent);
  const [cursor, setCursor] = useState(0);
  const { format } = useCurrency();

  useEffect(() => {
    if (source.length <= VISIBLE) return;
    const t = setInterval(() => setCursor((c) => (c + 1) % source.length), INTERVAL);
    return () => clearInterval(t);
  }, [source.length]);

  if (!source.length) return null;

  const visible = Array.from({ length: Math.min(VISIBLE, source.length) }, (_, i) => {
    return source[(cursor + i) % source.length];
  });

  return (
    <div className="panel flex h-full flex-col overflow-hidden p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="microlabel text-[color:var(--color-text-secondary)]">Live activity</div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-success)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-success)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-success)]" />
          </span>
          Live
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {visible.map((e, i) => (
          <Link
            key={`${e.id}-${cursor}-${i}`}
            href={`/skin/${e.skinId}`}
            style={{ ["--rarity" as string]: e.rarityColor }}
            className="group flex items-center gap-3 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-tertiary)] px-2.5 py-2 transition-colors hover:border-[color:var(--color-primary)]"
          >
            <span
              className="flex h-9 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--color-bg)]"
              style={{ boxShadow: "inset 3px 0 0 0 var(--rarity)" }}
            >
              {e.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.imageUrl} alt="" className="h-full w-full object-contain p-0.5" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em]">
                {e.kind === "drop" ? (
                  <span className="inline-flex items-center gap-0.5 text-[color:var(--color-success)]">
                    <ArrowDownRight size={11} /> Price drop
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[color:var(--color-primary)]">
                    <Sparkles size={11} /> New listing
                  </span>
                )}
              </span>
              <span className="block max-w-full truncate text-[12.5px] font-semibold text-[color:var(--color-text)]">
                {e.name}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="readout block text-[13px] font-bold text-[color:var(--color-text)]">
                {format(e.price, "USD")}
              </span>
              {e.kind === "drop" && e.discountPct != null && (
                <span className="readout inline-flex items-center gap-0.5 text-[10px] font-bold text-[color:var(--color-success)]">
                  <Tag size={9} /> {e.discountPct.toFixed(0)}%
                </span>
              )}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
