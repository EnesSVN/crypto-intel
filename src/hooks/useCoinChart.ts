"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarketChart, ChartPoint } from "@/lib/coingecko";

export function useCoinChart(id: string, vs: "usd" | "try", days: number) {
  return useQuery<ChartPoint[], Error>({
    queryKey: ["coin-chart", { id, vs, days }],
    queryFn: () => getMarketChart({ id, vs, days }),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
