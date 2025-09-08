"use client";

import { useState } from "react";
import CoinsTable from "@/components/coins/CoinsTable";
import { useMarketsQuery } from "@/hooks/useMarketsQuery";

const PER_PAGE = 25;

export default function CoinsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, isFetching } = useMarketsQuery({
    vs: "usd",
    page,
    perPage: PER_PAGE,
  });

  const canPrev = page > 1;
  const canNext = (data?.length ?? 0) === PER_PAGE;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Markets
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            CoinGecko gerçek verisiyle piyasa listesi. Sayfa: {page}
            {isFetching && (
              <span className="ml-2 text-xs opacity-70">(güncelleniyor…)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={!canPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            ← Prev
          </button>
          <button
            disabled={!canNext}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Next →
          </button>
        </div>
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

      {data && <CoinsTable data={data} currency="USD" />}
    </main>
  );
}
