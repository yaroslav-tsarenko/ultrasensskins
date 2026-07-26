"use client";

import { useCurrency } from "@/providers/CurrencyProvider";

/** Renders a USD-denominated amount converted into the user's selected currency. */
export function UsdPrice({ value }: { value: number }) {
  const { format } = useCurrency();
  return <>{format(value, "USD")}</>;
}
