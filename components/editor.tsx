/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { format } from "date-fns";
import { Check, Clock, Star, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useNotes } from "@/hooks/use-notes";
import { cn } from "@/lib/utils";
import { type Note } from "@/shared/schema";

export function Editor({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: () => void;
}) {
  const [title, setTitle] = React.useState(note.title);
  const [content, setContent] = React.useState(note.content || "");
  const [isSaved, setIsSaved] = React.useState(true);

  const { updateNote } = useNotes();

  React.useEffect(() => {
    setTitle(note.title);
    setContent(note.content || "");
    setIsSaved(true);
  }, [note.id]);

  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 1000);

  React.useEffect(() => {
    if (
      debouncedTitle === note.title &&
      debouncedContent === (note.content || "")
    ) {
      return;
    }

    const save = async () => {
      setIsSaved(false);
      try {
        await updateNote.mutateAsync({
          id: String(note.id),
          title: debouncedTitle,
          content: debouncedContent,
        });
        setIsSaved(true);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Failed to save note: ${error.message}`);
        }
        setIsSaved(true);
      }
    };

    save();
  }, [debouncedTitle, debouncedContent]);

  const toggleFavorite = () => {
    updateNote.mutate({
      id: String(note.id),
      isFavorite: !note.isFavorite,
    });
    toast.success(
      `Note marked as ${!note.isFavorite ? "favorite" : "not favorite"}`,
    );
  };

  return (
    <div className="flex flex-col h-full bg-white/50 animate-in">
      <div className="flex items-center justify-between px-8 py-6 border-b border-border/40 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              isSaved ? "text-green-600/80" : "text-amber-500/80",
            )}
          >
            {isSaved ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5 animate-pulse" />
            )}
            {isSaved ? "Saved" : "Saving..."}
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>
            {note.createdAt
              ? format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")
              : ""}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-200",
              note.isFavorite
                ? "text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 hover:text-yellow-500"
                : "text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10",
            )}
            title={
              note.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Star
              className={cn("w-4 h-4", note.isFavorite && "fill-current")}
            />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto px-8 py-12">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-4xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40 outline-none border-none p-0 mb-6 font-display"
            placeholder="Note Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[calc(100vh-300px)] resize-none bg-transparent text-lg text-foreground/80 placeholder:text-muted-foreground/40 outline-none border-none p-0 leading-relaxed font-serif"
            placeholder="Start typing your thoughts..."
          />
        </div>
      </div>
    </div>
  );
}
