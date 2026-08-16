"use client";

import * as React from "react";
import { Plus, Edit3, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTransactionStore } from "@/stores/use-transaction-store";

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenQuickAdd?: () => void;
}

export function Navbar({ onOpenSearch, onOpenQuickAdd }: NavbarProps) {
  const { settings, appMode, setAppMode } = useTransactionStore();

  // Generate initials from name (up to 2 chars)
  const initials = settings.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "LU";

  const isViewer = appMode === "VIEWER";

  return (
    <header className="flex h-14 w-full items-center justify-between rounded-2xl border border-white/10 bg-[#0D1420]/80 px-5 backdrop-blur-md shadow-sm">
      {/* Title & Mode Indicator */}
      <div className="flex items-center space-x-2.5">
        <span className="text-xs font-semibold text-[#AAB5C5] hidden sm:inline">Personal Workspace</span>
        <span className="text-xs text-[#AAB5C5]/40 hidden sm:inline">•</span>

        {isViewer ? (
          <button
            onClick={() => setAppMode("UNSELECTED")}
            title="Klik untuk ganti mode (Editor / Viewer)"
            className="flex items-center space-x-1"
          >
            <Badge variant="outline" className="px-2.5 py-1 text-[11px] border-white/10 text-[#AAB5C5] bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
              <Eye className="h-3 w-3 mr-1 text-[#AAB5C5]" /> Viewer Mode
            </Badge>
          </button>
        ) : (
          <button
            onClick={() => setAppMode("UNSELECTED")}
            title="Klik untuk ganti mode (Editor / Viewer)"
            className="flex items-center space-x-1"
          >
            <Badge variant="outline" className="px-2.5 py-1 text-[11px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10 cursor-pointer hover:bg-emerald-500/20 transition-colors">
              <Edit3 className="h-3 w-3 mr-1 text-emerald-400" /> Editor Mode
            </Badge>
          </button>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Add Button - Only available in Editor mode */}
        {!isViewer && (
          <Button
            onClick={onOpenQuickAdd}
            size="sm"
            className="rounded-xl bg-[#10b981] hover:bg-[#10b981]/90 text-white font-medium text-xs flex items-center space-x-1 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tambah Transaksi</span>
          </Button>
        )}

        {/* Workspace Badge */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 border border-white/10">
            <AvatarFallback className="text-xs font-bold bg-[#10b981]/20 text-[#10b981]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block text-xs font-medium text-white/90">{settings.name}</span>
        </div>
      </div>
    </header>
  );
}
