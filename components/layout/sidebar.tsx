"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Home,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PiggyBank,
  Tag,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  RefreshCcw,
  CreditCard as SubIcon,
  Landmark,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const navSections = [
    {
      label: "Menu Utama",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: Home },
        { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
        { title: "Income", href: "/income", icon: TrendingUp },
        { title: "Expenses", href: "/expenses", icon: TrendingDown },
      ],
    },
    {
      label: "Keuangan",
      items: [
        { title: "Accounts", href: "/accounts", icon: CreditCard },
        { title: "Budgets", href: "/budgets", icon: PiggyBank },
        { title: "Categories", href: "/categories", icon: Tag },
      ],
    },
    {
      label: "Laporan",
      items: [
        { title: "Reports", href: "/reports", icon: BarChart3 },
        { title: "Analytics", href: "/analytics", icon: PieChart },
        { title: "Calendar", href: "/calendar", icon: Calendar },
      ],
    },
    {
      label: "Lainnya",
      items: [
        { title: "Goals", href: "/goals", icon: Target },
        { title: "Subscriptions", href: "/subscriptions", icon: SubIcon },
        { title: "Net Worth", href: "/net-worth", icon: Landmark },
        { title: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  const allItems = navSections.flatMap((s) => s.items);

  // Mobile bottom bar: show 5 most important
  const mobileItems = [
    { title: "Home", href: "/dashboard", icon: Home },
    { title: "Transaksi", href: "/transactions", icon: ArrowLeftRight },
    { title: "Income", href: "/income", icon: TrendingUp },
    { title: "Expenses", href: "/expenses", icon: TrendingDown },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar (md+) */}
      <aside
        className={cn(
          "hidden md:flex flex-shrink-0 flex-col bg-[#0D1420] border-r border-white/5 min-h-screen z-30 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[220px]"
        )}
      >
        {/* Header */}
        <div className={cn("flex items-center px-4 py-5", collapsed ? "justify-center" : "justify-between")}>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-white text-[#080D16] shadow-md">
              <Sparkles className="h-4 w-4 fill-current" />
            </div>
            {!collapsed && <span className="text-sm font-bold text-white tracking-tight">Finance Tracker</span>}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-[#AAB5C5] hover:text-white hover:bg-white/5 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mb-2 p-1.5 rounded-lg text-[#AAB5C5] hover:text-white hover:bg-white/5 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#AAB5C5]/60 px-2 mb-2">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || (item.href === "/dashboard" && pathname === "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.title}
                      className={cn(
                        "flex items-center rounded-xl transition-all duration-200 group relative",
                        collapsed ? "justify-center p-2.5 mx-auto" : "px-3 py-2 space-x-3",
                        isActive
                          ? "bg-[#10b981]/15 text-[#10b981]"
                          : "text-[#AAB5C5] hover:text-white hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#10b981] rounded-r-full" />
                      )}
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && (
                        <span className="text-[13px] font-medium truncate">{item.title}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation (< md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D1420]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href === "/dashboard" && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-medium transition-all min-w-[52px] min-h-[44px]",
                isActive
                  ? "text-[#10b981] bg-[#10b981]/15"
                  : "text-[#AAB5C5] hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
