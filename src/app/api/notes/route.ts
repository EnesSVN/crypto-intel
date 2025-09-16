import { NextResponse } from "next/server";

type Note = { id: string; coinId: string; text: string; createdAt: number };
const notes: Note[] = [];

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const coinId = searchParams.get("coinId");
  const list = coinId ? notes.filter((n) => n.coinId === coinId) : notes;
  return NextResponse.json(list, {
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.coinId || !body?.text) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  await new Promise((r) => setTimeout(r, 600));
  if (Math.random() < 0.1) {
    return NextResponse.json({ error: "random_fail" }, { status: 500 });
  }
  const note: Note = {
    id: Math.random().toString(36).slice(2),
    coinId: String(body.coinId),
    text: String(body.text).slice(0, 500),
    createdAt: Date.now(),
  };
  notes.unshift(note);
  return NextResponse.json(note, {
    status: 201,
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
