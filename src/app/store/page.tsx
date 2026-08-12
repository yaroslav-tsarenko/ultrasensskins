import { Suspense } from "react";
import type { Metadata } from "next";
import { getSihFacets } from "@/lib/sih/queries";
import { SihCatalogClient } from "@/components/sih/SihCatalogClient";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Store — ${brand.displayName}`,
  description: "Buy real CS2 skins delivered straight to your Steam inventory. Live stock and prices.",
};

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const facets = await getSihFacets();

  return (
    <>
      <header className="relative overflow-hidden border-b border-[color:var(--color-line)]">
        <div className="grain absolute inset-0 opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-[var(--max-width)] px-4 py-10">
          <span className="eyebrow text-[color:var(--color-primary)]">Buy real skins</span>
          <h1 className="editorial-heading mt-2 text-3xl font-bold text-[color:var(--color-text)] sm:text-4xl">
            The store
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--color-text-secondary)]">
            Every item is live stock, priced in USD and delivered to your Steam inventory as a trade offer.
          </p>
        </div>
      </header>
      <Suspense fallback={null}>
        <SihCatalogClient facets={facets} />
      </Suspense>
    </>
  );
}
