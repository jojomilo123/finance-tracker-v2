import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SupportedCurrency = "IDR" | "USD" | "EUR" | "SGD";

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  IDR: "Rp",
  USD: "$",
  EUR: "€",
  SGD: "S$",
};

const CURRENCY_LOCALES: Record<SupportedCurrency, string> = {
  IDR: "id-ID",
  USD: "en-US",
  EUR: "de-DE",
  SGD: "en-SG",
};

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = "IDR"
): string {
  const symbol = CURRENCY_SYMBOLS[currency] || "Rp";
  const locale = CURRENCY_LOCALES[currency] || "id-ID";

  if (currency === "IDR") {
    const isNegative = amount < 0;
    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));

    return isNegative ? `-${symbol}${formattedNumber}` : `${symbol}${formattedNumber}`;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
