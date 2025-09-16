"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CoinsTable from "@/components/coins/CoinsTable";
import { useAppStore } from "@/store/app";
import { useMarketsInfiniteQuery } from "@/hooks/useMarketsInfiniteQuery";
import CoinsVirtualTable from "@/components/coins/CoinsVirtualTable";

const PER_PAGE = 25;
const USE_VIRTUAL = true;

export default function CoinsPage() {
  const currency = useAppStore((s) => s.currency);
  const vs = currency.toLowerCase() as "usd" | "try";

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useMarketsInfiniteQuery({ vs, perPage: PER_PAGE });

  const items = useMemo(() => (data?.pages ?? []).flat(), [data]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "800px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Markets
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Gerçek veri (CoinGecko). {items.length} sonuç • Para birimi:{" "}
          {currency}
        </p>
      </header>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-300 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-300">
          Hata: {error.message}
        </div>
      )}

      {!isLoading &&
        items.length > 0 &&
        (USE_VIRTUAL ? (
          <CoinsVirtualTable items={items} />
        ) : (
          <CoinsTable data={items} currency={currency} />
        ))}

      <div ref={bottomRef} className="h-12" />
      {isFetchingNextPage && (
        <div className="mt-3 text-xs opacity-70">Daha fazla yükleniyor…</div>
      )}
      {!hasNextPage && items.length > 0 && (
        <div className="mt-4 text-center text-xs opacity-70">
          Hepsi bu kadar 🎉
        </div>
      )}
    </main>
  );
}
