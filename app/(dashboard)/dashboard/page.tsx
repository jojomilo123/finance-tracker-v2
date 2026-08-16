"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionForm, TransactionFormValues, COMPREHENSIVE_CATEGORIES } from "@/components/forms/transaction-form";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { ArrowDownCircle, ArrowUpCircle, Wallet,
  FilePlus,
  BarChart2,
  Target,
  CreditCard,
  ShoppingBag,
  Heart,
  Plus,
  Moon,
  User,
  Camera,
} from "lucide-react";
import { MiniTrend } from "@/components/charts/mini-trend";

export default function DashboardPage() {
  const { toast } = useToast();
  const { transactions, accounts, budgets, settings, updateSettings, addTransaction } = useTransactionStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [workspaceImage, setWorkspaceImage] = React.useState("/images/cozy-desk.png");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (settings.avatarUrl) {
      setWorkspaceImage(settings.avatarUrl);
    } else if (typeof window !== "undefined") {
      const savedImg = localStorage.getItem("finance-tracker-workspace-img");
      if (savedImg) setWorkspaceImage(savedImg);
    }
  }, [settings.avatarUrl]);

  const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setWorkspaceImage(result);
          updateSettings({ avatarUrl: result });
          if (typeof window !== "undefined") {
            localStorage.setItem("finance-tracker-workspace-img", result);
          }
          toast({ variant: "success", title: "Foto Diubah", description: "Foto workspace berhasil diperbarui dan tersimpan." });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const totalBalance = React.useMemo(
    () => accounts.reduce((acc, curr) => acc + curr.balance, 0),
    [accounts]
  );

  const totalIncome = React.useMemo(
    () =>
      transactions
        .filter((t) => t.transactionType === "INCOME")
        .reduce((acc, curr) => acc + curr.amount, 0),
    [transactions]
  );

  const totalExpense = React.useMemo(
    () =>
      transactions
        .filter((t) => t.transactionType === "EXPENSE")
        .reduce((acc, curr) => acc + curr.amount, 0),
    [transactions]
  );

  // Compute Expense Pie Distribution dynamically from store
  const expensePieData = React.useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.transactionType === "EXPENSE")
      .forEach((t) => {
        map[t.categoryName] = (map[t.categoryName] || 0) + t.amount;
      });

    return Object.entries(map).map(([name, value], idx) => {
      const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"];
      return {
        name,
        value,
        color: colors[idx % colors.length],
      };
    });
  }, [transactions]);

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
      description: `${values.title} (${formatCurrency(values.amount)}) berhasil dicatat.`,
    });
  };

  return (
    <DashboardShell onOpenQuickAdd={() => setIsModalOpen(true)}>
      <div className="space-y-6 w-full">
        {/* Workspace Main Top Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Visual Desk Room Illustration Container */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[360px] flex flex-col justify-between group">
            <Image
              src={workspaceImage}
              alt="Cozy Personal Workspace"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              priority
              unoptimized={workspaceImage.startsWith("blob:") || workspaceImage.startsWith("data:")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080D16] via-transparent to-transparent opacity-80" />
            <div className="relative z-10 p-6 flex flex-col justify-between h-full space-y-36">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-xs font-semibold text-white/90 tracking-wide">Workspace Active</span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                  title="Ganti Foto Workspace"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleChangePhoto} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Personal Workspace</h2>
                <p className="text-xs text-white/70">Ruang pencatatan finansial pribadi harian</p>
              </div>
            </div>
          </div>

          {/* Right Overview & Charts Container */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Overview Cards Grid */}
            <div>
              <h3 className="text-xs font-bold text-[#AAB5C5] uppercase tracking-wider mb-3">Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Income Card */}
                <div className="p-4 rounded-2xl bg-[#121C2A] border border-white/5 space-y-3 hover:border-white/10 transition-all">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-[#10b981]/20 text-[#10b981]">
                      <ArrowDownCircle className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-[#AAB5C5]">Income</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#F5F7FA]">
                    {formatCurrency(totalIncome)}
                  </div>
                  <MiniTrend data={
                    (() => {
                      const days = 7;
                      const now = new Date();
                      const arr: { label: string; value: number }[] = [];
                      for (let i = days - 1; i >= 0; i--) {
                        const d = new Date(now);
                        d.setDate(now.getDate() - i);
                        arr.push({ label: d.toLocaleDateString(undefined, { weekday: "short" }), value: 0 });
                      }
                      // fill with simple recent income per day
                      transactions
                        .filter((t) => t.transactionType === "INCOME")
                        .forEach((t) => {
                          const d = new Date(t.date);
                          const label = d.toLocaleDateString(undefined, { weekday: "short" });
                          const item = arr.find((a) => a.label === label);
                          if (item) item.value += t.amount;
                        });
                      return arr;
                    })()
                  } color="#10b981" />
                </div>

                {/* Expense Card */}
                <div className="p-4 rounded-2xl bg-[#121C2A] border border-white/5 space-y-3 hover:border-white/10 transition-all">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-[#f59e0b]/20 text-[#f59e0b]">
                      <ArrowUpCircle className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-[#AAB5C5]">Expense</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#F5F7FA]">
                    {formatCurrency(totalExpense)}
                  </div>
                  <MiniTrend data={
                    (() => {
                      const days = 7;
                      const now = new Date();
                      const arr: { label: string; value: number }[] = [];
                      for (let i = days - 1; i >= 0; i--) {
                        const d = new Date(now);
                        d.setDate(now.getDate() - i);
                        arr.push({ label: d.toLocaleDateString(undefined, { weekday: "short" }), value: 0 });
                      }
                      transactions
                        .filter((t) => t.transactionType === "EXPENSE")
                        .forEach((t) => {
                          const d = new Date(t.date);
                          const label = d.toLocaleDateString(undefined, { weekday: "short" });
                          const item = arr.find((a) => a.label === label);
                          if (item) item.value += t.amount;
                        });
                      return arr;
                    })()
                  } color="#f59e0b" />
                </div>

                {/* Balance Card */}
                <div className="p-4 rounded-2xl bg-[#121C2A] border border-white/5 space-y-3 hover:border-white/10 transition-all">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-[#3b82f6]/20 text-[#3b82f6]">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-[#AAB5C5]">Balance</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#F5F7FA]">
                    {formatCurrency(totalBalance)}
                  </div>
                  <MiniTrend data={
                    (() => {
                      const days = 7;
                      const now = new Date();
                      const arr: { label: string; value: number }[] = [];
                      for (let i = days - 1; i >= 0; i--) {
                        const d = new Date(now);
                        d.setDate(now.getDate() - i);
                        arr.push({ label: d.toLocaleDateString(undefined, { weekday: "short" }), value: 0 });
                      }
                      // compute net per day and cumulative balance
                      const netPerDay = arr.map((a) => 0);
                      transactions.forEach((t) => {
                        const d = new Date(t.date);
                        const label = d.toLocaleDateString(undefined, { weekday: "short" });
                        const idx = arr.findIndex((a) => a.label === label);
                        if (idx >= 0) {
                          netPerDay[idx] += t.transactionType === "INCOME" ? t.amount : -t.amount;
                        }
                      });
                      const totalNet = netPerDay.reduce((s, n) => s + n, 0);
                      let running = totalBalance - totalNet;
                      for (let i = 0; i < arr.length; i++) {
                        running += netPerDay[i];
                        arr[i].value = Math.max(0, Math.round(running));
                      }
                      return arr;
                    })()
                  } color="#3b82f6" />
                </div>
              </div>
            </div>

            {/* Middle Spending Breakdown & Budget Progress Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Spending Breakdown */}
              <div className="p-4 rounded-2xl bg-[#121C2A] border border-white/5 max-h-[420px] overflow-y-auto">
                <ExpensePieChart data={expensePieData} title="Spending Breakdown" />
              </div>

              {/* Budget Progress */}
              <div className="p-5 rounded-2xl bg-[#121C2A] border border-white/5 space-y-4 flex flex-col justify-between">
                <h3 className="text-sm font-bold text-[#F5F7FA]">Budget Progress</h3>

                <div className="space-y-4">
                  {budgets.slice(0, 3).map((b) => {
                    const pct = b.budgetAmount > 0 ? Math.min(100, Math.round((b.spentAmount / b.budgetAmount) * 100)) : 0;
                    return (
                      <div key={b.id} className="p-3 rounded-xl bg-[#172131] border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 rounded-lg shrink-0" style={{ backgroundColor: `${b.categoryColor}20`, color: b.categoryColor }}>
                              <ShoppingBag className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-semibold text-[#F5F7FA]">{b.categoryName}</span>
                          </div>
                          <span className="text-xs font-bold" style={{ color: b.categoryColor }}>{pct}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#AAB5C5]">
                          <span>{formatCurrency(b.spentAmount)}</span>
                          <span>{formatCurrency(b.budgetAmount)}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: b.categoryColor }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full Width Quick Actions Section */}
        <div className="p-6 rounded-3xl bg-[#121C2A] border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA]">Quick Actions</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Action 1: Add Transaction */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-5 rounded-2xl bg-[#172131] border border-white/5 hover:border-[#10b981]/50 hover:bg-[#172131]/80 transition-all flex flex-col items-center justify-center space-y-3 group text-center"
            >
              <div className="p-4 rounded-2xl bg-[#10b981]/20 text-[#10b981] group-hover:scale-110 transition-transform">
                <FilePlus className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Add Transaction</h4>
                <p className="text-[10px] text-[#AAB5C5]">Catat pemasukan/pengeluaran</p>
              </div>
            </button>

            {/* Action 2: View Analytics */}
            <Link
              href="/analytics"
              className="p-5 rounded-2xl bg-[#172131] border border-white/5 hover:border-[#8b5cf6]/50 hover:bg-[#172131]/80 transition-all flex flex-col items-center justify-center space-y-3 group text-center"
            >
              <div className="p-4 rounded-2xl bg-[#8b5cf6]/20 text-[#8b5cf6] group-hover:scale-110 transition-transform">
                <BarChart2 className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">View Analytics</h4>
                <p className="text-[10px] text-[#AAB5C5]">Analisis tren & grafik</p>
              </div>
            </Link>

            {/* Action 3: Manage Goals */}
            <Link
              href="/goals"
              className="p-5 rounded-2xl bg-[#172131] border border-white/5 hover:border-[#f59e0b]/50 hover:bg-[#172131]/80 transition-all flex flex-col items-center justify-center space-y-3 group text-center"
            >
              <div className="p-4 rounded-2xl bg-[#f59e0b]/20 text-[#f59e0b] group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Manage Goals</h4>
                <p className="text-[10px] text-[#AAB5C5]">Target &amp; tabungan impian</p>
              </div>
            </Link>

            {/* Action 4: Manage Accounts / Wallet */}
            <Link
              href="/accounts"
              className="p-5 rounded-2xl bg-[#172131] border border-white/5 hover:border-[#3b82f6]/50 hover:bg-[#172131]/80 transition-all flex flex-col items-center justify-center space-y-3 group text-center"
            >
              <div className="p-4 rounded-2xl bg-[#3b82f6]/20 text-[#3b82f6] group-hover:scale-110 transition-transform">
                <CreditCard className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Manage Wallet</h4>
                <p className="text-[10px] text-[#AAB5C5]">Kelola akun bank & dompet</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Quick Add Transaction */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Catat Transaksi Baru</DialogTitle>
            <DialogDescription>
              Tambahkan pengeluaran, pemasukan, atau transfer antar rekening.
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
