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

export function calculateMonthOverMonthChange(
  transactions: Array<{ date: string; amount: number; transactionType: string }>,
  type: "INCOME" | "EXPENSE"
): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  let currentSum = 0;
  let prevSum = 0;

  transactions.forEach((t) => {
    if (t.transactionType !== type) return;
    const txDate = new Date(t.date);
    if (isNaN(txDate.getTime())) return;

    if (txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth) {
      currentSum += t.amount;
    } else if (txDate.getFullYear() === prevYear && txDate.getMonth() === prevMonth) {
      prevSum += t.amount;
    }
  });

  if (prevSum === 0) {
    return currentSum > 0 ? 100 : 0;
  }

  const change = ((currentSum - prevSum) / prevSum) * 100;
  return Number(change.toFixed(1));
}

export function compressImage(file: File, maxDim = 300, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
