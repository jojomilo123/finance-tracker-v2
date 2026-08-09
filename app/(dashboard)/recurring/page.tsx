"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Repeat, Plus, Calendar, TrendingUp, TrendingDown } from "lucide-react";

export default function RecurringPage() {
  const { toast } = useToast();

  const rules = [
    {
      id: "r-1",
      title: "Gaji Bulanan Tetap",
      amount: 8500000,
      type: "INCOME",
      interval: "Tiap Tanggal 25",
      category: "Gaji Utama",
      account: "BCA Utama",
    },
    {
      id: "r-2",
      title: "Sewa Apartemen / Kontrakan",
      amount: 1500000,
      type: "EXPENSE",
      interval: "Tiap Tanggal 1",
      category: "Tempat Tinggal",
      account: "BCA Utama",
    },
    {
      id: "r-3",
      title: "Asuransi Kesehatan",
      amount: 450000,
      type: "EXPENSE",
      interval: "Tiap Tanggal 10",
      category: "Kesehatan",
      account: "BCA Utama",
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transaksi Berulang (Recurring Rules)</h1>
            <p className="text-sm text-muted-foreground">
              Otomatisasi pencatatan gaji bulanan, sewa, asuransi, dan tagihan berkala.
            </p>
          </div>
          <Button
            onClick={() =>
              toast({
                title: "Aturan Baru",
                description: "Formulir transaksi berulang diaktifkan.",
              })
            }
            className="rounded-xl gap-2"
          >
            <Plus className="h-4 w-4" /> Aturan Otomatis Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((r) => (
            <Card key={r.id} className="hover:border-primary/40 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-2 rounded-xl ${
                        r.type === "INCOME"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-rose-500/10 text-rose-600"
                      }`}
                    >
                      {r.type === "INCOME" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <h4 className="text-sm font-semibold">{r.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {r.interval}
                  </Badge>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-muted-foreground">Nominal Transaksi</span>
                  <p className="text-lg font-bold font-mono">
                    {formatCurrency(r.amount)}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground space-x-2 pt-2 border-t border-border">
                  <span>{r.category}</span>
                  <span>•</span>
                  <span>{r.account}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
