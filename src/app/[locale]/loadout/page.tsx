import type { Metadata } from "next";
import { LoadoutClient } from "@/components/collections/LoadoutClient";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Loadout creator — ${brand.displayName}`,
  description: "Build a full CS2 loadout and track its total value.",
};

export default function LoadoutPage() {
  return <LoadoutClient />;
}
