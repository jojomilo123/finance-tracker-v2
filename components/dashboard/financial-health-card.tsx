import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, ShieldCheck, TrendingUp, AlertCircle } from "lucide-react";
import { calculateFinancialHealth } from "@/services/dashboard-service";

interface FinancialHealthCardProps {
  income: number;
  expense: number;
  totalBudget: number;
  spentBudget: number;
}

export function FinancialHealthCard({
  income,
  expense,
  totalBudget,
  spentBudget,
}: FinancialHealthCardProps) {
  const health = calculateFinancialHealth(income, expense, totalBudget, spentBudget);

  const getBadgeVariant = () => {
    if (health.score >= 85) return "success";
    if (health.score >= 70) return "info";
    if (health.score >= 55) return "warning";
    return "destructive";
  };

  return (
    <Card className="w-full border-primary/20 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" /> Skor Kesehatan Keuangan
        </CardTitle>
        <Badge variant={getBadgeVariant()} className="text-xs">
          {health.rating}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score & Gauge Bar */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-foreground">
              {health.score}
            </span>
            <span className="text-xs text-muted-foreground font-semibold">/ 100</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Rasio Tabungan: <strong className="text-foreground">{health.savingsRate}%</strong>
          </span>
        </div>

        <Progress value={health.score} autoColor className="h-3" />

        {/* Recommendation Advice */}
        <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-start space-x-2 text-xs">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-muted-foreground leading-relaxed">
            {health.recommendation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
