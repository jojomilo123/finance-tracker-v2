"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Search, Plus, Moon, User, LogOut, Settings as SettingsIcon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenQuickAdd?: () => void;
}

export function Navbar({ onOpenSearch, onOpenQuickAdd }: NavbarProps) {
  const pathname = usePathname();
  const { toast } = useToast();

  return (
    <header className="flex h-14 w-full items-center justify-between rounded-2xl border border-white/5 bg-[#0D1420]/80 px-5 backdrop-blur-md shadow-sm">
      {/* Title */}
      <div className="flex items-center space-x-2">
        <span className="text-xs font-semibold text-[#AAB5C5]">Personal Workspace</span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-3">
        {/* Quick Add Button */}
        <Button
          onClick={onOpenQuickAdd}
          size="sm"
          className="rounded-xl bg-[#10b981] hover:bg-[#10b981]/90 text-white font-medium text-xs flex items-center space-x-1 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Transaksi</span>
        </Button>

        {/* Theme Toggle Moon Icon */}
        <button
          onClick={() =>
            toast({
              title: "Night Mode Active",
              description: "Tampilan malam alami aktif.",
            })
          }
          className="p-2 rounded-xl border border-white/5 bg-[#121C2A] text-[#AAB5C5] hover:text-white transition-colors"
          aria-label="Night Mode"
        >
          <Moon className="h-4 w-4" />
        </button>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-full ring-offset-background transition-opacity hover:opacity-80 focus:outline-none">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs font-bold bg-[#10b981]/20 text-[#10b981]">
                  FT
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#10b981] ring-2 ring-[#0D1420]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#121C2A] border-white/10 text-white">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Personal User</p>
                <p className="text-xs leading-none text-[#AAB5C5]">
                  workspace@financetracker.id
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
              <User className="mr-2 h-4 w-4" /> Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
              <SettingsIcon className="mr-2 h-4 w-4" /> Pengaturan Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
