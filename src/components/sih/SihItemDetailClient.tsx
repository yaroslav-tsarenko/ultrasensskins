"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, Zap, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { exteriorMeta } from "@/lib/skins/shared";
import type { SihItemDetail, SihCatalogItem } from "@/lib/sih/queries";
import { useCurrency } from "@/providers/CurrencyProvider";
import { SihItemCard } from "./SihItemCard";

export type SihPurchaseState = "anon" | "no-steam" | "no-trade-url" | "ready";

export function SihItemDetailClient({
  item,
  related,
  purchaseState,
}: {
  item: SihItemDetail;
  related: SihCatalogItem[];
  purchaseState: SihPurchaseState;
}) {
  const { format } = useCurrency();
  const router = useRouter();
  const ext = exteriorMeta(item.exterior);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const soldOut = item.count <= 0;
  const canBuy = purchaseState === "ready" && !item.stale && !soldOut;

  const title =
    item.skinName ||
    item.name.replace(/^(StatTrak™ |Souvenir |★ )/, "").split(" | ").slice(1).join(" | ") ||
    item.name;

  async function handleBuy() {
    setError(null);
    if (purchaseState === "anon") {
      router.push(`/auth/login?next=/store/${item.slug}`);
      return;
    }
    if (purchaseState === "no-steam" || purchaseState === "no-trade-url") {
      router.push("/sell");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/sih/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketHashName: item.marketHashName }),
      });
      const data = (await res.json()) as { paymentUrl?: string; error?: string };
      if (!res.ok || !data.paymentUrl) {
        setError(data.error ?? "Unable to start checkout. Please try again.");
        setBusy(false);
        return;
      }
      window.location.href = data.paymentUrl;
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  const buyLabel = (() => {
    if (soldOut) return "Out of stock";
    if (item.stale) return "Refreshing price…";
    if (purchaseState === "anon") return "Sign in to buy";
    if (purchaseState === "no-steam") return "Link Steam to buy";
    if (purchaseState === "no-trade-url") return "Add trade URL to buy";
    return `Buy now · ${format(item.price, "USD")}`;
  })();

  return (
    <div className="mx-auto w-full max-w-[var(--max-width)] px-4 py-6">
      <Link
        href="/store"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to store
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* image */}
        <div
          className="metal-stroke relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-[color:var(--color-bg-elevated)] tech-grid"
          style={{ ["--rarity" as string]: item.rarityColor }}
        >
          <div className="rarity-strip absolute inset-x-0 top-0 h-[3px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{ background: `radial-gradient(120% 80% at 50% 120%, ${item.rarityColor}22 0%, transparent 60%)` }}
          />
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.imageUrl} alt={item.name} className="relative h-full w-full object-contain p-10" />
          ) : (
            <span className="text-[color:var(--color-text-tertiary)]">no image</span>
          )}
        </div>

        {/* details */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {item.rarity && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{ color: item.rarityColor, background: `${item.rarityColor}1a` }}
              >
                {item.rarity}
              </span>
            )}
            {ext && (
              <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-xs text-[color:var(--color-text-secondary)]">
                {ext.label}
              </span>
            )}
            {item.isStatTrak && (
              <span className="rounded-full bg-[color:var(--color-warning)] px-2 py-0.5 text-xs font-bold text-black">
                StatTrak™
              </span>
            )}
            {item.isSouvenir && (
              <span className="rounded-full bg-[color:var(--color-teal)] px-2 py-0.5 text-xs font-bold text-black">
                Souvenir
              </span>
            )}
            {item.phase && (
              <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-xs text-[color:var(--color-text-secondary)]">
                {item.phase}
              </span>
            )}
          </div>

          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[color:var(--color-text-tertiary)]">
            {item.weapon ?? item.category}
          </p>
          <h1 className="editorial-heading mt-1 text-2xl font-bold text-[color:var(--color-text)] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{item.name}</p>

          {/* price */}
          <div className="mt-6 flex items-end gap-3">
            <span className="tnum text-3xl font-bold text-[color:var(--color-text)]">
              {format(item.price, "USD")}
            </span>
            {item.steamPrice != null && item.discountPct != null && item.discountPct > 0 && (
              <div className="flex flex-col">
                <span className="tnum text-sm text-[color:var(--color-text-tertiary)] line-through">
                  {format(item.steamPrice, "USD")}
                </span>
                <span className="text-xs font-semibold text-[color:var(--color-success)]">
                  −{item.discountPct}% vs Steam
                </span>
              </div>
            )}
          </div>

          <p className="tnum mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            {soldOut ? "Currently unavailable" : `${item.count} in stock`}
          </p>

          {/* buy */}
          <button
            onClick={handleBuy}
            disabled={busy || soldOut || item.stale}
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[color:var(--color-primary)] px-6 text-sm font-semibold text-[color:var(--color-primary-fg)] shadow-[var(--shadow-glow-violet)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {busy ? "Starting checkout…" : buyLabel}
          </button>

          {error && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[color:var(--color-danger)]">
              <AlertTriangle className="h-4 w-4" /> {error}
            </p>
          )}
          {item.stale && !soldOut && (
            <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">
              Live price is being refreshed — please check back in a moment.
            </p>
          )}

          {/* trust */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Trust icon={<Truck className="h-4 w-4" />} title="Steam delivery" body="Sent as a trade offer" />
            <Trust icon={<ShieldCheck className="h-4 w-4" />} title="Buyer protection" body="Refund if undelivered" />
            <Trust icon={<Zap className="h-4 w-4" />} title="Fast dispatch" body="Automated fulfilment" />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg font-bold text-[color:var(--color-text)]">
            More {item.weapon ?? item.category}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {related.map((r) => (
              <SihItemCard key={r.slug} item={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Trust({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="metal-stroke flex items-start gap-2 rounded-xl bg-[color:var(--color-bg-elevated)] p-3">
      <span className="mt-0.5 text-[color:var(--color-primary)]">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-[color:var(--color-text)]">{title}</p>
        <p className="text-[11px] text-[color:var(--color-text-secondary)]">{body}</p>
      </div>
    </div>
  );
}
