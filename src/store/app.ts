"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = "USD" | "TRY";

export type AlertOp = ">" | "<";
export type AlertRule = {
  id: string;
  op: AlertOp;
  price: number;
  active: boolean;
  lastTriggeredAt?: number;
};

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

  alerts: AlertRule[];
  addAlert: (rule: AlertRule) => void;
  removeAlert: (id: string, op: AlertOp, price: number) => void;
  toggleAlert: (id: string, op: AlertOp, price: number) => void;
  markTriggered: (id: string, op: AlertOp, price: number) => void;
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

      alerts: [],
      addAlert: (rule) => {
        const s = get();
        const exists = s.alerts.some(
          (a) => a.id === rule.id && a.op === rule.op && a.price === rule.price
        );
        if (!exists) set({ alerts: [...s.alerts, rule] });
      },
      removeAlert: (id, op, price) => {
        set({
          alerts: get().alerts.filter(
            (a) => !(a.id === id && a.op === op && a.price === price)
          ),
        });
      },
      toggleAlert: (id, op, price) => {
        set({
          alerts: get().alerts.map((a) =>
            a.id === id && a.op === op && a.price === price
              ? { ...a, active: !a.active }
              : a
          ),
        });
      },
      markTriggered: (id, op, price) => {
        set({
          alerts: get().alerts.map((a) =>
            a.id === id && a.op === op && a.price === price
              ? { ...a, lastTriggeredAt: Date.now() }
              : a
          ),
        });
      },
    }),
    { name: "crypto-intel-app" }
  )
);
