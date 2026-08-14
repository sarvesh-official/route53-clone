"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";

export function AppTopNavigation() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="relative z-1000 flex h-12 w-full shrink-0 items-center border-t-[3px] border-[#7f8796] bg-[#181c24] font-sans text-sm"
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
          className="flex h-full w-16 shrink-0 items-center justify-center px-4 text-[#dedee3] no-underline"
          title="AWS Console Home"
        >
          <img
            src="/assets/aws-logo-white.svg"
            alt="AWS"
            className="block h-[19px] w-[33px]"
          />
        </a>

        <span className="h-6 w-px shrink-0 bg-[#40454d]" aria-hidden="true" />

        <button
          className="flex h-full shrink-0 cursor-pointer appearance-none items-center justify-center border-none bg-transparent px-3 text-sm font-medium text-[#dedee3] hover:bg-white/5"
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

        <span className="h-6 w-px shrink-0 bg-[#40454d]" aria-hidden="true" />

        <button
          className="flex h-full shrink-0 cursor-pointer appearance-none items-center justify-center border-none bg-transparent px-4 text-sm font-medium text-[#dedee3] hover:bg-white/5"
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
        <div className="relative flex w-full items-center">
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
            className="h-[30px] w-full rounded-lg border-2 border-[#62676f] bg-[#0f141a] py-px pl-9 pr-20 text-sm text-[#ebebf0] outline-none placeholder:italic placeholder:text-[#a4a4ad]"
          />

          <span className="pointer-events-none absolute right-9 top-1/2 hidden -translate-y-1/2 text-xs text-[#a4a4ad] md:block">
            [Option+S]
          </span>

          <button
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer appearance-none items-center justify-center rounded-full border border-[#62676f] bg-transparent p-0 text-[#c6c6cd]"
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
          className="hidden h-full shrink-0 cursor-pointer appearance-none items-center justify-center border-none bg-transparent px-4 text-xs font-medium text-[#dedee3] hover:bg-white/5 md:flex"
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

        <span className="hidden h-6 w-px shrink-0 bg-[#40454d] md:block" aria-hidden="true" />

        <button
          className="hidden h-full shrink-0 cursor-pointer appearance-none items-center justify-center border-none bg-transparent px-4 text-xs font-medium text-[#dedee3] hover:bg-white/5 md:flex"
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

        <span className="hidden h-6 w-px shrink-0 bg-[#40454d] lg:block" aria-hidden="true" />

        <button
          className="hidden h-full shrink-0 cursor-pointer appearance-none items-center gap-1 border-none bg-transparent px-4 text-xs font-medium text-[#dedee3] hover:bg-white/5 lg:flex"
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

        <span className="hidden h-6 w-px shrink-0 bg-[#40454d] lg:block" aria-hidden="true" />

        {/* Settings with dropdown */}
        <div ref={settingsRef} className="relative h-full">
          <button
            className="hidden h-full shrink-0 cursor-pointer appearance-none items-center gap-1 border-none bg-transparent px-4 text-xs font-medium text-[#dedee3] hover:bg-white/5 lg:flex"
            title="Settings"
            onClick={() => setSettingsOpen(!settingsOpen)}
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
          {settingsOpen && (
            <div className="absolute right-0 top-12 z-[1001] w-[300px] rounded-lg border border-[#41474f] bg-[#fafafa] shadow-xl dark:bg-[#1a1e25]">
              <div className="flex items-center gap-2 border-b border-[#e9ebed] px-4 py-3 dark:border-[#41474f]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-[#5f6b7a]">
                  <path d="M12 1L5 8l7 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
                <span className="text-sm font-medium text-[#161d26] dark:text-[#ebebf0]">Settings</span>
                <button
                  className="ml-auto cursor-pointer text-[#5f6b7a] hover:text-[#161d26] dark:hover:text-[#ebebf0]"
                  onClick={() => setSettingsOpen(false)}
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m2 1.71 12 12M2 13.71l12-12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="px-4 pt-3">
                <h3 className="text-sm font-medium text-[#161d26] dark:text-[#ebebf0]">Current user settings</h3>
              </div>

              <div className="px-4 py-3">
                <label className="mb-2 block text-xs font-medium text-[#5f6b7a]">Language</label>
                <select className="h-8 w-full rounded border border-[#8c8c94] bg-white px-2 text-sm text-[#161d26] outline-none dark:bg-[#0f141a] dark:text-[#ebebf0]">
                  <option>Browser default</option>
                  <option>English (US)</option>
                  <option>Japanese</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div className="px-4 pb-3">
                <label className="mb-2 block text-xs font-medium text-[#5f6b7a]">
                  Visual mode <i className="not-italic text-[#9ba1a8]">- beta</i>
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[#161d26] dark:text-[#ebebf0]">
                    <input type="radio" name="visual-mode" value="light" checked={theme === "light"} onChange={() => setTheme("light")} className="cursor-pointer" />
                    Light
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[#161d26] dark:text-[#ebebf0]">
                    <input type="radio" name="visual-mode" value="dark" checked={theme === "dark"} onChange={() => setTheme("dark")} className="cursor-pointer" />
                    Dark
                  </label>
                </div>
              </div>

              <div className="border-t border-[#e9ebed] px-4 py-3 dark:border-[#41474f]">
                <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-medium text-[#006ce0] hover:underline">
                  See all user settings
                </a>
              </div>
            </div>
          )}
        </div>

        <span className="hidden h-6 w-px shrink-0 bg-[#40454d] lg:block" aria-hidden="true" />

        <div ref={regionRef} className="relative h-full">
          <button
            className="hidden h-full shrink-0 cursor-pointer appearance-none items-center gap-1 border-none bg-transparent px-4 text-xs font-medium text-[#dedee3] hover:bg-white/5 lg:flex"
            title="Global"
            onClick={() => setRegionOpen(!regionOpen)}
          >
            <span>Global</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 11h8L8 5l-4 6z" />
            </svg>
          </button>
          {regionOpen && (
            <div className="absolute right-0 top-12 z-[1001] w-[340px] rounded-lg border border-[#41474f] bg-[#fafafa] shadow-xl dark:bg-[#1a1e25]">
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-[#e9ebed] px-4 py-3 dark:border-[#41474f]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-[#5f6b7a]">
                  <path d="M12 1L5 8l7 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
                <span className="text-sm font-medium text-[#161d26] dark:text-[#ebebf0]">Regions</span>
                <button
                  className="ml-auto cursor-pointer text-[#5f6b7a] hover:text-[#161d26] dark:hover:text-[#ebebf0]"
                  onClick={() => setRegionOpen(false)}
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m2 1.71 12 12M2 13.71l12-12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Info message */}
              <div className="border-b border-[#e9ebed] px-4 py-2 text-xs text-[#5f6b7a] dark:border-[#41474f] dark:text-[#9ba1a8]">
                Route 53 does not require region selection.
              </div>

              {/* Region tabs */}
              <div className="flex border-b border-[#e9ebed] dark:border-[#41474f]">
                <button className="flex-1 cursor-pointer border-b-2 border-[#006ce0] px-4 py-2 text-xs font-medium text-[#006ce0]">Regions</button>
                <button className="flex-1 cursor-pointer border-b-2 border-transparent px-4 py-2 text-xs font-medium text-[#5f6b7a] hover:text-[#161d26] dark:hover:text-[#ebebf0]">Local zones</button>
              </div>

              {/* Region list */}
              <div className="max-h-[400px] overflow-y-auto">
                {[
                  { header: "United States", regions: [["N. Virginia", "us-east-1"], ["Ohio", "us-east-2"], ["N. California", "us-west-1"], ["Oregon", "us-west-2"]] },
                  { header: "Asia Pacific", regions: [["Mumbai", "ap-south-1"], ["Osaka", "ap-northeast-3"], ["Seoul", "ap-northeast-2"], ["Singapore", "ap-southeast-1"], ["Sydney", "ap-southeast-2"], ["Tokyo", "ap-northeast-1"]] },
                  { header: "Canada", regions: [["Central", "ca-central-1"]] },
                  { header: "Europe", regions: [["Frankfurt", "eu-central-1"], ["Ireland", "eu-west-1"], ["London", "eu-west-2"], ["Paris", "eu-west-3"], ["Stockholm", "eu-north-1"]] },
                  { header: "South America", regions: [["Sao Paulo", "sa-east-1"]] },
                ].map((group) => (
                  <div key={group.header} className="border-b border-[#e9ebed] last:border-b-0 dark:border-[#41474f]">
                    <h6 className="px-4 pt-3 pb-1 text-xs font-semibold text-[#5f6b7a] dark:text-[#9ba1a8]">{group.header}</h6>
                    <ul>
                      {group.regions.map(([name, code]) => (
                        <li key={code}>
                          <span className="flex cursor-not-allowed items-center gap-2 px-4 py-1.5 text-sm text-[#9ba1a8] dark:text-[#6b7280]">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-[#9ba1a8] dark:text-[#6b7280]">
                              <path d="M12 7H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM5 7V4c0-1.65 1.35-3 3-3s3 1.35 3 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                            </svg>
                            <span className="flex-1">{name}</span>
                            <span className="text-xs text-[#9ba1a8] dark:text-[#6b7280]">{code}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-[#e9ebed] px-4 py-3 text-xs dark:border-[#41474f]">
                <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-[#006ce0] hover:underline">Manage Regions</a>
                <span className="mx-2 text-[#9ba1a8]">|</span>
                <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-[#006ce0] hover:underline">Manage local zones</a>
              </div>
            </div>
          )}
        </div>

        <span className="h-6 w-px shrink-0 bg-[#40454d]" aria-hidden="true" />

        <div ref={menuRef} className="relative h-full">
          <button
            className="flex h-full shrink-0 cursor-pointer appearance-none items-center gap-1 whitespace-nowrap border-none bg-transparent px-4 text-xs font-medium text-[#dedee3] hover:bg-white/5"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            title={user?.display_name ?? "Account"}
          >
            <span className="text-[#dedee3]">{user?.display_name ?? "Account"}</span>
            <span className="text-[#9ba1a8]">(888577037798)</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 11h8L8 5l-4 6z" />
            </svg>
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-12 z-[1001] min-w-[200px] rounded border border-[#41474f] bg-[#181c24] shadow-lg">
              <div className="border-b border-[#41474f] px-4 py-3 text-sm text-[#ebebf0]">
                {user?.email}
              </div>
              <button
                className="w-full cursor-pointer px-4 py-3 text-left text-xs font-medium text-[#dedee3] hover:bg-white/5"
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
