import { Suspense } from "react";
import type { Metadata } from "next";
import { MyPurchasesClient } from "@/components/sih/MyPurchasesClient";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `My purchases — ${brand.displayName}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function MyPurchasesPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--max-width)] px-4 py-10">
      <span className="eyebrow text-[color:var(--color-primary)]">Your orders</span>
      <h1 className="editorial-heading mt-2 text-3xl font-bold text-[color:var(--color-text)] sm:text-4xl">
        My purchases
      </h1>
      <p className="mt-2 max-w-xl text-sm text-[color:var(--color-text-secondary)]">
        Skins you bought here. Delivery arrives as a Steam trade offer — accept it to
        receive the item.
      </p>

      <Suspense fallback={null}>
        <MyPurchasesClient />
      </Suspense>
    </div>
  );
}
