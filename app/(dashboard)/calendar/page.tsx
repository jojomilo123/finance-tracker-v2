"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DAY_NAMES = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default function CalendarPage() {
  const { transactions } = useTransactionStore();
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth()); // 0-indexed

  const goToPrevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const goToNextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const calendarCells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month overflow
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    calendarCells.push({ day: d, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      isCurrentMonth: true,
    });
  }

  // Next month overflow to fill 6 rows
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 1 : month + 2;
    const y = month === 11 ? year + 1 : year;
    calendarCells.push({ day: d, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: false });
  }

  // Build income/expense per day from transactions
  const dayData = React.useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      if (!map[t.date]) map[t.date] = { income: 0, expense: 0 };
      if (t.transactionType === "INCOME") map[t.date].income += t.amount;
      if (t.transactionType === "EXPENSE") map[t.date].expense += t.amount;
    });
    return map;
  }, [transactions]);

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kalender Keuangan</h1>
            <p className="text-sm text-muted-foreground">Jadwal harian transaksi dan alokasi anggaran bulanan.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={goToPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold px-2 min-w-[140px] text-center">
              {MONTH_NAMES[month]} {year}
            </span>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="w-full">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-muted-foreground mb-3 uppercase font-mono">
              {DAY_NAMES.map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarCells.map((cell, idx) => {
                const data = dayData[cell.dateStr];
                const isToday = cell.dateStr === todayStr;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "min-h-[70px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col justify-between",
                      cell.isCurrentMonth
                        ? "bg-card border-border hover:border-primary/40"
                        : "bg-muted/20 border-transparent text-muted-foreground/40"
                    )}
                  >
                    <div className="flex justify-between items-center text-xs font-mono font-semibold">
                      <span className={isToday ? "p-1 rounded-md bg-primary text-primary-foreground" : ""}>{cell.day}</span>
                    </div>
                    <div className="space-y-0.5 font-mono text-[9px] sm:text-[10px]">
                      {data?.income ? (
                        <div className="p-0.5 sm:p-1 rounded bg-emerald-500/10 text-emerald-400 font-bold truncate">
                          +{formatCurrency(data.income)}
                        </div>
                      ) : null}
                      {data?.expense ? (
                        <div className="p-0.5 sm:p-1 rounded bg-rose-500/10 text-rose-400 font-bold truncate">
                          -{formatCurrency(data.expense)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
