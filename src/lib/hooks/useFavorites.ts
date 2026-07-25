"use client";

import { useSkinCollection } from "./useSkinCollection";

/**
 * Client-only wishlist of skins, persisted as snapshots in localStorage. Skin
 * wishlisting has no backend model (the Wishlist API is Products-only), so
 * favorites live on the device and every subscriber stays in sync via a window
 * event. `toggle`/`add` take a full SkinSnapshot so the favorites page can
 * render with zero fetches.
 */
export function useFavorites() {
  return useSkinCollection("uss:favorites");
}
