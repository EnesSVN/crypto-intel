"use client";

import { useAppStore } from "@/store/app";

export default function Topbar() {
  const currency = useAppStore((s) => s.currency);
  const setCurrency = useAppStore((s) => s.setCurrency);

  return (
    <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto max-w-6xl flex items-center justify-end gap-2 px-4 py-2 text-xs">
        <span className="opacity-70">Currency:</span>
        <button
          onClick={() => setCurrency(currency === "USD" ? "TRY" : "USD")}
          className="rounded-md border border-neutral-300 px-2 py-1 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          {currency}
        </button>
      </div>
    </div>
  );
}
