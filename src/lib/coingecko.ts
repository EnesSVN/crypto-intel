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
