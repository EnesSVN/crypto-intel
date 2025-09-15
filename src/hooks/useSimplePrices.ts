"use client";

import { useQuery } from "@tanstack/react-query";
import { getSimplePrices } from "@/lib/coingecko";

export function useSimplePrices(
  ids: string[],
  vs: "usd" | "try",
  intervalMs = 10_000
) {
  return useQuery({
    queryKey: ["simple-prices", { ids: ids.sort(), vs }],
    queryFn: () => getSimplePrices(ids, vs),
    enabled: ids.length > 0,
    refetchInterval: intervalMs,
    staleTime: intervalMs,
  });
}
