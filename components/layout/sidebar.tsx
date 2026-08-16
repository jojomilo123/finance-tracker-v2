"use client";

import * as React from "react";
import Link from "next/link";
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
  CreditCard as SubIcon,
  Landmark,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LogOut,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";

import { useTransactionStore } from "@/stores/use-transaction-store";

export function Sidebar() {
  const pathname = usePathname();
  const { appMode, sidebarCollapsed: collapsed, setSidebarCollapsed } = useTransactionStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleToggleCollapse = (val: boolean) => {
    setSidebarCollapsed(val);
  };

  const isViewer = appMode === "VIEWER";

  const navSections = isViewer
    ? [
        {
          label: "Ringkasan Keuangan",
          items: [
            { title: "Dashboard Overview", href: "/dashboard", icon: Home },
            { title: "Laporan", href: "/reports", icon: BarChart3 },
            { title: "Analytics", href: "/analytics", icon: PieChart },
            { title: "Kalender Aktivitas", href: "/calendar", icon: Calendar },
          ],
        },
        {
          label: "Portofolio & Lainnya",
          items: [
            { title: "Kekayaan Bersih", href: "/net-worth", icon: Landmark },
            { title: "Langganan", href: "/subscriptions", icon: SubIcon },
            { title: "Settings", href: "/settings", icon: Settings },
          ],
        },
      ]
    : [
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

  // Streamlined mobile bottom bar: 3 main tabs + Menu
  const mobileBottomItems = isViewer
    ? [
        { title: "Dashboard", href: "/dashboard", icon: Home },
        { title: "Laporan", href: "/reports", icon: BarChart3 },
        { title: "Net Worth", href: "/net-worth", icon: Landmark },
      ]
    : [
        { title: "Home", href: "/dashboard", icon: Home },
        { title: "Transaksi", href: "/transactions", icon: ArrowLeftRight },
        { title: "Laporan", href: "/reports", icon: BarChart3 },
      ];

  const handleLogout = async () => {
    const client = getSupabase();
    if (client) {
      await client.auth.signOut();
    }
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <>
      {/* Desktop / iPad Sidebar (md+) */}
      <aside
        className={cn(
          "hidden md:flex flex-shrink-0 flex-col bg-[#0D1420] border-r border-white/10 min-h-screen h-full z-30 transition-[width] duration-300 ease-out",
          collapsed ? "w-[68px]" : "w-[220px]"
        )}
      >
        <div className={cn("flex items-center px-4 h-16 border-b border-white/5 shrink-0", collapsed ? "justify-center" : "justify-between")}>
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-xl bg-white text-[#080D16] shadow-md group-hover:scale-105 transition-transform duration-150">
              <Sparkles className="h-4 w-4 fill-current" />
            </div>
            {!collapsed && <span className="text-sm font-bold text-white tracking-tight">Finance Tracker</span>}
          </Link>
          {!collapsed && (
            <button
              onClick={() => handleToggleCollapse(true)}
              className="p-1.5 rounded-lg text-[#AAB5C5] hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-150"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => handleToggleCollapse(false)}
            className="mx-auto mb-2 p-1.5 rounded-lg text-[#AAB5C5] hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-150"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

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
                        "flex items-center rounded-xl transition-all duration-150 ease-out group relative active:scale-[0.98]",
                        collapsed ? "justify-center p-2.5 mx-auto" : "px-3 py-2 space-x-3",
                        isActive
                          ? "bg-[#10b981]/15 text-[#10b981] font-semibold"
                          : "text-[#AAB5C5] hover:text-white hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#10b981] rounded-r-full" />
                      )}
                      <Icon className="h-[18px] w-[18px] shrink-0 group-hover:scale-105 transition-transform duration-150" />
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

      {/* Mobile Bottom Navigation (< md) — clean 4 items only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D1420]/95 backdrop-blur-md border-t border-white/10 px-4 py-1.5 flex items-center justify-around shadow-2xl">
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href === "/dashboard" && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-medium transition-all duration-150 active:scale-95 min-w-[56px] min-h-[44px]",
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

        {/* Menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-medium transition-all duration-150 active:scale-95 min-w-[56px] min-h-[44px]",
            isMobileMenuOpen
              ? "text-[#10b981] bg-[#10b981]/15"
              : "text-[#AAB5C5] hover:text-white"
          )}
        >
          <LayoutGrid className="h-5 w-5 mb-0.5" />
          <span className="truncate">Lainnya</span>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent className="sm:max-w-md bg-[#0D1420] text-white border-white/10 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-2 border-b border-white/10">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" /> Menu Navigasi
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {navSections.map((sec) => (
              <div key={sec.label} className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#AAB5C5]/60 px-1">
                  {sec.label}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center space-x-2.5 p-3 rounded-xl border border-white/5 transition-all duration-150 active:scale-95 text-xs font-medium",
                          isActive
                            ? "bg-[#10b981]/20 border-[#10b981]/40 text-[#10b981]"
                            : "bg-[#121C2A] text-[#F5F7FA] hover:bg-white/5"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-emerald-400" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Logout at the very bottom, visually separated */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-medium hover:bg-red-500/10 active:scale-[0.98] transition-all duration-150"
              >
                <LogOut className="h-4 w-4" /> Keluar Akun / Disconnect
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Double Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-sm bg-[#0D1420] text-white border-white/10">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-red-400">
              <LogOut className="h-5 w-5" /> Konfirmasi Keluar
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-[#AAB5C5]">
              Apakah Anda yakin ingin keluar dari akun? Sesi sinkronisasi perangkat ini akan terputus.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-white/10 text-white hover:bg-white/5"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-500"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
              >
                Ya, Keluar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
