"use client";

import * as React from "react";
import Image from "next/image";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { formatCurrency, cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart2,
  Activity,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { CashFlowChart } from "@/components/charts/cash-flow-chart";

export function ViewerAnalyticsDashboard() {
  const { transactions, accounts, budgets, assets, liabilities } = useTransactionStore();
  const [workspaceImage, setWorkspaceImage] = React.useState("/images/workspace-default.jpg");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const customBanner = localStorage.getItem("finance-tracker-custom-workspace-banner");
      if (customBanner) {
        setWorkspaceImage(customBanner);
      } else {
        setWorkspaceImage("/images/workspace-default.jpg");
      }
    }
  }, []);

  // 1. Financial Overview Metrics
  const metrics = React.useMemo(() => {
    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
    const totalAssetsValue = assets.reduce((acc, curr) => acc + curr.amount, 0);
    const totalLiabilitiesValue = liabilities.reduce((acc, curr) => acc + curr.amount, 0);

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.transactionType === "INCOME") totalIncome += t.amount;
      if (t.transactionType === "EXPENSE") totalExpense += t.amount;
    });

    const netIncome = totalIncome - totalExpense;
    const netWorth = totalBalance + totalAssetsValue - totalLiabilitiesValue;

    return {
      totalBalance,
      totalAssetsValue,
      totalLiabilitiesValue,
      totalIncome,
      totalExpense,
      netIncome,
      netWorth,
    };
  }, [transactions, accounts, assets, liabilities]);

  // 2. Spending Analysis by Category
  const spendingByCategory = React.useMemo(() => {
    const map: Record<string, number> = {};
    let totalSpent = 0;

    transactions.forEach((t) => {
      if (t.transactionType === "EXPENSE") {
        const cat = t.categoryName || "Umum";
        map[cat] = (map[cat] || 0) + t.amount;
        totalSpent += t.amount;
      }
    });

    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];
    const list = Object.entries(map)
      .map(([category, amount], idx) => ({
        category,
        amount,
        percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
        color: colors[idx % colors.length],
      }))
      .sort((a, b) => b.amount - a.amount);

    return { list, totalSpent, topCategory: list[0] || null };
  }, [transactions]);

  // 3. Income Analysis
  const incomeAnalysis = React.useMemo(() => {
    const map: Record<string, number> = {};
    let totalInc = 0;

    transactions.forEach((t) => {
      if (t.transactionType === "INCOME") {
        const source = t.accountName || t.title || "Sumber Lain";
        map[source] = (map[source] || 0) + t.amount;
        totalInc += t.amount;
      }
    });

    const sources = Object.entries(map)
      .map(([source, amount]) => ({
        source,
        amount,
        percentage: totalInc > 0 ? Math.round((amount / totalInc) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return { sources, totalInc };
  }, [transactions]);

  // 4. Budget Utilization Analysis
  const budgetAnalysis = React.useMemo(() => {
    const totalBudget = budgets.reduce((acc, b) => acc + b.budgetAmount, 0);
    const totalSpentInBudgets = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
    const remainingBudget = Math.max(0, totalBudget - totalSpentInBudgets);
    const overallUtilization = totalBudget > 0 ? Math.round((totalSpentInBudgets / totalBudget) * 100) : 0;

    const overBudget = budgets.filter((b) => b.spentAmount > b.budgetAmount && b.budgetAmount > 0);
    const nearBudget = budgets.filter(
      (b) => b.spentAmount / b.budgetAmount >= 0.8 && b.spentAmount <= b.budgetAmount && b.budgetAmount > 0
    );
    const healthyBudgets = budgets.filter(
      (b) => b.spentAmount / b.budgetAmount < 0.8 && b.budgetAmount > 0
    );

    return {
      totalBudget,
      totalSpentInBudgets,
      remainingBudget,
      overallUtilization,
      overBudget,
      nearBudget,
      healthyBudgets,
    };
  }, [budgets]);

  // 5. Cash Flow Trend Data for Chart
  const cashFlowChartData = React.useMemo(() => {
    const dateMap: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const dateKey = t.date || "Terbaru";
      if (!dateMap[dateKey]) dateMap[dateKey] = { income: 0, expense: 0 };
      if (t.transactionType === "INCOME") dateMap[dateKey].income += t.amount;
      if (t.transactionType === "EXPENSE") dateMap[dateKey].expense += t.amount;
    });

    return Object.entries(dateMap)
      .map(([date, data]) => ({ date, ...data }))
      .slice(-7);
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Workspace Sea Wave Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[220px] sm:min-h-[260px] flex flex-col justify-between group">
        <Image
          src={workspaceImage}
          alt="Cozy Personal Workspace"
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          priority
          unoptimized={workspaceImage.startsWith("blob:") || workspaceImage.startsWith("data:")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D16] via-[#080D16]/50 to-transparent opacity-90" />
        <div className="relative z-10 p-6 flex flex-col justify-between h-full min-h-[220px] sm:min-h-[260px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs font-semibold text-white/90 tracking-wide">Personal Workspace (Viewer Mode)</span>
            </div>
            <Badge variant="outline" className="text-xs border-blue-500/40 text-blue-400 bg-blue-500/10">
              <Zap className="h-3.5 w-3.5 mr-1 animate-pulse" /> Real-time Live Dashboard
            </Badge>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Personal Workspace</h2>
            <p className="text-xs sm:text-sm text-white/80">Ruang pencatatan &amp; pemantauan finansial pribadi</p>
          </div>
        </div>
      </div>

      {/* Real-time Viewer Header */}
      <div className="p-5 rounded-2xl bg-[#0D1420] border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Viewer Analytical Insights</h2>
          <p className="text-xs text-muted-foreground">
            Analisis lengkap arus kas, anggaran, dan kesehatan keuangan terkini.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#121C2A] px-3.5 py-2 rounded-xl border border-white/10 text-xs text-white">
          <Activity className="h-4 w-4 text-[#10b981]" />
          <span>Status Keuangan: <strong className={metrics.netIncome >= 0 ? "text-emerald-400" : "text-rose-400"}>
            {metrics.netIncome >= 0 ? "Cash Flow Positif" : "Defisit Terdeteksi"}
          </strong></span>
        </div>
      </div>

      {/* 1. Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <Card className="bg-[#0D1420] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-[#AAB5C5] flex items-center justify-between">
              <span>Total Saldo Akun</span>
              <Wallet className="h-4 w-4 text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(metrics.totalBalance)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Tersedia di {accounts.length} akun aktif
            </p>
          </CardContent>
        </Card>

        {/* Net Income */}
        <Card className="bg-[#0D1420] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-[#AAB5C5] flex items-center justify-between">
              <span>Surplus / Defisit (Net Income)</span>
              {metrics.netIncome >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-rose-400" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold tracking-tight", metrics.netIncome >= 0 ? "text-emerald-400" : "text-rose-400")}>
              {formatCurrency(metrics.netIncome)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Pemasukan dikurangi pengeluaran
            </p>
          </CardContent>
        </Card>

        {/* Total Income */}
        <Card className="bg-[#0D1420] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-[#AAB5C5] flex items-center justify-between">
              <span>Total Pemasukan</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(metrics.totalIncome)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {incomeAnalysis.sources.length} sumber pendapatan tercatat
            </p>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="bg-[#0D1420] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-[#AAB5C5] flex items-center justify-between">
              <span>Total Pengeluaran</span>
              <TrendingDown className="h-4 w-4 text-rose-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(metrics.totalExpense)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Top: {spendingByCategory.topCategory ? spendingByCategory.topCategory.category : "Belum Ada"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Spending Analysis & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Category Breakdown */}
        <Card className="lg:col-span-2 bg-[#0D1420] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-emerald-400" /> Analisis Pengeluaran Berdasarkan Kategori
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Proporsi pengeluaran dari data transaksi terkini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {spendingByCategory.list.length > 0 ? (
              spendingByCategory.list.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-white">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.category}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {formatCurrency(item.amount)} ({item.percentage}%)
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-2 bg-secondary" style={{ accentColor: item.color }} />
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-8 text-center">
                Belum ada transaksi pengeluaran yang dicatat oleh Editor.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Expense Pie Chart */}
        <Card className="bg-[#0D1420] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-white">Distribusi Visual</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensePieChart
              data={spendingByCategory.list.map((item) => ({
                name: item.category,
                value: item.amount,
                color: item.color,
              }))}
              title="Kategori Pengeluaran"
            />
          </CardContent>
        </Card>
      </div>

      {/* 3. Budget Analysis Section */}
      <Card className="bg-[#0D1420] border-white/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-amber-400" /> Analisis Efisiensi Anggaran (Budgets)
            </CardTitle>
            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
              Penggunaan: {budgetAnalysis.overallUtilization}%
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Total Budget: {formatCurrency(budgetAnalysis.totalBudget)} | Terpakai: {formatCurrency(budgetAnalysis.totalSpentInBudgets)} | Sisa: {formatCurrency(budgetAnalysis.remainingBudget)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-3">
          {budgetAnalysis.overBudget.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-400" /> Kategori Melebihi Anggaran:
              </div>
              <ul className="list-disc list-inside">
                {budgetAnalysis.overBudget.map((b) => (
                  <li key={b.id}>
                    {b.categoryName}: Terpakai {formatCurrency(b.spentAmount)} dari budget {formatCurrency(b.budgetAmount)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {budgets.map((b) => {
              const percent = b.budgetAmount > 0 ? Math.round((b.spentAmount / b.budgetAmount) * 100) : 0;
              const isOver = percent > 100;
              const isNear = percent >= 80 && percent <= 100;

              return (
                <div key={b.id} className="p-3.5 rounded-xl border border-white/5 bg-[#121C2A] space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-white">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.categoryColor || "#3b82f6" }} />
                      {b.categoryName}
                    </span>
                    <span className={isOver ? "text-rose-400 font-mono" : isNear ? "text-amber-400 font-mono" : "text-emerald-400 font-mono"}>
                      {percent}%
                    </span>
                  </div>
                  <Progress value={Math.min(100, percent)} className="h-1.5" />
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Terpakai: {formatCurrency(b.spentAmount)}</span>
                    <span>Budget: {formatCurrency(b.budgetAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 4. Financial Health Summary Card */}
      <Card className="bg-[#0D1420] border-emerald-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" /> Ringkasan Kesehatan Keuangan (Financial Health)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#121C2A] border border-white/5 space-y-1">
              <span className="text-muted-foreground text-[11px]">Kondisi Arus Kas</span>
              <p className={`font-bold ${metrics.netIncome >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {metrics.netIncome >= 0 ? "Positif / Surplus" : "Negatif / Defisit"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#121C2A] border border-white/5 space-y-1">
              <span className="text-muted-foreground text-[11px]">Kategori Terbesar</span>
              <p className="font-bold text-white">
                {spendingByCategory.topCategory ? spendingByCategory.topCategory.category : "N/A"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#121C2A] border border-white/5 space-y-1">
              <span className="text-muted-foreground text-[11px]">Kerapian Anggaran</span>
              <p className="font-bold text-amber-400">
                {budgetAnalysis.overBudget.length === 0 ? "100% Sesuai Budget" : `${budgetAnalysis.overBudget.length} Melebihi Batas`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
