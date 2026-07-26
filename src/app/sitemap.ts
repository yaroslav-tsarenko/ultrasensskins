import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/catalog`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/analytics`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/sell`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/loadout`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/policies/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/policies/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/policies/returns`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/policies/shipping`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/policies/payment`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/policies/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const [skins, pages] = await Promise.all([
    prisma.skin
      .findMany({
        where: { listingCount: { gt: 0 } },
        select: { id: true, imageUrl: true, updatedAt: true },
        orderBy: { lowestPrice: "desc" },
        take: 10000,
      })
      .catch(() => []),
    prisma.page
      .findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => []),
  ]);

  const skinPages: MetadataRoute.Sitemap = skins.map((s) => ({
    url: `${siteUrl}/skin/${s.id}`,
    lastModified: s.updatedAt,
    changeFrequency: "daily",
    priority: 0.7,
    images: s.imageUrl ? [s.imageUrl] : undefined,
  }));

  const cmsPages: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${siteUrl}/pages/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticPages, ...skinPages, ...cmsPages];
}
