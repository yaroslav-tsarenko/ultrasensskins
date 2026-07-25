"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { useLoadout } from "@/lib/hooks/useLoadout";
import { formatUSD } from "@/components/skins/SkinCard";
import { toSnapshot, type SkinSnapshot } from "@/lib/skins/snapshot";
import type { CatalogItem, CatalogResult } from "@/lib/skins/queries";
import { CollectionHeader } from "./CollectionShell";

interface Slot {
  id: string;
  label: string;
  query: string; // default filter applied when the picker opens
}

const SLOTS: { side: string; slots: Slot[] }[] = [
  {
    side: "Signature",
    slots: [
      { id: "knife", label: "Knife", query: "category=Knives" },
      { id: "gloves", label: "Gloves", query: "category=Gloves" },
    ],
  },
  {
    side: "Rifles",
    slots: [
      { id: "ak47", label: "AK-47", query: "weapon=AK-47" },
      { id: "m4", label: "M4A4 / M4A1-S", query: "weapon=M4A4,M4A1-S" },
      { id: "awp", label: "AWP", query: "weapon=AWP" },
    ],
  },
  {
    side: "Pistols",
    slots: [
      { id: "deagle", label: "Desert Eagle", query: "weapon=Desert Eagle" },
      { id: "usp", label: "USP-S / Glock-18", query: "weapon=USP-S,Glock-18" },
    ],
  },
];

export function LoadoutClient() {
  const { loadout, assign, unassign, clear, total, filled } = useLoadout();
  const [picking, setPicking] = useState<Slot | null>(null);

  return (
    <>
      <CollectionHeader
        eyebrow="Build your dream inventory"
        title="Loadout creator"
        subtitle="Assemble a full CS2 loadout and watch its value add up — saved on this device."
        action={
          filled > 0 ? (
            <button
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--color-line-strong)] px-3 py-2 text-sm text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-danger)]"
            >
              <Trash2 className="h-4 w-4" /> Reset loadout
            </button>
          ) : null
        }
      />

      <div className="mx-auto grid w-full max-w-[var(--max-width)] gap-6 px-4 py-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-8">
          {SLOTS.map((group) => (
            <section key={group.side}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                {group.side}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {group.slots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    snapshot={loadout[slot.id]}
                    onPick={() => setPicking(slot)}
                    onClear={() => unassign(slot.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="lg:sticky lg:top-[92px] lg:self-start">
          <div className="metal-stroke rounded-2xl bg-[color:var(--color-bg-elevated)] p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-tertiary)]">
              Loadout value
            </div>
            <div className="tnum mt-1 font-display text-3xl font-bold text-[color:var(--color-text)]">
              {formatUSD(total)}
            </div>
            <div className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
              {filled} of {SLOTS.reduce((n, g) => n + g.slots.length, 0)} slots filled
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-bg-tertiary)]">
              <div
                className="h-full rounded-full bg-[color:var(--color-primary)] transition-all"
                style={{ width: `${(filled / SLOTS.reduce((n, g) => n + g.slots.length, 0)) * 100}%` }}
              />
            </div>
          </div>
        </aside>
      </div>

      {picking && (
        <SkinPicker
          slot={picking}
          onClose={() => setPicking(null)}
          onSelect={(item) => {
            assign(picking.id, toSnapshot(item));
            setPicking(null);
          }}
        />
      )}
    </>
  );
}

function SlotCard({
  slot,
  snapshot,
  onPick,
  onClear,
}: {
  slot: Slot;
  snapshot?: SkinSnapshot;
  onPick: () => void;
  onClear: () => void;
}) {
  if (!snapshot) {
    return (
      <button
        onClick={onPick}
        className="group flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--color-line-strong)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-tertiary)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
      >
        <Plus className="h-6 w-6" />
        <span className="text-xs font-semibold uppercase tracking-wide">{slot.label}</span>
      </button>
    );
  }
  return (
    <div
      className="metal-stroke group relative flex aspect-[4/3] flex-col overflow-hidden rounded-xl bg-[color:var(--color-bg-elevated)]"
      style={{ ["--rarity" as string]: snapshot.rarityColor }}
    >
      <div className="rarity-strip h-[3px] w-full" />
      <button
        onClick={onClear}
        aria-label="Remove"
        className="glass absolute right-1.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full text-[color:var(--color-text-secondary)] opacity-0 transition group-hover:opacity-100 hover:text-[color:var(--color-danger)]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <button onClick={onPick} className="tech-grid relative flex-1 overflow-hidden">
        {snapshot.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={snapshot.imageUrl} alt={snapshot.name} className="absolute inset-0 h-full w-full object-contain p-3" />
        )}
      </button>
      <div className="flex items-center justify-between gap-1 px-2 py-1.5">
        <span className="truncate text-[11px] font-semibold text-[color:var(--color-text)]">
          {snapshot.name.split(" | ").slice(1).join(" | ") || snapshot.name}
        </span>
        <span className="tnum shrink-0 text-[11px] font-bold text-[color:var(--color-text)]">
          {formatUSD(snapshot.price)}
        </span>
      </div>
    </div>
  );
}

function SkinPicker({
  slot,
  onClose,
  onSelect,
}: {
  slot: Slot;
  onClose: () => void;
  onSelect: (item: CatalogItem) => void;
}) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const fetchItems = useCallback(
    async (q: string) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      try {
        const p = new URLSearchParams(slot.query);
        if (q) p.set("q", q);
        p.set("perPage", "24");
        p.set("sort", "price_asc");
        const res = await fetch(`/api/skins?${p.toString()}`, { signal: ac.signal });
        const json = (await res.json()) as CatalogResult;
        setItems(json.items);
      } catch (err) {
        if ((err as Error).name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [slot.query],
  );

  useEffect(() => {
    const t = setTimeout(() => fetchItems(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchItems]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="glass-strong relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-line)] p-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-tertiary)]">
              Choose a skin
            </div>
            <div className="font-display text-lg font-bold text-[color:var(--color-text)]">{slot.label}</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative p-4">
          <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${slot.label}…`}
            className="w-full rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg)] py-2 pl-9 pr-3 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-primary)]"
          />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto p-4 pt-0 sm:grid-cols-3">
          {loading && items.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-[color:var(--color-text-secondary)]">Loading…</div>
          )}
          {!loading && items.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-[color:var(--color-text-secondary)]">No matches.</div>
          )}
          {items.map((it) => (
            <button
              key={it.listingId}
              onClick={() => onSelect(it)}
              className="metal-stroke group flex flex-col overflow-hidden rounded-lg bg-[color:var(--color-bg-elevated)] text-left transition hover:-translate-y-0.5"
              style={{ ["--rarity" as string]: it.rarityColor }}
            >
              <div className="rarity-strip h-[3px] w-full" />
              <div className="tech-grid relative aspect-[4/3] overflow-hidden">
                {it.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.imageUrl} alt={it.name} className="absolute inset-0 h-full w-full object-contain p-2" />
                )}
              </div>
              <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                <span className="truncate text-[10px] text-[color:var(--color-text-secondary)]">
                  {it.name.split(" | ").slice(1).join(" | ") || it.name}
                </span>
                <span className="tnum shrink-0 text-[11px] font-bold text-[color:var(--color-text)]">
                  {formatUSD(it.price)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
