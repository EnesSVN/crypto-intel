"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = "USD" | "TRY";

export type PortfolioItem = {
  id: string;
  amount: number;
  costBasis: number;
};

type AppState = {
  currency: Currency;
  setCurrency: (c: Currency) => void;

  watchlist: string[];
  toggleWatch: (id: string) => void;
  inWatch: (id: string) => boolean;

  portfolio: PortfolioItem[];
  addPortfolio: (item: PortfolioItem) => void;
  removePortfolio: (id: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currency: "USD",
      setCurrency: (c) => set({ currency: c }),

      watchlist: [],
      toggleWatch: (id) => {
        const cur = get().watchlist;
        if (cur.includes(id)) {
          set({ watchlist: cur.filter((x) => x !== id) });
        } else {
          set({ watchlist: [...cur, id] });
        }
      },
      inWatch: (id) => get().watchlist.includes(id),

      portfolio: [],
      addPortfolio: (item) => {
        const exists = get().portfolio.some((p) => p.id === item.id);
        if (exists) {
          return;
        }
        set({ portfolio: [...get().portfolio, item] });
      },
      removePortfolio: (id) =>
        set({ portfolio: get().portfolio.filter((p) => p.id !== id) }),
    }),
    { name: "crypto-intel-app" }
  )
);
