"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, X, TrendingDown, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIInsightItem {
  id: string;
  type: "positive" | "warning" | "tip";
  title: string;
  description: string;
  actionText?: string;
}

interface AIInsightsCardProps {
  insights: AIInsightItem[];
}

export function AIInsightsCard({ insights: initialInsights }: AIInsightsCardProps) {
  const [insights, setInsights] = React.useState<AIInsightItem[]>(initialInsights);

  const handleDismiss = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Wawasan Finansial Otomatis (AI Insights)</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight) => {
          const isWarning = insight.type === "warning";
          const isPositive = insight.type === "positive";

          return (
            <Card
              key={insight.id}
              className={cn(
                "relative transition-all duration-200 border",
                isWarning && "border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-100",
                isPositive && "border-emerald-500/20 bg-emerald-500/5 text-emerald-900 dark:text-emerald-100",
                !isWarning && !isPositive && "border-blue-500/20 bg-blue-500/5 text-blue-900 dark:text-blue-100"
              )}
            >
              <button
                onClick={() => handleDismiss(insight.id)}
                className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                title="Abaikan Wawasan"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <CardContent className="p-4 flex items-start space-x-3 pr-8">
                <div className="p-2 rounded-xl bg-background/80 shrink-0 mt-0.5 shadow-sm">
                  {isWarning && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  {isPositive && <TrendingDown className="h-4 w-4 text-emerald-500" />}
                  {!isWarning && !isPositive && <Lightbulb className="h-4 w-4 text-blue-500" />}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold leading-none">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
