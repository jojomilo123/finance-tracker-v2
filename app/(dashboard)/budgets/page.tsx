"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BudgetCard } from "@/components/budget/budget-card";
import { BudgetTemplateModal } from "@/components/budget/budget-template-modal";
import { SummaryCard } from "@/components/cards/summary-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Sparkles, AlertTriangle, TrendingDown, RotateCcw, CheckCircle2 } from "lucide-react";

export default function BudgetsPage() {
  const { toast } = useToast();
  const { budgets, updateBudget, setBudgets } = useTransactionStore();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);

  const totalBudget = budgets.reduce((acc, curr) => acc + curr.budgetAmount, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spentAmount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const overbudgetCount = budgets.filter((b) => b.spentAmount > b.budgetAmount).length;

  const handleBudgetChange = (id: string, newAmount: number) => {
    updateBudget(id, newAmount);
  };

  const handleApplyTemplate = (templateAllocations: Record<string, number>) => {
    const updatedBudgets = budgets.map((b) => {
      if (templateAllocations[b.categoryName] !== undefined) {
        return { ...b, budgetAmount: templateAllocations[b.categoryName] };
      }
      return b;
    });
    setBudgets(updatedBudgets);
    toast({ variant: "success", title: "Template Diterapkan", description: "Alokasi anggaran bulanan berhasil diperbarui." });
  };

  const handleResetBudgets = () => {
    setBudgets([
      { id: "b-1", categoryName: "Makanan & Minuman", categoryColor: "#3b82f6", budgetAmount: 2000000, spentAmount: 1478985 },
      { id: "b-2", categoryName: "Tempat Tinggal", categoryColor: "#10b981", budgetAmount: 1000000, spentAmount: 800000 },
      { id: "b-3", categoryName: "Transportasi", categoryColor: "#f59e0b", budgetAmount: 750000, spentAmount: 700000 },
      { id: "b-4", categoryName: "Internet", categoryColor: "#8b5cf6", budgetAmount: 350000, spentAmount: 300000 },
      { id: "b-5", categoryName: "Hiburan", categoryColor: "#ec4899", budgetAmount: 500000, spentAmount: 600000 },
    ]);
    toast({ title: "Anggaran Direset", description: "Nilai anggaran telah dikembalikan ke kondisi awal." });
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Perencanaan Anggaran (Budgets)</h1>
            <p className="text-sm text-muted-foreground">Simulasi interaktif dan pemantauan batas pengeluaran kategori bulanan.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleResetBudgets} className="rounded-xl gap-1.5">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button onClick={() => setIsTemplateModalOpen(true)} className="rounded-xl gap-1.5">
              <Sparkles className="h-4 w-4" /> Template Otomatis
            </Button>
          </div>
        </div>

        {overbudgetCount > 0 && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              <span className="text-xs font-semibold">
                Perhatian: Terdapat {overbudgetCount} kategori pengeluaran yang melebihi batas anggaran!
              </span>
            </div>
            <Badge variant="destructive" className="text-[10px]">Tindakan Diperlukan</Badge>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard title="Total Target Anggaran" amount={totalBudget} icon={PieChart} iconColor="text-blue-500" />
          <SummaryCard title="Total Pengeluaran" amount={totalSpent} icon={TrendingDown} iconColor="text-rose-500" />
          <SummaryCard title="Sisa Anggaran Bersih" amount={remainingBudget} icon={CheckCircle2} iconColor="text-emerald-500" />
          <SummaryCard title="Tingkat Penggunaan" value={`${Math.round((totalSpent / (totalBudget || 1)) * 100)}%`} subtitle="dari Total Anggaran" icon={Sparkles} iconColor="text-purple-500" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Kategori Pengeluaran ({budgets.length})</h3>
            <span className="text-xs text-muted-foreground">Geser slider atau ketik jumlah untuk simulasi waktu-nyata</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => (
              <BudgetCard
                key={b.id}
                id={b.id}
                categoryName={b.categoryName}
                categoryColor={b.categoryColor}
                budgetAmount={b.budgetAmount}
                spentAmount={b.spentAmount}
                onChangeBudget={(newVal) => handleBudgetChange(b.id, newVal)}
              />
            ))}
          </div>
        </div>
      </div>
      <BudgetTemplateModal open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen} onApplyTemplate={handleApplyTemplate} />
    </DashboardShell>
  );
}
