import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const vs = searchParams.get("vs") ?? "usd";
  const page = searchParams.get("page") ?? "1";
  const perPage = searchParams.get("perPage") ?? "25";
  const order = searchParams.get("order") ?? "market_cap_desc";

  const url =
    `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=${vs}&order=${order}&per_page=${perPage}&page=${page}` +
    `&price_change_percentage=1h,24h,7d`;

  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    const body = await res.json();
    return NextResponse.json(body, {
      status: res.status,
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  }
}
