"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { SummaryCard } from "@/components/cards/summary-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { formatCurrency } from "@/lib/utils";
import { RefreshCw, Plus, Calendar, AlertCircle, Trash2 } from "lucide-react";

export default function SubscriptionsPage() {
  const { toast } = useToast();
  const { subscriptions, addSubscription, deleteSubscription, toggleSubscriptionPause } = useTransactionStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [name, setName] = React.useState("");
  const [cost, setCost] = React.useState(100000);
  const [cycle, setCycle] = React.useState("Bulanan");
  const [dueDate, setDueDate] = React.useState("2026-09-01");

  const monthlyCost = subscriptions
    .filter((s) => !s.isPaused)
    .reduce((acc, s) => {
      if (s.cycle === "Tahunan") return acc + Math.round(s.amount / 12);
      if (s.cycle === "Mingguan") return acc + s.amount * 4;
      return acc + s.amount;
    }, 0);

  const activeCount = subscriptions.filter((s) => !s.isPaused).length;

  const handleToggleActive = (id: string, subName: string, nextState: boolean) => {
    toggleSubscriptionPause(id);
    toast({
      title: subName,
      description: nextState ? "Langganan diaktifkan kembali." : "Langganan di-jeda sementara.",
    });
  };

  const handleDeleteSubscription = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    deleteSubscription(id);
    toast({ title: "Langganan Dihapus", description: `"${sub?.name}" telah dihapus.` });
  };

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addSubscription({ name, amount: cost, cycle, nextDate: dueDate, category: "Lainnya", isPaused: false });
    setIsModalOpen(false);
    setName("");
    toast({ variant: "success", title: "Langganan Ditambahkan", description: `${name} (${formatCurrency(cost)}) berhasil dicatat.` });
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Langganan (Subscriptions)</h1>
            <p className="text-sm text-muted-foreground">Kelola tagihan rutin otomatis.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Langganan Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Total Bulanan" amount={monthlyCost} icon={RefreshCw} iconColor="text-blue-500" />
          <SummaryCard title="Total Setahun" amount={monthlyCost * 12} icon={Calendar} iconColor="text-purple-500" />
          <SummaryCard title="Layanan Aktif" value={`${activeCount} / ${subscriptions.length}`} subtitle="Langganan Aktif" icon={AlertCircle} iconColor="text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((s) => (
            <div key={s.id} className="relative group">
              <SubscriptionCard
                id={s.id}
                name={s.name}
                cost={s.amount}
                billingCycle={s.cycle}
                nextDueDate={s.nextDate}
                active={!s.isPaused}
                onToggleActive={(id, name, next) => handleToggleActive(id, name, next)}
              />
              <button
                onClick={() => handleDeleteSubscription(s.id)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/40 transition-all"
                title="Hapus Langganan"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Layanan Langganan</DialogTitle>
            <DialogDescription>Catat tagihan rutin bulanan atau tahunan Anda.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubscription} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Nama Layanan</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Netflix, Spotify, iCloud" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Biaya Langganan</label>
              <CurrencyInput value={cost} onChange={setCost} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Siklus Tagihan</label>
              <select value={cycle} onChange={(e) => setCycle(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-white/10 bg-[#172131] text-[#F5F7FA] px-3 py-2 text-sm">
                <option value="Bulanan">Bulanan</option>
                <option value="Tahunan">Tahunan</option>
                <option value="Mingguan">Mingguan</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Jatuh Tempo Berikutnya</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type="submit">Simpan Langganan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
