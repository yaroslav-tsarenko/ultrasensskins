import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import type { CategoryShowcaseItem } from "@/lib/skins/queries";
import { UsdPrice } from "@/components/skins/UsdPrice";

// Visually-rich category grid — each card is a machined panel with a spotlit
// representative render, live unique-skin count, and entry / average price
// readouts. Reuses the real getCategoryShowcase rollup; no static data.
export function CategoryShowcase({ items }: { items: CategoryShowcaseItem[] }) {
  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((c) => (
        <Link
          key={c.category}
          href={`/catalog?category=${encodeURIComponent(c.category)}`}
          className="panel card-lift reticle group relative flex flex-col overflow-hidden p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="microlabel text-[color:var(--color-primary)]">{c.category}</div>
            <ArrowUpRight
              size={15}
              className="text-[color:var(--color-text-tertiary)] transition group-hover:text-[color:var(--color-primary)]"
            />
          </div>

          <div className="tech-grid relative my-3 flex h-24 items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-[color:var(--color-bg-tertiary)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 70% at 50% 120%, rgba(255,122,26,0.16) 0%, transparent 60%)",
              }}
            />
            {c.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.imageUrl}
                alt={c.category}
                className="relative h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              />
            )}
          </div>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div>
              <div className="readout text-lg font-bold leading-none text-[color:var(--color-text)]">
                {c.count.toLocaleString()}
              </div>
              <div className="microlabel mt-1">skins</div>
            </div>
            {c.fromPrice != null && (
              <div className="text-right">
                <div className="microlabel">from</div>
                <div className="readout text-sm font-bold text-[color:var(--color-primary)]">
                  <UsdPrice value={c.fromPrice} />
                </div>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
