"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarkets, MarketCoin } from "@/lib/coingecko";

type Params = {
  vs?: string;
  page?: number;
  perPage?: number;
  order?: string;
};

export function useMarketsQuery(params: Params) {
  return useQuery<MarketCoin[], Error>({
    queryKey: ["markets", params],
    queryFn: () => getMarkets(params),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
