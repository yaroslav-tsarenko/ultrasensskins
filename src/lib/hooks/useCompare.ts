"use client";

import { useSkinCollection } from "./useSkinCollection";

/** Skins staged for side-by-side comparison — capped at 4 columns. */
export function useCompare() {
  return useSkinCollection("uss:compare", { max: 4 });
}
