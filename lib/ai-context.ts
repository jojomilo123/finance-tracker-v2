import { formatCurrency } from "@/lib/utils";

export interface FinancialContextInput {
  accounts: Array<{ name: string; type: string; balance: number }>;
  transactions: Array<{
    title: string;
    amount: number;
    date: string;
    transactionType: string;
    categoryName: string;
    accountName: string;
  }>;
  budgets: Array<{
    categoryName: string;
    budgetAmount: number;
    spentAmount: number;
  }>;
  goals: Array<{
    name: string;
    targetAmount: number;
    currentSaved: number;
    targetDate: string;
  }>;
}

export function buildFinancialContextSummary(context: FinancialContextInput): string {
  const totalBalance = context.accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = context.transactions
    .filter((tx) => tx.transactionType === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = context.transactions
    .filter((tx) => tx.transactionType === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const accountLines = context.accounts
    .map((account) => `- ${account.name} (${account.type}): ${formatCurrency(account.balance)}`)
    .join("\n");

  const recentTransactions = context.transactions
    .slice(0, 8)
    .map(
      (tx) =>
        `- ${tx.date} | ${tx.transactionType} | ${tx.title} | ${formatCurrency(tx.amount)} | ${tx.categoryName} | ${tx.accountName}`
    )
    .join("\n");

  const budgetLines = context.budgets
    .map(
      (budget) =>
        `- ${budget.categoryName}: anggaran ${formatCurrency(budget.budgetAmount)}, terpakai ${formatCurrency(budget.spentAmount)}`
    )
    .join("\n");

  const goalLines = context.goals
    .map(
      (goal) =>
        `- ${goal.name}: ${formatCurrency(goal.currentSaved)} / ${formatCurrency(goal.targetAmount)} (target ${goal.targetDate})`
    )
    .join("\n");

  return [
    "Data keuangan pengguna saat ini (gunakan untuk analisis spesifik):",
    `Total saldo semua akun: ${formatCurrency(totalBalance)}`,
    `Total pemasukan tercatat: ${formatCurrency(totalIncome)}`,
    `Total pengeluaran tercatat: ${formatCurrency(totalExpense)}`,
    "",
    "Akun:",
    accountLines || "- (belum ada akun)",
    "",
    "Transaksi terbaru:",
    recentTransactions || "- (belum ada transaksi)",
    "",
    "Anggaran:",
    budgetLines || "- (belum ada anggaran)",
    "",
    "Target tabungan:",
    goalLines || "- (belum ada target)",
  ].join("\n");
}
