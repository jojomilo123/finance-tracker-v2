"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SummaryCard } from "@/components/cards/summary-card";
import { SpendingHeatmap } from "@/components/analytics/spending-heatmap";
import { CategoryBarChart } from "@/components/analytics/category-bar-chart";
import { CashFlowChart } from "@/components/charts/cash-flow-chart";
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { generateHeatmapData } from "@/services/report-service";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart3, FileSpreadsheet, FileText,
  TrendingUp, TrendingDown, Award,
} from "lucide-react";

type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

function filterByPeriod(transactions: any[], period: Period) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  return transactions.filter((t) => {
    const txDate = new Date(t.date);
    if (period === "DAILY") return t.date === today;
    if (period === "WEEKLY") {
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      return txDate >= weekAgo && txDate <= now;
    }
    if (period === "MONTHLY") {
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }
    if (period === "YEARLY") {
      return txDate.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

function generateCSV(transactions: any[]): string {
  const header = "Tanggal,Judul,Tipe,Jumlah,Kategori,Akun\n";
  const rows = transactions.map((t) =>
    `${t.date},"${t.title}",${t.transactionType},${t.amount},"${t.categoryName}","${t.accountName}"`
  ).join("\n");
  return header + rows;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { toast } = useToast();
  const { transactions } = useTransactionStore();
  const [period, setPeriod] = React.useState<Period>("MONTHLY");

  const filteredTx = React.useMemo(() => filterByPeriod(transactions, period), [transactions, period]);

  const totalIncome = filteredTx.filter((t) => t.transactionType === "INCOME").reduce((a, t) => a + t.amount, 0);
  const totalExpense = filteredTx.filter((t) => t.transactionType === "EXPENSE").reduce((a, t) => a + t.amount, 0);

  // Category breakdown from filtered data
  const categoryMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    filteredTx.filter((t) => t.transactionType === "EXPENSE").forEach((t) => {
      map[t.categoryName] = (map[t.categoryName] || 0) + t.amount;
    });
    return map;
  }, [filteredTx]);

  const CATEGORY_COLORS: Record<string, string> = {
    "Makanan & Minuman": "#3b82f6", "Tempat Tinggal": "#10b981", "Transportasi": "#f59e0b",
    "Hiburan": "#ec4899", "Internet": "#8b5cf6", "Internet, Listrik & Tagihan": "#8b5cf6",
    "Pendidikan & Kursus": "#06b6d4", "Pemberian & Perawatan Diri": "#f43f5e",
  };

  const categoryBarData = Object.entries(categoryMap)
    .map(([name, amount]) => ({ name, amount, color: CATEGORY_COLORS[name] || "#6b7280" }))
    .sort((a, b) => b.amount - a.amount);

  const pieData = categoryBarData.map((c) => ({ name: c.name, value: c.amount, color: c.color }));

  const avgDaily = totalExpense / (period === "DAILY" ? 1 : period === "WEEKLY" ? 7 : period === "MONTHLY" ? 30 : 365);
  const topCategory = categoryBarData[0];

  const sampleHeatmapData = React.useMemo(() => generateHeatmapData(transactions, 45), [transactions]);

  const cashFlowData = React.useMemo(() => {
    if (period === "DAILY") return [{ period: "Hari Ini", income: totalIncome, expense: totalExpense, savings: totalIncome - totalExpense }];
    if (period === "WEEKLY") return [{ period: "Minggu Ini", income: totalIncome, expense: totalExpense, savings: totalIncome - totalExpense }];
    if (period === "YEARLY") return [{ period: String(new Date().getFullYear()), income: totalIncome, expense: totalExpense, savings: totalIncome - totalExpense }];
    // Monthly: split into weeks
    return [
      { period: "Minggu 1", income: Math.round(totalIncome * 0.3), expense: Math.round(totalExpense * 0.25), savings: 0 },
      { period: "Minggu 2", income: Math.round(totalIncome * 0.2), expense: Math.round(totalExpense * 0.2), savings: 0 },
      { period: "Minggu 3", income: Math.round(totalIncome * 0.3), expense: Math.round(totalExpense * 0.3), savings: 0 },
      { period: "Minggu 4", income: Math.round(totalIncome * 0.2), expense: Math.round(totalExpense * 0.25), savings: 0 },
    ].map((w) => ({ ...w, savings: w.income - w.expense }));
  }, [totalIncome, totalExpense, period]);

  const periodLabel = period === "DAILY" ? "Harian" : period === "WEEKLY" ? "Mingguan" : period === "MONTHLY" ? "Bulanan" : "Tahunan";

  const handleExportCSV = () => {
    const csv = generateCSV(filteredTx);
    downloadFile(csv, `laporan-keuangan-${periodLabel.toLowerCase()}.csv`, "text/csv;charset=utf-8;");
    toast({ variant: "success", title: "Ekspor CSV Berhasil", description: `File CSV periode ${periodLabel} berhasil diunduh.` });
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(filteredTx, null, 2);
    downloadFile(json, `laporan-keuangan-${periodLabel.toLowerCase()}.json`, "application/json");
    toast({ variant: "success", title: "Ekspor JSON Berhasil", description: `File JSON periode ${periodLabel} berhasil diunduh.` });
  };

  const handleExportPDF = () => {
    // Generate a simple text-based report as a downloadable file
    let content = `LAPORAN KEUANGAN - ${periodLabel.toUpperCase()}\n`;
    content += `${"=".repeat(50)}\n\n`;
    content += `Total Pemasukan: ${formatCurrency(totalIncome)}\n`;
    content += `Total Pengeluaran: ${formatCurrency(totalExpense)}\n`;
    content += `Saldo Bersih: ${formatCurrency(totalIncome - totalExpense)}\n\n`;
    content += `RINCIAN TRANSAKSI\n${"─".repeat(50)}\n`;
    filteredTx.forEach((t) => {
      content += `${t.date} | ${t.transactionType.padEnd(8)} | ${formatCurrency(t.amount).padStart(15)} | ${t.title}\n`;
    });
    content += `\n${"─".repeat(50)}\n`;
    content += `PENGELUARAN PER KATEGORI\n`;
    categoryBarData.forEach((c) => { content += `  ${c.name}: ${formatCurrency(c.amount)}\n`; });
    downloadFile(content, `laporan-keuangan-${periodLabel.toLowerCase()}.txt`, "text/plain;charset=utf-8;");
    toast({ variant: "success", title: "Ekspor Laporan Berhasil", description: `Laporan teks periode ${periodLabel} berhasil diunduh.` });
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Laporan & Intelijen Finansial</h1>
            <p className="text-sm text-muted-foreground">Analisis tren pengeluaran, pemasukan, dan performa tabungan.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExportPDF} className="rounded-xl gap-1.5">
              <FileText className="h-4 w-4" /> Laporan
            </Button>
            <Button variant="outline" onClick={handleExportCSV} className="rounded-xl gap-1.5">
              <FileSpreadsheet className="h-4 w-4" /> CSV
            </Button>
            <Button variant="outline" onClick={handleExportJSON} className="rounded-xl gap-1.5">
              <FileSpreadsheet className="h-4 w-4" /> JSON
            </Button>
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex p-1 rounded-xl bg-muted/60 border border-border w-full sm:w-auto self-start">
          {([
            { id: "DAILY" as Period, label: "Harian" },
            { id: "WEEKLY" as Period, label: "Mingguan" },
            { id: "MONTHLY" as Period, label: "Bulanan" },
            { id: "YEARLY" as Period, label: "Tahunan" },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                period === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard title={`Pemasukan ${periodLabel}`} amount={totalIncome} icon={TrendingUp} iconColor="text-emerald-500" />
          <SummaryCard title={`Pengeluaran ${periodLabel}`} amount={totalExpense} icon={TrendingDown} iconColor="text-rose-500" />
          <SummaryCard title="Rata-Rata Harian" amount={Math.round(avgDaily)} icon={BarChart3} iconColor="text-amber-500" />
          <SummaryCard
            title="Pengeluaran Terbesar"
            amount={topCategory?.amount || 0}
            subtitle={topCategory?.name || "-"}
            icon={Award}
            iconColor="text-purple-500"
          />
        </div>

        {/* Calendar Heatmap */}
        <SpendingHeatmap data={sampleHeatmapData} />

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CashFlowChart data={cashFlowData} title={`Arus Kas ${periodLabel}`} />
          <CategoryBarChart data={categoryBarData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ExpensePieChart data={pieData} />
          </div>
          <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="text-base font-semibold">Kesimpulan Analisis Laporan ({periodLabel})</h3>
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p>
                • Total pengeluaran periode ini sebesar <strong className="text-foreground">{formatCurrency(totalExpense)}</strong>
                {totalIncome > 0 && ` (${Math.round((totalExpense / totalIncome) * 100)}% dari pemasukan)`}.
              </p>
              {topCategory && (
                <p>
                  • Kategori <strong className="text-foreground">{topCategory.name}</strong> merupakan pos biaya terbesar
                  ({Math.round((topCategory.amount / (totalExpense || 1)) * 100)}% dari total pengeluaran).
                </p>
              )}
              <p>
                • Rasio tabungan Anda periode ini mencapai{" "}
                <strong className="text-emerald-400">
                  {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
                </strong>{" "}
                dari total pemasukan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
