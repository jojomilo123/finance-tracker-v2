"use client";

import * as React from "react";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Point {
  label: string;
  value: number;
}

interface MiniTrendProps {
  data: Point[];
  color?: string;
}

export function MiniTrend({ data, color = "#10b981" }: MiniTrendProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-6 w-full" />;

  return (
    <div className="w-full h-6">
      <ResponsiveContainer width="100%" height={24}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.36} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill="url(#miniGrad)"
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
          <Tooltip
            formatter={(val: number) => formatCurrency(val)}
            labelFormatter={(label: string) => label}
            contentStyle={{ display: "none" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
