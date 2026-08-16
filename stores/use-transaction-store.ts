import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  pushTransactionToRemote,
  deleteTransactionFromRemote,
  pushSettingsToRemote,
  pushAccountToRemote,
  deleteAccountFromRemote,
  pushBudgetToRemote,
  pushGoalToRemote,
  clearRemoteData,
} from "@/lib/sync-engine";

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
  avatarUrl?: string;
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
  sidebarCollapsed: boolean;
  appMode: "UNSELECTED" | "EDITOR" | "VIEWER";
  activeEditorLock: { userId: string; deviceId: string; deviceName: string; lastHeartbeat: string } | null;

  setAppMode: (mode: "UNSELECTED" | "EDITOR" | "VIEWER") => void;
  setActiveEditorLock: (lock: { userId: string; deviceId: string; deviceName: string; lastHeartbeat: string } | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addTransaction: (tx: Omit<TransactionRecord, "id">) => void;
  deleteTransaction: (id: string) => TransactionRecord | undefined;
  restoreTransaction: (tx: TransactionRecord) => void;

  addAccount: (acc: Omit<AccountRecord, "id">) => void;
  updateAccount: (id: string, accData: Partial<AccountRecord>) => void;
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
  resetStore: () => void;
}

const INITIAL_ACCOUNTS: AccountRecord[] = [
  { id: "acc-1", name: "BCA Utama", type: "BANK", balance: 0, color: "#0056a4" },
];

const INITIAL_TRANSACTIONS: TransactionRecord[] = [];

const INITIAL_BUDGETS: BudgetRecord[] = [
  { id: "b-1", categoryName: "Makanan & Minuman", categoryColor: "#3b82f6", budgetAmount: 2000000, spentAmount: 0 },
  { id: "b-2", categoryName: "Tempat Tinggal", categoryColor: "#10b981", budgetAmount: 1000000, spentAmount: 0 },
  { id: "b-3", categoryName: "Transportasi", categoryColor: "#f59e0b", budgetAmount: 750000, spentAmount: 0 },
  { id: "b-4", categoryName: "Internet", categoryColor: "#8b5cf6", budgetAmount: 350000, spentAmount: 0 },
  { id: "b-5", categoryName: "Hiburan", categoryColor: "#ec4899", budgetAmount: 500000, spentAmount: 0 },
];

const INITIAL_GOALS: GoalRecord[] = [
  { id: "g-1", name: "Dana Darurat (6 Bulan)", targetAmount: 30000000, currentSaved: 0, targetDate: "31 Des 2026", color: "#10b981" },
  { id: "g-2", name: "Liburan Akhir Tahun", targetAmount: 7500000, currentSaved: 0, targetDate: "15 Nov 2026", color: "#06b6d4" },
  { id: "g-3", name: "Upgrade Perangkat Kerja", targetAmount: 25000000, currentSaved: 0, targetDate: "01 Ags 2026", color: "#8b5cf6" },
];

const INITIAL_ASSETS: NetWorthAsset[] = [
  { id: "a-1", name: "BCA Utama", type: "Bank", amount: 0, color: "#0056a4" },
];

const INITIAL_LIABILITIES: NetWorthLiability[] = [];

const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [];

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
      settings: { name: "Pengguna Lokal", email: "user@local.app", timezone: "Asia/Jakarta", currency: "IDR" },
      sidebarCollapsed: false,
      appMode: "UNSELECTED",
      activeEditorLock: null,

      setAppMode: (mode) => set({ appMode: mode }),
      setActiveEditorLock: (lock) => set({ activeEditorLock: lock }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      addTransaction: (txData) => {
        if (get().appMode === "VIEWER") {
          console.warn("Write blocked: Mode Viewer (Read-Only)");
          return;
        }
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
          const updatedBudgets = state.budgets.map((b) => {
            if (txData.transactionType === "EXPENSE" && (b.categoryName === txData.categoryName || b.id === txData.categoryId)) {
              return { ...b, spentAmount: b.spentAmount + txData.amount };
            }
            return b;
          });
          return { transactions: [newTx, ...state.transactions], accounts: updatedAccounts, budgets: updatedBudgets };
        });
        pushTransactionToRemote(newTx).catch(() => {});
      },

      deleteTransaction: (id) => {
        if (get().appMode === "VIEWER") {
          console.warn("Write blocked: Mode Viewer (Read-Only)");
          return undefined;
        }
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
          budgets: state.budgets.map((b) => {
            if (deleted.transactionType === "EXPENSE" && (b.categoryName === deleted.categoryName || b.id === deleted.categoryId)) {
              return { ...b, spentAmount: Math.max(0, b.spentAmount - deleted.amount) };
            }
            return b;
          }),
        });
        deleteTransactionFromRemote(id).catch(() => {});
        return deleted;
      },

      restoreTransaction: (tx) => {
        set((state) => {
          const updatedAccounts = state.accounts.map((acc) => {
            if (tx.transactionType === "EXPENSE" && acc.id === tx.accountId) return { ...acc, balance: acc.balance - tx.amount };
            if (tx.transactionType === "INCOME" && acc.id === tx.accountId) return { ...acc, balance: acc.balance + tx.amount };
            if (tx.transactionType === "TRANSFER") {
              if (acc.id === tx.accountId) return { ...acc, balance: acc.balance - tx.amount };
              if (acc.id === tx.toAccountId) return { ...acc, balance: acc.balance + tx.amount };
            }
            return acc;
          });
          const updatedBudgets = state.budgets.map((b) => {
            if (tx.transactionType === "EXPENSE" && (b.categoryName === tx.categoryName || b.id === tx.categoryId)) {
              return { ...b, spentAmount: b.spentAmount + tx.amount };
            }
            return b;
          });
          return { transactions: [tx, ...state.transactions], accounts: updatedAccounts, budgets: updatedBudgets };
        });
        pushTransactionToRemote(tx).catch(() => {});
      },

      addAccount: (accData) => {
        if (get().appMode === "VIEWER") return;
        const newAcc: AccountRecord = { ...accData, id: `acc-${Date.now()}` };
        set((state) => ({ accounts: [...state.accounts, newAcc] }));
        pushAccountToRemote(newAcc).catch(() => {});
      },

      updateAccount: (id, accData) => {
        if (get().appMode === "VIEWER") return;
        set((state) => {
          const updatedAccounts = state.accounts.map((acc) =>
            acc.id === id ? { ...acc, ...accData } : acc
          );
          const target = updatedAccounts.find((acc) => acc.id === id);
          if (target) {
            pushAccountToRemote(target).catch(() => {});
          }
          const updatedTransactions = accData.name
            ? state.transactions.map((tx) => ({
                ...tx,
                accountName: tx.accountId === id ? accData.name! : tx.accountName,
                toAccountName: tx.toAccountId === id ? accData.name! : tx.toAccountName,
              }))
            : state.transactions;
          return { accounts: updatedAccounts, transactions: updatedTransactions };
        });
      },

      deleteAccount: (id) => {
        if (get().appMode === "VIEWER") return;
        set((state) => ({ accounts: state.accounts.filter((a) => a.id !== id) }));
        deleteAccountFromRemote(id).catch(() => {});
      },

      updateBudget: (id, budgetAmount) => {
        if (get().appMode === "VIEWER") return;
        set((state) => {
          const updated = state.budgets.map((b) => b.id === id ? { ...b, budgetAmount } : b);
          const target = updated.find((b) => b.id === id);
          if (target) pushBudgetToRemote(target).catch(() => {});
          return { budgets: updated };
        });
      },

      setBudgets: (budgets) => {
        set({ budgets });
        for (const b of budgets) {
          pushBudgetToRemote(b).catch(() => {});
        }
      },

      addGoal: (goalData) => {
        const newGoal: GoalRecord = { ...goalData, id: `g-${Date.now()}` };
        set((state) => ({ goals: [...state.goals, newGoal] }));
        pushGoalToRemote(newGoal).catch(() => {});
      },

      deleteGoal: (id) => set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

      contributeToGoal: (id, amount) => {
        set((state) => {
          const updated = state.goals.map((g) => g.id === id ? { ...g, currentSaved: g.currentSaved + amount } : g);
          const target = updated.find((g) => g.id === id);
          if (target) pushGoalToRemote(target).catch(() => {});
          return { goals: updated };
        });
      },

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

      updateSettings: (partial) => {
        set((state) => {
          const updated = { ...state.settings, ...partial };
          pushSettingsToRemote(updated).catch(() => {});
          return { settings: updated };
        });
      },
      resetStore: () => {
        clearRemoteData().catch(() => {});
        const defaultAccounts: AccountRecord[] = [
          { id: "acc-1", name: "BCA Utama", type: "BANK", balance: 0, color: "#0056a4" },
        ];
        set({
          transactions: [],
          accounts: defaultAccounts,
          budgets: INITIAL_BUDGETS.map((b) => ({ ...b, spentAmount: 0 })),
          goals: [],
          assets: [],
          liabilities: [],
          subscriptions: [],
          settings: { name: "Pengguna Lokal", email: "user@local.app", timezone: "Asia/Jakarta", currency: "IDR" },
        });
      },
    }),
    {
      name: "finance-tracker-tx-store",
      partialize: (state) => {
        const { appMode, activeEditorLock, ...rest } = state;
        return rest;
      },
    }
  )
);
