import type { Metadata } from "next";
import { CompareClient } from "@/components/collections/CompareClient";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Compare — ${brand.displayName}`,
  description: "Compare CS2 skins side by side on price, float and rarity.",
};

export default function ComparePage() {
  return <CompareClient />;
}
