"use client";

import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import { usePathname, useRouter } from "next/navigation";

import { useBreadcrumbLabels } from "@/providers/breadcrumb-provider";

interface Crumb {
  text: string;
  href: string;
}

function buildCrumbs(pathname: string, labels: Record<string, string>): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ text: "Route 53", href: "/dashboard" }];

  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = labels[path] ?? seg;
    crumbs.push({ text: label, href: path });
  }
  return crumbs;
}

interface ToolbarProps {
  onToggleNav: () => void;
  onToggleTools: () => void;
}

export function AppToolbar({ onToggleNav, onToggleTools }: ToolbarProps) {
  const pathname = usePathname() ?? "/dashboard";
  const router = useRouter();
  const labels = useBreadcrumbLabels();
  const items = buildCrumbs(pathname, labels);

  return (
    <section
      className="flex h-[44px] w-full shrink-0 items-center gap-2 border-b border-[#e9ebed] bg-[#f7f7f7] px-2 dark:border-[#40454d] dark:bg-[#181c24]"
      aria-label="Toolbar"
    >
      {/* Hamburger toggle */}
      <button
        className="flex h-8 w-8 shrink-0 cursor-pointer appearance-none items-center justify-center rounded border-none bg-transparent text-[#5f6b7a] hover:bg-[#e9ebed] dark:text-[#9ba1a8] dark:hover:bg-white/5"
        aria-label="Open side navigation"
        onClick={() => onToggleNav()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M15 3H1M15 8H1M15 13H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Breadcrumbs */}
      <div className="min-w-0 flex-1 dark:[&_*]:!text-[#dedee3] dark:[&_a:hover]:!text-[#43B4FF]">
        <BreadcrumbGroup
          items={items}
          onFollow={(e) => {
            e.preventDefault();
            router.push(e.detail.href);
          }}
        />
      </div>

      {/* Help icon */}
      <button
        className="flex h-8 w-8 shrink-0 cursor-pointer appearance-none items-center justify-center rounded border-none bg-transparent text-[#5f6b7a] hover:bg-[#e9ebed] dark:text-[#9ba1a8] dark:hover:bg-white/5"
        aria-label="Open help panel"
        onClick={() => onToggleTools()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12V7M8 6V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </section>
  );
}
