"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listNotes, createNote, type Note } from "@/lib/notes";

export function useNotes(coinId: string) {
  const qc = useQueryClient();
  const key = ["notes", { coinId }];

  const list = useQuery<Note[], Error>({
    queryKey: key,
    queryFn: () => listNotes(coinId),
    staleTime: 0,
  });

  const create = useMutation({
    mutationFn: ({ text }: { text: string }) => createNote(coinId, text),
    onMutate: async ({ text }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Note[]>(key) ?? [];
      const temp: Note = {
        id: `temp-${Math.random().toString(36).slice(2)}`,
        coinId,
        text,
        createdAt: Date.now(),
      };
      qc.setQueryData<Note[]>(key, [temp, ...prev]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSuccess: (server) => {
      qc.setQueryData<Note[]>(key, (cur = []) => {
        const filtered = cur.filter((n) => !String(n.id).startsWith("temp-"));
        return [server, ...filtered];
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });
    },
  });

  return {
    ...list,
    createNote: create.mutateAsync,
    creating: create.isPending,
    createError: create.error as Error | null,
  };
}
