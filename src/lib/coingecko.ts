const API_BASE = "https://api.coingecko.com/api/v3";

export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
};

export type CoinDetail = {
  id: string;
  symbol: string;
  name: string;
  image: { small: string; thumb?: string; large?: string };
  market_data: {
    current_price: Record<string, number>;
    price_change_percentage_24h_in_currency: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
  };
};

type MarketsParams = {
  vs?: string;
  page?: number;
  perPage?: number;
  order?: string;
};

export async function getMarkets({
  vs = "usd",
  page = 1,
  perPage = 25,
  order = "market_cap_desc",
}: MarketsParams): Promise<MarketCoin[]> {
  const url = `${API_BASE}/coins/markets?vs_currency=${vs}&order=${order}&per_page=${perPage}&page=${page}&price_change_percentage=24h`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "x-cg-demo": "crypto-intel" },
  });
  if (!res.ok) {
    throw new Error(`CoinGecko error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getCoinDetail(id: string): Promise<CoinDetail> {
  const url = `${API_BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok)
    throw new Error(`CoinGecko error: ${res.status} ${res.statusText}`);
  return res.json();
}

export type ChartPoint = { t: number; price: number };

export async function getMarketChart(params: {
  id: string;
  vs?: string;
  days?: number;
}): Promise<ChartPoint[]> {
  const { id, vs = "usd", days = 30 } = params;
  const url = `${API_BASE}/coins/${id}/market_chart?vs_currency=${vs}&days=${days}&precision=2`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok)
    throw new Error(`CoinGecko error: ${res.status} ${res.statusText}`);
  const json = await res.json();
  return (json.prices as [number, number][]).map(([t, p]) => ({ t, price: p }));
}
