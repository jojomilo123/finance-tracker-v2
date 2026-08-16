import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import { Wallet, Building2, Smartphone, CreditCard, Landmark, Star, Pencil, Trash2 } from "lucide-react";
import { AccountType } from "@prisma/client";

interface AccountCardProps {
  name: string;
  accountType: AccountType;
  balance: number;
  color?: string;
  isDefault?: boolean;
  onEdit?: () => void;
  onEditBalance?: () => void;
  onDelete?: () => void;
  className?: string;
}

const ACCOUNT_ICON_MAP: Record<AccountType, React.ElementType> = {
  CASH: Wallet,
  BANK: Building2,
  E_WALLET: Smartphone,
  CREDIT_CARD: CreditCard,
  INVESTMENT: Landmark,
};

export function AccountCard({
  name,
  accountType,
  balance,
  color = "#3b82f6",
  isDefault,
  onEdit,
  onEditBalance,
  onDelete,
  className,
}: AccountCardProps) {
  const Icon = ACCOUNT_ICON_MAP[accountType] || Wallet;

  return (
    <Card
      className={cn(
        "rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-200 group relative overflow-hidden bg-[#0D1420]",
        className
      )}
    >
      <div
        className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl"
        style={{ backgroundColor: color }}
      />
      <CardContent className="p-5 pl-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div
              className="p-2 rounded-xl text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold group-hover:text-primary transition-colors flex items-center gap-1.5">
                {name}
              </h4>
              <span className="text-[11px] text-muted-foreground uppercase font-mono">
                {accountType.replace("_", " ")}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            {isDefault && (
              <Badge variant="outline" className="gap-1 text-[10px] bg-primary/5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Utama
              </Badge>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Kustomisasi / Edit Akun"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                title="Hapus Akun"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="pt-1 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Saldo Saat Ini</p>
            <p className="text-xl font-bold tracking-tight">
              {formatCurrency(balance)}
            </p>
          </div>
          {onEditBalance && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditBalance();
              }}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1 pb-1 transition-all"
              title="Edit Saldo Langsung"
            >
              <Pencil className="h-3 w-3" /> Edit Saldo
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
