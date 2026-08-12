import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSihItemBySlug, getSihRelated } from "@/lib/sih/queries";
import { refreshSihItemLive } from "@/lib/sih/live";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SihItemDetailClient, type SihPurchaseState } from "@/components/sih/SihItemDetailClient";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const item = await getSihItemBySlug(name);
  if (!item) return { title: `Skin — ${brand.displayName}` };
  const description = `Buy ${item.name} on ${brand.displayName} — delivered to your Steam inventory.`;
  const canonical = `/store/${item.slug}`;
  return {
    title: item.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: `${item.name} — ${brand.displayName}`,
      description,
      images: item.imageUrl ? [{ url: item.imageUrl, alt: item.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.name,
      description,
      images: item.imageUrl ? [item.imageUrl] : undefined,
    },
  };
}

export default async function StoreItemPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const dbItem = await getSihItemBySlug(name);
  if (!dbItem) notFound();

  const item = await refreshSihItemLive(dbItem);

  const related = await getSihRelated(item);

  const user = await getSessionUser();
  let purchaseState: SihPurchaseState = "anon";
  if (user) {
    const steam = await prisma.steamAccount.findUnique({
      where: { userId: user.id },
      select: { tradeUrlVerified: true },
    });
    if (!steam) purchaseState = "no-steam";
    else purchaseState = steam.tradeUrlVerified ? "ready" : "no-trade-url";
  }

  return <SihItemDetailClient item={item} related={related} purchaseState={purchaseState} />;
}
