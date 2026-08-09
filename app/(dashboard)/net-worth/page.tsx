"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SummaryCard } from "@/components/cards/summary-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { formatCurrency } from "@/lib/utils";
import { Landmark, TrendingUp, ShieldAlert, Plus, Wallet, Building2, Smartphone, Trash2 } from "lucide-react";

const ICON_MAP: Record<string, any> = { Bank: Building2, BANK: Building2, Tunai: Wallet, CASH: Wallet, "E-Wallet": Smartphone, E_WALLET: Smartphone, Investasi: Landmark };

export default function NetWorthPage() {
  const { toast } = useToast();
  const { accounts, liabilities, addLiability, deleteLiability } = useTransactionStore();
  const [isLiabilityModalOpen, setIsLiabilityModalOpen] = React.useState(false);

  const [newName, setNewName] = React.useState("");
  const [newAmount, setNewAmount] = React.useState(1000000);
  const [newDueDate, setNewDueDate] = React.useState("");

  // Assets are derived from accounts (single source of truth)
  const totalAssets = accounts.reduce((a, c) => a + c.balance, 0);
  const totalLiabilities = liabilities.reduce((a, c) => a + c.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  const handleAddLiability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    addLiability({ name: newName, amount: newAmount, dueDate: newDueDate || "-" });
    setIsLiabilityModalOpen(false);
    setNewName("");
    toast({ variant: "success", title: "Kewajiban Ditambahkan", description: `${newName} berhasil ditambahkan.` });
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kekayaan Bersih (Net Worth)</h1>
            <p className="text-sm text-muted-foreground">Total aktiva (dari Akun Keuangan) dikurangi kewajiban utang.</p>
          </div>
          <Button onClick={() => { setNewName(""); setIsLiabilityModalOpen(true); }} className="rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Tambah Kewajiban
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Kekayaan Bersih" amount={netWorth} icon={Landmark} iconColor="text-emerald-500" />
          <SummaryCard title="Total Aktiva (dari Akun)" amount={totalAssets} icon={TrendingUp} iconColor="text-blue-500" />
          <SummaryCard title="Total Kewajiban" amount={totalLiabilities} icon={ShieldAlert} iconColor="text-rose-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assets = Accounts (single source of truth) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>Rincian Aktiva (dari Akun Keuangan)</span>
                <span className="text-sm font-mono font-bold text-emerald-400">{formatCurrency(totalAssets)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
              {accounts.map((item) => {
                const Icon = ICON_MAP[item.type] || Wallet;
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/60">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 rounded-xl text-white shrink-0" style={{ backgroundColor: item.color || "#3b82f6" }}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">{item.type}</span>
                      </div>
                    </div>
                    <span className={`text-sm font-bold font-mono ${item.balance < 0 ? "text-rose-400" : ""}`}>
                      {formatCurrency(item.balance)}
                    </span>
                  </div>
                );
              })}
              {accounts.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Belum ada akun. Tambahkan di halaman Accounts.</p>}
            </CardContent>
          </Card>

          {/* Liabilities */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>Rincian Kewajiban Utang</span>
                <span className="text-sm font-mono font-bold text-rose-400">{formatCurrency(totalLiabilities)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
              {liabilities.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 group">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                    <span className="text-[10px] text-muted-foreground">Jatuh Tempo: {item.dueDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-sm font-bold font-mono text-rose-400">-{formatCurrency(item.amount)}</span>
                    <button onClick={() => { deleteLiability(item.id); toast({ title: "Kewajiban Dihapus" }); }}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/40 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {liabilities.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Belum ada kewajiban.</p>}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Liability Modal */}
      <Dialog open={isLiabilityModalOpen} onOpenChange={setIsLiabilityModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Kewajiban Baru</DialogTitle>
            <DialogDescription>Masukkan detail utang atau kewajiban Anda.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLiability} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Nama Kewajiban</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Contoh: Cicilan Motor" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Jumlah (Rp)</label>
              <CurrencyInput value={newAmount} onChange={setNewAmount} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Jatuh Tempo</label>
              <Input value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} placeholder="Contoh: 01 Sep 2026" />
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsLiabilityModalOpen(false)}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
