"use client";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";
import { store } from "@/store";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Provider } from "react-redux";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Provider store={store}>
          <Toaster />
          {children}
        </Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
