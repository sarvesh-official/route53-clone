"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoginForm } from "@/features/auth/login-form";
import { useAuth } from "@/providers/auth-provider";

const FONT = '"Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fafafa",
        fontFamily: FONT,
        color: "#0f141a",
      }}
    >
      {/* Top bar: AWS logo left, utility buttons right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
        }}
      >
        <a href="/login" onClick={(e) => e.preventDefault()}>
          <img
            src="/assets/aws-logo-login.png"
            alt="Amazon Web Services logo"
            style={{ height: 51, width: 84 }}
          />
        </a>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: FONT,
              color: "#0f141a",
              padding: "4px 8px",
            }}
          >
            English
          </button>
        </div>
      </div>

      {/* Content row: form (340px) + marketing banner (570px) */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          flex: 1,
          padding: "48px 24px",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* Form column */}
        <div style={{ width: 340, flexShrink: 0 }}>
          <LoginForm />
        </div>

        {/* Marketing banner */}
        <div style={{ flexShrink: 0 }}>
          <img
            src="/assets/marketing-banner.png"
            alt="Amazon Web Services Marketing"
            style={{
              width: 570,
              height: 450,
              borderRadius: 16,
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Copyright footer */}
      <div
        style={{
          fontSize: 12,
          color: "#687078",
          fontFamily: FONT,
          textAlign: "center",
          padding: "16px 24px",
        }}
      >
        (Clone) 2026 Route 53 Clone. Built for Scaler AI Labs assignment.
      </div>
    </div>
  );
}
