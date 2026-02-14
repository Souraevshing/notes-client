"use client";

import {
  Archive,
  Loader2Icon,
  NotebookPen,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Editor } from "@/components/editor";
import { LayoutShell } from "@/components/layout-shell";
import { NoteList } from "@/components/notes-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { RootState } from "@/store";

import { useNotes } from "@/hooks/use-notes";
import type { Note } from "@/shared/schema";
import { setFilter, setSelectedNoteId } from "@/store/notes-slice";

export default function Home() {
  const dispatch = useDispatch();

  const selectedId = useSelector(
    (state: RootState) => state.notes.selectedNoteId,
  );

  const filter = useSelector((state: RootState) => state.notes.filter);

  const { notes, isLoading, error, createNote, deleteNote } = useNotes();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    return (notes as Note[])
      .filter((note) => {
        const matchesFilter =
          filter === "all" || (filter === "favorites" && note.isFavorite);

        const matchesSearch =
          note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
      );
  }, [notes, filter, searchQuery]);

  const handleCreate = async () => {
    try {
      const newNote = await createNote.mutateAsync({ title: "", content: "" });
      dispatch(setSelectedNoteId(newNote.id));
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (confirm("Are you sure you want to delete this note?")) {
      await deleteNote.mutateAsync(String(selectedId));
      dispatch(setSelectedNoteId(null));
    }
  };

  const selectedNote = notes.find((n) => n.id === selectedId);

  const sidebar = (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <NotebookPen className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-foreground">
            Scribe
          </h1>
        </div>

        <Button
          onClick={handleCreate}
          disabled={createNote.isPending}
          className="w-full justify-start gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          {createNote.isPending ? (
            <Loader2Icon className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin text-center justify-center" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          New Note
        </Button>
      </div>

      <div className="px-3 py-4 space-y-1">
        <Button
          variant="ghost"
          onClick={() => dispatch(setFilter("all"))}
          className={cn(
            "w-full justify-start gap-3 font-medium text-sm h-10 px-4 rounded-xl",
            filter === "all"
              ? "bg-white shadow-sm text-primary ring-1 ring-border/50"
              : "text-muted-foreground hover:bg-black/5",
          )}
        >
          <Archive className="w-4 h-4" />
          All Notes
          <span className="ml-auto text-xs opacity-50 font-normal">
            {notes.length}
          </span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => dispatch(setFilter("favorites"))}
          className={cn(
            "w-full justify-start gap-3 font-medium text-sm h-10 px-4 rounded-xl",
            filter === "favorites"
              ? "bg-white shadow-sm text-primary ring-1 ring-border/50"
              : "text-muted-foreground hover:bg-black/5",
          )}
        >
          <Star className="w-4 h-4" />
          Favorites
          <span className="ml-auto text-xs opacity-50 font-normal">
            {notes.filter((n) => n.isFavorite).length}
          </span>
        </Button>
      </div>
    </div>
  );

  return (
    <LayoutShell sidebar={sidebar}>
      <div className="flex h-full">
        {/* Notes List Column */}
        <div
          className={cn(
            "w-full md:w-80 lg:w-96 border-r border-border/40 flex flex-col bg-slate-50/30 transition-all duration-300",
            selectedId ? "hidden lg:flex" : "flex",
          )}
        >
          <div className="p-4 border-b border-border/40 backdrop-blur-sm bg-white/50 sticky top-0 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="pl-9 bg-white border-transparent shadow-sm focus:border-primary/20 transition-all duration-200"
              />
            </div>
          </div>
          <NoteList
            notes={filteredNotes}
            selectedId={selectedId}
            onSelect={(id) => dispatch(setSelectedNoteId(id))}
            isLoading={isLoading}
          />
        </div>

        {/* Editor Column */}
        <div
          className={cn(
            "flex-1 bg-white transition-all duration-500",
            !selectedId
              ? "hidden lg:flex items-center justify-center bg-slate-50/20"
              : "flex flex-col w-full absolute inset-0 lg:static z-20",
          )}
        >
          {selectedId ? (
            selectedNote ? (
              <>
                <div className="lg:hidden p-4 border-b flex items-center">
                  <Button
                    variant="ghost"
                    onClick={() => dispatch(setSelectedNoteId(null))}
                    className="-ml-2"
                  >
                    ← Back
                  </Button>
                </div>
                <Editor note={selectedNote} onDelete={handleDelete} />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Note not found
              </div>
            )
          ) : (
            <div className="text-center p-8 opacity-40 select-none">
              <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <NotebookPen className="w-16 h-16 text-slate-300" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-slate-700">
                Select a note to view
              </h2>
              <p className="text-slate-500 max-w-xs mx-auto">
                Choose a note from the list on the left, or create a new one to
                get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </LayoutShell>
  );
}
