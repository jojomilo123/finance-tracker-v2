import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import { Wallet, Building2, Smartphone, CreditCard, Landmark, Star } from "lucide-react";
import { AccountType } from "@prisma/client";

interface AccountCardProps {
  name: string;
  accountType: AccountType;
  balance: number;
  color?: string;
  isDefault?: boolean;
  onEdit?: () => void;
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
  className,
}: AccountCardProps) {
  const Icon = ACCOUNT_ICON_MAP[accountType] || Wallet;

  return (
    <Card
      onClick={onEdit}
      className={cn(
        "cursor-pointer hover:border-primary/40 transition-all duration-200 group relative overflow-hidden",
        className
      )}
    >
      <div
        className="absolute top-0 left-0 bottom-0 w-1.5"
        style={{ backgroundColor: color }}
      />
      <CardContent className="p-5 pl-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div
              className="p-2 rounded-xl text-white"
              style={{ backgroundColor: color }}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">
                {name}
              </h4>
              <span className="text-[11px] text-muted-foreground uppercase font-mono">
                {accountType.replace("_", " ")}
              </span>
            </div>
          </div>
          {isDefault && (
            <Badge variant="outline" className="gap-1 text-[10px]">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Utama
            </Badge>
          )}
        </div>

        <div className="pt-1">
          <p className="text-xs text-muted-foreground">Saldo Saat Ini</p>
          <p className="text-xl font-bold tracking-tight">
            {formatCurrency(balance)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
