import { PrismaClient, CategoryType, AccountType, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // Create Demo User
  const user = await prisma.user.upsert({
    where: { email: "demo@financetracker.id" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@financetracker.id",
      emailVerified: true,
      currency: "IDR",
      locale: "id-ID",
      timezone: "Asia/Jakarta",
      theme: "system",
    },
  });

  console.log(`👤 Created/Verified User: ${user.name} (${user.id})`);

  // Default Income Categories
  const incomeCategories = [
    { name: "Salary", icon: "Briefcase", color: "#10b981" },
    { name: "Business", icon: "Store", color: "#3b82f6" },
    { name: "Freelance", icon: "Laptop", color: "#8b5cf6" },
    { name: "Investment", icon: "TrendingUp", color: "#06b6d4" },
    { name: "Bonus", icon: "Gift", color: "#f59e0b" },
    { name: "Gift", icon: "Heart", color: "#ec4899" },
    { name: "Refund", icon: "RotateCcw", color: "#64748b" },
    { name: "Others", icon: "MoreHorizontal", color: "#94a3b8" },
  ];

  for (const cat of incomeCategories) {
    await prisma.category.upsert({
      where: { id: `income-${cat.name.toLowerCase()}` },
      update: {},
      create: {
        id: `income-${cat.name.toLowerCase()}`,
        userId: user.id,
        name: cat.name,
        type: CategoryType.INCOME,
        icon: cat.icon,
        color: cat.color,
      },
    });
  }

  // Default Expense Categories
  const expenseCategories = [
    { name: "Food & Water", icon: "Utensils", color: "#ef4444" },
    { name: "Housing", icon: "Home", color: "#3b82f6" },
    { name: "Transportation", icon: "Car", color: "#f59e0b" },
    { name: "Internet", icon: "Wifi", color: "#8b5cf6" },
    { name: "Entertainment", icon: "Film", color: "#ec4899" },
    { name: "Emergency", icon: "ShieldAlert", color: "#dc2626" },
    { name: "Personal Care", icon: "Sparkles", color: "#14b8a6" },
    { name: "Household", icon: "Package", color: "#64748b" },
    { name: "Health", icon: "Activity", color: "#10b981" },
    { name: "Shopping", icon: "ShoppingBag", color: "#a855f7" },
    { name: "Education", icon: "GraduationCap", color: "#0284c7" },
    { name: "Subscription", icon: "CreditCard", color: "#f97316" },
    { name: "Travel", icon: "Plane", color: "#06b6d4" },
    { name: "Investment", icon: "LineChart", color: "#059669" },
    { name: "Others", icon: "MoreHorizontal", color: "#94a3b8" },
  ];

  for (const cat of expenseCategories) {
    await prisma.category.upsert({
      where: { id: `expense-${cat.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `expense-${cat.name.toLowerCase().replace(/\s+/g, "-")}`,
        userId: user.id,
        name: cat.name,
        type: CategoryType.EXPENSE,
        icon: cat.icon,
        color: cat.color,
      },
    });
  }

  // Default Payment Methods
  const paymentMethods = [
    { name: "Cash", icon: "Banknote", color: "#10b981" },
    { name: "Debit Card", icon: "CreditCard", color: "#3b82f6" },
    { name: "Credit Card", icon: "CreditCard", color: "#8b5cf6" },
    { name: "QRIS", icon: "QrCode", color: "#ef4444" },
    { name: "Bank Transfer", icon: "Building2", color: "#f59e0b" },
    { name: "GoPay", icon: "Smartphone", color: "#06b6d4" },
    { name: "OVO", icon: "Smartphone", color: "#7c3aed" },
    { name: "DANA", icon: "Smartphone", color: "#0284c7" },
    { name: "ShopeePay", icon: "Smartphone", color: "#f97316" },
  ];

  for (const pm of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { id: `pm-${pm.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `pm-${pm.name.toLowerCase().replace(/\s+/g, "-")}`,
        userId: user.id,
        name: pm.name,
        icon: pm.icon,
        color: pm.color,
      },
    });
  }

  // Sample Accounts
  const bcaAccount = await prisma.financialAccount.upsert({
    where: { id: "account-bca" },
    update: {},
    create: {
      id: "account-bca",
      userId: user.id,
      name: "BCA Utama",
      accountType: AccountType.BANK,
      currentBalance: 0,
      color: "#0056a4",
      icon: "Building2",
      isDefault: true,
    },
  });

  await prisma.financialAccount.upsert({
    where: { id: "account-cash" },
    update: {},
    create: {
      id: "account-cash",
      userId: user.id,
      name: "Dompet Tunai",
      accountType: AccountType.CASH,
      currentBalance: 0,
      color: "#10b981",
      icon: "Wallet",
    },
  });

  // Sample Budgets
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  await prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId: user.id,
        categoryId: "expense-food-&-water",
        month: currentMonth,
        year: currentYear,
      },
    },
    update: {},
    create: {
      userId: user.id,
      categoryId: "expense-food-&-water",
      amount: 2000000,
      month: currentMonth,
      year: currentYear,
      rolloverEnabled: true,
    },
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
