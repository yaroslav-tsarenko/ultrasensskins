import type { CatalogItem } from "./queries";

// Round-robin interleave a pool so neighbouring items rarely share a category —
// the homepage should read as if a merchandiser mixed knives, gloves, rifles and
// pistols rather than dumping one category in a row. Deterministic (no RNG) so
// server and client render identically and there is no hydration mismatch.
export function mixByCategory(items: CatalogItem[]): CatalogItem[] {
  const buckets = new Map<string, CatalogItem[]>();
  for (const item of items) {
    const key = item.category || "Other";
    const bucket = buckets.get(key);
    if (bucket) bucket.push(item);
    else buckets.set(key, [item]);
  }

  // Order buckets by size (largest first) so the big categories spread evenly.
  const queues = [...buckets.values()].sort((a, b) => b.length - a.length);
  const mixed: CatalogItem[] = [];
  let drained = false;
  while (!drained) {
    drained = true;
    for (const q of queues) {
      const next = q.shift();
      if (next) {
        mixed.push(next);
        drained = false;
      }
    }
  }
  return mixed;
}

// De-duplicate by skin so the same skin never appears twice within one curated
// row, keeping the first (best-sorted) listing for each skin.
export function dedupeBySkin(items: CatalogItem[]): CatalogItem[] {
  const seen = new Set<string>();
  const out: CatalogItem[] = [];
  for (const item of items) {
    if (seen.has(item.skinId)) continue;
    seen.add(item.skinId);
    out.push(item);
  }
  return out;
}

// Build a curated, mixed row: dedupe by skin, interleave categories, then cap.
export function curateRow(items: CatalogItem[], limit: number): CatalogItem[] {
  return mixByCategory(dedupeBySkin(items)).slice(0, limit);
}
