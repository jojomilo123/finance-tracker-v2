"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface ExpensePieData {
  name: string;
  value: number;
  color?: string;
}

interface ExpensePieChartProps {
  data: ExpensePieData[];
  title?: string;
}

const DEFAULT_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: any) => {
  if (percent < 0.04) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central"
      className="text-[11px] font-bold font-mono"
      style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.8))" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function ExpensePieChart({ data, title = "Distribusi Pengeluaran" }: ExpensePieChartProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => { setIsMounted(true); }, []);

  const totalValue = React.useMemo(() => data ? data.reduce((acc, curr) => acc + curr.value, 0) : 0, [data]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        {!isMounted ? (
          <Skeleton className="h-[250px] w-full rounded-xl" />
        ) : data && data.length > 0 ? (
          <div className="space-y-3">
            {/* Chart */}
            <div className="h-[220px] w-full relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    animationDuration={800}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                        stroke="transparent"
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom scrollable legend */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              {data.map((item, idx) => {
                const pct = ((item.value / (totalValue || 1)) * 100).toFixed(0);
                return (
                  <div key={idx} className="flex items-center justify-between text-xs px-1">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
                      />
                      <span className="text-[#F5F7FA] font-medium truncate">{item.name}</span>
                    </div>
                    <span className="text-[#AAB5C5] font-mono shrink-0 ml-2">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-xs text-muted-foreground">
            Tidak ada data pengeluaran
          </div>
        )}
      </CardContent>
    </Card>
  );
}
