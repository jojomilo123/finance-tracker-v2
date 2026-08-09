"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CategoryBarChart } from "@/components/analytics/category-bar-chart";
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { LineChart as LineChartIcon, Store, CreditCard, Building2 } from "lucide-react";

export default function AnalyticsPage() {
  const merchantData = [
    { name: "Tokopedia", amount: 1200000, visits: 4 },
    { name: "Resto Sederhana", amount: 850000, visits: 8 },
    { name: "IndiHome", amount: 300000, visits: 1 },
    { name: "Pertamina", amount: 250000, visits: 5 },
    { name: "Starbucks", amount: 180000, visits: 3 },
  ];

  const paymentMethodUsage = [
    { name: "QRIS", percentage: 42, color: "#ef4444" },
    { name: "Bank Transfer", percentage: 35, color: "#3b82f6" },
    { name: "GoPay", percentage: 15, color: "#06b6d4" },
    { name: "Cash", percentage: 8, color: "#10b981" },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analisis &amp; Intelijen Merchant</h1>
            <p className="text-sm text-muted-foreground">
              Statistik penggunaan kanal pembayaran, merchant terpopuler, dan analisis frekuensi.
            </p>
          </div>
        </div>

        {/* Top Merchants Grid */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" /> Peringkat Merchant Teratas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {merchantData.map((m, idx) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/60"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center p-0 font-mono text-xs">
                      #{idx + 1}
                    </Badge>
                    <div>
                      <h4 className="text-sm font-semibold">{m.name}</h4>
                      <p className="text-[11px] text-muted-foreground">
                        Frekuensi Transaksi: {m.visits} kali
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-bold font-mono text-foreground">
                    {formatCurrency(m.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Penggunaan Metode Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethodUsage.map((pm) => (
                <div key={pm.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{pm.name}</span>
                    <span className="font-mono">{pm.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pm.percentage}%`,
                        backgroundColor: pm.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <ExpensePieChart
            data={paymentMethodUsage.map((p) => ({
              name: p.name,
              value: p.percentage,
              color: p.color,
            }))}
            title="Distribusi Metode Pembayaran"
          />
        </div>
      </div>
    </DashboardShell>
  );
}
