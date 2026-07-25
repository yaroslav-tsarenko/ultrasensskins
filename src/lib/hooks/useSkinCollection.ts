"use client";

import { useCallback, useEffect, useState } from "react";
import { isSnapshot, type SkinSnapshot } from "@/lib/skins/snapshot";

/**
 * Generic localStorage-backed collection of skin snapshots. Every mutation
 * broadcasts a window event keyed to the store so all subscribers (header
 * counters, cards, dedicated pages) stay in sync without a provider. Powers
 * favorites, recently-viewed and compare — each is just a different key + opts.
 */
export function useSkinCollection(
  key: string,
  opts: { max?: number; prepend?: boolean } = {},
) {
  const event = `${key}:changed`;
  const [items, setItems] = useState<SkinSnapshot[]>([]);

  const read = useCallback((): SkinSnapshot[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(isSnapshot) : [];
    } catch {
      return [];
    }
  }, [key]);

  const write = useCallback(
    (next: SkinSnapshot[]) => {
      window.localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(event));
    },
    [key, event],
  );

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener(event, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(event, sync);
      window.removeEventListener("storage", sync);
    };
  }, [read, event]);

  const has = useCallback((id: string) => items.some((s) => s.skinId === id), [items]);

  const add = useCallback(
    (snap: SkinSnapshot) => {
      const current = read().filter((s) => s.skinId !== snap.skinId);
      let next = opts.prepend ? [snap, ...current] : [...current, snap];
      if (opts.max && next.length > opts.max) {
        next = opts.prepend ? next.slice(0, opts.max) : next.slice(next.length - opts.max);
      }
      write(next);
    },
    [read, write, opts.prepend, opts.max],
  );

  const remove = useCallback(
    (id: string) => write(read().filter((s) => s.skinId !== id)),
    [read, write],
  );

  const toggle = useCallback(
    (snap: SkinSnapshot) => {
      const current = read();
      if (current.some((s) => s.skinId === snap.skinId)) {
        write(current.filter((s) => s.skinId !== snap.skinId));
      } else {
        add(snap);
      }
    },
    [read, write, add],
  );

  const clear = useCallback(() => write([]), [write]);

  return { items, count: items.length, has, add, remove, toggle, clear };
}
