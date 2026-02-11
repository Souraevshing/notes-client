import { useToast } from "@/hooks/use-toast";
import {
        api,
        buildUrl,
        type CreateNoteRequest,
        type UpdateNoteRequest,
} from "@/shared/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useNotes() {
  return useQuery({
    queryKey: [api.notes.list.path],
    queryFn: async () => {
      const res = await fetch(api.notes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      return api.notes.list.responses[200].parse(data);
    },
  });
}

export function useNote(id: number | null) {
  return useQuery({
    queryKey: [api.notes.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.notes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch note");
      const data = await res.json();
      return api.notes.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (note: CreateNoteRequest) => {
      const res = await fetch(api.notes.create.path, {
        method: api.notes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create note");
      }

      const data = await res.json();
      return api.notes.create.responses[201].parse(data);
    },
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      // Optimistically update the list if possible, or just invalidate
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: number } & UpdateNoteRequest) => {
      const url = buildUrl(api.notes.update.path, { id });
      const res = await fetch(url, {
        method: api.notes.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update note");
      }

      const data = await res.json();
      return api.notes.update.responses[200].parse(data);
    },
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      queryClient.setQueryData(
        [api.notes.get.path, updatedNote.id],
        updatedNote,
      );
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.notes.delete.path, { id });
      const res = await fetch(url, {
        method: api.notes.delete.method,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete note");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      toast({
        title: "Deleted",
        description: "Note has been moved to trash.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
