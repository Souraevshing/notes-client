"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import supabase from "@/lib/supabase-client";
import { ROUTES } from "@/shared/routes";
import { CreateNoteRequest, Note, UpdateNoteRequest } from "@/shared/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNote(row: any): Note {
  return {
    id: row.id,
    title: row.title ?? "",
    content: row.content ?? "",
    isFavorite: Boolean(row.is_favorite ?? false),
    createdAt: row.created_at ?? null,
  };
}

async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

async function fetchNotes(): Promise<Note[]> {
  const token = await getToken();
  const res = await fetch(ROUTES.notes, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch notes");
  const data = await res.json();
  return (Array.isArray(data) ? data : (data.data ?? [])).map(mapNote);
}

async function createNoteFn(note: CreateNoteRequest): Promise<Note> {
  const token = await getToken();
  const res = await fetch(ROUTES.notes, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: note.title,
      content: note.content,
    }),
  });
  if (!res.ok) throw new Error("Failed to create note");
  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : (data.data ?? data);
  return mapNote(row);
}

async function updateNoteFn(
  note: {
    id: string;
  } & Partial<UpdateNoteRequest>,
): Promise<Note> {
  const token = await getToken();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = {};
  if (note.title !== undefined) body.title = note.title;
  if (note.content !== undefined) body.content = note.content;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((note as any).isFavorite !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body.is_favorite = (note as any).isFavorite;
  }

  const res = await fetch(`${ROUTES.notes}/${note.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update note");
  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : (data.data ?? data);
  return mapNote(row);
}

async function deleteNoteFn(id: string) {
  const token = await getToken();
  const res = await fetch(`${ROUTES.notes}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
}

export function useNotes() {
  const queryClient = useQueryClient();

  const {
    data: notes = [],
    isLoading,
    error,
  } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const createNote = useMutation<Note, Error, CreateNoteRequest>({
    mutationFn: createNoteFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const updateNote = useMutation<
    Note,
    Error,
    { id: string } & Partial<UpdateNoteRequest>
  >({
    mutationFn: updateNoteFn,
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previous = queryClient.getQueryData<Note[]>(["notes"]);
      if (previous) {
        queryClient.setQueryData<Note[]>(
          ["notes"],
          previous.map((n) =>
            n.id === Number(vars.id)
              ? {
                  ...n,
                  ...(vars.title !== undefined ? { title: vars.title } : {}),
                  ...(vars.content !== undefined
                    ? { content: vars.content }
                    : {}),
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ...((vars as any).isFavorite !== undefined
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      { isFavorite: (vars as any).isFavorite }
                    : {}),
                }
              : n,
          ),
        );
      }
      return { previous };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (_err, _vars, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(["notes"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteNote = useMutation({
    mutationFn: deleteNoteFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  return { notes, isLoading, error, createNote, updateNote, deleteNote };
}
