"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import supabase from "@/lib/supabase-client";
import { ROUTES } from "@/shared/routes";
import { CreateNoteRequest, Note, UpdateNoteRequest } from "@/shared/schema";

async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

async function fetchNotes() {
  const token = await getToken();
  const res = await fetch(ROUTES.notes, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

async function createNoteFn(note: CreateNoteRequest): Promise<Note> {
  const token = await getToken();
  const res = await fetch(ROUTES.notes, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

async function updateNoteFn(
  note: {
    id: string;
  } & Partial<UpdateNoteRequest>,
): Promise<Note> {
  const token = await getToken();
  const body: Partial<UpdateNoteRequest> = {};
  if (note.title !== undefined) {
    body.title = note.title;
  }
  if (note.content !== undefined) {
    body.content = note.content;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((note as any).isFavorite !== undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (body as any).isFavorite = (note as any).isFavorite;

  const res = await fetch(`${ROUTES.notes}/${note.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteNote = useMutation({
    mutationFn: deleteNoteFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  return { notes, isLoading, error, createNote, updateNote, deleteNote };
}
