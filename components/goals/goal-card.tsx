"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { Target, PlusCircle, CheckCircle2, Calendar } from "lucide-react";

interface GoalCardProps {
  id: string;
  name: string;
  targetAmount: number;
  currentSaved: number;
  targetDate?: string;
  color?: string;
  onContribute: (id: string, name: string) => void;
  className?: string;
}

export function GoalCard({
  id,
  name,
  targetAmount,
  currentSaved,
  targetDate,
  color = "#3b82f6",
  onContribute,
  className,
}: GoalCardProps) {
  const percentage = Math.min(100, Math.round((currentSaved / targetAmount) * 100));
  const remaining = Math.max(0, targetAmount - currentSaved);
  const isCompleted = percentage >= 100;

  return (
    <Card
      className={cn(
        "hover:border-primary/40 transition-all duration-200 relative overflow-hidden",
        isCompleted && "border-emerald-500/40 bg-emerald-500/5",
        className
      )}
    >
      <div
        className="absolute top-0 left-0 bottom-0 w-1.5"
        style={{ backgroundColor: isCompleted ? "#10b981" : color }}
      />
      <CardContent className="p-5 pl-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div
              className="p-2 rounded-xl text-white shrink-0"
              style={{ backgroundColor: isCompleted ? "#10b981" : color }}
            >
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">{name}</h4>
              {targetDate && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Target: {targetDate}
                </span>
              )}
            </div>
          </div>

          {isCompleted ? (
            <Badge variant="success" className="gap-1 text-[10px]">
              <CheckCircle2 className="h-3 w-3" /> Tercapai!
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-[10px]">
              {percentage}%
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between text-xs font-mono">
            <span className="font-bold text-foreground">{formatCurrency(currentSaved)}</span>
            <span className="text-muted-foreground">dari {formatCurrency(targetAmount)}</span>
          </div>
          <Progress value={percentage} autoColor />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Sisa: <strong className="text-foreground">{formatCurrency(remaining)}</strong>
          </span>

          {!isCompleted && (
            <Button
              size="sm"
              onClick={() => onContribute(id, name)}
              className="rounded-xl text-xs gap-1 h-8"
            >
              <PlusCircle className="h-3.5 w-3.5" /> Tabung
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
