"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AppProviders } from "@/providers/app-providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>{children}</AppProviders>
    </QueryClientProvider>
  );
}
