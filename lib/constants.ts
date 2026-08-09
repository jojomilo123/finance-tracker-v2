import { NavItem } from "@/types";

export const APP_CONFIG = {
  name: "Finance Tracker",
  description: "Platform Manajemen Keuangan Pribadi & Olah Data Finansial Cerdas",
  version: "0.1.0",
  defaultCurrency: "IDR",
  defaultLocale: "id-ID",
  defaultTimezone: "Asia/Jakarta",
};

export const MAIN_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Transactions", href: "/transactions", icon: "ArrowLeftRight" },
  { title: "Income", href: "/income", icon: "TrendingUp" },
  { title: "Expenses", href: "/expenses", icon: "TrendingDown" },
  { title: "Budgets", href: "/budgets", icon: "PieChart" },
  { title: "Categories", href: "/categories", icon: "FolderKanban" },
  { title: "Reports", href: "/reports", icon: "BarChart3" },
  { title: "Analytics", href: "/analytics", icon: "LineChart" },
  { title: "Calendar", href: "/calendar", icon: "Calendar" },
  { title: "Goals", href: "/goals", icon: "Target" },
  { title: "Subscriptions", href: "/subscriptions", icon: "CreditCard" },
  { title: "Net Worth", href: "/net-worth", icon: "Landmark" },
  { title: "Settings", href: "/settings", icon: "Settings" },
];
