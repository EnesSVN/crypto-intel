"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMarkets, type MarketCoin } from "@/lib/coingecko";

type Params = {
  vs: "usd" | "try";
  perPage?: number;
  order?: string;
};

export function useMarketsInfiniteQuery({
  vs,
  perPage = 50,
  order = "market_cap_desc",
}: Params) {
  return useInfiniteQuery<MarketCoin[], Error>({
    queryKey: ["markets-infinite", { vs, perPage, order }],
    queryFn: ({ pageParam = 1 }: { pageParam?: unknown }) =>
      getMarkets({ vs, page: pageParam as number, perPage, order }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === perPage ? allPages.length + 1 : undefined;
    },
    staleTime: 45_000,
    refetchOnWindowFocus: false,
  });
}
