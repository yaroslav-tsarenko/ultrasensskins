"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { formatPrice } from "@/lib/utils/format-price";

export type Currency = "USD" | "GBP" | "EUR";

interface Rates {
  USD: number;
  GBP: number;
  EUR: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  /** Convert an amount from a base currency (default EUR) into the selected currency. */
  convert: (amount: number, from?: Currency) => number;
  /** Convert and format an amount from a base currency (default EUR). */
  format: (amount: number, from?: Currency) => string;
  symbol: string;
  rates: Rates;
}

const DEFAULT_RATES: Rates = { EUR: 1, USD: 1.08, GBP: 0.85 };

const SYMBOLS: Record<Currency, string> = { GBP: "£", USD: "$", EUR: "€" };

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [rates, setRates] = useState<Rates>(DEFAULT_RATES);

  useEffect(() => {
    const stored = localStorage.getItem("currency") as Currency | null;
    if (stored && ["EUR", "USD", "GBP"].includes(stored)) {
      setCurrencyState(stored);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/exchange-rates")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.rates) return;
        const usd = Number(data.rates.USD);
        const gbp = Number(data.rates.GBP);
        if (Number.isFinite(usd) && Number.isFinite(gbp) && usd > 0 && gbp > 0) {
          setRates({ EUR: 1, USD: usd, GBP: gbp });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CurrencyContextType>(() => {
    const setCurrency = (c: Currency) => {
      setCurrencyState(c);
      localStorage.setItem("currency", c);
    };

    // Rates are EUR-based: rates[X] is the EUR→X multiplier (rates.EUR === 1).
    const convert = (amount: number, from: Currency = "EUR") => {
      if (!Number.isFinite(amount)) return 0;
      const converted = (amount * rates[currency]) / rates[from];
      return Math.round(converted * 100) / 100;
    };

    const format = (amount: number, from: Currency = "EUR") =>
      formatPrice(convert(amount, from), currency);

    return { currency, setCurrency, convert, format, rates, symbol: SYMBOLS[currency] };
  }, [currency, rates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
