"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { User, ShieldCheck, Sliders, AlertTriangle, Save, RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { settings, updateSettings } = useTransactionStore();
  const [activeTab, setActiveTab] = React.useState<"profile" | "security" | "preferences" | "danger">("profile");

  const [name, setName] = React.useState(settings.name);
  const [email, setEmail] = React.useState(settings.email);
  const [timezone, setTimezone] = React.useState(settings.timezone);
  const [currency, setCurrency] = React.useState(settings.currency);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sync from store when it changes
  React.useEffect(() => {
    setName(settings.name);
    setEmail(settings.email);
    setTimezone(settings.timezone);
    setCurrency(settings.currency);
  }, [settings]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updateSettings({ name, email, timezone, currency });
    setIsLoading(false);
    toast({ variant: "success", title: "Profil Disimpan", description: "Pengaturan profil Anda berhasil diperbarui." });
  };

  const handleResetAllData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("finance-tracker-tx-store");
      toast({ title: "Data Direset", description: "Semua data keuangan telah dihapus. Halaman akan dimuat ulang." });
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const tabs = [
    { id: "profile" as const, label: "Profil Pengguna", icon: User, variant: "default" },
    { id: "security" as const, label: "Keamanan & Sandi", icon: ShieldCheck, variant: "default" },
    { id: "preferences" as const, label: "Preferensi Aplikasi", icon: Sliders, variant: "default" },
    { id: "danger" as const, label: "Zona Bahaya", icon: AlertTriangle, variant: "danger" },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-sm text-muted-foreground">Kelola identitas, preferensi, dan data akun Anda.</p>
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
                  {activeTab === "profile" && "Informasi Profil"}
                  {activeTab === "security" && "Keamanan Sesi"}
                  {activeTab === "preferences" && "Preferensi Aplikasi"}
                  {activeTab === "danger" && "Zona Bahaya"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "profile" && "Perbarui identitas dan pengaturan tampilan."}
                  {activeTab === "security" && "Pengaturan keamanan untuk penggunaan lokal."}
                  {activeTab === "preferences" && "Atur format dan preferensi sistem."}
                  {activeTab === "danger" && "Tindakan destruktif pada data akun Anda."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "profile" && (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Nama Lengkap</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Alamat Email</label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
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

                {activeTab === "security" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#172131] border border-white/5 space-y-2">
                      <p className="text-xs font-semibold text-foreground">Mode Lokal Aktif</p>
                      <p className="text-xs text-muted-foreground">
                        Aplikasi ini berjalan secara lokal. Semua data disimpan di browser Anda (localStorage).
                        Tidak ada data yang dikirim ke server manapun.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#172131] border border-white/5 space-y-2">
                      <p className="text-xs font-semibold text-foreground">Sesi Aktif</p>
                      <p className="text-xs text-muted-foreground">Perangkat Ini — Browser Lokal</p>
                    </div>
                  </div>
                )}

                {activeTab === "preferences" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#172131] border border-white/5 space-y-3">
                      <p className="text-xs font-semibold text-foreground">Penyimpanan Data</p>
                      <p className="text-xs text-muted-foreground">
                        Semua data transaksi, akun, anggaran, target, dan pengaturan disimpan di localStorage browser Anda.
                        Data tetap tersimpan meskipun browser ditutup.
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
                        Tindakan ini tidak dapat dibatalkan. Semua transaksi, anggaran, akun, target, dan langganan akan dihapus secara permanen dari localStorage browser Anda.
                      </p>
                      <Button variant="destructive" size="sm" onClick={handleResetAllData} className="gap-2">
                        <RotateCcw className="h-4 w-4" /> Hapus Semua Data & Reset
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
