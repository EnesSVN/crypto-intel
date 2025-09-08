/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ChartPoint } from "@/lib/coingecko";

function formatXAxis(ts: number, isIntraday: boolean) {
  const d = new Date(ts);
  if (isIntraday) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString();
}

export default function CoinChart({
  data,
  currency = "USD",
  days,
}: {
  data: ChartPoint[];
  currency?: "USD" | "TRY";
  days: number;
}) {
  const isIntraday = days <= 1;

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis
            dataKey="t"
            tickFormatter={(t) => formatXAxis(t as number, isIntraday)}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={(n) =>
              new Intl.NumberFormat(currency === "TRY" ? "tr-TR" : "en-US", {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
              }).format(Number(n))
            }
            domain={["auto", "auto"]}
            width={80}
          />
          <Tooltip
            formatter={(value: any) =>
              new Intl.NumberFormat(currency === "TRY" ? "tr-TR" : "en-US", {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
              }).format(Number(value))
            }
            labelFormatter={(label) => new Date(Number(label)).toLocaleString()}
          />
          <Line
            type="monotone"
            dataKey="price"
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
