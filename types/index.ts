export type CurrencyCode = "IDR" | "USD" | "EUR" | "SGD" | "JPY" | "GBP" | "AUD";

export type ThemePreference = "light" | "dark" | "system";

export type AccountType =
  | "CASH"
  | "BANK"
  | "E_WALLET"
  | "CREDIT_CARD"
  | "INVESTMENT";

export type CategoryType = "INCOME" | "EXPENSE";

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface UserPreferences {
  currency: CurrencyCode;
  locale: string;
  timezone: string;
  theme: ThemePreference;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  disabled?: boolean;
  external?: boolean;
  badge?: string | number;
}
