import { formatCurrency } from "@/lib/utils";

export interface ReportSummaryMetrics {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  savingsRate: number;
  avgDailyExpense: number;
  avgDailyIncome: number;
  largestExpense: { title: string; amount: number; category: string };
  largestIncome: { title: string; amount: number; category: string };
  totalTransactionsCount: number;
  mostActiveCategory: string;
  netCashFlow: number;
}

export function calculateReportMetrics(
  transactions: Array<{
    amount: number;
    transactionType: "INCOME" | "EXPENSE" | "TRANSFER";
    title: string;
    categoryName: string;
    date: string;
  }>,
  daysCount: number = 30
): ReportSummaryMetrics {
  let totalIncome = 0;
  let totalExpense = 0;
  let largestExpense = { title: "Tidak ada", amount: 0, category: "-" };
  let largestIncome = { title: "Tidak ada", amount: 0, category: "-" };
  const categoryCounts: Record<string, number> = {};

  transactions.forEach((tx) => {
    if (tx.transactionType === "INCOME") {
      totalIncome += tx.amount;
      if (tx.amount > largestIncome.amount) {
        largestIncome = { title: tx.title, amount: tx.amount, category: tx.categoryName };
      }
    } else if (tx.transactionType === "EXPENSE") {
      totalExpense += tx.amount;
      if (tx.amount > largestExpense.amount) {
        largestExpense = { title: tx.title, amount: tx.amount, category: tx.categoryName };
      }
    }

    categoryCounts[tx.categoryName] = (categoryCounts[tx.categoryName] || 0) + 1;
  });

  const savings = Math.max(0, totalIncome - totalExpense);
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;
  const avgDailyExpense = Math.round(totalExpense / Math.max(1, daysCount));
  const avgDailyIncome = Math.round(totalIncome / Math.max(1, daysCount));

  let mostActiveCategory = "-";
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostActiveCategory = cat;
    }
  });

  return {
    totalIncome,
    totalExpense,
    savings,
    savingsRate,
    avgDailyExpense,
    avgDailyIncome,
    largestExpense,
    largestIncome,
    totalTransactionsCount: transactions.length,
    mostActiveCategory,
    netCashFlow: totalIncome - totalExpense,
  };
}

export function generateHeatmapData(days: number = 60) {
  const result = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    // Random sample spending value between 0 and 500,000 IDR
    const count = Math.random() > 0.4 ? Math.floor(Math.random() * 450000) : 0;
    result.push({ date: dateStr, count });
  }

  return result;
}
