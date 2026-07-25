"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, History, Trash2 } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";
import { CollectionHeader, EmptyState, SnapshotGrid } from "./CollectionShell";

type Tab = "favorites" | "recent";

export function FavoritesClient() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const search = useSearchParams();
  const [tab, setTab] = useState<Tab>(search.get("tab") === "recent" ? "recent" : "favorites");

  const favorites = useFavorites();
  const recent = useRecentlyViewed();
  const active = tab === "favorites" ? favorites : recent;

  return (
    <>
      <CollectionHeader
        eyebrow="Your collection"
        title="Favorites & history"
        subtitle="Everything you've saved or viewed, kept on this device."
        action={
          active.count > 0 ? (
            <button
              onClick={active.clear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--color-line-strong)] px-3 py-2 text-sm text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-danger)]"
            >
              <Trash2 className="h-4 w-4" /> Clear {tab === "favorites" ? "favorites" : "history"}
            </button>
          ) : null
        }
      />

      <div className="mx-auto w-full max-w-[var(--max-width)] px-4 py-6">
        <div className="mb-6 inline-flex gap-1 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-1">
          <TabButton active={tab === "favorites"} onClick={() => setTab("favorites")} icon={<Heart className="h-4 w-4" />} label="Favorites" count={favorites.count} />
          <TabButton active={tab === "recent"} onClick={() => setTab("recent")} icon={<History className="h-4 w-4" />} label="Recently viewed" count={recent.count} />
        </div>

        {active.count === 0 ? (
          <EmptyState
            title={tab === "favorites" ? "No favorites yet" : "Nothing viewed yet"}
            hint={
              tab === "favorites"
                ? "Tap the heart on any skin to keep it here for later."
                : "Skins you open will appear here so you can pick up where you left off."
            }
            cta={
              <Link
                href={`/${locale}/catalog`}
                className="inline-flex items-center rounded-lg bg-[color:var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[color:var(--color-primary-fg)] shadow-[var(--shadow-glow-violet)]"
              >
                Explore the marketplace
              </Link>
            }
          />
        ) : (
          <SnapshotGrid items={active.items} locale={locale} />
        )}
      </div>
    </>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[color:var(--color-primary)] text-[color:var(--color-primary-fg)]"
          : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
      }`}
    >
      {icon}
      {label}
      <span className={`tnum rounded-full px-1.5 text-xs ${active ? "bg-black/15" : "bg-[color:var(--color-bg-tertiary)]"}`}>
        {count}
      </span>
    </button>
  );
}
