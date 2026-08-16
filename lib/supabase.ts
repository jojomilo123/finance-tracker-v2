import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseCredentials() {
  if (typeof window === "undefined") {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    };
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || localStorage.getItem("supabase_url") || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || localStorage.getItem("supabase_anon_key") || "";
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key);
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  supabaseInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  return supabaseInstance;
}

export function setSupabaseCredentials(url: string, key: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("supabase_url", url.trim());
    localStorage.setItem("supabase_anon_key", key.trim());
    supabaseInstance = null;
  }
}

export const supabase = getSupabase();
