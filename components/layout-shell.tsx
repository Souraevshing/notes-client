"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function LayoutShell({
  children,
  sidebar,
  className,
}: {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {sidebar && (
        <aside className="hidden md:flex flex-col w-64 border-r border-border/50 bg-card/50 backdrop-blur-sm z-10">
          {sidebar}
        </aside>
      )}
      <main
        className={cn(
          "flex-1 flex flex-col min-w-0 overflow-hidden relative",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
