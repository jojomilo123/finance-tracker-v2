"use client";

import * as React from "react";
import { getSupabase, isSupabaseConfigured, setSupabaseCredentials, getSupabaseCredentials } from "@/lib/supabase";
import { initRealtimeSync } from "@/lib/sync-engine";
import { Lock, Sparkles, Database, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [showConfigModal, setShowConfigModal] = React.useState(false);

  // Setup credentials state
  const [setupUrl, setSetupUrl] = React.useState("");
  const [setupKey, setSetupKey] = React.useState("");

  // Login credentials state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    const configured = isSupabaseConfigured();
    const client = getSupabase();

    if (!configured || !client) {
      // Pre-fill setup inputs if previously saved
      const current = getSupabaseCredentials();
      setSetupUrl(current.url);
      setSetupKey(current.key);
      setShowConfigModal(true);
      setIsAuthenticated(false);
      return;
    }

    setShowConfigModal(false);

    // Check active session
    client.auth.getSession().then((res: { data: { session: any } }) => {
      if (res.data.session) {
        setIsAuthenticated(true);
        initRealtimeSync();
      } else {
        setIsAuthenticated(false);
      }
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event: string, session: any) => {
      if (session) {
        setIsAuthenticated(true);
        initRealtimeSync();
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSaveSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupUrl || !setupKey) return;

    setSupabaseCredentials(setupUrl, setupKey);
    const client = getSupabase();
    if (client) {
      setShowConfigModal(false);
      client.auth.getSession().then((res: { data: { session: any } }) => {
        if (res.data.session) {
          setIsAuthenticated(true);
          initRealtimeSync();
        } else {
          setIsAuthenticated(false);
        }
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = getSupabase();
    if (!client) {
      setShowConfigModal(true);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isSignUpMode) {
      const { data, error } = await client.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        setIsAuthenticated(true);
        initRealtimeSync();
      } else {
        setSuccessMsg("Akun pemilik berhasil dibuat! Silakan coba login sekarang.");
        setIsSignUpMode(false);
      }
    } else {
      const { error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg("Email atau Kata Sandi salah / belum terdaftar. Pilih tab 'Daftar Akun Pemilik' jika baru pertama kali.");
      }
    }
    setLoading(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#080D16] flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 rounded-2xl bg-white/10 animate-pulse">
            <Sparkles className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">Memuat Finance Tracker...</p>
        </div>
      </div>
    );
  }

  if (showConfigModal || !isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-[#080D16] text-[#F5F7FA] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121C2A] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-400 mb-1 border border-blue-500/20">
              <Database className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Setup Supabase Key</h1>
            <p className="text-xs text-muted-foreground">
              Masukkan Project URL dan Anon Key dari Supabase Dashboard Anda untuk menghubungkan HP & iPad.
            </p>
          </div>

          <form onSubmit={handleSaveSetup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Project URL Supabase</label>
              <Input
                type="url"
                required
                placeholder="https://reacitzacwbaaquwbsf.supabase.co"
                value={setupUrl}
                onChange={(e) => setSetupUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Anon / Publishable Key</label>
              <Input
                type="password"
                required
                placeholder="eyJhbGciOi..."
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-10 font-semibold">
              Simpan & Hubungkan Supabase
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#080D16] text-[#F5F7FA] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121C2A] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-1 border border-emerald-500/20">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Akses Keuangan Pribadi</h1>
            <p className="text-xs text-muted-foreground">
              Masukkan kredensial akun pribadi Anda untuk menghubungkan HP & iPad.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/60">
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                !isSignUpMode ? "bg-card text-emerald-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(true);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                isSignUpMode ? "bg-card text-emerald-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Daftar Akun Pemilik
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Email Pribadi</label>
              <Input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Kata Sandi</label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                {successMsg}
              </div>
            )}

            <Button type="submit" isLoading={loading} className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-xl h-10 font-semibold">
              {isSignUpMode ? "Buat Akun Pemilik Baru" : "Masuk ke Workspace"}
            </Button>

            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="w-full text-center text-[11px] text-muted-foreground hover:text-white pt-2 transition-colors flex items-center justify-center space-x-1"
            >
              <Key className="h-3 w-3" />
              <span>Ubah Key Supabase</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
