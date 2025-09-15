"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/store/app";
import { useSimplePrices } from "@/hooks/useSimplePrices";

function Badge({
  children,
  kind = "neutral",
}: {
  children: React.ReactNode;
  kind?: "neutral" | "ok" | "warn";
}) {
  const cls =
    kind === "ok"
      ? "border-emerald-400 text-emerald-600 dark:text-emerald-400"
      : kind === "warn"
      ? "border-amber-400 text-amber-600 dark:text-amber-300"
      : "border-neutral-300 text-neutral-600 dark:text-neutral-300";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {children}
    </span>
  );
}

export default function AlertsPage() {
  const currency = useAppStore((s) => s.currency);
  const alerts = useAppStore((s) => s.alerts);
  const addAlert = useAppStore((s) => s.addAlert);
  const removeAlert = useAppStore((s) => s.removeAlert);
  const toggleAlert = useAppStore((s) => s.toggleAlert);
  const markTriggered = useAppStore((s) => s.markTriggered);

  const [id, setId] = useState("");
  const [op, setOp] = useState<">" | "<">(">");
  const [price, setPrice] = useState<number>(0);

  const ids = useMemo(
    () => Array.from(new Set(alerts.map((a) => a.id))),
    [alerts]
  );
  const vs = currency.toLowerCase() as "usd" | "try";
  const { data: prices } = useSimplePrices(ids, vs, 8_000);

  const fired = useMemo(() => {
    if (!prices) return new Set<string>();
    const set = new Set<string>();
    for (const a of alerts) {
      const p = prices[a.id]?.[vs];
      if (typeof p !== "number" || !a.active) continue;
      if ((a.op === ">" && p > a.price) || (a.op === "<" && p < a.price)) {
        set.add(`${a.id}|${a.op}|${a.price}`);
      }
    }
    return set;
  }, [alerts, prices, vs]);

  const now = Date.now();
  alerts.forEach((a) => {
    const key = `${a.id}|${a.op}|${a.price}`;
    const isFire = fired.has(key);
    const cooldownPassed =
      !a.lastTriggeredAt || now - a.lastTriggeredAt > 60_000;
    if (isFire && cooldownPassed) {
      markTriggered(a.id, a.op, a.price);
    }
  });

  function addRule(e: React.FormEvent) {
    e.preventDefault();
    const coinId = id.trim().toLowerCase();
    if (!coinId || price <= 0) return;
    addAlert({ id: coinId, op, price, active: true });
    setId("");
    setPrice(0);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Alerts</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
        Fiyat eşiği uyarıları (client rules). Fiyatlar <b>{currency}</b>{" "}
        cinsinden değerlendirilir. Periyodik kontrol: ~8s.
      </p>

      {/* Form */}
      <form
        onSubmit={addRule}
        className="mb-8 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder='Coin id (örn: "bitcoin")'
          className="rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700"
        />
        <select
          value={op}
          onChange={(e) => setOp(e.target.value as ">" | "<")}
          className="rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700"
        >
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
        </select>
        <input
          type="number"
          step="any"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder={`Eşik (${currency})`}
          className="rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700"
        />
        <button
          type="submit"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Ekle
        </button>
      </form>

      {/* Liste */}
      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
          Henüz kural yok. Örnek:{" "}
          <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">
            bitcoin &gt; 1000000
          </code>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr className="text-left">
                <th className="px-4 py-3">Coin</th>
                <th className="px-4 py-3">Kural</th>
                <th className="px-4 py-3">Anlık Fiyat</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3 w-40">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => {
                const key = `${a.id}|${a.op}|${a.price}`;
                const p = prices?.[a.id]?.[vs];
                const firedNow = fired.has(key);
                const last = a.lastTriggeredAt
                  ? new Date(a.lastTriggeredAt).toLocaleTimeString()
                  : "-";
                return (
                  <tr
                    key={key}
                    className="border-t border-neutral-100 dark:border-neutral-800"
                  >
                    <td className="px-4 py-3 font-medium">{a.id}</td>
                    <td className="px-4 py-3">
                      {a.op} {a.price} {currency}
                    </td>
                    <td className="px-4 py-3">
                      {typeof p === "number"
                        ? new Intl.NumberFormat(
                            currency === "TRY" ? "tr-TR" : "en-US",
                            { style: "currency", currency }
                          ).format(p)
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {a.active ? (
                        firedNow ? (
                          <Badge kind="ok">Tetiklendi</Badge>
                        ) : (
                          <Badge>İzleniyor</Badge>
                        )
                      ) : (
                        <Badge kind="warn">Pasif</Badge>
                      )}
                      <span className="ml-2 text-xs opacity-70">
                        Son: {last}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleAlert(a.id, a.op, a.price)}
                          className="rounded-lg border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                        >
                          {a.active ? "Durdur" : "Aktifleştir"}
                        </button>
                        <button
                          onClick={() => removeAlert(a.id, a.op, a.price)}
                          className="rounded-lg border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
