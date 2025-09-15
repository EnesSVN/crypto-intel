import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  _context: { params: { id: string } }
) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");
  const coinId = pathSegments[pathSegments.length - 1];

  const apiUrl =
    `https://api.coingecko.com/api/v3/coins/${coinId}` +
    `?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

  try {
    const res = await fetch(apiUrl, {
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
