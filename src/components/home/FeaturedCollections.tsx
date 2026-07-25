import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";

export interface FeaturedCollection {
  title: string;
  subtitle: string;
  href: string;
  imageUrls: string[];
  accent: string; // css color for the rarity-style glow
}

// Large editorial collection cards. Each is a curated entry point into the real
// catalog (deep-linked filters); the artwork is a stack of real representative
// renders passed from the server. The first card spans two columns for rhythm.
export function FeaturedCollections({ collections }: { collections: FeaturedCollection[] }) {
  if (!collections.length) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {collections.map((c, i) => (
        <Link
          key={c.title}
          href={c.href}
          className={`panel card-lift reticle group relative flex min-h-[220px] flex-col justify-between overflow-hidden p-5 ${
            i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
          }`}
          style={{ ["--rarity" as string]: c.accent }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70 transition-opacity group-hover:opacity-100"
            style={{
              background: `radial-gradient(120% 90% at 85% 110%, ${c.accent}2e 0%, transparent 60%)`,
            }}
          />
          <div className="tech-grid pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative flex items-start justify-between gap-3">
            <div>
              <div className="microlabel text-[color:var(--color-primary)]">Collection</div>
              <h3 className="mt-1 font-display text-xl font-extrabold tracking-tight text-[color:var(--color-text)]">
                {c.title}
              </h3>
              <p className="mt-1 max-w-[28ch] text-[13px] text-[color:var(--color-text-secondary)]">
                {c.subtitle}
              </p>
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-tertiary)] text-[color:var(--color-text-secondary)] transition group-hover:border-[color:var(--color-primary)] group-hover:text-[color:var(--color-primary)]">
              <ArrowUpRight size={16} />
            </span>
          </div>

          <div className="relative mt-4 flex items-end gap-2">
            {c.imageUrls.slice(0, i === 0 ? 4 : 3).map((src, k) => (
              <span
                key={k}
                className="flex h-16 flex-1 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-tertiary)]"
              >
                {src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
