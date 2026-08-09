"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TransactionTimeline } from "@/components/transactions/transaction-timeline";
import { TransactionForm, TransactionFormValues, COMPREHENSIVE_CATEGORIES } from "@/components/forms/transaction-form";
import { SummaryCard } from "@/components/cards/summary-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { TrendingUp, Plus, RotateCcw } from "lucide-react";

export default function IncomePage() {
  const { toast } = useToast();
  const { transactions, accounts, addTransaction, deleteTransaction, restoreTransaction } = useTransactionStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const incomeItems = transactions.filter((t) => t.transactionType === "INCOME");
  const totalIncome = incomeItems.reduce((acc, curr) => acc + curr.amount, 0);

  const handleCreateIncome = (values: TransactionFormValues) => {
    const acc = accounts.find((a) => a.id === values.accountId);
    const cat = COMPREHENSIVE_CATEGORIES.find((c) => c.id === values.categoryId);

    addTransaction({
      title: values.title,
      amount: values.amount,
      date: values.date,
      transactionType: "INCOME",
      accountId: values.accountId,
      accountName: acc?.name || "BCA Utama",
      categoryId: values.categoryId,
      categoryName: cat?.name || "Gaji Utama",
      note: values.note,
    });

    setIsModalOpen(false);

    toast({
      variant: "success",
      title: "Pemasukan Disimpan",
      description: `${values.title} (${formatCurrency(values.amount)}) berhasil ditambahkan.`,
    });
  };

  const handleDelete = (id: string, title: string) => {
    const deleted = deleteTransaction(id);
    if (!deleted) return;

    toast({
      title: "Pemasukan Dihapus",
      description: `Pemasukan "${title}" telah dihapus.`,
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            restoreTransaction(deleted);
            toast({
              variant: "success",
              title: "Dibatalkan",
              description: "Pemasukan berhasil dipulihkan.",
            });
          }}
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" /> Undo (Batal)
        </Button>
      ),
    });
  };

  return (
    <DashboardShell onOpenQuickAdd={() => setIsModalOpen(true)}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pemasukan (Income)</h1>
            <p className="text-sm text-muted-foreground">
              Pantau seluruh arus masuk keuangan dari gaji, freelance, dan investasi.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Catat Pemasukan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Pemasukan"
            amount={totalIncome}
            changePercentage={14.2}
            icon={TrendingUp}
            iconColor="text-emerald-500"
          />
          <SummaryCard
            title="Rata-Rata Harian"
            amount={Math.round(totalIncome / 30)}
            icon={TrendingUp}
            iconColor="text-blue-500"
          />
          <SummaryCard
            title="Sumber Terbesar"
            amount={8500000}
            subtitle="Gaji Utama"
            icon={TrendingUp}
            iconColor="text-purple-500"
          />
        </div>

        <TransactionTimeline
          items={incomeItems}
          onDelete={handleDelete}
          onSelect={(item) =>
            toast({
              title: item.title,
              description: `Kategori: ${item.categoryName} • Jumlah: ${formatCurrency(item.amount)}`,
            })
          }
        />
      </div>

      {/* Modal Dialog Catat Pemasukan (Locked to INCOME) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Catat Pemasukan Baru</DialogTitle>
            <DialogDescription>
              Tambahkan catatan pemasukan dari gaji, komisi, atau sumber lainnya.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            accounts={accounts}
            categories={COMPREHENSIVE_CATEGORIES}
            lockType="INCOME"
            onSubmitSuccess={handleCreateIncome}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
