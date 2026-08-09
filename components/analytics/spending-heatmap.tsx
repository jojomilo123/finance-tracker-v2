"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

interface HeatmapDay {
  date: string;
  count: number; // amount in IDR
}

interface SpendingHeatmapProps {
  data: HeatmapDay[];
  title?: string;
}

export function SpendingHeatmap({
  data,
  title = "Peta Intensitas Pengeluaran Harian (Heatmap)",
}: SpendingHeatmapProps) {
  const getIntensityClass = (amount: number) => {
    if (amount === 0) return "bg-muted/40 hover:border-foreground/30";
    if (amount < 100000) return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400";
    if (amount < 250000) return "bg-emerald-500/40 text-emerald-700 dark:text-emerald-300";
    if (amount < 400000) return "bg-emerald-500/70 text-white";
    return "bg-emerald-600 text-white";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" /> {title}
        </CardTitle>
        <div className="flex items-center space-x-1.5 text-[11px] text-muted-foreground">
          <span>Rendah</span>
          <span className="h-2.5 w-2.5 rounded bg-muted/40 inline-block" />
          <span className="h-2.5 w-2.5 rounded bg-emerald-500/30 inline-block" />
          <span className="h-2.5 w-2.5 rounded bg-emerald-500/70 inline-block" />
          <span className="h-2.5 w-2.5 rounded bg-emerald-600 inline-block" />
          <span>Tinggi</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-border bg-card/40">
          {data.map((day) => (
            <div
              key={day.date}
              className={cn(
                "h-6 w-6 rounded-md border border-border flex items-center justify-center text-[9px] font-mono transition-transform hover:scale-115 cursor-pointer relative group",
                getIntensityClass(day.count)
              )}
              title={`${day.date}: ${formatCurrency(day.count)}`}
            >
              <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 px-2 py-1 bg-popover text-popover-foreground border border-border rounded-lg text-[10px] whitespace-nowrap shadow-md">
                <span className="font-semibold">{day.date}</span>: {formatCurrency(day.count)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
