const MAP: Record<string, string> = {
  bitcoin: "BTCUSDT",
  ethereum: "ETHUSDT",
  binancecoin: "BNBUSDT",
  solana: "SOLUSDT",
  ripple: "XRPUSDT",
  cardano: "ADAUSDT",
  dogecoin: "DOGEUSDT",
  tron: "TRXUSDT",
  "polygon-pos": "MATICUSDT",
  polkadot: "DOTUSDT",
  litecoin: "LTCUSDT",
  chainlink: "LINKUSDT",
  "avalanche-2": "AVAXUSDT",
  toncoin: "TONUSDT",
  "internet-computer": "ICPUSDT",
  near: "NEARUSDT",
  uniswap: "UNIUSDT",
  aptos: "APTUSDT",
  sui: "SUIUSDT",
  "shiba-inu": "SHIBUSDT",
  pepe: "PEPEUSDT",
  "render-token": "RNDRUSDT",
  "lido-dao": "LDOUSDT",
  arbitrum: "ARBUSDT",
  optimism: "OPUSDT",
  cosmos: "ATOMUSDT",
  stellar: "XLMUSDT",
  maker: "MKRUSDT",
};

export function mapToBinanceSymbol(
  coinGeckoId: string,
  fallbackSymbol?: string
): string | null {
  if (MAP[coinGeckoId]) return MAP[coinGeckoId];
  if (fallbackSymbol) return `${fallbackSymbol.toUpperCase()}USDT`;
  return null;
}
