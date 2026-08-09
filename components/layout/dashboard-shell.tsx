"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { TransactionForm, TransactionFormValues, COMPREHENSIVE_CATEGORIES } from "@/components/forms/transaction-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useTransactionStore } from "@/stores/use-transaction-store";

interface DashboardShellProps {
  children: React.ReactNode;
  onOpenQuickAdd?: () => void;
}

export function DashboardShell({ children, onOpenQuickAdd }: DashboardShellProps) {
  const { toast } = useToast();
  const { accounts, addTransaction } = useTransactionStore();
  const [isUniversalModalOpen, setIsUniversalModalOpen] = React.useState(false);

  const handleOpenQuickAdd = () => {
    if (onOpenQuickAdd) {
      onOpenQuickAdd();
    } else {
      setIsUniversalModalOpen(true);
    }
  };

  const handleSaveUniversalTransaction = (values: TransactionFormValues) => {
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

    setIsUniversalModalOpen(false);
    toast({
      variant: "success",
      title: "Transaksi Disimpan",
      description: `${values.title} (${formatCurrency(values.amount)}) telah berhasil dicatat.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#080D16] text-[#F5F7FA] flex flex-col md:flex-row overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Navbar with proper spacing from sidebar */}
        <div className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <Navbar onOpenQuickAdd={handleOpenQuickAdd} />
        </div>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-2 w-full">
          {children}
        </main>
      </div>

      {/* Floating AI Coach removed */}

      {/* Universal Quick Add */}
      <Dialog open={isUniversalModalOpen} onOpenChange={setIsUniversalModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-[#121C2A] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Tambah Transaksi</DialogTitle>
            <DialogDescription className="text-[#AAB5C5]">
              Catat pengeluaran, pemasukan, atau transfer antar rekening secara cepat.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            accounts={accounts}
            categories={COMPREHENSIVE_CATEGORIES}
            onSubmitSuccess={handleSaveUniversalTransaction}
            onCancel={() => setIsUniversalModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
