"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/providers/auth-provider";

export function AppTopNavigation() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="flex h-12 w-full shrink-0 items-center bg-[#161d26] font-sans text-sm relative z-1000"
      aria-label="Global navigation"
    >
      {/* Left section: Logo + Amazon Q + Services */}
      <div className="flex shrink-0 items-center">
        <a
          href="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            router.push("/dashboard");
          }}
          className="flex h-12 w-16.25 items-center justify-center px-4 text-[#dedee3] no-underline"
          title="AWS Console Home"
        >
          <img
            src="/assets/aws-logo-white.svg"
            alt="AWS"
            className="block h-[19px] w-[33px]"
          />
        </a>

        <button
          className="flex h-12 cursor-pointer appearance-none items-center justify-center rounded-full border-2 border-transparent bg-transparent px-3 text-sm font-medium text-[#dedee3]"
          title="Amazon Q"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect width="24" height="24" rx="6" fill="url(#q-grad)" />
            <defs>
              <linearGradient id="q-grad" x1="0" y1="0" x2="24" y2="24">
                <stop stopColor="#7B5FF3" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <path
              d="M18.22 7.41L12.87 4.32C12.63 4.18 12.32 4.11 12 4.11C11.68 4.11 11.37 4.18 11.13 4.32L5.78 7.41C5.3 7.68 4.91 8.36 4.91 8.91V15.09C4.91 15.64 5.3 16.31 5.78 16.59L11.14 19.68C11.38 19.82 11.69 19.89 12.01 19.89C12.33 19.89 12.64 19.82 12.88 19.68L18.24 16.59C18.72 16.31 19.11 15.64 19.11 15.09V8.91C19.11 8.36 18.72 7.68 18.24 7.41H18.22Z"
              fill="white"
            />
          </svg>
        </button>

        <button
          className="flex h-12 cursor-pointer appearance-none items-center justify-center border-2 border-transparent bg-transparent px-4 text-sm font-medium text-[#dedee3]"
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
      <div className="flex min-w-0 flex-1 items-center px-4">
        <div className="relative flex w-full max-w-[540px] items-center">
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-[#c6c6cd]">
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
            className="h-[30px] w-full rounded-lg border-2 border-[#656871] bg-[#0f141a] px-[83px] py-px text-sm text-[#ebebf0] outline-none"
          />
          <span className="pointer-events-none absolute right-[42px] top-1/2 -translate-y-1/2 text-sm text-[#a4a4ad]">
            [Option+S]
          </span>
          <button
            className="absolute right-2.5 top-1/2 flex h-6 w-[30px] appearance-none -translate-y-1/2 cursor-pointer items-center justify-center rounded border-none bg-[#0f141a] p-0 text-[#c6c6cd]"
            title="Search"
          >
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
          </button>
        </div>
      </div>

      {/* Right section: CloudShell, Notifications, Help, Settings, Region, User */}
      <div className="flex shrink-0 items-center">
        <a
          href="#"
          className="flex h-12 cursor-pointer appearance-none items-center justify-center bg-transparent px-4 text-xs font-medium text-[#dedee3]"
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

        <button
          className="flex h-12 cursor-pointer appearance-none items-center justify-center bg-transparent px-4 text-xs font-medium text-[#dedee3]"
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

        <button
          className="flex h-12 cursor-pointer appearance-none items-center gap-1 bg-transparent px-4 text-xs font-medium text-[#dedee3]"
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

        <button
          className="flex h-12 cursor-pointer appearance-none items-center gap-1 bg-transparent px-4 text-xs font-medium text-[#dedee3]"
          title="Settings"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M6.11 1.729c.07-.42.44-.729.86-.729h2.02c.43 0 .79.31.86.729l.17.999c.05.29.24.529.5.679.06.03.11.06.17.1.25.15.56.2.84.1l.95-.35c.4-.15.85 0 1.07.38l1.01 1.747c.21.37.13.839-.2 1.108l-.78.64c-.23.189-.34.479-.33.768v.2c0 .29.11.579.33.769l.78.639c.33.27.42.739.2 1.108l-1.01 1.748c-.21.37-.66.529-1.06.38l-.95-.35a.966.966 0 0 0-.84.1c-.06.03-.11.07-.17.1a1.01 1.01 0 0 0-.5.679l-.17.998A.878.878 0 0 1 9 15.27H6.97c-.42 0-.79-.31-.86-.729l-.17-.999a1.01 1.01 0 0 0-.5-.679c-.06-.03-.11-.07-.17-.1a.966.966 0 0 0-.84-.1l-.95.35c-.4.15-.85 0-1.07-.38L1.23 11.04c-.21-.37-.13-.839.2-1.108l.78-.64c.23-.189.34-.479.33-.768v-.2c0-.29-.11-.579-.33-.769l-.78-.639c-.33-.27-.42-.739-.2-1.108L2.24 4.66c.21-.37.66-.529 1.06-.38l.95.35a.966.966 0 0 0 .84-.1c.06-.03.11-.07.17-.1.26-.14.45-.389.5-.679l.17-.999Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="8" cy="8" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <button
          className="flex h-12 cursor-pointer appearance-none items-center gap-1 bg-transparent px-4 text-xs font-medium text-[#dedee3]"
          title="Global"
        >
          Global
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M12 1L5 8l7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div ref={menuRef} className="relative">
          <button
            className="flex h-12 cursor-pointer appearance-none items-center gap-1 bg-transparent px-4 text-xs font-medium text-[#dedee3]"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            title={user?.display_name ?? "Account"}
          >
            {user?.display_name ?? "Account"}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 11h8L8 5l-4 6z" />
            </svg>
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-12 z-[1001] min-w-[200px] rounded border border-[#41474f] bg-[#161d26]">
              <div className="border-b border-[#41474f] px-4 py-3 text-sm text-[#ebebf0]">
                {user?.email}
              </div>
              <button
                className="w-full cursor-pointer px-4 py-3 text-left text-xs font-medium text-[#dedee3]"
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
