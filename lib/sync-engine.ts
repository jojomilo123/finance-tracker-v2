import { getSupabase, isSupabaseConfigured } from "./supabase";
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
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client || isSubscribed) return;

  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  isSubscribed = true;

  // Listen to network status changes
  if (typeof window !== "undefined") {
    window.addEventListener("online", handleOnlineSync);
  }

  // Subscribe to Realtime DB events for this user
  client
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
  if (!isSupabaseConfigured()) return;
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
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  const { error } = await client.from("user_transactions").upsert({
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

  if (error) {
    console.error("Supabase Transaction Push Error:", error.message);
  }

  // Also push updated account balances & budgets
  const store = useTransactionStore.getState();
  for (const acc of store.accounts) {
    await pushAccountToRemote(acc);
  }
  for (const b of store.budgets) {
    await pushBudgetToRemote(b);
  }
}

export async function deleteTransactionFromRemote(id: string) {
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  await client.from("user_transactions").delete().eq("id", id).eq("user_id", session.user.id);

  // Sync balances & budgets
  const store = useTransactionStore.getState();
  for (const acc of store.accounts) {
    await pushAccountToRemote(acc);
  }
  for (const b of store.budgets) {
    await pushBudgetToRemote(b);
  }
}

export async function pushSettingsToRemote(settings: SettingsRecord) {
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  await client.from("user_settings").upsert({
    user_id: session.user.id,
    name: settings.name,
    email: settings.email,
    timezone: settings.timezone,
    currency: settings.currency,
    avatar_url: settings.avatarUrl || null,
    updated_at: new Date().toISOString(),
  });
}

export async function pushAccountToRemote(acc: AccountRecord) {
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  await client.from("user_accounts").upsert({
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

export async function pushBudgetToRemote(b: BudgetRecord) {
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  await client.from("user_budgets").upsert({
    id: b.id,
    user_id: session.user.id,
    category_name: b.categoryName,
    category_color: b.categoryColor,
    budget_amount: b.budgetAmount,
    spent_amount: b.spentAmount,
    updated_at: new Date().toISOString(),
  });
}

export async function pushGoalToRemote(g: GoalRecord) {
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  await client.from("user_goals").upsert({
    id: g.id,
    user_id: session.user.id,
    name: g.name,
    target_amount: g.targetAmount,
    current_saved: g.currentSaved,
    target_date: g.targetDate,
    color: g.color || null,
    updated_at: new Date().toISOString(),
  });
}

export async function clearRemoteData() {
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  const uid = session.user.id;
  await Promise.all([
    client.from("user_transactions").delete().eq("user_id", uid),
    client.from("user_accounts").delete().eq("user_id", uid),
    client.from("user_budgets").delete().eq("user_id", uid),
    client.from("user_goals").delete().eq("user_id", uid),
    client.from("user_assets").delete().eq("user_id", uid),
    client.from("user_liabilities").delete().eq("user_id", uid),
    client.from("user_subscriptions").delete().eq("user_id", uid),
    client.from("user_settings").delete().eq("user_id", uid),
  ]);
}

export async function pullAllRemoteData() {
  const client = getSupabase();
  if (!isSupabaseConfigured() || !client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  // 1. Transactions
  const { data: remoteTx } = await client
    .from("user_transactions")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (remoteTx && remoteTx.length > 0) {
    const mapped = remoteTx.map(mapRowToTransaction);
    useTransactionStore.setState({ transactions: mapped });
  } else {
    // Seed existing local transactions to remote if remote DB is empty
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
  const client = getSupabase();
  if (!client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  const { data } = await client.from("user_accounts").select("*").eq("user_id", session.user.id);
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
  } else {
    // Seed local accounts to remote
    const localStore = useTransactionStore.getState();
    for (const acc of localStore.accounts) {
      await pushAccountToRemote(acc);
    }
  }
}

async function pullRemoteBudgets() {
  const client = getSupabase();
  if (!client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  const { data } = await client.from("user_budgets").select("*").eq("user_id", session.user.id);
  if (data && data.length > 0) {
    const budgets: BudgetRecord[] = data.map((r: any) => ({
      id: r.id,
      categoryName: r.category_name,
      categoryColor: r.category_color,
      budgetAmount: Number(r.budget_amount),
      spentAmount: Number(r.spent_amount),
    }));
    useTransactionStore.setState({ budgets });
  } else {
    // Seed local budgets to remote
    const localStore = useTransactionStore.getState();
    for (const b of localStore.budgets) {
      await pushBudgetToRemote(b);
    }
  }
}

async function pullRemoteGoals() {
  const client = getSupabase();
  if (!client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  const { data } = await client.from("user_goals").select("*").eq("user_id", session.user.id);
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
  } else {
    // Seed local goals to remote
    const localStore = useTransactionStore.getState();
    for (const g of localStore.goals) {
      await pushGoalToRemote(g);
    }
  }
}

async function pullRemoteSettings() {
  const client = getSupabase();
  if (!client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  const { data } = await client.from("user_settings").select("*").eq("user_id", session.user.id).single();
  if (data) {
    const settings: SettingsRecord = {
      name: data.name,
      email: data.email,
      timezone: data.timezone,
      currency: data.currency,
      avatarUrl: data.avatar_url || undefined,
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
