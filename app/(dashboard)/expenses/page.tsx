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
import { TrendingDown, Plus, RotateCcw } from "lucide-react";

export default function ExpensesPage() {
  const { toast } = useToast();
  const { transactions, accounts, addTransaction, deleteTransaction, restoreTransaction } = useTransactionStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const expenseItems = transactions.filter((t) => t.transactionType === "EXPENSE");
  const totalExpense = expenseItems.reduce((acc, curr) => acc + curr.amount, 0);

  const handleCreateExpense = (values: TransactionFormValues) => {
    const acc = accounts.find((a) => a.id === values.accountId);
    const cat = COMPREHENSIVE_CATEGORIES.find((c) => c.id === values.categoryId);

    addTransaction({
      title: values.title,
      amount: values.amount,
      date: values.date,
      transactionType: "EXPENSE",
      accountId: values.accountId,
      accountName: acc?.name || "BCA Utama",
      categoryId: values.categoryId,
      categoryName: cat?.name || "Makanan & Minuman",
      merchant: values.merchant,
      note: values.note,
    });

    setIsModalOpen(false);

    toast({
      variant: "success",
      title: "Pengeluaran Disimpan",
      description: `${values.title} (${formatCurrency(values.amount)}) berhasil ditambahkan.`,
    });
  };

  const handleDelete = (id: string, title: string) => {
    const deleted = deleteTransaction(id);
    if (!deleted) return;

    toast({
      title: "Pengeluaran Dihapus",
      description: `Pengeluaran "${title}" telah dihapus.`,
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            restoreTransaction(deleted);
            toast({
              variant: "success",
              title: "Dibatalkan",
              description: "Pengeluaran berhasil dipulihkan.",
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
            <h1 className="text-2xl font-bold tracking-tight">Pengeluaran (Expenses)</h1>
            <p className="text-sm text-muted-foreground">
              Analisis detail pengeluaran bulanan Anda menurut merchant dan pos kategori.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Catat Pengeluaran
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Pengeluaran"
            amount={totalExpense}
            changePercentage={-5.4}
            icon={TrendingDown}
            iconColor="text-rose-500"
          />
          <SummaryCard
            title="Rata-Rata Harian"
            amount={Math.round(totalExpense / 30)}
            icon={TrendingDown}
            iconColor="text-amber-500"
          />
          <SummaryCard
            title="Kategori Tertinggi"
            amount={300000}
            subtitle="Internet"
            icon={TrendingDown}
            iconColor="text-purple-500"
          />
        </div>

        <TransactionTimeline
          items={expenseItems}
          onDelete={handleDelete}
          onSelect={(item) =>
            toast({
              title: item.title,
              description: `Kategori: ${item.categoryName} • Jumlah: ${formatCurrency(item.amount)}`,
            })
          }
        />
      </div>

      {/* Modal Dialog Catat Pengeluaran (Locked to EXPENSE) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Catat Pengeluaran Baru</DialogTitle>
            <DialogDescription>
              Tambahkan catatan pengeluaran harian, belanja, atau tagihan.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            accounts={accounts}
            categories={COMPREHENSIVE_CATEGORIES}
            lockType="EXPENSE"
            onSubmitSuccess={handleCreateExpense}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
