import { prisma } from "@/lib/prisma";
import { AccountType } from "@prisma/client";

export interface CreateAccountInput {
  userId: string;
  name: string;
  accountType: AccountType;
  currentBalance?: number;
  color?: string;
  icon?: string;
  isDefault?: boolean;
}

export async function getAccounts(userId: string) {
  return await prisma.financialAccount.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });
}

export async function createAccount(data: CreateAccountInput) {
  if (data.isDefault) {
    // Unset other default accounts
    await prisma.financialAccount.updateMany({
      where: { userId: data.userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return await prisma.financialAccount.create({
    data: {
      userId: data.userId,
      name: data.name,
      accountType: data.accountType,
      currentBalance: data.currentBalance || 0,
      color: data.color || "#3b82f6",
      icon: data.icon || "Wallet",
      isDefault: data.isDefault || false,
    },
  });
}

export async function deleteAccount(id: string, userId: string) {
  return await prisma.financialAccount.delete({
    where: { id, userId },
  });
}
