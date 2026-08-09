import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TransactionRecord {
  id: string;
  title: string;
  amount: number;
  date: string;
  transactionType: "EXPENSE" | "INCOME" | "TRANSFER";
  accountId: string;
  accountName: string;
  toAccountId?: string;
  toAccountName?: string;
  categoryId: string;
  categoryName: string;
  merchant?: string;
  note?: string;
}

export interface AccountRecord {
  id: string;
  name: string;
  type: string;
  balance: number;
  icon?: string;
  color?: string;
}

export interface BudgetRecord {
  id: string;
  categoryName: string;
  categoryColor: string;
  budgetAmount: number;
  spentAmount: number;
}

export interface GoalRecord {
  id: string;
  name: string;
  targetAmount: number;
  currentSaved: number;
  targetDate: string;
  color: string;
}

export interface NetWorthAsset {
  id: string;
  name: string;
  type: string;
  amount: number;
  color: string;
}

export interface NetWorthLiability {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SubscriptionRecord {
  id: string;
  name: string;
  amount: number;
  cycle: string;
  nextDate: string;
  category: string;
  isPaused: boolean;
}

export interface SettingsRecord {
  name: string;
  email: string;
  timezone: string;
  currency: string;
}

interface TransactionState {
  transactions: TransactionRecord[];
  accounts: AccountRecord[];
  budgets: BudgetRecord[];
  goals: GoalRecord[];
  assets: NetWorthAsset[];
  liabilities: NetWorthLiability[];
  subscriptions: SubscriptionRecord[];
  settings: SettingsRecord;

  addTransaction: (tx: Omit<TransactionRecord, "id">) => void;
  deleteTransaction: (id: string) => TransactionRecord | undefined;
  restoreTransaction: (tx: TransactionRecord) => void;

  addAccount: (acc: Omit<AccountRecord, "id">) => void;
  deleteAccount: (id: string) => void;

  updateBudget: (id: string, budgetAmount: number) => void;
  setBudgets: (budgets: BudgetRecord[]) => void;

  addGoal: (goal: Omit<GoalRecord, "id">) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;

  addAsset: (asset: Omit<NetWorthAsset, "id">) => void;
  deleteAsset: (id: string) => void;
  addLiability: (liability: Omit<NetWorthLiability, "id">) => void;
  deleteLiability: (id: string) => void;

  addSubscription: (sub: Omit<SubscriptionRecord, "id">) => void;
  deleteSubscription: (id: string) => void;
  toggleSubscriptionPause: (id: string) => void;

  updateSettings: (settings: Partial<SettingsRecord>) => void;
}

const INITIAL_ACCOUNTS: AccountRecord[] = [
  { id: "acc-1", name: "BCA Utama", type: "BANK", balance: 12500000, color: "#0056a4" },
  { id: "acc-2", name: "Mandiri Tabungan", type: "BANK", balance: 4200000, color: "#003d79" },
  { id: "acc-3", name: "Dompet Tunai", type: "CASH", balance: 950000, color: "#10b981" },
  { id: "acc-4", name: "GoPay", type: "E_WALLET", balance: 500000, color: "#06b6d4" },
  { id: "acc-5", name: "OVO", type: "E_WALLET", balance: 300000, color: "#8b5cf6" },
];

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "tx-1",
    title: "Makan Siang Restoran Padang",
    amount: 85000,
    date: new Date().toISOString().split("T")[0],
    transactionType: "EXPENSE",
    accountId: "acc-1",
    accountName: "BCA Utama",
    categoryId: "cat-exp-1",
    categoryName: "Makanan & Minuman",
    merchant: "Resto Sederhana",
  },
  {
    id: "tx-2",
    title: "Transfer Saldo BCA ke GoPay",
    amount: 350000,
    date: new Date().toISOString().split("T")[0],
    transactionType: "TRANSFER",
    accountId: "acc-1",
    accountName: "BCA Utama",
    toAccountId: "acc-4",
    toAccountName: "GoPay",
    categoryId: "cat-trf-1",
    categoryName: "Transfer Antar Rekening",
  },
  {
    id: "tx-3",
    title: "Gaji Bulanan Proyek Client",
    amount: 8500000,
    date: "2026-08-05",
    transactionType: "INCOME",
    accountId: "acc-1",
    accountName: "BCA Utama",
    categoryId: "cat-inc-1",
    categoryName: "Gaji Utama",
  },
  {
    id: "tx-4",
    title: "Tagihan Internet WiFi",
    amount: 300000,
    date: "2026-08-01",
    transactionType: "EXPENSE",
    accountId: "acc-1",
    accountName: "BCA Utama",
    categoryId: "cat-exp-4",
    categoryName: "Internet, Listrik & Tagihan",
    merchant: "IndiHome",
  },
];

const INITIAL_BUDGETS: BudgetRecord[] = [
  { id: "b-1", categoryName: "Makanan & Minuman", categoryColor: "#3b82f6", budgetAmount: 2000000, spentAmount: 1478985 },
  { id: "b-2", categoryName: "Tempat Tinggal", categoryColor: "#10b981", budgetAmount: 1000000, spentAmount: 800000 },
  { id: "b-3", categoryName: "Transportasi", categoryColor: "#f59e0b", budgetAmount: 750000, spentAmount: 700000 },
  { id: "b-4", categoryName: "Internet", categoryColor: "#8b5cf6", budgetAmount: 350000, spentAmount: 300000 },
  { id: "b-5", categoryName: "Hiburan", categoryColor: "#ec4899", budgetAmount: 500000, spentAmount: 600000 },
];

const INITIAL_GOALS: GoalRecord[] = [
  { id: "g-1", name: "Dana Darurat (6 Bulan)", targetAmount: 30000000, currentSaved: 18500000, targetDate: "31 Des 2026", color: "#10b981" },
  { id: "g-2", name: "Liburan Akhir Tahun Bali", targetAmount: 7500000, currentSaved: 5000000, targetDate: "15 Nov 2026", color: "#06b6d4" },
  { id: "g-3", name: "Upgrade Laptop Kerja M3 Pro", targetAmount: 25000000, currentSaved: 25000000, targetDate: "01 Ags 2026", color: "#8b5cf6" },
];

const INITIAL_ASSETS: NetWorthAsset[] = [
  { id: "a-1", name: "BCA Utama", type: "Bank", amount: 12500000, color: "#0056a4" },
  { id: "a-2", name: "Mandiri Tabungan", type: "Bank", amount: 4200000, color: "#003d79" },
  { id: "a-3", name: "Dompet Tunai", type: "Tunai", amount: 950000, color: "#10b981" },
  { id: "a-4", name: "E-Wallet (GoPay & OVO)", type: "E-Wallet", amount: 800000, color: "#06b6d4" },
  { id: "a-5", name: "Investasi Reksa Dana", type: "Investasi", amount: 6500000, color: "#8b5cf6" },
];

const INITIAL_LIABILITIES: NetWorthLiability[] = [
  { id: "l-1", name: "Cicilan Kartu Kredit", amount: 4500000, dueDate: "20 Ags 2026" },
  { id: "l-2", name: "Pinjaman Teman", amount: 2000000, dueDate: "01 Sep 2026" },
];

const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [
  { id: "s-1", name: "Netflix Premium 4K", amount: 186000, cycle: "Bulanan", nextDate: "2026-08-20", category: "Hiburan", isPaused: false },
  { id: "s-2", name: "Spotify Family", amount: 79900, cycle: "Bulanan", nextDate: "2026-08-15", category: "Hiburan", isPaused: false },
  { id: "s-3", name: "iCloud+ 200GB", amount: 45000, cycle: "Bulanan", nextDate: "2026-08-25", category: "Cloud Storage", isPaused: false },
];

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: INITIAL_TRANSACTIONS,
      accounts: INITIAL_ACCOUNTS,
      budgets: INITIAL_BUDGETS,
      goals: INITIAL_GOALS,
      assets: INITIAL_ASSETS,
      liabilities: INITIAL_LIABILITIES,
      subscriptions: INITIAL_SUBSCRIPTIONS,
      settings: { name: "Demo User", email: "demo@financetracker.id", timezone: "Asia/Jakarta", currency: "IDR" },

      addTransaction: (txData) => {
        const newTx: TransactionRecord = { ...txData, id: `tx-${Date.now()}` };
        set((state) => {
          const updatedAccounts = state.accounts.map((acc) => {
            if (txData.transactionType === "EXPENSE" && acc.id === txData.accountId) return { ...acc, balance: acc.balance - txData.amount };
            if (txData.transactionType === "INCOME" && acc.id === txData.accountId) return { ...acc, balance: acc.balance + txData.amount };
            if (txData.transactionType === "TRANSFER") {
              if (acc.id === txData.accountId) return { ...acc, balance: acc.balance - txData.amount };
              if (acc.id === txData.toAccountId) return { ...acc, balance: acc.balance + txData.amount };
            }
            return acc;
          });
          return { transactions: [newTx, ...state.transactions], accounts: updatedAccounts };
        });
      },

      deleteTransaction: (id) => {
        const state = get();
        const deleted = state.transactions.find((t) => t.id === id);
        if (!deleted) return undefined;
        set({
          transactions: state.transactions.filter((t) => t.id !== id),
          accounts: state.accounts.map((acc) => {
            if (deleted.transactionType === "EXPENSE" && acc.id === deleted.accountId) return { ...acc, balance: acc.balance + deleted.amount };
            if (deleted.transactionType === "INCOME" && acc.id === deleted.accountId) return { ...acc, balance: acc.balance - deleted.amount };
            if (deleted.transactionType === "TRANSFER") {
              if (acc.id === deleted.accountId) return { ...acc, balance: acc.balance + deleted.amount };
              if (acc.id === deleted.toAccountId) return { ...acc, balance: acc.balance - deleted.amount };
            }
            return acc;
          }),
        });
        return deleted;
      },

      restoreTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),

      addAccount: (accData) => {
        const newAcc: AccountRecord = { ...accData, id: `acc-${Date.now()}` };
        set((state) => ({ accounts: [...state.accounts, newAcc] }));
      },

      deleteAccount: (id) => set((state) => ({ accounts: state.accounts.filter((a) => a.id !== id) })),

      updateBudget: (id, budgetAmount) => set((state) => ({
        budgets: state.budgets.map((b) => b.id === id ? { ...b, budgetAmount } : b),
      })),

      setBudgets: (budgets) => set({ budgets }),

      addGoal: (goalData) => {
        const newGoal: GoalRecord = { ...goalData, id: `g-${Date.now()}` };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      deleteGoal: (id) => set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

      contributeToGoal: (id, amount) => set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, currentSaved: g.currentSaved + amount } : g),
      })),

      addAsset: (assetData) => {
        const newAsset: NetWorthAsset = { ...assetData, id: `a-${Date.now()}` };
        set((state) => ({ assets: [...state.assets, newAsset] }));
      },

      deleteAsset: (id) => set((state) => ({ assets: state.assets.filter((a) => a.id !== id) })),

      addLiability: (liabilityData) => {
        const newLiability: NetWorthLiability = { ...liabilityData, id: `l-${Date.now()}` };
        set((state) => ({ liabilities: [...state.liabilities, newLiability] }));
      },

      deleteLiability: (id) => set((state) => ({ liabilities: state.liabilities.filter((l) => l.id !== id) })),

      addSubscription: (subData) => {
        const newSub: SubscriptionRecord = { ...subData, id: `s-${Date.now()}` };
        set((state) => ({ subscriptions: [...state.subscriptions, newSub] }));
      },

      deleteSubscription: (id) => set((state) => ({ subscriptions: state.subscriptions.filter((s) => s.id !== id) })),

      toggleSubscriptionPause: (id) => set((state) => ({
        subscriptions: state.subscriptions.map((s) => s.id === id ? { ...s, isPaused: !s.isPaused } : s),
      })),

      updateSettings: (partial) => set((state) => ({ settings: { ...state.settings, ...partial } })),
    }),
    { name: "finance-tracker-tx-store" }
  )
);
