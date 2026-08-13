"use client";

import AppLayout from "@cloudscape-design/components/app-layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { AppBreadcrumbs } from "./breadcrumbs";
import { AppSideNavigation } from "./side-navigation";
import { AppTopNavigation } from "./top-navigation";
import { NotificationsFlashbar } from "@/providers/notifications-provider";
import { useAuth } from "@/providers/auth-provider";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { status } = useAuth();

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
          backgroundColor: "#fafafa",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            border: "3px solid #e9ebed",
            borderTopColor: "#ff9900",
            borderRadius: "50%",
            animation: "r53-spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes r53-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <AppTopNavigation />
      <AppLayout
        navigation={<AppSideNavigation />}
        breadcrumbs={<AppBreadcrumbs />}
        notifications={<NotificationsFlashbar />}
        toolsHide
        contentType="default"
        content={children}
      />
    </>
  );
}
