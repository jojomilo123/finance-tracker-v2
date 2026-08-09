"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { RefreshCw, Calendar, CheckCircle2, PauseCircle } from "lucide-react";

interface SubscriptionCardProps {
  id: string;
  name: string;
  cost: number;
  billingCycle: string;
  nextDueDate: string;
  active: boolean;
  onToggleActive?: (id: string, name: string, active: boolean) => void;
}

export function SubscriptionCard({
  id,
  name,
  cost,
  billingCycle,
  nextDueDate,
  active,
  onToggleActive,
}: SubscriptionCardProps) {
  return (
    <Card className="hover:border-primary/40 transition-all duration-200">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">{name}</h4>
              <span className="text-[11px] text-muted-foreground uppercase font-mono">
                {billingCycle}
              </span>
            </div>
          </div>

          <Badge variant={active ? "success" : "secondary"} className="text-[10px]">
            {active ? "Aktif" : "Dedaunan"}
          </Badge>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="text-[11px] text-muted-foreground">Biaya Per Siklus</span>
            <p className="text-lg font-bold font-mono text-foreground">
              {formatCurrency(cost)}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-muted-foreground">Jatuh Tempo</span>
            <p className="text-xs font-semibold font-mono flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" /> {nextDueDate}
            </p>
          </div>
        </div>

        {onToggleActive && (
          <div className="flex justify-end pt-2 border-t border-border">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleActive(id, name, !active)}
              className="h-7 text-xs rounded-lg gap-1"
            >
              {active ? (
                <>
                  <PauseCircle className="h-3 w-3" /> Jeda Langganan
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3" /> Aktifkan Lagi
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
