import { Suspense } from "react";
import type { Metadata } from "next";
import { FavoritesClient } from "@/components/collections/FavoritesClient";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Favorites — ${brand.displayName}`,
  description: "Your saved skins and recently viewed items.",
};

export default function FavoritesPage() {
  return (
    <Suspense fallback={null}>
      <FavoritesClient />
    </Suspense>
  );
}
