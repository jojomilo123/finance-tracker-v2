import { supabase, isSupabaseConfigured } from "./supabase";
import {
  useTransactionStore,
  TransactionRecord,
  AccountRecord,
  BudgetRecord,
  GoalRecord,
  NetWorthAsset,
  NetWorthLiability,
  SubscriptionRecord,
  SettingsRecord,
} from "@/stores/use-transaction-store";

let isSubscribed = false;

export async function initRealtimeSync() {
  if (!isSupabaseConfigured || !supabase || isSubscribed) return;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  isSubscribed = true;

  // Listen to network status changes
  if (typeof window !== "undefined") {
    window.addEventListener("online", handleOnlineSync);
  }

  // Subscribe to Realtime DB events for this user
  supabase
    .channel("finance-tracker-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "user_transactions" }, (payload: any) => {
      handleTransactionRealtime(payload);
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "user_accounts" }, () => pullRemoteAccounts())
    .on("postgres_changes", { event: "*", schema: "public", table: "user_budgets" }, () => pullRemoteBudgets())
    .on("postgres_changes", { event: "*", schema: "public", table: "user_goals" }, () => pullRemoteGoals())
    .on("postgres_changes", { event: "*", schema: "public", table: "user_settings" }, () => pullRemoteSettings())
    .subscribe();

  // Initial sync pull & seed
  await pullAllRemoteData();
}

async function handleOnlineSync() {
  if (!isSupabaseConfigured || !supabase) return;
  await pullAllRemoteData();
}

function handleTransactionRealtime(payload: any) {
  const store = useTransactionStore.getState();
  if (payload.eventType === "INSERT") {
    const newTx = mapRowToTransaction(payload.new);
    if (!store.transactions.some((t) => t.id === newTx.id)) {
      useTransactionStore.setState((state) => ({
        transactions: [newTx, ...state.transactions],
      }));
    }
  } else if (payload.eventType === "DELETE") {
    const deletedId = payload.old.id;
    useTransactionStore.setState((state) => ({
      transactions: state.transactions.filter((t) => t.id !== deletedId),
    }));
  } else if (payload.eventType === "UPDATE") {
    const updatedTx = mapRowToTransaction(payload.new);
    useTransactionStore.setState((state) => ({
      transactions: state.transactions.map((t) => (t.id === updatedTx.id ? updatedTx : t)),
    }));
  }
}

export async function pushTransactionToRemote(tx: TransactionRecord) {
  if (!isSupabaseConfigured || !supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  await supabase.from("user_transactions").upsert({
    id: tx.id,
    user_id: session.user.id,
    title: tx.title,
    amount: tx.amount,
    date: tx.date,
    transaction_type: tx.transactionType,
    account_id: tx.accountId,
    account_name: tx.accountName,
    to_account_id: tx.toAccountId || null,
    to_account_name: tx.toAccountName || null,
    category_id: tx.categoryId,
    category_name: tx.categoryName,
    merchant: tx.merchant || null,
    note: tx.note || null,
    updated_at: new Date().toISOString(),
  });
}

export async function deleteTransactionFromRemote(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  await supabase.from("user_transactions").delete().eq("id", id).eq("user_id", session.user.id);
}

export async function pushSettingsToRemote(settings: SettingsRecord) {
  if (!isSupabaseConfigured || !supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  await supabase.from("user_settings").upsert({
    user_id: session.user.id,
    name: settings.name,
    email: settings.email,
    timezone: settings.timezone,
    currency: settings.currency,
    updated_at: new Date().toISOString(),
  });
}

export async function pushAccountToRemote(acc: AccountRecord) {
  if (!isSupabaseConfigured || !supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  await supabase.from("user_accounts").upsert({
    id: acc.id,
    user_id: session.user.id,
    name: acc.name,
    type: acc.type,
    balance: acc.balance,
    color: acc.color || null,
    icon: acc.icon || null,
    updated_at: new Date().toISOString(),
  });
}

export async function pullAllRemoteData() {
  if (!isSupabaseConfigured || !supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  // 1. Transactions
  const { data: remoteTx } = await supabase
    .from("user_transactions")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (remoteTx && remoteTx.length > 0) {
    const mapped = remoteTx.map(mapRowToTransaction);
    useTransactionStore.setState({ transactions: mapped });
  } else {
    // If remote DB has no transactions yet, seed existing local transactions to remote
    const localStore = useTransactionStore.getState();
    if (localStore.transactions.length > 0) {
      for (const t of localStore.transactions) {
        await pushTransactionToRemote(t);
      }
    }
  }

  await Promise.all([
    pullRemoteAccounts(),
    pullRemoteBudgets(),
    pullRemoteGoals(),
    pullRemoteSettings(),
  ]);
}

async function pullRemoteAccounts() {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data } = await supabase.from("user_accounts").select("*").eq("user_id", session.user.id);
  if (data && data.length > 0) {
    const accounts: AccountRecord[] = data.map((r: any) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      balance: Number(r.balance),
      color: r.color,
      icon: r.icon,
    }));
    useTransactionStore.setState({ accounts });
  }
}

async function pullRemoteBudgets() {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data } = await supabase.from("user_budgets").select("*").eq("user_id", session.user.id);
  if (data && data.length > 0) {
    const budgets: BudgetRecord[] = data.map((r: any) => ({
      id: r.id,
      categoryName: r.category_name,
      categoryColor: r.category_color,
      budgetAmount: Number(r.budget_amount),
      spentAmount: Number(r.spent_amount),
    }));
    useTransactionStore.setState({ budgets });
  }
}

async function pullRemoteGoals() {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data } = await supabase.from("user_goals").select("*").eq("user_id", session.user.id);
  if (data && data.length > 0) {
    const goals: GoalRecord[] = data.map((r: any) => ({
      id: r.id,
      name: r.name,
      targetAmount: Number(r.target_amount),
      currentSaved: Number(r.current_saved),
      targetDate: r.target_date,
      color: r.color,
    }));
    useTransactionStore.setState({ goals });
  }
}

async function pullRemoteSettings() {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data } = await supabase.from("user_settings").select("*").eq("user_id", session.user.id).single();
  if (data) {
    const settings: SettingsRecord = {
      name: data.name,
      email: data.email,
      timezone: data.timezone,
      currency: data.currency,
    };
    useTransactionStore.setState({ settings });
  } else {
    // Seed local settings to remote
    const localStore = useTransactionStore.getState();
    await pushSettingsToRemote(localStore.settings);
  }
}

function mapRowToTransaction(r: any): TransactionRecord {
  return {
    id: r.id,
    title: r.title,
    amount: Number(r.amount),
    date: r.date,
    transactionType: r.transaction_type,
    accountId: r.account_id,
    accountName: r.account_name,
    toAccountId: r.to_account_id,
    toAccountName: r.to_account_name,
    categoryId: r.category_id,
    categoryName: r.category_name,
    merchant: r.merchant,
    note: r.note,
  };
}
