"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { type MarketCoin, getCoinDetail } from "@/lib/coingecko";
import { useAppStore } from "@/store/app";
import { Star } from "lucide-react";
import { useAppStore as useStore } from "@/store/app";

function formatCurrency(n: number, currency = "USD") {
  return new Intl.NumberFormat(currency === "TRY" ? "tr-TR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}
function pctColor(p?: number | null) {
  if (p == null) return "";
  if (p > 0) return "text-emerald-600 dark:text-emerald-400";
  if (p < 0) return "text-red-600 dark:text-red-400";
  return "";
}

function PrefetchingLink({ id, name }: { id: string; name: string }) {
  const qc = useQueryClient();
  return (
    <Link
      href={`/coins/${id}`}
      onMouseEnter={() => {
        qc.prefetchQuery({
          queryKey: ["coin", id],
          queryFn: () => getCoinDetail(id),
          staleTime: 60_000,
        });
      }}
      className="font-medium underline-offset-2 hover:underline"
    >
      {name}
    </Link>
  );
}

function WatchButton({ id }: { id: string }) {
  const inWatch = useStore((s) => s.inWatch(id));
  const toggle = useStore((s) => s.toggleWatch);
  return (
    <button
      onClick={() => toggle(id)}
      aria-label={inWatch ? "İzlemeyi kaldır" : "İzlemeye al"}
      className={`inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs
        ${
          inWatch
            ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-500"
            : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        }`}
    >
      <Star className={`h-4 w-4 ${inWatch ? "fill-current" : ""}`} />
    </button>
  );
}

export default function CoinsVirtualTable({ items }: { items: MarketCoin[] }) {
  const currency = useAppStore((s) => s.currency);
  const rowHeight = 52;
  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => rowHeight,
    overscan: 8,
  });
  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <div
        className="sticky top-[42px] z-[1] hidden bg-neutral-50 px-4 py-3 text-xs font-medium text-neutral-500 dark:bg-neutral-900 md:grid"
        style={{
          gridTemplateColumns:
            "56px minmax(200px,1fr) 160px 120px 200px 200px 80px",
        }}
      >
        <div>#</div>
        <div>Coin</div>
        <div>Price</div>
        <div>24h %</div>
        <div>Market Cap</div>
        <div>Volume (24h)</div>
        <div className="text-center">Watch</div>
      </div>

      <div className="relative" style={{ height: virtualizer.getTotalSize() }}>
        {virtualItems.map((v) => {
          const c = items[v.index];
          if (!c) return null;
          return (
            <div
              key={v.key}
              className="md:grid px-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2 py-3"
              style={{
                transform: `translateY(${v.start}px)`,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                gridTemplateColumns:
                  "56px minmax(200px,1fr) 160px 120px 200px 200px 80px",
              }}
            >
              <div className="md:contents">
                <div className="md:block hidden">{c.market_cap_rank}</div>

                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="flex items-center gap-2">
                    <PrefetchingLink id={c.id} name={c.name} />
                    <span className="uppercase text-neutral-500">
                      {c.symbol}
                    </span>
                  </div>
                </div>

                <div>{formatCurrency(c.current_price, currency)}</div>

                <div className={pctColor(c.price_change_percentage_24h)}>
                  {c.price_change_percentage_24h?.toFixed(2)}%
                </div>

                <div>{formatCurrency(c.market_cap, currency)}</div>

                <div>{formatCurrency(c.total_volume, currency)}</div>

                <div className="text-center">
                  <WatchButton id={c.id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
