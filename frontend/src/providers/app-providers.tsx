"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "./auth-provider";
import { BreadcrumbProvider } from "./breadcrumb-provider";
import { NotificationsProvider } from "./notifications-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BreadcrumbProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </BreadcrumbProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
