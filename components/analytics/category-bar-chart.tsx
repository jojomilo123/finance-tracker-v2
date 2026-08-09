"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface CategoryBarData {
  name: string;
  amount: number;
  color?: string;
}

interface CategoryBarChartProps {
  data: CategoryBarData[];
  title?: string;
}

export function CategoryBarChart({
  data,
  title = "Peringkat Pengeluaran Per Kategori",
}: CategoryBarChartProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => b.amount - a.amount);
  }, [data]);

  const totalAmount = React.useMemo(() => {
    return sortedData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [sortedData]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isMounted ? (
          <Skeleton className="h-[300px] w-full rounded-xl" />
        ) : sortedData && sortedData.length > 0 ? (
          <div className="h-[300px] w-full min-h-[300px] relative">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={sortedData}
                margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  type="number"
                  tickFormatter={(val) => `Rp${(val / 1000).toFixed(0)}k`}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }}
                  width={110}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                  formatter={(val: number) => [
                    `${formatCurrency(val)} (${((val / (totalAmount || 1)) * 100).toFixed(1)}%)`,
                    "Total Pengeluaran",
                  ]}
                  contentStyle={{
                    backgroundColor: "#121C2A",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    color: "#F5F7FA",
                    fontSize: "12px",
                    fontWeight: "600",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  }}
                  labelStyle={{ color: "#F5F7FA", fontWeight: "700" }}
                  itemStyle={{ color: "#F5F7FA" }}
                />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]} cursor="pointer">
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-xs text-muted-foreground">
            Tidak ada data peringkat kategori
          </div>
        )}
      </CardContent>
    </Card>
  );
}
