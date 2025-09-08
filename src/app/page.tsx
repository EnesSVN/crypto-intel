import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Crypto Intelligence Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
          Gerçek verilerle (CoinGecko REST + Binance WebSocket) piyasa takibi,
          coin detayları, portföy PnL ve uyarılar — tek ekranda. Bu bir “demo”
          değil; <span className="font-semibold">server state</span> (React
          Query) ile <span className="font-semibold">client state</span>’i
          (Zustand) gerçek akışta ayırmayı pratik etmek için geliştirildi.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/coins"
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Piyasayı Keşfet →
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Portföy Oluştur
          </Link>
          <Link
            href="/alerts"
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Uyarı Tanımla
          </Link>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">
            Bu projeyi neden yapıyorum?
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Kariyer hedefim: gerçek dünyadaki veri akışlarını yönetebilen,
            performans ve UX’i önemseyen “üretime yakın” arayüzler geliştirmek.
            Bu projede:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300 list-disc pl-5">
            <li>
              REST’ten liste/detay/tarihsel veriyi <b>cache</b> ederek yönetmek,
            </li>
            <li>
              WebSocket ile <b>canlı fiyat akışı</b> ve yeniden bağlanma
              stratejisi,
            </li>
            <li>Server state ↔ Client state sınırını pratikte netleştirmek,</li>
            <li>
              Gerçek veride pagination, search, filtre, prefetch gibi kalıpları
              uygulamak.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Öğrenim hedefleri</h2>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300 list-disc pl-5">
            <li>
              React Query: cache key tasarımı, staleTime/GC, background refetch,
              prefetch
            </li>
            <li>
              Zustand: kalıcı (persist) kullanıcı tercihleri,
              watchlist/portföy/uyarılar
            </li>
            <li>Performans: sanal liste, skeleton/empty/error durumları</li>
            <li>
              Test: kritik akışların RTL + (gerekirse) MSW ile güvence altına
              alınması
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Öne çıkan modüller</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Markets</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              Top movers, arama/filtre, sıralama, infinite scroll. Veri:
              CoinGecko.
            </p>
            <Link
              href="/coins"
              className="inline-block mt-3 text-sm text-primary underline"
            >
              Git → /coins
            </Link>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Coin Detay</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              OHLC grafik (1D/7D/1M/1Y), canlı tiker (Binance WS), benzer
              coinler.
            </p>
            <Link
              href="/coins/bitcoin"
              className="inline-block mt-3 text-sm text-primary underline"
            >
              Örnek → /coins/bitcoin
            </Link>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Portfolio</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              USD/TRY toplam, canlı PnL; veri client-side saklanır (persist).
            </p>
            <Link
              href="/portfolio"
              className="inline-block mt-3 text-sm text-primary underline"
            >
              Git → /portfolio
            </Link>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Alerts</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              Fiyat eşikleri ( &gt; , &lt; ), toast/rozet ile bildirim; durumlar
              local persist.
            </p>
            <Link
              href="/alerts"
              className="inline-block mt-3 text-sm text-primary underline"
            >
              Git → /alerts
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Server State • React Query</h3>
          <ul className="mt-2 space-y-2 text-sm text-neutral-700 dark:text-neutral-300 list-disc pl-5">
            <li>Markets listesi (sayfa/filtre/sıralama)</li>
            <li>Coin detay &amp; tarihsel fiyat (market_chart)</li>
            <li>Background refetch &amp; prefetch</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Client State • Zustand</h3>
          <ul className="mt-2 space-y-2 text-sm text-neutral-700 dark:text-neutral-300 list-disc pl-5">
            <li>Watchlist, tablo görünümü, tema, para birimi (USD/TRY)</li>
            <li>Portföy (amount, cost basis) &amp; PnL</li>
            <li>Fiyat uyarıları ve kalıcı tercih yönetimi</li>
          </ul>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Gerçek veri kaynakları</h3>
          <ul className="mt-2 space-y-2 text-sm text-neutral-700 dark:text-neutral-300 list-disc pl-5">
            <li>CoinGecko REST (piyasa, detay, tarihsel)</li>
            <li>Binance WebSocket (canlı tiker)</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Teknoloji yığını</h3>
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
            Next.js (App Router) • TypeScript • Tailwind • React Query • Zustand
            • (Grafik: recharts / lightweight-charts)
          </p>
        </div>
      </section>

      <footer className="mt-14 text-center text-xs text-neutral-500">
        <p>
          Bu içerik eğitim amaçlıdır, yatırım tavsiyesi değildir. — ANKA Projesi
          kapsamında geliştirildi.
        </p>
      </footer>
    </main>
  );
}
