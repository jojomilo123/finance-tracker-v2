import * as React from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Trash2,
  Paperclip,
  Tag as TagIcon,
  Store,
} from "lucide-react";
import { TransactionType } from "@prisma/client";

export interface TransactionItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  transactionType: TransactionType;
  accountName: string;
  toAccountName?: string;
  categoryName: string;
  merchant?: string;
  hasAttachment?: boolean;
}

interface TransactionTimelineProps {
  items: TransactionItem[];
  onDelete?: (id: string, title: string) => void;
  onSelect?: (item: TransactionItem) => void;
}

export function TransactionTimeline({
  items,
  onDelete,
  onSelect,
}: TransactionTimelineProps) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground text-xs">
        Tidak ada transaksi yang ditemukan untuk kriteria filter ini.
      </div>
    );
  }

  // Group by date
  const groups = items.reduce<Record<string, TransactionItem[]>>((acc, item) => {
    const d = item.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([dateStr, groupItems]) => {
        const dayTotalExpense = groupItems
          .filter((i) => i.transactionType === "EXPENSE")
          .reduce((sum, i) => sum + i.amount, 0);

        const dayTotalIncome = groupItems
          .filter((i) => i.transactionType === "INCOME")
          .reduce((sum, i) => sum + i.amount, 0);

        return (
          <div key={dateStr} className="space-y-2">
            {/* Timeline Header */}
            <div className="flex items-center justify-between px-2 py-1 bg-muted/30 rounded-lg text-xs">
              <span className="font-semibold text-foreground">{dateStr}</span>
              <div className="flex space-x-3 font-mono">
                {dayTotalIncome > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    +{formatCurrency(dayTotalIncome)}
                  </span>
                )}
                {dayTotalExpense > 0 && (
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    -{formatCurrency(dayTotalExpense)}
                  </span>
                )}
              </div>
            </div>

            {/* Group Items List */}
            <div className="space-y-2">
              {groupItems.map((item) => {
                const isIncome = item.transactionType === "INCOME";
                const isExpense = item.transactionType === "EXPENSE";
                const isTransfer = item.transactionType === "TRANSFER";

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelect && onSelect(item)}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          "p-2.5 rounded-xl shrink-0",
                          isIncome && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                          isExpense && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                          isTransfer && "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        )}
                      >
                        {isIncome && <TrendingUp className="h-4 w-4" />}
                        {isExpense && <TrendingDown className="h-4 w-4" />}
                        {isTransfer && <ArrowLeftRight className="h-4 w-4" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          {item.hasAttachment && (
                            <Paperclip className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                            {item.categoryName}
                          </Badge>
                          <span>•</span>
                          <span>{item.accountName}</span>
                          {isTransfer && item.toAccountName && (
                            <>
                              <span>➔</span>
                              <span>{item.toAccountName}</span>
                            </>
                          )}
                          {item.merchant && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Store className="h-3 w-3" /> {item.merchant}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={cn(
                          "text-sm font-bold font-mono",
                          isIncome && "text-emerald-600 dark:text-emerald-400",
                          isExpense && "text-rose-600 dark:text-rose-400",
                          isTransfer && "text-blue-600 dark:text-blue-400"
                        )}
                      >
                        {isIncome ? "+" : isExpense ? "-" : ""}
                        {formatCurrency(item.amount)}
                      </span>

                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id, item.title);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
