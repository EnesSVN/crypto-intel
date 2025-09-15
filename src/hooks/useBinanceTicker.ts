"use client";

import { useEffect, useRef, useState } from "react";

type Ticker = {
  last: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  changePercent: number | null;
  ts: number | null;
  connected: boolean;
  error?: string;
};

export function useBinanceTicker(symbol: string | null) {
  const [tick, setTick] = useState<Ticker>({
    last: null,
    open: null,
    high: null,
    low: null,
    changePercent: null,
    ts: null,
    connected: false,
  });
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const connect = () => {
      const url = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retryRef.current = 0;
        setTick((t) => ({ ...t, connected: true, error: undefined }));
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          const last = Number(msg.c);
          const open = Number(msg.o);
          const high = Number(msg.h);
          const low = Number(msg.l);
          const pct = Number(msg.P);
          const ts = Number(msg.E);
          if (!Number.isNaN(last)) {
            setTick({
              last,
              open,
              high,
              low,
              changePercent: pct,
              ts,
              connected: true,
            });
          }
        } catch (e: unknown) {
          setTick((t) => ({ ...t, error: "parse_error" }));
        }
      };

      const scheduleReconnect = () => {
        const delay = Math.min(30000, 1000 * Math.pow(2, retryRef.current++));
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(
          connect,
          delay
        ) as unknown as number;
      };

      ws.onclose = () => {
        setTick((t) => ({ ...t, connected: false }));
        scheduleReconnect();
      };
      ws.onerror = () => {
        setTick((t) => ({ ...t, connected: false, error: "ws_error" }));
        try {
          ws.close();
        } catch {}
      };
    };

    connect();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)
        wsRef.current.close();
      wsRef.current = null;
    };
  }, [symbol]);

  return tick;
}
