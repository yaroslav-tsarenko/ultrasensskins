import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/shared/SEO/JsonLd";
import {
  getMarketStats,
  queryCatalog,
  getRecentListings,
  getRarityBreakdown,
  getCategoryShowcase,
  type CatalogItem,
} from "@/lib/skins/queries";
import { curateRow } from "@/lib/skins/assortment";
import { SkinCard } from "@/components/skins/SkinCard";
import { CountUp } from "@/components/home/CountUp";
import { MarketTicker } from "@/components/home/MarketTicker";
import { RarityExplorer } from "@/components/home/RarityExplorer";
import { WearSlider } from "@/components/home/WearSlider";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { TrendingCarousel } from "@/components/home/TrendingCarousel";
import { ActivityFeed } from "@/components/home/ActivityFeed";
import { BudgetFinder } from "@/components/home/BudgetFinder";
import { FeaturedCollections, type FeaturedCollection } from "@/components/home/FeaturedCollections";
import { brand } from "@/lib/brand";
import {
  ArrowRight,
  Layers,
  Percent,
  TrendingUp,
  Wallet,
  Flame,
  Sparkles,
  Gem,
  Radio,
  Diamond,
  ShieldCheck,
  Crosshair,
  Scale,
  Boxes,
  ArrowUpRight,
} from "lucide-react";

export const revalidate = 60;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `${brand.displayName} — ${brand.tagline}`,
    description: brand.description,
    alternates: { canonical: `/${locale}` },
    openGraph: { url: `/${locale}` },
  };
}

async function getFeaturedSkin() {
  const dragon = await prisma.skin.findFirst({
    where: { name: { contains: "Dragon Lore", mode: "insensitive" }, listingCount: { gt: 0 } },
    orderBy: { lowestPrice: "desc" },
    select: { id: true, externalId: true, name: true, weapon: true, lowestPrice: true, imageUrl: true, rarityColor: true },
  });
  if (dragon) return dragon;
  return prisma.skin.findFirst({
    where: { listingCount: { gt: 0 } },
    orderBy: { lowestPrice: "desc" },
    select: { id: true, externalId: true, name: true, weapon: true, lowestPrice: true, imageUrl: true, rarityColor: true },
  });
}

function pics(items: CatalogItem[], n = 4): string[] {
  return items
    .map((i) => i.imageUrl)
    .filter((u): u is string => Boolean(u))
    .slice(0, n);
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  href,
  cta,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <div className="microlabel flex items-center gap-1.5 text-[color:var(--color-primary)]">
          <Icon size={13} /> {eyebrow}
        </div>
        <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-[color:var(--color-text)]">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="focus-amber inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] text-[13px] font-semibold text-[color:var(--color-primary)] hover:underline"
      >
        {cta} <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  const [stats, featured, deals, fresh, premium, under50, budgetPool, recent, rarities, categories] =
    await Promise.all([
      getMarketStats(),
      getFeaturedSkin(),
      queryCatalog({ sort: "discount", perPage: 24 }),
      queryCatalog({ sort: "newest", perPage: 24 }),
      queryCatalog({ categories: ["Knives", "Gloves"], sort: "price_desc", perPage: 12 }),
      queryCatalog({ priceMax: 50, sort: "discount", perPage: 24 }),
      queryCatalog({ priceMax: 1000, sort: "newest", perPage: 96 }),
      getRecentListings(24),
      getRarityBreakdown(),
      getCategoryShowcase(),
    ]);

  // Smart, mixed assortment: interleave categories so no row reads as a single
  // weapon type. Deterministic so SSR and client agree.
  const trending = curateRow([...deals.items, ...fresh.items], 16);
  const dealRow = curateRow(deals.items, 10);
  const freshRow = curateRow(fresh.items, 10);
  const under50Row = curateRow(under50.items, 10);
  const premiumRow = premium.items.slice(0, 8);

  const collections: FeaturedCollection[] = [
    {
      title: "Blade & Hand",
      subtitle: "Knives and gloves — the crown of any inventory.",
      href: "/catalog?category=Knives,Gloves&sort=price_desc",
      imageUrls: pics(premium.items),
      accent: "#E4AE39",
    },
    {
      title: "Best value picks",
      subtitle: "Steepest discounts against Steam market right now.",
      href: "/catalog?sort=discount",
      imageUrls: pics(deals.items, 3),
      accent: "#FF7A1A",
    },
    {
      title: "Fresh this week",
      subtitle: "The newest listings hitting the armory floor.",
      href: "/catalog?sort=newest",
      imageUrls: pics(fresh.items, 3),
      accent: "#C7CCD6",
    },
    {
      title: "Under $50 loadout",
      subtitle: "Build a full kit without breaking the bank.",
      href: "/catalog?priceMax=50&sort=discount",
      imageUrls: pics(under50.items, 3),
      accent: "#39D98A",
    },
  ];

  const statItems = [
    { icon: Layers, label: "Items listed", value: stats.totalListings, decimals: 0, prefix: "", suffix: "" },
    { icon: Wallet, label: "Market value", value: Math.round(stats.marketValue), decimals: 0, prefix: "$", suffix: "" },
    { icon: Percent, label: "Avg discount", value: stats.avgDiscountPct, decimals: 1, prefix: "", suffix: "%" },
    { icon: TrendingUp, label: "Unique skins", value: stats.totalSkins, decimals: 0, prefix: "", suffix: "" },
  ];

  const tools = [
    {
      icon: Boxes,
      href: "/loadout",
      eyebrow: "Builder",
      title: "Loadout creator",
      copy: "Assemble a full CS2 kit and watch its value add up.",
    },
    {
      icon: Scale,
      href: "/compare",
      eyebrow: "Analysis",
      title: "Compare skins",
      copy: "Put finishes head-to-head on price, float and rarity.",
    },
    {
      icon: TrendingUp,
      href: "/analytics",
      eyebrow: "Market",
      title: "Price analytics",
      copy: "Track movement, volume and popular categories.",
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: brand.displayName,
          legalName: brand.company.legalName,
          alternateName: [brand.domain],
          url: brand.url,
          sameAs: [brand.url],
          description: brand.description,
        }}
      />

      <div className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="grain reticle relative overflow-hidden rounded-[var(--radius-2xl)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-6 sm:p-10 lg:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.9 }} />
          <div aria-hidden className="tech-grid pointer-events-none absolute inset-0 opacity-[0.5]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-primary-tint)] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
                <Crosshair size={12} /> Precision skin terminal
              </span>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-[color:var(--color-text)] sm:text-5xl">
                Find your perfect{" "}
                <span className="bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] bg-clip-text text-transparent">
                  CS2 skin.
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-[color:var(--color-text-secondary)]">
                Explore thousands of skins, compare prices and build your dream
                inventory. Every listing carries verified float, pattern and
                cross-market data — read like an instrument, traded like an asset.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/catalog"
                  className="focus-amber inline-flex h-12 items-center gap-2 rounded-[var(--radius-md)] bg-[color:var(--color-primary)] px-6 text-sm font-bold text-[color:var(--color-primary-fg)] shadow-[0_10px_30px_-8px_var(--color-primary-glow)] transition hover:bg-[color:var(--color-primary-hover)]"
                >
                  Browse skins <ArrowRight size={16} />
                </Link>
                <Link
                  href="/sell"
                  className="focus-amber inline-flex h-12 items-center gap-2 rounded-[var(--radius-md)] border border-[color:var(--color-border-strong)] px-6 text-sm font-bold text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  <Wallet size={16} /> Sell skins
                </Link>
              </div>
              <div className="mt-5 flex items-center gap-2 text-[13px] text-[color:var(--color-text-tertiary)]">
                <ShieldCheck size={15} className="text-[color:var(--color-primary)]" />
                Buyer protection on every trade · No password ever shared
              </div>
            </div>

            {/* Featured high-tier showcase */}
            {featured && (
              <Link
                href={`/skin/${featured.id}`}
                className="panel card-lift reticle group relative flex flex-col overflow-hidden"
                style={{ ["--rarity" as string]: featured.rarityColor }}
              >
                <div className="rarity-strip h-[3px] w-full" />
                <div className="relative aspect-[16/10] overflow-hidden tech-grid">
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(120% 90% at 50% 120%, ${featured.rarityColor}2e 0%, transparent 60%)`,
                    }}
                  />
                  {featured.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.imageUrl}
                      alt={featured.name}
                      className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                    <Gem size={11} /> Featured
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="truncate font-display text-[15px] font-bold text-[color:var(--color-text)]">
                      {featured.name}
                    </div>
                    <div className="microlabel mt-0.5">{featured.weapon}</div>
                  </div>
                  {featured.lowestPrice != null && (
                    <div className="shrink-0 text-right">
                      <div className="microlabel">from</div>
                      <div className="readout font-display text-lg font-extrabold text-[color:var(--color-primary)]">
                        ${Number(featured.lowestPrice).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )}
          </div>

          {/* Stats strip — HUD readouts */}
          <div className="relative mt-8 grid grid-cols-2 gap-3 border-t border-[color:var(--color-border)] pt-6 lg:grid-cols-4">
            {statItems.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                  <s.icon size={18} />
                </span>
                <div>
                  <CountUp
                    value={s.value}
                    decimals={s.decimals}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    className="readout font-display text-xl font-extrabold leading-none text-[color:var(--color-text)]"
                  />
                  <div className="microlabel mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Live market ticker ───────────────────────────────── */}
        <section className="mt-8">
          <div className="microlabel mb-3 flex items-center gap-1.5 text-[color:var(--color-primary)]">
            <Radio size={13} /> Live market · newest listings
          </div>
          <MarketTicker items={recent} />
        </section>

        {/* ── Category showcase ────────────────────────────────── */}
        <section className="mt-12">
          <SectionHeader icon={Boxes} eyebrow="Browse the armory" title="Shop by category" href="/catalog" cta="All categories" />
          <CategoryShowcase items={categories} />
        </section>

        {/* ── Trending carousel ────────────────────────────────── */}
        <section className="mt-12">
          <SectionHeader icon={Flame} eyebrow="Moving now" title="Trending skins" href="/catalog?sort=discount" cta="See all" />
          <TrendingCarousel items={trending} locale={locale} />
        </section>

        {/* ── Budget finder ────────────────────────────────────── */}
        <section className="mt-12">
          <BudgetFinder pool={budgetPool.items} />
        </section>

        {/* ── Best deals + live activity ───────────────────────── */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <SectionHeader icon={Percent} eyebrow="Best value" title="Biggest discounts" href="/catalog?sort=discount" cta="See all deals" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {dealRow.slice(0, 8).map((item) => (
                <SkinCard key={item.listingId} item={item} locale={locale} />
              ))}
            </div>
          </div>
          <div>
            <div className="microlabel mb-4 flex items-center gap-1.5 text-[color:var(--color-primary)]">
              <Radio size={13} /> Real-time feed
            </div>
            <ActivityFeed items={recent} />
          </div>
        </section>

        {/* ── Featured collections ─────────────────────────────── */}
        <section className="mt-12">
          <SectionHeader icon={Diamond} eyebrow="Curated" title="Featured collections" href="/catalog" cta="Open catalog" />
          <FeaturedCollections collections={collections} />
        </section>

        {/* ── Under $50 ────────────────────────────────────────── */}
        <section className="mt-12">
          <SectionHeader icon={Wallet} eyebrow="Budget picks" title="Under $50" href="/catalog?priceMax=50" cta="Shop under $50" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {under50Row.map((item) => (
              <SkinCard key={item.listingId} item={item} locale={locale} />
            ))}
          </div>
        </section>

        {/* ── Rarity explorer + wear demo ──────────────────────── */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="flex flex-col">
            <SectionHeader icon={Diamond} eyebrow="Explore by tier" title="Rarity breakdown" href="/catalog" cta="Open catalog" />
            <RarityExplorer buckets={rarities} />
          </div>
          <div className="flex flex-col">
            <SectionHeader icon={Radio} eyebrow="Know your float" title="Wear & float" href="/faq" cta="Learn more" />
            <WearSlider />
          </div>
        </section>

        {/* ── Premium collection ───────────────────────────────── */}
        <section className="mt-12">
          <SectionHeader icon={Gem} eyebrow="High tier" title="Premium collection" href="/catalog?category=Knives,Gloves&sort=price_desc" cta="Browse rare" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
            {premiumRow.map((item) => (
              <SkinCard key={item.listingId} item={item} locale={locale} />
            ))}
          </div>
        </section>

        {/* ── Fresh arrivals ───────────────────────────────────── */}
        <section className="mt-12">
          <SectionHeader icon={Sparkles} eyebrow="Fresh drops" title="Fresh arrivals" href="/catalog?sort=newest" cta="See what's new" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {freshRow.map((item) => (
              <SkinCard key={item.listingId} item={item} locale={locale} />
            ))}
          </div>
        </section>

        {/* ── Discovery tools ──────────────────────────────────── */}
        <section className="mt-12">
          <SectionHeader icon={Crosshair} eyebrow="Toolkit" title="Discover & build" href="/catalog" cta="Explore" />
          <div className="grid gap-3 sm:grid-cols-3">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="panel card-lift reticle group relative flex flex-col justify-between overflow-hidden p-5"
              >
                <div className="tech-grid pointer-events-none absolute inset-0 opacity-40" />
                <div className="relative flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                    <t.icon size={20} />
                  </span>
                  <ArrowUpRight size={16} className="text-[color:var(--color-text-tertiary)] transition group-hover:text-[color:var(--color-primary)]" />
                </div>
                <div className="relative mt-6">
                  <div className="microlabel text-[color:var(--color-primary)]">{t.eyebrow}</div>
                  <h3 className="mt-1 font-display text-lg font-extrabold tracking-tight text-[color:var(--color-text)]">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)]">{t.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
