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

export function AppBreadcrumbs() {
  const pathname = usePathname() ?? "/dashboard";
  const router = useRouter();
  const labels = useBreadcrumbLabels();
  const items = buildCrumbs(pathname, labels);

  return (
    <BreadcrumbGroup
      items={items}
      onFollow={(e) => {
        e.preventDefault();
        router.push(e.detail.href);
      }}
    />
  );
}

export function AppBreadcrumbItems() {
  const pathname = usePathname() ?? "/dashboard";
  const labels = useBreadcrumbLabels();
  return buildCrumbs(pathname, labels);
}
