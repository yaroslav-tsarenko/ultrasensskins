"use client";

import { useCallback, useEffect, useState } from "react";
import { isSnapshot, type SkinSnapshot } from "@/lib/skins/snapshot";

const KEY = "uss:loadout";
const EVENT = "uss:loadout:changed";

type Loadout = Record<string, SkinSnapshot>;

function read(): Loadout {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object") return {};
    const out: Loadout = {};
    for (const [slot, snap] of Object.entries(parsed)) {
      if (isSnapshot(snap)) out[slot] = snap;
    }
    return out;
  } catch {
    return {};
  }
}

function write(next: Loadout) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** A saved loadout mapping slot ids → chosen skins, persisted on the device. */
export function useLoadout() {
  const [loadout, setLoadout] = useState<Loadout>({});

  useEffect(() => {
    setLoadout(read());
    const sync = () => setLoadout(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const assign = useCallback((slot: string, snap: SkinSnapshot) => {
    write({ ...read(), [slot]: snap });
  }, []);

  const unassign = useCallback((slot: string) => {
    const next = read();
    delete next[slot];
    write(next);
  }, []);

  const clear = useCallback(() => write({}), []);

  const total = Object.values(loadout).reduce((sum, s) => sum + s.price, 0);

  return { loadout, assign, unassign, clear, total, filled: Object.keys(loadout).length };
}
