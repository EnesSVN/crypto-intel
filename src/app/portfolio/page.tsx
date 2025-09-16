"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app";
import { useCoinDetail } from "@/hooks/useCoinDetail";

function formatMoney(n: number | undefined, currency: "USD" | "TRY") {
  if (n == null) return "-";
  return new Intl.NumberFormat(currency === "TRY" ? "tr-TR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

export default function PortfolioPage() {
  const currency = useAppStore((s) => s.currency);
  const portfolio = useAppStore((s) => s.portfolio);
  const add = useAppStore((s) => s.addPortfolio);
  const remove = useAppStore((s) => s.removePortfolio);

  const [id, setId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const coinId = id.trim().toLowerCase();
    if (!coinId || amount <= 0 || cost <= 0) return;
    add({ id: coinId, amount, costBasis: cost });
    setId("");
    setAmount(0);
    setCost(0);
  }

  const hasItems = portfolio.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Portfolio
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
        Client-side portföy (Zustand) + server’dan anlık fiyat (React Query) ile
        PnL hesaplanır.
      </p>

      <form onSubmit={onAdd} className="mb-8 grid gap-3 sm:grid-cols-4">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder='Coin id (örn: "bitcoin")'
          className="rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700"
        />
        <input
          type="number"
          step="any"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Miktar"
          className="rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700"
        />
        <input
          type="number"
          step="any"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          placeholder="Birim maliyet (USD)"
          className="rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700"
        />
        <button
          aria-label="Add to portfolio"
          type="submit"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Ekle
        </button>
      </form>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-3">Holdings</h2>

        {!hasItems && (
          <div className="rounded-2xl border border-neutral-200 p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
            Henüz portföyüne bir şey eklemedin. Aşağıdaki <b>Watchlist</b>{" "}
            bölümünden yıldızladıklarını hızlıca portföye ekleyebilirsin.
          </div>
        )}

        {hasItems && (
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr className="text-left">
                  <th className="px-4 py-3">Coin</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Cost/Unit</th>
                  <th className="px-4 py-3">Current</th>
                  <th className="px-4 py-3">PnL</th>
                  <th className="px-4 py-3 w-16">Sil</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((p) => (
                  <PortfolioRow
                    key={p.id}
                    item={p}
                    currency={currency}
                    onRemove={() => remove(p.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <WatchlistBlock />
    </main>
  );
}

function PortfolioRow({
  item,
  currency,
  onRemove,
}: {
  item: import("@/store/app").PortfolioItem;
  currency: "USD" | "TRY";
  onRemove: () => void;
}) {
  const { data, isLoading, isError } = useCoinDetail(item.id);
  const current =
    data?.market_data?.current_price?.[currency.toLowerCase()] ?? undefined;

  const totalCost = item.amount * item.costBasis;
  const totalNow = current != null ? item.amount * current : undefined;
  const pnl = totalNow != null ? totalNow - totalCost : undefined;
  const pnlClass =
    pnl == null
      ? ""
      : pnl > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : pnl < 0
      ? "text-red-600 dark:text-red-400"
      : "";

  return (
    <tr className="border-t border-neutral-100 dark:border-neutral-800">
      <td className="px-4 py-3 font-medium">{item.id}</td>
      <td className="px-4 py-3">{item.amount}</td>
      <td className="px-4 py-3">{formatMoney(item.costBasis, currency)}</td>
      <td className="px-4 py-3">
        {isLoading
          ? "yükleniyor…"
          : isError
          ? "hata"
          : formatMoney(current, currency)}
      </td>
      <td className={`px-4 py-3 ${pnlClass}`}>
        {pnl == null ? "-" : formatMoney(pnl, currency)}
      </td>
      <td className="px-4 py-3">
        <button
          aria-label="Remove from portfolio"
          onClick={onRemove}
          className="rounded-lg border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Sil
        </button>
      </td>
    </tr>
  );
}

function WatchlistBlock() {
  const watchlist = useAppStore((s) => s.watchlist);
  const portfolio = useAppStore((s) => s.portfolio);
  const inPortfolio = (id: string) => portfolio.some((p) => p.id === id);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Watchlist (⭐)</h2>

      {watchlist.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
          Henüz bir şey ⭐’lamadın. Markets sayfasından coin’leri
          yıldızlayabilirsin.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {watchlist.map((id) => (
            <WatchlistRow
              key={id}
              id={id}
              alreadyInPortfolio={inPortfolio(id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function WatchlistRow({
  id,
  alreadyInPortfolio,
}: {
  id: string;
  alreadyInPortfolio: boolean;
}) {
  const currency = useAppStore((s) => s.currency);
  const add = useAppStore((s) => s.addPortfolio);
  const { data, isLoading, isError } = useCoinDetail(id);
  const [amount, setAmount] = useState<number>(0);
  const current = data?.market_data?.current_price?.[currency.toLowerCase()];

  return (
    <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-medium">{id}</div>
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          {isLoading
            ? "yükleniyor…"
            : isError
            ? "hata"
            : formatMoney(current, currency)}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input
          type="number"
          step="any"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Miktar"
          className="rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700"
        />
        <input
          type="number"
          step="any"
          defaultValue={current ?? 0}
          placeholder="Birim maliyet"
          className="rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700"
          onChange={(e) => {}}
          id={`cost-${id}`}
        />
        <button
          aria-label="Add to portfolio"
          disabled={alreadyInPortfolio || amount <= 0 || !current}
          onClick={() => {
            const input = document.getElementById(
              `cost-${id}`
            ) as HTMLInputElement | null;
            const costBasis = Number(input?.value ?? current ?? 0);
            if (amount > 0 && costBasis > 0) {
              add({ id, amount, costBasis });
            }
          }}
          className={`rounded-lg border px-3 py-2 text-sm
            ${
              alreadyInPortfolio
                ? "opacity-60 cursor-not-allowed border-neutral-300 dark:border-neutral-700"
                : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            }`}
        >
          {alreadyInPortfolio ? "Eklendi" : "Portföye ekle"}
        </button>
      </div>
    </div>
  );
}
