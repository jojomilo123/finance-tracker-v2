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

-- Ensure id column is TEXT type
ALTER TABLE public.user_transactions ALTER COLUMN id TYPE TEXT;

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
    target_amount NUMERIC NOT NULL DEFAULT 0,
    current_saved NUMERIC NOT NULL DEFAULT 0,
    target_date TEXT,
    color TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.user_assets (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    value NUMERIC NOT NULL DEFAULT 0,
    growth_rate NUMERIC DEFAULT 0,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USER LIABILITIES TABLE
CREATE TABLE IF NOT EXISTS public.user_liabilities (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    interest_rate NUMERIC DEFAULT 0,
    monthly_payment NUMERIC DEFAULT 0,
    due_date TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USER SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cost NUMERIC NOT NULL DEFAULT 0,
    billing_cycle TEXT NOT NULL DEFAULT 'MONTHLY',
    category TEXT NOT NULL,
    next_billing_date TEXT,
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
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. USER EDITOR LOCK TABLE (1 ACTIVE EDITOR LOCK PER USER)
CREATE TABLE IF NOT EXISTS public.user_editor_lock (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    device_name TEXT,
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
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
ALTER TABLE public.user_editor_lock ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- STRICT RLS POLICIES (AUTHENTICATED OWNER ONLY - IDEMPOTENT)
-- =========================================================================

DROP POLICY IF EXISTS "Owner All Access - Transactions" ON public.user_transactions;
CREATE POLICY "Owner All Access - Transactions" ON public.user_transactions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner All Access - Accounts" ON public.user_accounts;
CREATE POLICY "Owner All Access - Accounts" ON public.user_accounts
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner All Access - Budgets" ON public.user_budgets;
CREATE POLICY "Owner All Access - Budgets" ON public.user_budgets
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner All Access - Goals" ON public.user_goals;
CREATE POLICY "Owner All Access - Goals" ON public.user_goals
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner All Access - Assets" ON public.user_assets;
CREATE POLICY "Owner All Access - Assets" ON public.user_assets
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner All Access - Liabilities" ON public.user_liabilities;
CREATE POLICY "Owner All Access - Liabilities" ON public.user_liabilities
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner All Access - Subscriptions" ON public.user_subscriptions;
CREATE POLICY "Owner All Access - Subscriptions" ON public.user_subscriptions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner All Access - Settings" ON public.user_settings;
CREATE POLICY "Owner All Access - Settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner All Access - Editor Lock" ON public.user_editor_lock;
CREATE POLICY "Owner All Access - Editor Lock" ON public.user_editor_lock
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Enable Realtime publication for tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_transactions') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_transactions;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_accounts') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_accounts;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_budgets') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_budgets;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_goals') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_goals;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_assets') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_assets;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_liabilities') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_liabilities;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_subscriptions') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_subscriptions;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_settings') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_settings;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_editor_lock') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_editor_lock;
    END IF;
END $$;
