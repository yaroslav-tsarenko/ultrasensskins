"use client";

import { useSkinCollection } from "./useSkinCollection";

/** Last skins the user opened, newest first, capped so the list stays tidy. */
export function useRecentlyViewed() {
  return useSkinCollection("uss:recently", { prepend: true, max: 24 });
}
