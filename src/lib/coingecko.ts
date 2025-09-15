const PAGE_BASE = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";

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

export type ChartPoint = { t: number; price: number };

type MarketsParams = {
  vs?: "usd" | "try";
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
  const url = `${PAGE_BASE}/api/cg/markets?vs=${vs}&page=${page}&perPage=${perPage}&order=${encodeURIComponent(
    order
  )}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok)
    throw new Error(`Markets error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getCoinDetail(id: string): Promise<CoinDetail> {
  const url = `${PAGE_BASE}/api/cg/coin/${encodeURIComponent(id)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Detail error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getMarketChart(params: {
  id: string;
  vs?: "usd" | "try";
  days?: number;
}): Promise<ChartPoint[]> {
  const { id, vs = "usd", days = 30 } = params;
  const url = `${PAGE_BASE}/api/cg/coin/${encodeURIComponent(
    id
  )}/chart?vs=${vs}&days=${days}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Chart error: ${res.status} ${res.statusText}`);
  const json = await res.json();
  return (json.prices as [number, number][]).map(([t, p]) => ({ t, price: p }));
}
