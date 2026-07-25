import { Suspense } from "react";
import type { Metadata } from "next";
import { getCatalogFacets } from "@/lib/skins/queries";
import { CatalogClient } from "@/components/skins/CatalogClient";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Catalog — ${brand.displayName}`,
  description: "Browse thousands of CS2 skins with live float, pattern and price data.",
};

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const facets = await getCatalogFacets();

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
          <span className="eyebrow text-[color:var(--color-primary)]">The marketplace</span>
          <h1 className="editorial-heading mt-2 text-3xl font-bold text-[color:var(--color-text)] sm:text-4xl">
            Browse the collection
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--color-text-secondary)]">
            Every listing carries live float, pattern and price data — filter down to the exact cut you want.
          </p>
        </div>
      </header>
      <Suspense fallback={null}>
        <CatalogClient facets={facets} locale={locale} />
      </Suspense>
    </>
  );
}
