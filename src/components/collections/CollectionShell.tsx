"use client";

import { SkinCard } from "@/components/skins/SkinCard";
import { snapshotToItem, type SkinSnapshot } from "@/lib/skins/snapshot";

export function CollectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-[color:var(--color-line)]">
      <div className="grain absolute inset-0 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-[var(--max-width)] flex-wrap items-end justify-between gap-4 px-4 py-10">
        <div>
          <span className="eyebrow text-[color:var(--color-primary)]">{eyebrow}</span>
          <h1 className="editorial-heading mt-2 text-3xl font-bold text-[color:var(--color-text)] sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-xl text-sm text-[color:var(--color-text-secondary)]">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}

export function SnapshotGrid({ items, locale }: { items: SkinSnapshot[]; locale: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {items.map((s) => (
        <SkinCard key={s.skinId} item={snapshotToItem(s)} locale={locale} />
      ))}
    </div>
  );
}

export function EmptyState({ title, hint, cta }: { title: string; hint: string; cta?: React.ReactNode }) {
  return (
    <div className="metal-stroke flex flex-col items-center rounded-2xl bg-[color:var(--color-bg-elevated)] px-6 py-20 text-center">
      <h3 className="font-display text-lg font-bold text-[color:var(--color-text)]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[color:var(--color-text-secondary)]">{hint}</p>
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}
