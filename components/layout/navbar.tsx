"use client";

import * as React from "react";
import { Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { getSupabase } from "@/lib/supabase";

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenQuickAdd?: () => void;
}

export function Navbar({ onOpenSearch, onOpenQuickAdd }: NavbarProps) {
  const { settings } = useTransactionStore();

  // Generate initials from name (up to 2 chars)
  const initials = settings.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "LU";

  const handleLogout = async () => {
    const client = getSupabase();
    if (client) {
      await client.auth.signOut();
    }
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <header className="flex h-14 w-full items-center justify-between rounded-2xl border border-white/5 bg-[#0D1420]/80 px-5 backdrop-blur-md shadow-sm">
      {/* Title */}
      <div className="flex items-center space-x-2">
        <span className="text-xs font-semibold text-[#AAB5C5]">Personal Workspace</span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Add Button */}
        <Button
          onClick={onOpenQuickAdd}
          size="sm"
          className="rounded-xl bg-[#10b981] hover:bg-[#10b981]/90 text-white font-medium text-xs flex items-center space-x-1 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Transaksi</span>
        </Button>

        {/* Workspace Badge */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 border border-white/10">
            {settings.avatarUrl ? (
              <AvatarImage src={settings.avatarUrl} alt={settings.name} />
            ) : (
              <AvatarFallback className="text-xs font-bold bg-[#10b981]/20 text-[#10b981]">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="hidden md:inline-block text-xs font-medium text-white/90">{settings.name}</span>
        </div>

        {/* Disconnect / Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="rounded-xl border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-2.5 h-8 gap-1 shadow-sm"
          title="Keluar / Disconnect HP/iPad"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
