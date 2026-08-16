-- =========================================================================
-- FINANCE TRACKER - SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- =========================================================================

-- 1. USER TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_transactions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date TEXT NOT NULL,
    transaction_type TEXT NOT NULL,
    account_id TEXT NOT NULL,
    account_name TEXT NOT NULL,
    to_account_id TEXT,
    to_account_name TEXT,
    category_id TEXT NOT NULL,
    category_name TEXT NOT NULL,
    merchant TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.user_accounts (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance NUMERIC NOT NULL DEFAULT 0,
    color TEXT,
    icon TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER BUDGETS TABLE
CREATE TABLE IF NOT EXISTS public.user_budgets (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL,
    category_color TEXT,
    budget_amount NUMERIC NOT NULL DEFAULT 0,
    spent_amount NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER GOALS TABLE
CREATE TABLE IF NOT EXISTS public.user_goals (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount NUMERIC NOT NULL,
    current_saved NUMERIC NOT NULL DEFAULT 0,
    target_date TEXT NOT NULL,
    color TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.user_assets (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    color TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USER LIABILITIES TABLE
CREATE TABLE IF NOT EXISTS public.user_liabilities (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    due_date TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USER SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    cycle TEXT NOT NULL,
    next_date TEXT NOT NULL,
    category TEXT NOT NULL,
    is_paused BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. USER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    currency TEXT NOT NULL DEFAULT 'IDR',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- Ensures no public/unauthenticated access to financial data
-- =========================================================================

ALTER TABLE public.user_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- STRICT RLS POLICIES (AUTHENTICATED OWNER ONLY)
-- =========================================================================

CREATE POLICY "Owner All Access - Transactions" ON public.user_transactions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner All Access - Accounts" ON public.user_accounts
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner All Access - Budgets" ON public.user_budgets
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner All Access - Goals" ON public.user_goals
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner All Access - Assets" ON public.user_assets
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner All Access - Liabilities" ON public.user_liabilities
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner All Access - Subscriptions" ON public.user_subscriptions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner All Access - Settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Enable Realtime publication for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_budgets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_assets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_liabilities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_settings;
