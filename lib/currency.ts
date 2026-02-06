"use client";

import { useState, useEffect } from "react";

// Currency rates (EUR as base = 1)
// These could be fetched from an API in production
export const currencyRates: Record<string, { symbol: string; rate: number }> = {
  EUR: { symbol: "€", rate: 1 },
  USD: { symbol: "$", rate: 1.08 },
  GBP: { symbol: "£", rate: 0.86 },
  MAD: { symbol: "DH", rate: 10.8 },
};

// Convert EUR to target currency
export function convertPrice(eurPrice: number, targetCurrency: string): number {
  const rate = currencyRates[targetCurrency]?.rate || 1;
  return Math.round(eurPrice * rate);
}

// Format price with currency symbol
export function formatPrice(eurPrice: number, targetCurrency: string): string {
  const converted = convertPrice(eurPrice, targetCurrency);
  const { symbol } = currencyRates[targetCurrency] || currencyRates.EUR;
  return `${symbol}${converted.toLocaleString()}`;
}

// Hook to use currency state
export function useCurrency() {
  const [currency, setCurrency] = useState("EUR");

  useEffect(() => {
    // Get initial value from localStorage
    const saved = localStorage.getItem("slowmorocco_currency");
    if (saved && currencyRates[saved]) {
      setCurrency(saved);
    }

    // Listen for currency changes from Header
    const handleChange = (e: CustomEvent) => {
      setCurrency(e.detail);
    };

    window.addEventListener("currencyChange" as any, handleChange);
    return () => window.removeEventListener("currencyChange" as any, handleChange);
  }, []);

  return {
    currency,
    symbol: currencyRates[currency]?.symbol || "€",
    convert: (eurPrice: number) => convertPrice(eurPrice, currency),
    format: (eurPrice: number) => formatPrice(eurPrice, currency),
  };
}
