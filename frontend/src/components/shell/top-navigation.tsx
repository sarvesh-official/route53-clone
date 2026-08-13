"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";

const FONT = '"Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif';

const btnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid transparent",
  color: "#dedee3",
  fontSize: 14,
  fontWeight: 500,
  fontFamily: FONT,
  padding: "10px 16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
  height: 48,
};

const iconBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid transparent",
  color: "#d5dbdb",
  fontSize: 16,
  fontFamily: FONT,
  padding: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};

const dropdownStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid transparent",
  color: "#dedee3",
  fontSize: 12,
  fontWeight: 500,
  fontFamily: FONT,
  padding: "10px 16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 4,
  height: 48,
};

export function AppTopNavigation() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav
      style={{
        backgroundColor: "#161d26",
        height: 48,
        display: "flex",
        alignItems: "center",
        fontFamily: FONT,
        width: "100%",
      }}
    >
      {/* Left section: Logo + Services */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <a
          href="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            router.push("/dashboard");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            height: 48,
            width: 65,
            color: "#dedee3",
            textDecoration: "none",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/aws-logo-white.svg"
            alt="AWS"
            style={{ height: 19, width: 33, display: "block" }}
          />
        </a>
        <button style={btnStyle}>Services</button>
      </div>

      {/* Center: Search bar */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
          minWidth: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 540,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#a2a6ad",
              fontSize: 14,
              pointerEvents: "none",
              lineHeight: 1,
            }}
          >
            &#128269;
          </span>
          <input
            type="text"
            placeholder="Search"
            style={{
              width: "100%",
              height: 30,
              backgroundColor: "transparent",
              border: "2px solid #656871",
              borderRadius: 8,
              color: "#ebebf0",
              fontSize: 14,
              fontFamily: FONT,
              padding: "1px 83px 1px 35px",
              outline: "none",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#a2a6ad",
              fontSize: 12,
              pointerEvents: "none",
              lineHeight: 1,
            }}
          >
            [Option+S]
          </span>
        </div>
      </div>

      {/* Right section: Action buttons */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <button style={btnStyle}>
          <span style={{ fontSize: 16 }}>Q</span>
          Amazon Q
        </button>

        <button style={btnStyle}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 5l2.997 2.998L5 11m4.997-.002H12m3-7.626A2.374 2.374 0 0012.627 1H3.37A2.372 2.372 0 001 3.372v9.256a2.373 2.373 0 002.37 2.373h9.257A2.375 2.375 0 0015 12.628V3.372z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          CloudShell
        </button>

        <button style={iconBtnStyle} title="Notifications">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 12H2c-.39 0-.63-.44-.41-.76L4 8V5c0-2.21 1.79-4 4-4s4 1.79 4 4v3l2.41 3.24c.22.33-.02.76-.41.76ZM6 13c0 1.1.9 2 2 2s2-.9 2-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button style={iconBtnStyle} title="Help & support">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M5.75 6.338c.13-1.178.811-2.339 2.37-2.339 1.472 0 2.435 1.312 2.042 2.468-.215.633-.916 1.132-1.385 1.578C8.162 8.631 8 9.2 8 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M8 12.01h.01V12H8v.01Z" fill="currentColor" />
          </svg>
        </button>

        <button style={iconBtnStyle} title="Settings">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <button style={dropdownStyle}>
          Global
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 11h8L8 5l-4 6z" />
          </svg>
        </button>

        <button style={iconBtnStyle} title="Toggle theme" onClick={toggle}>
          {theme === "dark" ? "\u2600" : "\u263D"}
        </button>

        <div style={{ position: "relative" }}>
          <button
            style={dropdownStyle}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M2 15c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            {user?.display_name ?? "Account"}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 11h8L8 5l-4 6z" />
            </svg>
          </button>
          {userMenuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 48,
                backgroundColor: "#161d26",
                border: "1px solid #41474f",
                borderRadius: 4,
                minWidth: 200,
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #41474f",
                  color: "#ebebf0",
                  fontSize: 14,
                }}
              >
                {user?.email}
              </div>
              <button
                style={{
                  ...btnStyle,
                  width: "100%",
                  justifyContent: "flex-start",
                  height: "auto",
                  padding: "12px 16px",
                }}
                onClick={() => {
                  setUserMenuOpen(false);
                  void logout().then(() => router.push("/login"));
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
