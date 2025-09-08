"use client";

import { MarketCoin } from "@/lib/coingecko";
import Link from "next/link";

function formatCurrency(n: number, currency = "USD") {
  return new Intl.NumberFormat(currency === "TRY" ? "tr-TR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

function pctColor(p: number | null | undefined) {
  if (p == null) return "";
  if (p > 0) return "text-emerald-600 dark:text-emerald-400";
  if (p < 0) return "text-red-600 dark:text-red-400";
  return "";
}

export default function CoinsTable({
  data,
  currency = "USD",
}: {
  data: MarketCoin[];
  currency?: "USD" | "TRY";
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50 dark:bg-neutral-900">
          <tr className="text-left">
            <th className="px-4 py-3 w-16">#</th>
            <th className="px-4 py-3">Coin</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">24h %</th>
            <th className="px-4 py-3">Market Cap</th>
            <th className="px-4 py-3">Volume (24h)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr
              key={c.id}
              className="border-t border-neutral-100 dark:border-neutral-800"
            >
              <td className="px-4 py-3">{c.market_cap_rank}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/coins/${c.id}`}
                      className="font-medium underline-offset-2 hover:underline"
                    >
                      {c.name}
                    </Link>
                    <span className="uppercase text-neutral-500">
                      {c.symbol}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                {formatCurrency(c.current_price, currency)}
              </td>
              <td
                className={`px-4 py-3 ${pctColor(
                  c.price_change_percentage_24h
                )}`}
              >
                {c.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td className="px-4 py-3">
                {formatCurrency(c.market_cap, currency)}
              </td>
              <td className="px-4 py-3">
                {formatCurrency(c.total_volume, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
