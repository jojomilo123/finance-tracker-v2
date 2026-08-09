import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export interface TransactionFilterOptions {
  search?: string;
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreateTransactionInput {
  userId: string;
  transactionType: TransactionType;
  title: string;
  amount: number;
  date: Date;
  accountId: string;
  toAccountId?: string;
  categoryId: string;
  paymentMethodId?: string;
  merchant?: string;
  note?: string;
}

export async function getTransactions(
  userId: string,
  filters?: TransactionFilterOptions
) {
  const where: any = { userId };

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { merchant: { contains: filters.search, mode: "insensitive" } },
      { note: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters?.type) {
    where.transactionType = filters.type;
  }

  if (filters?.accountId) {
    where.accountId = filters.accountId;
  }

  if (filters?.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters?.startDate || filters?.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = filters.startDate;
    if (filters.endDate) where.date.lte = filters.endDate;
  }

  return await prisma.transaction.findMany({
    where,
    include: {
      account: true,
      toAccount: true,
      category: true,
      paymentMethod: true,
      tags: { include: { tag: true } },
      attachments: true,
    },
    orderBy: { date: "desc" },
  });
}

export async function createTransaction(data: CreateTransactionInput) {
  return await prisma.$transaction(async (tx) => {
    // 1. Create Master Transaction
    const transaction = await tx.transaction.create({
      data: {
        userId: data.userId,
        transactionType: data.transactionType,
        title: data.title,
        amount: data.amount,
        date: data.date,
        accountId: data.accountId,
        toAccountId: data.toAccountId,
        categoryId: data.categoryId,
        paymentMethodId: data.paymentMethodId,
        merchant: data.merchant,
        note: data.note,
      },
    });

    // 2. Atomic Balance Adjustment
    if (data.transactionType === "INCOME") {
      await tx.financialAccount.update({
        where: { id: data.accountId },
        data: { currentBalance: { increment: data.amount } },
      });
    } else if (data.transactionType === "EXPENSE") {
      await tx.financialAccount.update({
        where: { id: data.accountId },
        data: { currentBalance: { decrement: data.amount } },
      });
    } else if (data.transactionType === "TRANSFER" && data.toAccountId) {
      // Deduct from source account
      await tx.financialAccount.update({
        where: { id: data.accountId },
        data: { currentBalance: { decrement: data.amount } },
      });
      // Add to target account
      await tx.financialAccount.update({
        where: { id: data.toAccountId },
        data: { currentBalance: { increment: data.amount } },
      });
    }

    return transaction;
  });
}

export async function deleteTransaction(id: string, userId: string) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.transaction.findUnique({
      where: { id, userId },
    });

    if (!existing) throw new Error("Transaksi tidak ditemukan");

    // Reverse balance adjustment
    if (existing.transactionType === "INCOME") {
      await tx.financialAccount.update({
        where: { id: existing.accountId },
        data: { currentBalance: { decrement: existing.amount } },
      });
    } else if (existing.transactionType === "EXPENSE") {
      await tx.financialAccount.update({
        where: { id: existing.accountId },
        data: { currentBalance: { increment: existing.amount } },
      });
    } else if (existing.transactionType === "TRANSFER" && existing.toAccountId) {
      await tx.financialAccount.update({
        where: { id: existing.accountId },
        data: { currentBalance: { increment: existing.amount } },
      });
      await tx.financialAccount.update({
        where: { id: existing.toAccountId },
        data: { currentBalance: { decrement: existing.amount } },
      });
    }

    return await tx.transaction.delete({
      where: { id },
    });
  });
}
