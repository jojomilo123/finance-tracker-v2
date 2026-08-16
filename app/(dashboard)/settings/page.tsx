"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore, AccountRecord } from "@/stores/use-transaction-store";
import { Sliders, AlertTriangle, Save, RotateCcw, User, LogOut } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { clearRemoteData, pushAccountToRemote } from "@/lib/sync-engine";

export default function SettingsPage() {
  const { toast } = useToast();
  const { settings, updateSettings, resetStore } = useTransactionStore();
  const [activeTab, setActiveTab] = React.useState<"workspace" | "preferences" | "danger">("workspace");

  const [displayName, setDisplayName] = React.useState(settings.name);
  const [timezone, setTimezone] = React.useState(settings.timezone);
  const [currency, setCurrency] = React.useState(settings.currency);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  // Sync from store when it changes
  React.useEffect(() => {
    setDisplayName(settings.name);
    setTimezone(settings.timezone);
    setCurrency(settings.currency);
  }, [settings]);

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    updateSettings({ name: displayName, timezone, currency });
    setIsLoading(false);
    toast({ variant: "success", title: "Pengaturan Disimpan", description: "Nama dan preferensi berhasil diperbarui." });
  };

  const handleResetAllData = async () => {
    setShowResetConfirm(false);
    setIsLoading(true);
    await clearRemoteData();
    resetStore();
    if (typeof window !== "undefined") {
      localStorage.removeItem("finance-tracker-tx-store");
      localStorage.removeItem("finance-tracker-workspace-img");
    }
    const defaultBca: AccountRecord = { id: "acc-1", name: "BCA Utama", type: "BANK", balance: 0, color: "#0056a4" };
    await pushAccountToRemote(defaultBca);
    setIsLoading(false);
    toast({ title: "Data Direset Ke Kondisi Baru", description: "Semua data telah direset. Hanya akun BCA Utama yang tersisa." });
    setTimeout(() => window.location.reload(), 400);
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    const client = getSupabase();
    if (client) {
      await client.auth.signOut();
    }
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const tabs = [
    { id: "workspace" as const, label: "Pengguna Lokal", icon: User, variant: "default" },
    { id: "preferences" as const, label: "Preferensi Aplikasi", icon: Sliders, variant: "default" },
    { id: "danger" as const, label: "Zona Bahaya", icon: AlertTriangle, variant: "danger" },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-sm text-muted-foreground">Kelola nama pengguna, preferensi tampilan, dan data Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tab Navigation */}
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                    activeTab === tab.id
                      ? tab.variant === "danger"
                        ? "bg-red-500/20 text-red-400 shadow-sm"
                        : "bg-primary text-primary-foreground shadow-sm"
                      : tab.variant === "danger"
                        ? "text-red-400 hover:bg-red-500/10"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {activeTab === "workspace" && "Pengguna Lokal"}
                  {activeTab === "preferences" && "Preferensi Aplikasi"}
                  {activeTab === "danger" && "Zona Bahaya"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "workspace" && "Ubah nama yang ditampilkan di navbar dan zona waktu serta mata uang default."}
                  {activeTab === "preferences" && "Atur format penyimpanan dan ekspor data Anda."}
                  {activeTab === "danger" && "Tindakan destruktif pada data akun Anda."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "workspace" && (
                  <form onSubmit={handleSaveWorkspace} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-medium">Nama Pengguna</label>
                        <Input
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Nama yang ditampilkan di navbar"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Nama ini akan ditampilkan di sudut kanan atas aplikasi.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Zona Waktu</label>
                        <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
                          className="flex h-10 w-full rounded-xl border border-white/10 bg-[#172131] text-[#F5F7FA] px-3 py-2 text-sm">
                          <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                          <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                          <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                          <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Mata Uang Utama</label>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                          className="flex h-10 w-full rounded-xl border border-white/10 bg-[#172131] text-[#F5F7FA] px-3 py-2 text-sm">
                          <option value="IDR">IDR (Rupiah)</option>
                          <option value="USD">USD (Dollar)</option>
                          <option value="EUR">EUR (Euro)</option>
                          <option value="SGD">SGD (Singapore Dollar)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button type="submit" className="rounded-xl" isLoading={isLoading}>
                        <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                      </Button>
                    </div>
                  </form>
                )}

                {activeTab === "preferences" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#172131] border border-white/5 space-y-3">
                      <p className="text-xs font-semibold text-foreground">Penyimpanan Data</p>
                      <p className="text-xs text-muted-foreground">
                        Semua data transaksi, akun, anggaran, target, dan pengaturan disimpan secara otomatis di localStorage browser Anda dan disinkronkan ke Supabase Cloud.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#172131] border border-white/5 space-y-3">
                      <p className="text-xs font-semibold text-foreground">Ekspor Data</p>
                      <p className="text-xs text-muted-foreground">
                        Gunakan halaman Reports untuk mengekspor data keuangan Anda dalam format CSV, JSON, atau Laporan Teks.
                      </p>
                    </div>
                    <Button variant="outline" className="rounded-xl gap-2" onClick={() => {
                      const data = localStorage.getItem("finance-tracker-tx-store");
                      if (data) {
                        const blob = new Blob([data], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url; a.download = "finance-tracker-backup.json";
                        document.body.appendChild(a); a.click(); document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        toast({ variant: "success", title: "Backup Berhasil", description: "File backup data berhasil diunduh." });
                      }
                    }}>
                      <Save className="h-4 w-4" /> Backup Seluruh Data
                    </Button>
                  </div>
                )}

                {activeTab === "danger" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-3">
                      <h4 className="text-sm font-semibold text-red-400">Hapus Semua Data Keuangan</h4>
                      <p className="text-xs text-muted-foreground">
                        Tindakan ini tidak dapat dibatalkan. Semua transaksi, anggaran, akun, target, dan langganan akan dihapus secara permanen.
                      </p>
                      <Button variant="destructive" size="sm" onClick={() => setShowResetConfirm(true)} className="gap-2">
                        <RotateCcw className="h-4 w-4" /> Hapus Semua Data &amp; Reset
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-3">
                      <h4 className="text-sm font-semibold text-amber-400">Keluar Akun / Disconnect Perangkat</h4>
                      <p className="text-xs text-muted-foreground">
                        Putuskan sesi sinkronisasi perangkat ini. Data lokal Anda tetap tersimpan.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setShowLogoutConfirm(true)} className="gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                        <LogOut className="h-4 w-4" /> Keluar Akun
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Double Confirmation: Reset */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="sm:max-w-sm bg-[#0D1420] text-white border-white/10">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" /> Konfirmasi Hapus Data
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-[#AAB5C5]">
              Apakah Anda <strong className="text-red-400">benar-benar yakin</strong> ingin menghapus seluruh data keuangan? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-xl border-white/10 text-white hover:bg-white/5" onClick={() => setShowResetConfirm(false)}>
                Batal
              </Button>
              <Button variant="destructive" className="flex-1 rounded-xl bg-red-600 hover:bg-red-500" onClick={handleResetAllData}>
                Ya, Hapus Semua
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Double Confirmation: Logout */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-sm bg-[#0D1420] text-white border-white/10">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-400">
              <LogOut className="h-5 w-5" /> Konfirmasi Keluar
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-[#AAB5C5]">
              Apakah Anda yakin ingin keluar? Sesi sinkronisasi perangkat ini akan terputus.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-xl border-white/10 text-white hover:bg-white/5" onClick={() => setShowLogoutConfirm(false)}>
                Batal
              </Button>
              <Button variant="destructive" className="flex-1 rounded-xl bg-amber-600 hover:bg-amber-500" onClick={handleLogout}>
                Ya, Keluar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
