import { formatCurrency } from "@/lib/utils";

export interface FinancialHealthMetrics {
  score: number; // 0 - 100
  rating: "Excellent" | "Good" | "Fair" | "Needs Improvement";
  savingsRate: number; // e.g. 35%
  budgetDisciplineScore: number;
  recommendation: string;
}

export function calculateFinancialHealth(
  income: number,
  expense: number,
  totalBudget: number,
  spentBudget: number
): FinancialHealthMetrics {
  const savings = Math.max(0, income - expense);
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  
  let score = 50; // base score

  // Savings Rate contribution (max 35 pts)
  if (savingsRate >= 30) score += 35;
  else if (savingsRate >= 20) score += 25;
  else if (savingsRate >= 10) score += 15;
  else score += 5;

  // Budget Discipline contribution (max 35 pts)
  const budgetUtilization = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0;
  if (budgetUtilization <= 85) score += 35;
  else if (budgetUtilization <= 100) score += 20;
  else score += 0;

  // Cash Flow Stability (max 30 pts)
  if (income > expense) score += 30;
  else score += 5;

  score = Math.min(100, Math.max(0, score));

  let rating: "Excellent" | "Good" | "Fair" | "Needs Improvement" = "Fair";
  let recommendation = "Pertahankan kedisiplinan anggaran dan tingkatkan alokasi tabungan harian.";

  if (score >= 85) {
    rating = "Excellent";
    recommendation = "Kondisi keuangan Anda sangat sehat! Pertahankan rasio tabungan di atas 30%.";
  } else if (score >= 70) {
    rating = "Good";
    recommendation = "Keuangan Anda dalam kondisi baik. Pertimbangkan mengalokasikan kelebihan dana ke investasi.";
  } else if (score >= 55) {
    rating = "Fair";
    recommendation = "Kondisi cukup stabil, namun perhatikan kategori pengeluaran yang mendekati batas anggaran.";
  } else {
    rating = "Needs Improvement";
    recommendation = "Pengeluaran Anda melebihi atau mendekati total pemasukan. Evaluasi pos anggaran non-esensial.";
  }

  return {
    score,
    rating,
    savingsRate,
    budgetDisciplineScore: Math.round(budgetUtilization),
    recommendation,
  };
}
