"use client";

import Button from "@cloudscape-design/components/button";
import CopyToClipboard from "@cloudscape-design/components/copy-to-clipboard";
import Divider from "@cloudscape-design/components/divider";
import FormField from "@cloudscape-design/components/form-field";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";

/* CSS variable shortcuts for inline use.
   Top nav is always dark (AWS console style).
   Dropdowns use --r53-dropdown-* vars which swap via .awsui-dark-mode in globals.css. */
const c = {
  // Top nav (always dark)
  darkSurface: "var(--r53-dark-surface)",
  darkBorderAlt: "var(--r53-dark-border-alt)",
  darkTextSecondary: "var(--r53-dark-text-secondary)",
  darkTextDim: "var(--r53-dark-text-dim)",
  darkBorder: "var(--r53-dark-border)",
  darkSurfaceAlt: "var(--r53-dark-surface-alt)",
  darkTextPrimary: "var(--r53-dark-text-primary)",
  darkAccountCard: "var(--r53-dark-account-card)",
  darkAccountCardHover: "var(--r53-dark-account-card-hover)",
  darkAccent: "var(--r53-dark-accent)",
  darkTextMuted: "var(--r53-dark-text-muted)",
  sharedWhite: "var(--r53-shared-white)",
  accountColour: "#7D8998",
  // Dropdowns (theme-aware via CSS overrides)
  dropdownBg: "var(--r53-dropdown-bg)",
  dropdownBorder: "var(--r53-dropdown-border)",
  dropdownText: "var(--r53-dropdown-text)",
  dropdownTextMuted: "var(--r53-dropdown-text-muted)",
  dropdownAccent: "var(--r53-dropdown-accent)",
  dropdownInputBg: "var(--r53-dropdown-input-bg)",
  dropdownInputBorder: "var(--r53-dropdown-input-border)",
} as const;

export function AppTopNavigation() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="relative z-1000 flex h-12 w-full shrink-0 items-center border-t-[3px] border-b font-sans text-sm"
      style={{
        borderTopColor: c.darkAccountCard,
        borderBottomColor: c.darkBorderAlt,
        backgroundColor: c.darkSurface,
      }}
      aria-label="Global navigation"
    >
      {/* Left section: Logo + Amazon Q + Services */}
      <div className="flex h-full shrink-0 items-center">
        <a
          href="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            router.push("/dashboard");
          }}
          className="flex h-full w-16 shrink-0 items-center justify-center px-4 no-underline"
          style={{ color: c.darkTextSecondary }}
          title="AWS Console Home"
        >
          <img
            src="/assets/aws-logo-white.svg"
            alt="AWS"
            className="block h-[19px] w-[33px]"
          />
        </a>

        <span className="h-6 w-px shrink-0" style={{ backgroundColor: c.darkBorderAlt }} aria-hidden="true" />

        <button
          className="flex h-full shrink-0 cursor-pointer appearance-none items-center justify-center border-none bg-transparent px-3 text-sm font-medium hover:bg-white/5"
          style={{ color: c.darkTextSecondary }}
          title="Amazon Q"
          aria-label="Amazon Q"
          aria-expanded="false"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect width="24" height="24" rx="6" fill="url(#q-icon-radial-gradient)" />
            <g clipPath="url(#q-icon-clip-path)">
              <path
                d="M18.2199 7.40941L12.8699 4.31846C12.6299 4.17842 12.3199 4.1084 11.9999 4.1084C11.6799 4.1084 11.3699 4.17842 11.1299 4.31846L5.77991 7.40941C5.29991 7.67949 4.90991 8.3597 4.90991 8.90986V15.0917C4.90991 15.6419 5.29991 16.3121 5.77991 16.5922L11.1399 19.6832C11.3799 19.8232 11.6899 19.8932 12.0099 19.8932C12.3299 19.8932 12.6399 19.8232 12.8799 19.6832L18.2399 16.5922C18.7199 16.3121 19.1099 15.6419 19.1099 15.0917V8.90986C19.1099 8.3597 18.7199 7.67949 18.2399 7.40941H18.2199ZM11.9999 17.8826L6.90991 14.9417V9.05991L11.9999 6.11901L17.0899 9.05991V13.7813L13.9999 12.0008V11.2606C13.9999 11.0005 13.8599 10.7704 13.6399 10.6404L12.3599 9.90017C12.2499 9.84015 12.1199 9.80013 11.9999 9.80013C11.8799 9.80013 11.7499 9.83014 11.6399 9.90017L10.3599 10.6404C10.1399 10.7704 9.99991 11.0105 9.99991 11.2606V12.741C9.99991 13.0011 10.1399 13.2312 10.3599 13.3612L11.6399 14.1014C11.7499 14.1615 11.8799 14.2015 11.9999 14.2015C12.1199 14.2015 12.2499 14.1715 12.3599 14.1014L12.9999 13.7313L16.0899 15.5119L11.9999 17.8726V17.8826Z"
                fill="white"
              />
            </g>
            <defs>
              <radialGradient id="q-icon-radial-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(26.1421 -2.14213) rotate(135) scale(40 51.1797)">
                <stop stopColor="#7B5FF3" />
                <stop offset="0.3" stopColor="#685EF5" />
                <stop offset="0.45" stopColor="#5A5EF6" />
                <stop offset="0.6" stopColor="#4A5EF7" />
                <stop offset="0.8" stopColor="#3B82F6" />
              </radialGradient>
              <clipPath id="q-icon-clip-path">
                <rect width="16" height="16.0049" fill="white" transform="translate(4 3.99805)" />
              </clipPath>
            </defs>
          </svg>
        </button>

        <span className="h-6 w-px shrink-0" style={{ backgroundColor: c.darkBorderAlt }} aria-hidden="true" />

        <button
          className="flex h-full shrink-0 cursor-pointer appearance-none items-center justify-center border-none bg-transparent px-4 text-sm font-medium hover:bg-white/5"
          style={{ color: c.darkTextSecondary }}
          title="Services"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect width="4" height="4" rx="1" fill="currentColor" />
            <rect y="6" width="4" height="4" rx="1" fill="currentColor" />
            <rect y="12" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="6" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="6" y="6" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="6" y="12" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="12" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="12" y="6" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="12" y="12" width="4" height="4" rx="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Center: Search bar */}
      <div className="flex h-full min-w-0 flex-1 items-center px-4">
        <div className="relative flex max-w-[420px] w-full items-center">
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center" style={{ color: c.darkTextDim }}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="m11 11 4 4M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <input
            type="search"
            placeholder="Search"
            className="h-[30px] w-full rounded-lg border-2 py-px pl-9 pr-12 text-sm outline-none placeholder:italic"
            style={{
              borderColor: c.darkBorder,
              backgroundColor: c.darkSurfaceAlt,
              color: c.darkTextPrimary,
            }}
          />

          <span className="pointer-events-none absolute right-12 top-1/2 hidden -translate-y-1/2 text-xs md:block" style={{ color: c.darkTextDim }}>
            [Option+S]
          </span>

          <button
            className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer appearance-none items-center justify-center rounded-full border-none bg-transparent p-0"
            style={{ color: c.darkTextDim }}
            title="Search with Amazon Q"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18.2199 7.40941L12.8699 4.31846C12.6299 4.17842 12.3199 4.1084 11.9999 4.1084C11.6799 4.1084 11.3699 4.17842 11.1299 4.31846L5.77991 7.40941C5.29991 7.67949 4.90991 8.3597 4.90991 8.90986V15.0917C4.90991 15.6419 5.29991 16.3121 5.77991 16.5922L11.1399 19.6832C11.3799 19.8232 11.6899 19.8932 12.0099 19.8932C12.3299 19.8932 12.6399 19.8232 12.8799 19.6832L18.2399 16.5922C18.7199 16.3121 19.1099 15.6419 19.1099 15.0917V8.90986C19.1099 8.3597 18.7199 7.67949 18.2399 7.40941H18.2199ZM11.9999 17.8826L6.90991 14.9417V9.05991L11.9999 6.11901L17.0899 9.05991V13.7813L13.9999 12.0008V11.2606C13.9999 11.0005 13.8599 10.7704 13.6399 10.6404L12.3599 9.90017C12.2499 9.84015 12.1199 9.80013 11.9999 9.80013C11.8799 9.80013 11.7499 9.83014 11.6399 9.90017L10.3599 10.6404C10.1399 10.7704 9.99991 11.0105 9.99991 11.2606V12.741C9.99991 13.0011 10.1399 13.2312 10.3599 13.3612L11.6399 14.1014C11.7499 14.1615 11.8799 14.2015 11.9999 14.2015C12.1199 14.2015 12.2499 14.1715 12.3599 14.1014L12.9999 13.7313L16.0899 15.5119L11.9999 17.8726V17.8826Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Right section */}
      <div className="flex h-full shrink-0 items-center">
        <a
          href="#"
          className="hidden h-full shrink-0 cursor-pointer appearance-none items-center justify-center border-none bg-transparent px-4 text-xs font-medium hover:bg-white/5 md:flex"
          style={{ color: c.darkTextSecondary }}
          title="CloudShell"
          onClick={(e) => e.preventDefault()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M5 5l2.997 2.998L5 11m4.997-.002H12m3-7.626A2.374 2.374 0 0012.627 1H3.37A2.372 2.372 0 001 3.372v9.256a2.373 2.373 0 002.37 2.373h9.257A2.375 2.375 0 0015 12.628V3.372z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeMiterlimit="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <span className="hidden h-6 w-px shrink-0 md:block" style={{ backgroundColor: c.darkBorderAlt }} aria-hidden="true" />

        <button
          className="hidden h-full shrink-0 cursor-pointer appearance-none items-center justify-center border-none bg-transparent px-4 text-xs font-medium hover:bg-white/5 md:flex"
          style={{ color: c.darkTextSecondary }}
          title="Notifications"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M14 12H2c-.39 0-.63-.44-.41-.76L4 8V5c0-2.21 1.79-4 4-4s4 1.79 4 4v3l2.41 3.24c.22.33-.02.76-.41.76ZM6 13c0 1.1.9 2 2 2s2-.9 2-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className="hidden h-6 w-px shrink-0 lg:block" style={{ backgroundColor: c.darkBorderAlt }} aria-hidden="true" />

        <button
          className="hidden h-full shrink-0 cursor-pointer appearance-none items-center gap-1 border-none bg-transparent px-4 text-xs font-medium hover:bg-white/5 lg:flex"
          style={{ color: c.darkTextSecondary }}
          title="Help &amp; support"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path
              d="M5.75 6.338c.13-1.178.811-2.339 2.37-2.339 1.472 0 2.435 1.312 2.042 2.468-.215.633-.916 1.132-1.385 1.578C8.162 8.631 8 9.2 8 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M8 12.01h.01V12H8v.01Z" fill="currentColor" />
          </svg>
        </button>

        <span className="hidden h-6 w-px shrink-0 lg:block" style={{ backgroundColor: c.darkBorderAlt }} aria-hidden="true" />

        {/* Settings with dropdown */}
        <div ref={settingsRef} className="relative h-full">
          <button
            className="hidden h-full shrink-0 cursor-pointer appearance-none items-center gap-1 border-none bg-transparent px-4 text-xs font-medium hover:bg-white/5 lg:flex"
            style={{ color: settingsOpen ? c.darkAccent : c.darkTextSecondary }}
            title="Settings"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
              <path
                d="M6.11 1.729c.07-.42.44-.729.86-.729h2.02c.43 0 .79.31.86.729l.17.999c.05.29.24.529.5.679.06.03.11.06.17.1.25.15.56.2.84.1l.95-.35c.4-.15.85 0 1.07.38l1.01 1.747c.21.37.13.839-.2 1.108l-.78.64c-.23.189-.34.479-.33.768v.2c0 .29.11.579.33.769l.78.639c.33.27.42.739.2 1.108l-1.01 1.748c-.21.37-.66.529-1.06.38l-.95-.35a.966.966 0 0 0-.84.1c-.06.03-.11.07-.17.1a1.01 1.01 0 0 0-.5.679l-.17.998A.878.878 0 0 1 9 15.27H6.97c-.42 0-.79-.31-.86-.729l-.17-.999a1.01 1.01 0 0 0-.5-.679c-.06-.03-.11-.07-.17-.1a.966.966 0 0 0-.84-.1l-.95.35c-.4.15-.85 0-1.07-.38L1.23 11.04c-.21-.37-.13-.839.2-1.108l.78-.64c.23-.189.34-.479-.33-.768v-.2c0-.29-.11-.579-.33-.769l-.78-.639c-.33-.27-.42-.739-.2-1.108L2.24 4.66c.21-.37.66-.529 1.06-.38l.95.35a.966.966 0 0 0 .84-.1c.06-.03.11-.07.17-.1.26-.14.45-.389.5-.679l.17-.999Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          {settingsOpen && (
            <div
              className="absolute right-0 top-12 z-[1001] w-[300px] shadow-xl"
              style={{ border: `1px solid ${c.dropdownBorder}`, backgroundColor: c.dropdownBg }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${c.dropdownBorder}` }}>
                <span className="text-sm font-medium" style={{ color: c.dropdownText }}>Settings</span>
                <button
                  className="flex cursor-pointer appearance-none border-none bg-transparent p-0 hover:opacity-80"
                  style={{ color: c.dropdownTextMuted }}
                  onClick={() => setSettingsOpen(false)}
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m2 1.71 12 12M2 13.71l12-12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Current user settings */}
              <div className="px-4 pt-3">
                <h3 className="text-sm font-medium" style={{ color: c.dropdownText }}>Current user settings</h3>
              </div>

              {/* Language - English only */}
              <div className="px-4 py-3">
                <label className="mb-2 block text-xs font-medium" style={{ color: c.dropdownTextMuted }}>Language</label>
                <select
                  className="h-8 w-full rounded px-2 text-sm outline-none"
                  style={{ border: `1px solid ${c.dropdownInputBorder}`, backgroundColor: c.dropdownInputBg, color: c.dropdownText }}
                  defaultValue="en-US"
                >
                  <option value="en-US">English (US)</option>
                </select>
              </div>

              {/* Separator */}
              <div className="mx-4" style={{ borderTop: `1px solid ${c.dropdownBorder}` }} />

              {/* Visual mode */}
              <div className="px-4 py-3">
                <label className="mb-3 block text-xs font-medium" style={{ color: c.dropdownTextMuted }}>
                  Visual mode <i className="not-italic" style={{ color: c.dropdownTextMuted }}>- beta</i>
                </label>
                <div className="flex flex-col gap-3">
                  <label className="flex cursor-pointer items-center gap-3 text-sm" style={{ color: c.dropdownText }}>
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: theme === "light" ? c.dropdownAccent : c.dropdownTextMuted }}>
                      {theme === "light" && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.dropdownAccent }} />}
                    </span>
                    <input type="radio" name="visual-mode" value="light" checked={theme === "light"} onChange={() => setTheme("light")} className="sr-only" />
                    Light
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 text-sm" style={{ color: c.dropdownText }}>
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: theme === "dark" ? c.dropdownAccent : c.dropdownTextMuted }}>
                      {theme === "dark" && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.dropdownAccent }} />}
                    </span>
                    <input type="radio" name="visual-mode" value="dark" checked={theme === "dark"} onChange={() => setTheme("dark")} className="sr-only" />
                    Dark
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3" style={{ borderTop: `1px solid ${c.dropdownBorder}` }}>
                <span className="text-xs font-medium hover:underline cursor-pointer" style={{ color: c.dropdownAccent }}>
                  See all user settings
                </span>
              </div>
            </div>
          )}
        </div>

        <span className="hidden h-6 w-px shrink-0 lg:block" style={{ backgroundColor: c.darkBorderAlt }} aria-hidden="true" />

        <span
          className="hidden h-full shrink-0 cursor-default items-center gap-1 px-4 text-xs font-medium lg:flex"
          style={{ color: c.darkTextSecondary }}
          title="Global"
        >
          Global
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="m8 11 4-6H4l4 6Z" />
          </svg>
        </span>

        {/* Account section: card attached to top line + name below */}
        <div ref={menuRef} className="relative flex h-full shrink-0 flex-col items-end justify-start self-stretch" style={{ marginTop: "-3px" }}>
          {/* Account card attached to top border line */}
          <button
            className="flex shrink-0 cursor-pointer appearance-none items-center gap-1 whitespace-nowrap border-none font-bold text-black transition-colors"
            style={{ borderRadius: "0 0 8px 8px", padding: "2px 8px", fontSize: "10px", marginTop: "-3px", paddingTop: "5px", backgroundColor: c.darkAccountCard }}
            title="Account colour: Unset"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = c.darkAccountCardHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = c.darkAccountCard; }}
          >
            <span>
              {user?.display_name ?? "Account"} (888577037798)
            </span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="m8 11 4-6H4l4 6Z" />
            </svg>
          </button>
          {/* Account name below card - also opens dropdown */}
          <span
            className="leading-tight cursor-pointer"
            style={{ padding: "4px 8px", fontSize: "10px", height: "16px", color: c.darkTextMuted }}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            onMouseEnter={(e) => { e.currentTarget.style.color = c.darkTextPrimary; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = c.darkTextMuted; }}
          >
            {user?.display_name ?? "Account"}
          </span>

          {/* Account dropdown - comes from end of top nav */}
          {userMenuOpen && (
            <div
              className="absolute right-0 top-12 z-[1001] w-[340px] shadow-xl"
              style={{ border: `1px solid ${c.dropdownBorder}`, backgroundColor: c.dropdownBg }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${c.dropdownBorder}` }}>
                <span className="text-sm font-medium" style={{ color: c.dropdownText }}>Account details</span>
                <button
                  className="flex cursor-pointer appearance-none border-none bg-transparent p-0 hover:opacity-80"
                  style={{ color: c.dropdownTextMuted }}
                  onClick={() => setUserMenuOpen(false)}
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m2 1.71 12 12M2 13.71l12-12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Account details */}
              <div className="px-4 py-3">
                <SpaceBetween size="xs">
                  <FormField label="Account ID">
                    <CopyToClipboard
                      variant="inline"
                      copyButtonAriaLabel="Copy Account Id"
                      textToCopy="888577037798"
                      textToDisplay="8885-7703-7798"
                      copySuccessText="Copied!"
                      copyErrorText="Copy failed"
                    />
                  </FormField>
                  <FormField label="Account name">
                    <CopyToClipboard
                      variant="inline"
                      copyButtonAriaLabel="Copy account name"
                      textToCopy={user?.display_name ?? "Account"}
                      textToDisplay={user?.display_name ?? "Account"}
                      copySuccessText="Copied!"
                      copyErrorText="Copy failed"
                    />
                  </FormField>
                  <FormField label="Account colour">
                    <div className="flex items-center gap-2">
                      <svg height="16" width="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="8" r="8" fill={c.accountColour} />
                      </svg>
                      <span className="text-sm" style={{ color: c.dropdownText }}>Unset</span>
                    </div>
                  </FormField>
                </SpaceBetween>
              </div>

              <Divider />

              {/* Menu links - static, no redirects */}
              <div className="px-4 py-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs hover:underline cursor-pointer" style={{ color: c.dropdownAccent }}>Account</span>
                  <span className="text-xs hover:underline cursor-pointer" style={{ color: c.dropdownAccent }}>Organisation</span>
                  <span className="text-xs hover:underline cursor-pointer" style={{ color: c.dropdownAccent }}>Service Quotas</span>
                  <span className="text-xs hover:underline cursor-pointer" style={{ color: c.dropdownAccent }}>Billing and Cost Management</span>
                  <span className="text-xs hover:underline cursor-pointer" style={{ color: c.dropdownAccent }}>Security credentials</span>
                </div>
              </div>

              <Divider />

              {/* Sign out */}
              <div className="px-4 py-3">
                <SpaceBetween size="xs">
                  <Button variant="normal" fullWidth onClick={() => {}}>
                    Turn on multi-session support
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      setUserMenuOpen(false);
                      void logout().then(() => router.push("/login"));
                    }}
                  >
                    Sign out
                  </Button>
                </SpaceBetween>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
