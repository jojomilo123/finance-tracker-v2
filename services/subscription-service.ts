import { prisma } from "@/lib/prisma";

export interface CreateSubscriptionInput {
  userId: string;
  name: string;
  amount: number;
  billingCycle: string;
  renewalDate: Date;
  accountId: string;
  categoryId: string;
}

export async function getSubscriptions(userId: string) {
  return await prisma.subscription.findMany({
    where: { userId },
    orderBy: { renewalDate: "asc" },
  });
}

export async function createSubscription(data: CreateSubscriptionInput) {
  return await prisma.subscription.create({
    data: {
      userId: data.userId,
      name: data.name,
      amount: data.amount,
      billingCycle: data.billingCycle,
      renewalDate: data.renewalDate,
      accountId: data.accountId,
      categoryId: data.categoryId,
    },
  });
}

export function calculateMonthlySubscriptionCost(
  subscriptions: Array<{ amount: number; billingCycle: string }>
): number {
  return subscriptions.reduce((sum, s) => {
    if (s.billingCycle === "MONTHLY") return sum + s.amount;
    if (s.billingCycle === "YEARLY") return sum + Math.round(s.amount / 12);
    if (s.billingCycle === "WEEKLY") return sum + Math.round(s.amount * 4.33);
    return sum + s.amount;
  }, 0);
}
