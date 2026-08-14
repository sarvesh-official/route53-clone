"use client";

import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Button from "@cloudscape-design/components/button";
import { usePathname, useRouter } from "next/navigation";

import { useBreadcrumbLabels } from "@/providers/breadcrumb-provider";

/* CSS variable shortcuts — see src/app/globals.css :root */
const c = {
  lightBreadcrumbBg: "var(--r53-light-breadcrumb-bg)",
  lightBorder: "var(--r53-light-border)",
} as const;

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
  navOpen: boolean;
  toolsOpen: boolean;
}

export function AppToolbar({ onToggleNav, onToggleTools, navOpen, toolsOpen }: ToolbarProps) {
  const pathname = usePathname() ?? "/dashboard";
  const router = useRouter();
  const labels = useBreadcrumbLabels();
  const items = buildCrumbs(pathname, labels);

  return (
    <section
      className="flex h-[44px] w-full shrink-0 items-center gap-2 border-b px-2"
      style={{
        backgroundColor: c.lightBreadcrumbBg,
        borderColor: c.lightBorder,
      }}
      aria-label="Toolbar"
    >
      {/* Navigation toggle */}
      <div className={navOpen ? "r53-toggle-active" : ""}>
        <Button
          variant="icon"
          iconName="menu"
          ariaLabel="Open side navigation"
          ariaExpanded={navOpen}
          onClick={() => onToggleNav()}
        />
      </div>

      {/* Breadcrumbs */}
      <div className="min-w-0 flex-1">
        <BreadcrumbGroup
          items={items}
          onFollow={(e) => {
            e.preventDefault();
            router.push(e.detail.href);
          }}
        />
      </div>

      {/* Help icon */}
      <div className={toolsOpen ? "r53-toggle-active" : ""}>
        <Button
          variant="icon"
          iconName="status-info"
          ariaLabel="Open help panel"
          ariaExpanded={toolsOpen}
          onClick={() => onToggleTools()}
        />
      </div>
    </section>
  );
}
