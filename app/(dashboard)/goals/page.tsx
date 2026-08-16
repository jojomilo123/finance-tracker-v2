"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { GoalCard } from "@/components/goals/goal-card";
import { SummaryCard } from "@/components/cards/summary-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { ViewerAnalyticsDashboard } from "@/components/analytics/viewer-analytics-dashboard";
import { formatCurrency } from "@/lib/utils";
import { Target, Plus, PiggyBank, Award, Trash2 } from "lucide-react";

export default function GoalsPage() {
  const { toast } = useToast();
  const { appMode, goals, addGoal, deleteGoal, contributeToGoal } = useTransactionStore();
  const [activeGoalId, setActiveGoalId] = React.useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = React.useState(500000);
  const [isContributeModalOpen, setIsContributeModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  if (appMode === "VIEWER") {
    return (
      <DashboardShell>
        <ViewerAnalyticsDashboard />
      </DashboardShell>
    );
  }

  const [newGoalName, setNewGoalName] = React.useState("");
  const [newGoalTarget, setNewGoalTarget] = React.useState(5000000);
  const [newGoalDate, setNewGoalDate] = React.useState("2026-12-31");

  const totalTarget = goals.reduce((a, b) => a + b.targetAmount, 0);
  const totalSaved = goals.reduce((a, b) => a + b.currentSaved, 0);
  const completedCount = goals.filter((g) => g.currentSaved >= g.targetAmount).length;

  const handleOpenContribute = (id: string) => {
    setActiveGoalId(id);
    setIsContributeModalOpen(true);
  };

  const handleConfirmContribution = () => {
    if (!activeGoalId) return;
    const goal = goals.find((g) => g.id === activeGoalId);
    contributeToGoal(activeGoalId, contributionAmount);
    if (goal && goal.currentSaved + contributionAmount >= goal.targetAmount && goal.currentSaved < goal.targetAmount) {
      toast({ variant: "success", title: "Selamat! Target Tercapai 🎉", description: `Target ${goal.name} berhasil dicapai!` });
    } else {
      toast({ variant: "success", title: "Tabungan Ditambahkan", description: `Berhasil menabung ${formatCurrency(contributionAmount)}.` });
    }
    setIsContributeModalOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    deleteGoal(id);
    toast({ title: "Target Dihapus", description: `Target "${goal?.name}" telah dihapus.` });
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName) return;
    addGoal({ name: newGoalName, targetAmount: newGoalTarget, currentSaved: 0, targetDate: newGoalDate, color: "#3b82f6" });
    setIsCreateModalOpen(false);
    setNewGoalName("");
    toast({ variant: "success", title: "Target Baru Dibuat", description: `Target ${newGoalName} berhasil ditambahkan.` });
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Target Finansial (Goals)</h1>
            <p className="text-sm text-muted-foreground">Alokasikan dana untuk impian jangka panjang.</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Target Impian Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Total Terkumpul" amount={totalSaved} subtitle={`dari ${formatCurrency(totalTarget)}`} icon={PiggyBank} iconColor="text-emerald-500" />
          <SummaryCard title="Pencapaian" value={`${Math.round((totalSaved / (totalTarget || 1)) * 100)}%`} subtitle="Tercapai" icon={Target} iconColor="text-blue-500" />
          <SummaryCard title="Target Selesai" value={`${completedCount} / ${goals.length}`} subtitle="Impian Selesai" icon={Award} iconColor="text-purple-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g) => (
            <div key={g.id} className="relative group">
              <GoalCard
                id={g.id}
                name={g.name}
                targetAmount={g.targetAmount}
                currentSaved={g.currentSaved}
                targetDate={g.targetDate}
                color={g.color}
                onContribute={handleOpenContribute}
              />
              <button
                onClick={() => handleDeleteGoal(g.id)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/40 transition-all"
                title="Hapus Target"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contribute Modal */}
      <Dialog open={isContributeModalOpen} onOpenChange={setIsContributeModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Setor Tabungan Target</DialogTitle>
            <DialogDescription>Masukkan jumlah saldo yang ingin Anda alokasikan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Jumlah Setoran (Rp)</label>
              <CurrencyInput value={contributionAmount} onChange={setContributionAmount} />
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsContributeModalOpen(false)}>Batal</Button>
              <Button onClick={handleConfirmContribution}>Setor Sekarang</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Goal Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Target Impian Baru</DialogTitle>
            <DialogDescription>Tentukan nama impian, jumlah target dana, dan tenggat waktu.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateGoal} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Nama Target Impian</label>
              <Input value={newGoalName} onChange={(e) => setNewGoalName(e.target.value)} placeholder="Contoh: DP Rumah, Mobil Baru" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Jumlah Target Dana</label>
              <CurrencyInput value={newGoalTarget} onChange={setNewGoalTarget} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Target Tanggal</label>
              <Input type="date" value={newGoalDate} onChange={(e) => setNewGoalDate(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
              <Button type="submit">Simpan Target</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
