import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CurrencyCode } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SupportedCurrency = CurrencyCode;

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  IDR: "Rp",
  USD: "$",
  EUR: "€",
  SGD: "S$",
  JPY: "¥",
  GBP: "£",
  AUD: "A$",
};

const CURRENCY_LOCALES: Record<SupportedCurrency, string> = {
  IDR: "id-ID",
  USD: "en-US",
  EUR: "de-DE",
  SGD: "en-SG",
  JPY: "ja-JP",
  GBP: "en-GB",
  AUD: "en-AU",
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

  const fractionDigits = currency === "JPY" ? 0 : 2;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

