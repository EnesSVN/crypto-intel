const BASE = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";

export type Note = {
  id: string;
  coinId: string;
  text: string;
  createdAt: number;
};

export async function listNotes(coinId: string): Promise<Note[]> {
  const res = await fetch(
    `${BASE}/api/notes?coinId=${encodeURIComponent(coinId)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Notes list error: ${res.status}`);
  return res.json();
}

export async function createNote(coinId: string, text: string): Promise<Note> {
  const res = await fetch(`${BASE}/api/notes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ coinId, text }),
  });
  if (!res.ok) throw new Error(`Create note error: ${res.status}`);
  return res.json();
}
