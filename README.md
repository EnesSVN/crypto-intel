# Crypto Intelligence Dashboard

Kısa tanım: CoinGecko (REST) ve Binance (WS) ile kripto piyasasını izlemek için basit ama **üretime yakın** bir Next.js uygulaması.

> **Not:** Eğitim amaçlıdır, yatırım tavsiyesi değildir.

## Özellikler

- **Markets** (/coins): gerçek veri, USD/TRY, sonsuz kaydırma
- **Coin Detay**: grafik + Binance canlı fiyat (WS)
- **Watchlist (⭐)** ve **Portfolio**: yerel (Zustand, persist)
- **Alerts**: fiyat eşiği, periyodik kontrol
- **Proxy**: Tüm CoinGecko çağrıları `/api/cg/*` üzerinden (CORS yok)

## Teknoloji

Next.js (App Router) · TypeScript · Tailwind · TanStack Query · Zustand · Recharts

## Kurulum

```bash
npm i
npm run dev   # http://localhost:3000
```

## Komutlar

```bash
npm run build  # prod build
npm start      # prod start
```
