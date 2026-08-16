"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import { AlertCircle, TrendingUp, CheckCircle, Flame } from "lucide-react";

interface BudgetCardProps {
  id: string;
  categoryName: string;
  categoryColor?: string;
  budgetAmount: number;
  spentAmount: number;
  onChangeBudget: (newAmount: number) => void;
  className?: string;
}

export function BudgetCard({
  id,
  categoryName,
  categoryColor = "#3b82f6",
  budgetAmount,
  spentAmount,
  onChangeBudget,
  className,
}: BudgetCardProps) {
  const safeBudget = typeof budgetAmount === "number" && !isNaN(budgetAmount) ? Math.max(0, budgetAmount) : 0;
  const safeSpent = typeof spentAmount === "number" && !isNaN(spentAmount) ? Math.max(0, spentAmount) : 0;
  const percentage = safeBudget > 0 ? Math.round((safeSpent / safeBudget) * 100) : 0;
  const remaining = safeBudget - safeSpent;
  const isOverBudget = safeSpent > safeBudget && safeBudget > 0;
  const isNearLimit = percentage >= 85 && percentage <= 100;

  // Forecast projection
  const currentDay = new Date().getDate();
  const daysInMonth = 31;
  const dailyAvg = currentDay > 0 ? spentAmount / currentDay : 0;
  const projectedEndMonth = Math.round(dailyAvg * daysInMonth);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onChangeBudget(val);
  };

  return (
    <Card
      className={cn(
        "hover:border-primary/40 transition-all duration-200 relative overflow-hidden",
        isOverBudget && "border-red-500/40 bg-red-500/5",
        className
      )}
    >
      <div
        className="absolute top-0 left-0 bottom-0 w-1.5"
        style={{ backgroundColor: categoryColor }}
      />

      <CardContent className="p-5 pl-6 space-y-4">
        {/* Category Header & Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            <h4 className="text-sm font-bold text-foreground">{categoryName}</h4>
          </div>

          {isOverBudget && (
            <Badge variant="destructive" className="gap-1 text-[10px]">
              <Flame className="h-3 w-3" /> Melebihi Anggaran
            </Badge>
          )}
          {isNearLimit && (
            <Badge variant="warning" className="gap-1 text-[10px]">
              <AlertCircle className="h-3 w-3" /> Hampir Batas (85%+)
            </Badge>
          )}
          {!isOverBudget && !isNearLimit && (
            <Badge variant="success" className="gap-1 text-[10px]">
              <CheckCircle className="h-3 w-3" /> Aman
            </Badge>
          )}
        </div>

        {/* Spending vs Budget Amounts */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground">Terpakai</span>
            <p className="text-lg font-bold font-mono text-foreground">
              {formatCurrency(spentAmount)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-muted-foreground">Sisa Anggaran</span>
            <p
              className={cn(
                "text-lg font-bold font-mono",
                remaining >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {remaining < 0 ? `-` : ``}
              {formatCurrency(Math.abs(remaining))}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
            <span>{percentage}% terpakai</span>
            <span>Target: {formatCurrency(budgetAmount)}</span>
          </div>
          <Progress value={percentage} autoColor />
        </div>

        {/* Budget Slider Controls */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Atur Anggaran (Slider)</span>
            <span className="font-mono text-primary">{formatCurrency(budgetAmount)}</span>
          </div>

          <input
            type="range"
            min={0}
            max={5000000}
            step={50000}
            value={Math.min(budgetAmount, 5000000)}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />

          {/* Precise Currency Input */}
          <div className="pt-1">
            <label className="text-[11px] text-muted-foreground">Input Presisi (Rp)</label>
            <CurrencyInput
              value={budgetAmount}
              onChange={(val) => onChangeBudget(val)}
              className="h-8 text-xs font-mono"
            />
          </div>
        </div>

        {/* Forecast Prediction Widget */}
        <div className="p-2.5 rounded-xl bg-muted/40 text-xs flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-primary" /> Est. Akhir Bulan:
          </span>
          <span className="font-mono font-semibold text-foreground">
            {formatCurrency(projectedEndMonth)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
