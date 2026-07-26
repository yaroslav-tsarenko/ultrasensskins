"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CatalogItem } from "@/lib/skins/queries";
import { SkinCard } from "@/components/skins/SkinCard";

// Horizontal, drag-to-scroll rail of skin cards. Pointer-drag on desktop,
// native touch scroll on mobile, plus arrow controls. Momentum comes from the
// browser's native scroll; we only translate a drag gesture into scrollLeft.
export function TrendingCarousel({ items }: { items: CatalogItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startLeft: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  if (!items.length) return null;

  const nudge = (dir: number) => {
    railRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const rail = railRef.current;
    if (!rail) return;
    drag.current = { startX: e.clientX, startLeft: rail.scrollLeft };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const rail = railRef.current;
    if (!rail || !drag.current) return;
    rail.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-11 right-0 flex gap-2">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => nudge(-1)}
          className="focus-amber pointer-events-auto flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => nudge(1)}
          className="focus-amber pointer-events-auto flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div
        ref={railRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className={`scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {items.map((item) => (
          <div key={item.listingId} className="w-[190px] shrink-0 snap-start sm:w-[210px]">
            <SkinCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
