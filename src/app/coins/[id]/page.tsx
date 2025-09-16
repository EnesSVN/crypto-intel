"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useCoinDetail } from "@/hooks/useCoinDetail";
import { useCoinChart } from "@/hooks/useCoinChart";
import CoinChart from "../CoinChart";
import { mapToBinanceSymbol } from "@/lib/binance";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";
import { useNotes } from "@/hooks/useNotes";

function formatCurrency(n: number | undefined, currency: "USD" | "TRY") {
  if (n == null) return "-";
  return new Intl.NumberFormat(currency === "TRY" ? "tr-TR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

export default function CoinDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [currency] = useState<"USD" | "TRY">("USD");
  const [days, setDays] = useState<number>(30);
  const { data: coin, isLoading, isError, error } = useCoinDetail(id);
  const {
    data: notes,
    isLoading: notesLoading,
    createNote,
    creating,
    createError,
  } = useNotes(id);
  const [noteText, setNoteText] = useState("");

  const binanceSymbol = coin ? mapToBinanceSymbol(id, coin.symbol) : null;
  const live = useBinanceTicker(binanceSymbol);

  const displayPrice =
    live?.last != null
      ? live.last
      : coin?.market_data?.current_price?.[currency.toLowerCase()];

  const {
    data: chart,
    isLoading: isChartLoading,
    isError: isChartError,
    error: chartError,
    isFetching: isChartFetching,
  } = useCoinChart(id, currency.toLowerCase() as "usd" | "try", days);

  const pct24 =
    coin?.market_data?.price_change_percentage_24h_in_currency?.[
      currency.toLowerCase()
    ];

  const pctClass =
    pct24 == null
      ? ""
      : pct24 > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : pct24 < 0
      ? "text-red-600 dark:text-red-400"
      : "";

  const rangeOptions = useMemo(
    () => [
      { d: 1, label: "1D" },
      { d: 7, label: "7D" },
      { d: 30, label: "1M" },
      { d: 90, label: "3M" },
      { d: 365, label: "1Y" },
    ],
    []
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <Link href="/coins" className="text-sm underline">
          ← Markets
        </Link>
      </div>

      <section className="mb-6 flex flex-wrap items-baseline gap-4">
        <div className="text-2xl font-semibold">
          {formatCurrency(displayPrice, currency)}
        </div>
        <div className={`text-sm ${pctClass}`}>
          {pct24 != null ? `${pct24.toFixed(2)}% (24h)` : "-"}
        </div>

        {binanceSymbol ? (
          <span
            className={`rounded-full px-2 py-0.5 text-xs border ${
              live.connected
                ? "border-emerald-400 text-emerald-500"
                : "border-neutral-400 text-neutral-500"
            }`}
          >
            {live.connected ? "LIVE • Binance" : "WS bağlanıyor…"}
          </span>
        ) : (
          <span className="rounded-full px-2 py-0.5 text-xs border border-neutral-400 text-neutral-500">
            WS yok (eşleşme bulunamadı)
          </span>
        )}
      </section>

      {isLoading && (
        <div className="space-y-3">
          <div className="h-10 w-64 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          <div className="h-6 w-80 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          <div className="h-[360px] w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-300 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-300">
          Hata: {error.message}
        </div>
      )}

      {coin && (
        <>
          <header className="mb-6 flex flex-wrap items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coin.image?.small}
              alt={coin.name}
              className="h-8 w-8 rounded-full"
            />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {coin.name}{" "}
              <span className="uppercase text-neutral-500">{coin.symbol}</span>
            </h1>
          </header>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
              <div className="text-xs text-neutral-500">Market Cap</div>
              <div className="text-sm">
                {formatCurrency(
                  coin.market_data?.market_cap?.[currency.toLowerCase()],
                  currency
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
              <div className="text-xs text-neutral-500">Total Volume (24h)</div>
              <div className="text-sm">
                {formatCurrency(
                  coin.market_data?.total_volume?.[currency.toLowerCase()],
                  currency
                )}
              </div>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            {rangeOptions.map((r) => (
              <button
                key={r.d}
                onClick={() => setDays(r.d)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  days === r.d
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                }`}
              >
                {r.label}
              </button>
            ))}
            {isChartFetching && (
              <span className="ml-2 text-xs opacity-70">
                grafik güncelleniyor…
              </span>
            )}
          </div>

          {isChartLoading && (
            <div className="h-[360px] w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          )}
          {isChartError && (
            <div className="rounded-xl border border-red-300 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-300">
              Grafik hatası: {chartError.message}
            </div>
          )}
          {chart && <CoinChart data={chart} currency={currency} days={days} />}
        </>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Notlar</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const t = noteText.trim();
            if (!t) return;
            await createNote({ text: t });
            setNoteText("");
          }}
          className="mb-4 flex gap-2"
        >
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Bu coine dair kısa notun…"
            maxLength={500}
            className="flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700"
          />
          <button
            type="submit"
            disabled={creating || !noteText.trim()}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm disabled:opacity-60 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {creating ? "Kaydediliyor…" : "Ekle"}
          </button>
        </form>

        {createError && (
          <div className="mb-3 text-xs text-red-600 dark:text-red-400">
            Not kaydı başarısız oldu (örnek hata simülasyonu). Değişiklik geri
            alındı.
          </div>
        )}

        {notesLoading ? (
          <div className="space-y-2">
            <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-10 w-3/4 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          </div>
        ) : notes && notes.length > 0 ? (
          <ul className="space-y-2">
            {notes.map((n) => (
              <li
                key={n.id}
                className="rounded-xl border border-neutral-200 p-3 text-sm dark:border-neutral-800"
              >
                <div className="text-neutral-800 dark:text-neutral-100">
                  {n.text}
                </div>
                <div className="mt-1 text-[10px] text-neutral-500">
                  {new Date(n.createdAt).toLocaleString()}
                  {String(n.id).startsWith("temp-") && " • (taslak)"}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            Henüz not yok. İlk notu ekleyebilirsin.
          </div>
        )}
      </section>
    </main>
  );
}
