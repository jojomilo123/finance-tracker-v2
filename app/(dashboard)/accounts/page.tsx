"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AccountCard } from "@/components/cards/account-card";
import { AccountForm, AccountFormValues } from "@/components/forms/account-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore, AccountRecord } from "@/stores/use-transaction-store";
import { ViewerAnalyticsDashboard } from "@/components/analytics/viewer-analytics-dashboard";
import { Plus, AlertTriangle } from "lucide-react";
import { AccountType } from "@prisma/client";

export default function AccountsPage() {
  const { toast } = useToast();
  const { accounts, appMode, addAccount, updateAccount, deleteAccount } = useTransactionStore();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState<AccountRecord | null>(null);
  const [deletingAccount, setDeletingAccount] = React.useState<AccountRecord | null>(null);
  const [quickEditBalanceAccount, setQuickEditBalanceAccount] = React.useState<AccountRecord | null>(null);
  const [newBalanceVal, setNewBalanceVal] = React.useState<number>(0);

  if (appMode === "VIEWER") {
    return (
      <DashboardShell>
        <ViewerAnalyticsDashboard />
      </DashboardShell>
    );
  }

  const handleCreateAccount = (values: AccountFormValues) => {
    addAccount({
      name: values.name,
      type: values.accountType,
      balance: values.currentBalance,
      color: values.color,
    });
    setIsAddModalOpen(false);
    toast({ variant: "success", title: "Akun Ditambahkan", description: `Akun ${values.name} berhasil dibuat.` });
  };

  const handleUpdateAccount = (values: AccountFormValues) => {
    if (!editingAccount) return;
    updateAccount(editingAccount.id, {
      name: values.name,
      type: values.accountType,
      balance: values.currentBalance,
      color: values.color,
    });
    setEditingAccount(null);
    toast({ variant: "success", title: "Akun Diperbarui", description: `Akun ${values.name} berhasil dikustomisasi.` });
  };

  const confirmDeleteAccount = () => {
    if (!deletingAccount) return;
    deleteAccount(deletingAccount.id);
    toast({ title: "Akun Dihapus", description: `Akun "${deletingAccount.name}" telah berhasil dihilangkan.` });
    setDeletingAccount(null);
  };

  const openQuickEditBalance = (acc: AccountRecord) => {
    setQuickEditBalanceAccount(acc);
    setNewBalanceVal(acc.balance);
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  const isViewer = (appMode as string) === "VIEWER";

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#0D1420] border border-white/10 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Akun Keuangan</h1>
            <p className="text-sm text-muted-foreground">
              {isViewer
                ? "Mode Viewer (Read-Only): Pantau saldo dan status tempat penyimpanan uang Anda."
                : "Kelola dan kustomisasi tempat penyimpanan uang Anda (Bank, E-Wallet, Tunai, Kartu Kredit)."}
            </p>
          </div>
          {!isViewer && (
            <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl gap-2">
              <Plus className="h-4 w-4" /> Tambah Akun Baru
            </Button>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-primary text-primary-foreground space-y-2 shadow-sm">
          <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Total Kekayaan Aktiva</span>
          <div className="text-3xl font-bold tracking-tight">Rp{totalBalance.toLocaleString("id-ID")}</div>
          <p className="text-xs opacity-80">Tersedia di {accounts.length} akun keuangan aktif</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc, idx) => (
            <AccountCard
              key={acc.id}
              name={acc.name}
              accountType={acc.type as AccountType}
              balance={acc.balance}
              color={acc.color || "#0056a4"}
              isDefault={idx === 0}
              onEdit={isViewer ? undefined : () => setEditingAccount(acc)}
              onEditBalance={isViewer ? undefined : () => openQuickEditBalance(acc)}
              onDelete={isViewer ? undefined : () => setDeletingAccount(acc)}
            />
          ))}
        </div>
      </div>

      {/* Modal Tambah Akun */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Akun Keuangan Baru</DialogTitle>
            <DialogDescription>Masukkan informasi rekening bank, dompet digital, atau saldo tunai Anda.</DialogDescription>
          </DialogHeader>
          <AccountForm
            submitLabel="Tambah Akun Baru"
            onSubmitSuccess={handleCreateAccount}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Quick Edit Saldo */}
      <Dialog open={!!quickEditBalanceAccount} onOpenChange={(open) => !open && setQuickEditBalanceAccount(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Saldo Akun</DialogTitle>
            <DialogDescription>
              Ubah saldo uang awal / saldo saat ini untuk akun <strong>&quot;{quickEditBalanceAccount?.name}&quot;</strong> secara langsung.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Saldo Saat Ini / Uang Awal (Rp)</label>
              <CurrencyInput
                value={newBalanceVal}
                onChange={(val) => setNewBalanceVal(val)}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setQuickEditBalanceAccount(null)}>
                Batal
              </Button>
              <Button
                onClick={() => {
                  if (quickEditBalanceAccount) {
                    updateAccount(quickEditBalanceAccount.id, { balance: newBalanceVal });
                    toast({
                      variant: "success",
                      title: "Saldo Diperbarui",
                      description: `Saldo ${quickEditBalanceAccount.name} diubah menjadi Rp${newBalanceVal.toLocaleString("id-ID")}`,
                    });
                    setQuickEditBalanceAccount(null);
                  }
                }}
              >
                Simpan Saldo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Edit / Kustomisasi Akun */}
      <Dialog open={!!editingAccount} onOpenChange={(open) => !open && setEditingAccount(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kustomisasi Akun Keuangan</DialogTitle>
            <DialogDescription>Ubah nama, tipe, saldo, atau warna identifikasi akun ini.</DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <AccountForm
              defaultValues={{
                name: editingAccount.name,
                accountType: editingAccount.type as AccountType,
                currentBalance: editingAccount.balance,
                color: editingAccount.color || "#3b82f6",
                isDefault: false,
              }}
              submitLabel="Simpan Perubahan"
              onSubmitSuccess={handleUpdateAccount}
              onCancel={() => setEditingAccount(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Konfirmasi Hapus */}
      <Dialog open={!!deletingAccount} onOpenChange={(open) => !open && setDeletingAccount(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Hapus Akun Keuangan
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus akun <strong>&quot;{deletingAccount?.name}&quot;</strong>? Akun ini akan dihilangkan dari sistem secara permanen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setDeletingAccount(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAccount}>
              Hapus Akun
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
