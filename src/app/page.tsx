import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { JsonLd } from "@/components/shared/SEO/JsonLd";
import { querySihCatalog } from "@/lib/sih/queries";
import { SihItemCard } from "@/components/sih/SihItemCard";
import { brand } from "@/lib/brand";
import { ArrowRight, Flame, ShieldCheck, Sparkles, Tag, Package } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${brand.displayName} — ${brand.tagline}`,
    description: brand.description,
    alternates: { canonical: "/" },
    openGraph: { url: "/" },
  };
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

export default async function HomePage() {
  const [deals, fresh, premium] = await Promise.all([
    querySihCatalog({ sort: "price_asc", perPage: 12 }),
    querySihCatalog({ sort: "newest", perPage: 12 }),
    querySihCatalog({ sort: "price_desc", perPage: 12 }),
  ]);

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
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-primary-tint)] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
              <Sparkles size={12} /> Real skins · real delivery
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-[color:var(--color-text)] sm:text-5xl">
              Buy real{" "}
              <span className="bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] bg-clip-text text-transparent">
                CS2 skins.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-[color:var(--color-text-secondary)]">
              Every item in the store is live stock, priced in USD and delivered
              straight to your Steam inventory as a trade offer. Pay once — the
              skin lands in your account.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/store"
                className="focus-amber inline-flex h-12 items-center gap-2 rounded-[var(--radius-md)] bg-[color:var(--color-primary)] px-6 text-sm font-bold text-[color:var(--color-primary-fg)] shadow-[0_10px_30px_-8px_var(--color-primary-glow)] transition hover:bg-[color:var(--color-primary-hover)]"
              >
                Browse the store <ArrowRight size={16} />
              </Link>
              <Link
                href="/my-purchases"
                className="focus-amber inline-flex h-12 items-center gap-2 rounded-[var(--radius-md)] border border-[color:var(--color-border-strong)] px-6 text-sm font-bold text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                <Package size={16} /> My purchases
              </Link>
            </div>
            <div className="mt-5 flex items-center gap-2 text-[13px] text-[color:var(--color-text-tertiary)]">
              <ShieldCheck size={15} className="text-[color:var(--color-primary)]" />
              Delivered to Steam · Refund if delivery fails · No password ever shared
            </div>
          </div>
        </section>

        {/* ── Best value ───────────────────────────────────────── */}
        <section className="mt-12">
          <SectionHeader icon={Tag} eyebrow="Best value" title="Lowest prices" href="/store?sort=price_asc" cta="Shop all" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {deals.items.slice(0, 6).map((item) => (
              <SihItemCard key={item.slug} item={item} />
            ))}
          </div>
        </section>

        {/* ── Fresh arrivals ───────────────────────────────────── */}
        <section className="mt-12">
          <SectionHeader icon={Flame} eyebrow="Fresh stock" title="New arrivals" href="/store?sort=newest" cta="See what's new" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {fresh.items.slice(0, 6).map((item) => (
              <SihItemCard key={item.slug} item={item} />
            ))}
          </div>
        </section>

        {/* ── Premium ──────────────────────────────────────────── */}
        <section className="mt-12">
          <SectionHeader icon={Sparkles} eyebrow="High tier" title="Premium picks" href="/store?sort=price_desc" cta="Browse rare" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {premium.items.slice(0, 6).map((item) => (
              <SihItemCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
