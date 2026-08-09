"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AccountCard } from "@/components/cards/account-card";
import { AccountForm, AccountFormValues } from "@/components/forms/account-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { Plus, Trash2 } from "lucide-react";
import { AccountType } from "@prisma/client";

export default function AccountsPage() {
  const { toast } = useToast();
  const { accounts, addAccount, deleteAccount } = useTransactionStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateAccount = (values: AccountFormValues) => {
    addAccount({
      name: values.name,
      type: values.accountType,
      balance: values.currentBalance,
      color: values.color,
    });
    setIsModalOpen(false);
    toast({ variant: "success", title: "Akun Ditambahkan", description: `Akun ${values.name} berhasil dibuat.` });
  };

  const handleDeleteAccount = (id: string, name: string) => {
    deleteAccount(id);
    toast({ title: "Akun Dihapus", description: `Akun "${name}" telah dihapus.` });
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Akun Keuangan</h1>
            <p className="text-sm text-muted-foreground">
              Kelola tempat penyimpanan uang Anda (Bank, E-Wallet, Tunai, Kartu Kredit).
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Tambah Akun Baru
          </Button>
        </div>

        <div className="p-6 rounded-2xl bg-primary text-primary-foreground space-y-2 shadow-sm">
          <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Total Kekayaan Aktiva</span>
          <div className="text-3xl font-bold tracking-tight">Rp{totalBalance.toLocaleString("id-ID")}</div>
          <p className="text-xs opacity-80">Tersedia di {accounts.length} akun keuangan aktif</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc, idx) => (
            <div key={acc.id} className="relative group">
              <AccountCard
                name={acc.name}
                accountType={acc.type as AccountType}
                balance={acc.balance}
                color={acc.color || "#0056a4"}
                isDefault={idx === 0}
                onEdit={() => toast({ title: acc.name, description: `Saldo: Rp${acc.balance.toLocaleString("id-ID")}` })}
              />
              <button
                onClick={() => handleDeleteAccount(acc.id, acc.name)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/40 transition-all"
                title="Hapus Akun"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Akun Keuangan Baru</DialogTitle>
            <DialogDescription>Masukkan informasi rekening bank, dompet digital, atau saldo tunai Anda.</DialogDescription>
          </DialogHeader>
          <AccountForm onSubmitSuccess={handleCreateAccount} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
