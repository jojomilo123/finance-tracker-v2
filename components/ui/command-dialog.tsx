"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MAIN_NAV_ITEMS } from "@/lib/constants";
import { Search, Plus, ArrowRight } from "lucide-react";

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuickAdd?: () => void;
}

export function CommandDialog({
  open,
  onOpenChange,
  onQuickAdd,
}: CommandDialogProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const filteredNavItems = MAIN_NAV_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectNav = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl">
        <div className="flex items-center px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik perintah atau cari modul..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-12 shadow-none"
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
          {onQuickAdd && (
            <button
              onClick={() => {
                onOpenChange(false);
                onQuickAdd();
              }}
              className="flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-sm hover:bg-primary hover:text-primary-foreground transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span className="font-semibold">Tambah Transaksi Baru</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Navigasi Cepat
          </div>

          {filteredNavItems.length > 0 ? (
            filteredNavItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleSelectNav(item.href)}
                className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-sm text-foreground hover:bg-accent transition-colors"
              >
                <span>{item.title}</span>
                <span className="text-xs text-muted-foreground font-mono">
                  {item.href}
                </span>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Tidak ada hasil yang sesuai dengan `{query}`
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
