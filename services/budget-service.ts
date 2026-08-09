import { prisma } from "@/lib/prisma";

export interface UpsertBudgetInput {
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  rolloverEnabled?: boolean;
}

export async function getBudgets(userId: string, month: number, year: number) {
  return await prisma.budget.findMany({
    where: {
      userId,
      month,
      year,
    },
    include: {
      category: true,
    },
    orderBy: { category: { name: "asc" } },
  });
}

export async function upsertBudget(data: UpsertBudgetInput) {
  return await prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId: data.userId,
        categoryId: data.categoryId,
        month: data.month,
        year: data.year,
      },
    },
    update: {
      amount: data.amount,
      rolloverEnabled: data.rolloverEnabled ?? false,
    },
    create: {
      userId: data.userId,
      categoryId: data.categoryId,
      amount: data.amount,
      month: data.month,
      year: data.year,
      rolloverEnabled: data.rolloverEnabled ?? false,
    },
  });
}

export function calculateBudgetForecast(
  spent: number,
  budget: number,
  currentDay: number = new Date().getDate(),
  daysInMonth: number = 30
) {
  if (currentDay <= 0) return { projectedSpent: spent, overspendRisk: false, confidence: "LOW" };

  const dailyAverage = spent / currentDay;
  const projectedSpent = Math.round(dailyAverage * daysInMonth);
  const overspendRisk = projectedSpent > budget;

  let confidence: "LOW" | "MEDIUM" | "HIGH" = "LOW";
  if (currentDay > 20) confidence = "HIGH";
  else if (currentDay > 10) confidence = "MEDIUM";

  return {
    dailyAverage: Math.round(dailyAverage),
    projectedSpent,
    projectedRemaining: budget - projectedSpent,
    overspendRisk,
    confidence,
  };
}
