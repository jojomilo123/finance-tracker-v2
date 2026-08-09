import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  amount: number;
  changePercentage?: number;
  changePeriod?: string;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function SummaryCard({
  title,
  amount,
  changePercentage,
  changePeriod = "dibanding bulan lalu",
  icon: Icon,
  iconColor = "text-primary",
  subtitle,
  trend = "neutral",
  className,
}: SummaryCardProps) {
  const isPositive = changePercentage !== undefined && changePercentage > 0;
  const isNegative = changePercentage !== undefined && changePercentage < 0;

  return (
    <Card className={cn("hover:border-primary/30 transition-all duration-200", className)}>
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          <div className={cn("p-2 rounded-xl bg-muted/60", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-1">
          <div className={`text-2xl font-bold tracking-tight ${amount < 0 ? "text-rose-400" : ""}`}>
            {formatCurrency(amount)}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {changePercentage !== undefined && (
          <div className="flex items-center space-x-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded-md font-medium text-xs",
                isPositive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                isNegative && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                !isPositive && !isNegative && "bg-muted text-muted-foreground"
              )}
            >
              {isPositive && <TrendingUp className="h-3 w-3 mr-1" />}
              {isNegative && <TrendingDown className="h-3 w-3 mr-1" />}
              {!isPositive && !isNegative && <Minus className="h-3 w-3 mr-1" />}
              {Math.abs(changePercentage)}%
            </span>
            <span className="text-muted-foreground">{changePeriod}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
