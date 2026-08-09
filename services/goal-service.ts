import { prisma } from "@/lib/prisma";

export interface CreateGoalInput {
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate: Date;
}

export async function getGoals(userId: string) {
  return await prisma.goal.findMany({
    where: { userId },
    orderBy: { targetDate: "asc" },
  });
}

export async function createGoal(data: CreateGoalInput) {
  return await prisma.goal.create({
    data: {
      userId: data.userId,
      title: data.title,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount || 0,
      targetDate: data.targetDate,
    },
  });
}

export async function addGoalContribution(id: string, userId: string, amount: number) {
  return await prisma.goal.update({
    where: { id },
    data: {
      currentAmount: { increment: amount },
    },
  });
}
