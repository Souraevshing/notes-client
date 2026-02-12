import { useEffect, useState } from "react";

import supabase from "@/lib/supabase-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  }

  async function fetchNotes() {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setNotes(data);
      else setError(data.error);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createNote(title: string, content: string) {
    const token = await getToken();
    const res = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (res.ok) setNotes((prev) => [...prev, ...data]);
    else setError(data.error);
  }

  async function updateNote(id: string, title: string, content: string) {
    const token = await getToken();
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (res.ok) {
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, ...data[0] } : note)),
      );
    } else setError(data.error);
  }

  async function deleteNote(id: string) {
    const token = await getToken();
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}
