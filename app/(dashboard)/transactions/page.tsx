"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TransactionTimeline } from "@/components/transactions/transaction-timeline";
import { TransactionForm, TransactionFormValues, COMPREHENSIVE_CATEGORIES } from "@/components/forms/transaction-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { ViewerAnalyticsDashboard } from "@/components/analytics/viewer-analytics-dashboard";
import { Plus, Search, Download, RotateCcw } from "lucide-react";

export default function TransactionsPage() {
  const { toast } = useToast();
  const { appMode, transactions, accounts, addTransaction, deleteTransaction, restoreTransaction } = useTransactionStore();

  if (appMode === "VIEWER") {
    return (
      <DashboardShell>
        <ViewerAnalyticsDashboard />
      </DashboardShell>
    );
  }

  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateTransaction = (values: TransactionFormValues) => {
    const acc = accounts.find((a) => a.id === values.accountId);
    const toAcc = values.toAccountId ? accounts.find((a) => a.id === values.toAccountId) : undefined;
    const cat = COMPREHENSIVE_CATEGORIES.find((c) => c.id === values.categoryId);

    addTransaction({
      title: values.title,
      amount: values.amount,
      date: values.date,
      transactionType: values.transactionType,
      accountId: values.accountId,
      accountName: acc?.name || "BCA Utama",
      toAccountId: values.toAccountId,
      toAccountName: toAcc?.name,
      categoryId: values.categoryId,
      categoryName: cat?.name || "Umum",
      merchant: values.merchant,
      note: values.note,
    });

    setIsModalOpen(false);

    toast({
      variant: "success",
      title: "Transaksi Disimpan",
      description: `${values.title} (${formatCurrency(values.amount)}) berhasil ditambahkan.`,
    });
  };

  const handleDelete = (id: string, title: string) => {
    const deleted = deleteTransaction(id);
    if (!deleted) return;

    toast({
      title: "Transaksi Dihapus",
      description: `Transaksi "${title}" telah dihapus.`,
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            restoreTransaction(deleted);
            toast({
              variant: "success",
              title: "Dibatalkan",
              description: "Transaksi berhasil dipulihkan.",
            });
          }}
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" /> Undo (Batal)
        </Button>
      ),
    });
  };

  const handleExport = (format: string) => {
    const header = "Tanggal,Judul,Tipe,Jumlah,Kategori,Akun,Merchant\n";
    const rows = filteredTransactions.map((t) =>
      `${t.date},"${t.title}",${t.transactionType},${t.amount},"${t.categoryName}","${t.accountName}","${t.merchant || ""}"`
    ).join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transaksi-${format}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      variant: "success",
      title: "Ekspor Berhasil",
      description: `File laporan transaksi (${format.toUpperCase()}) telah diunduh.`,
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.merchant && t.merchant.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "ALL" || t.transactionType === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <DashboardShell onOpenQuickAdd={() => setIsModalOpen(true)}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kelola Transaksi</h1>
            <p className="text-sm text-muted-foreground">
              Catatan lengkap aktivitas pengeluaran, pemasukan, dan transfer saldo Anda.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              className="rounded-xl gap-1.5"
            >
              <Download className="h-4 w-4" /> Ekspor
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="rounded-xl gap-1.5">
              <Plus className="h-4 w-4" /> Tambah Transaksi
            </Button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex p-1 rounded-xl bg-muted/60 border border-border w-full sm:w-auto">
            {["ALL", "EXPENSE", "INCOME", "TRANSFER"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTypeFilter(tf)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  typeFilter === tf
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf === "ALL" && "Semua"}
                {tf === "EXPENSE" && "Pengeluaran"}
                {tf === "INCOME" && "Pemasukan"}
                {tf === "TRANSFER" && "Transfer"}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, merchant, kategori..."
              className="pl-9 text-xs"
            />
          </div>
        </div>

        {/* Transaction Timeline List */}
        <TransactionTimeline
          items={filteredTransactions}
          onDelete={handleDelete}
          onSelect={(item) =>
            toast({
              title: item.title,
              description: `Kategori: ${item.categoryName} • Jumlah: ${formatCurrency(item.amount)}`,
            })
          }
        />
      </div>

      {/* Modal Quick Add / Create Transaction */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Catat Transaksi Baru</DialogTitle>
            <DialogDescription>
              Tambahkan data pengeluaran, pemasukan, atau transfer antar rekening.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            accounts={accounts}
            categories={COMPREHENSIVE_CATEGORIES}
            onSubmitSuccess={handleCreateTransaction}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
