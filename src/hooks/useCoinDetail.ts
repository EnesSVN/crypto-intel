"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoinDetail, CoinDetail } from "@/lib/coingecko";

export function useCoinDetail(id: string) {
  return useQuery<CoinDetail, Error>({
    queryKey: ["coin", id],
    queryFn: () => getCoinDetail(id),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}
