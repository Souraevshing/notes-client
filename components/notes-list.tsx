"use client";

import { formatDistanceToNow } from "date-fns";
import { FileText, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { type Note } from "@/shared/schema";

export function NoteList({
  notes,
  selectedId,
  onSelect,
  isLoading,
}: {
  notes: Note[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-xl w-full" />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
        <FileText className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-medium">No notes found</p>
        <p className="text-xs mt-1 opacity-70">
          Create a new note to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onSelect(note.id)}
          className={cn(
            "w-full text-left p-4 rounded-xl transition-all duration-200 border border-transparent group relative overflow-hidden",
            selectedId === note.id
              ? "bg-white shadow-lg shadow-primary/5 border-border/50 ring-1 ring-primary/10"
              : "hover:bg-muted/50 hover:border-border/30",
          )}
        >
          {selectedId === note.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
          )}

          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3
              className={cn(
                "font-semibold truncate pr-4 text-sm",
                selectedId === note.id ? "text-primary" : "text-foreground",
              )}
            >
              {note.title || "Untitled Note"}
            </h3>
            {note.isFavorite && (
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 font-normal">
            {note.content || "No additional text"}
          </p>

          <div className="flex items-center text-[10px] text-muted-foreground/70 uppercase tracking-wider font-medium">
            {note.createdAt &&
              formatDistanceToNow(new Date(note.createdAt), {
                addSuffix: true,
              })}
          </div>
        </button>
      ))}
    </div>
  );
}
