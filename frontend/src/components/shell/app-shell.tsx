"use client";

import AppLayout from "@cloudscape-design/components/app-layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { AppSideNavigation } from "./side-navigation";
import { AppToolbar } from "./toolbar";
import { AppTopNavigation } from "./top-navigation";
import { ConsoleFooter } from "./console-footer";
import { NotificationsFlashbar } from "@/providers/notifications-provider";
import { useAuth } from "@/providers/auth-provider";

/* CSS variable shortcuts — see src/app/globals.css :root */
const c = {
  lightBg: "var(--r53-light-bg)",
  lightBorder: "var(--r53-light-border)",
  awsOrange: "var(--r53-aws-orange)",
  darkTextPrimary: "var(--r53-dark-text-primary)",
  darkTextDim: "var(--r53-dark-text-dim)",
  lightTextSecondary: "var(--r53-light-text-primary)",
} as const;

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { status } = useAuth();
  const [navOpen, setNavOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: c.lightBg,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            border: `3px solid ${c.lightBorder}`,
            borderTopColor: c.awsOrange,
            borderRadius: "50%",
            animation: "r53-spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes r53-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <AppTopNavigation />
      <AppToolbar
        onToggleNav={() => setNavOpen(!navOpen)}
        onToggleTools={() => setToolsOpen(!toolsOpen)}
        navOpen={navOpen}
        toolsOpen={toolsOpen}
      />
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        <AppLayout
          navigation={<AppSideNavigation />}
          navigationOpen={navOpen}
          onNavigationChange={({ detail }) => setNavOpen(detail.open)}
          notifications={<NotificationsFlashbar />}
          tools={
            <div className="p-4">
              <h3 className="text-sm font-semibold" style={{ color: c.lightTextSecondary }}>Route 53 help</h3>
              <p className="mt-2 text-xs" style={{ color: c.darkTextDim }}>
                Welcome to the Route 53 clone. Use the sidebar to navigate between
                hosted zones, DNS records, and other Route 53 features.
              </p>
            </div>
          }
          toolsOpen={toolsOpen}
          onToolsChange={({ detail }) => setToolsOpen(detail.open)}
          contentType="default"
          disableContentPaddings
          content={children}
        />
      </div>
      <ConsoleFooter />
    </div>
  );
}
