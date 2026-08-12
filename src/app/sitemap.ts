import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { encodeSihSlug } from "@/lib/sih/queries";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/store`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
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
    prisma.sihItem
      .findMany({
        where: { isAvailable: true, count: { gt: 0 }, appId: env.SIH_APP_ID },
        select: { marketHashName: true, updatedAt: true },
        orderBy: { sellPrice: "desc" },
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
    url: `${siteUrl}/store/${encodeSihSlug(s.marketHashName)}`,
    lastModified: s.updatedAt,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const cmsPages: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${siteUrl}/pages/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticPages, ...skinPages, ...cmsPages];
}
