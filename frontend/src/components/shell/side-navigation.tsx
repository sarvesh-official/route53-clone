"use client";

import SideNavigation, {
  type SideNavigationProps,
} from "@cloudscape-design/components/side-navigation";
import { usePathname, useRouter } from "next/navigation";

const ITEMS: SideNavigationProps.Item[] = [
  { type: "link", text: "Dashboard", href: "/dashboard" },
  { type: "link", text: "Hosted zones", href: "/hosted-zones" },
  { type: "link", text: "Health checks", href: "/health-checks" },
  { type: "link", text: "Profiles", href: "/profiles" },
  {
    type: "section-group",
    title: "Global Resolver",
    items: [
      { type: "link", text: "Global resolvers", href: "/global-resolvers", info: "New" },
      { type: "link", text: "Shared DNS views", href: "/shared-dns-views", info: "New" },
    ],
  },
  {
    type: "section-group",
    title: "VPC Resolver",
    items: [
      { type: "link", text: "VPCs", href: "/resolver/vpcs" },
      { type: "link", text: "Inbound endpoints", href: "/resolver/inbound-endpoints" },
      { type: "link", text: "Outbound endpoints", href: "/resolver/outbound-endpoints" },
      { type: "link", text: "Rules", href: "/resolver/rules" },
      { type: "link", text: "Query logging", href: "/resolver/query-logging" },
      { type: "link", text: "Outposts", href: "/resolver/outposts" },
    ],
  },
  {
    type: "section-group",
    title: "Domains",
    items: [
      { type: "link", text: "Registered domains", href: "/domains/registered" },
      { type: "link", text: "Requests", href: "/domains/requests" },
    ],
  },
  {
    type: "section-group",
    title: "IP-based routing",
    items: [
      { type: "link", text: "CIDR collections", href: "/cidr-collections" },
    ],
  },
  {
    type: "section-group",
    title: "Traffic flow",
    items: [
      { type: "link", text: "Traffic policies", href: "/traffic-policies" },
      { type: "link", text: "Policy records", href: "/policy-records" },
    ],
  },
  { type: "divider" },
  { type: "link", text: "DNS Firewall", href: "/dns-firewall" },
  { type: "link", text: "Application Recovery Controller", href: "/recovery-controller" },
];

export function AppSideNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SideNavigation
      header={{ text: "Route 53", href: "/dashboard" }}
      activeHref={pathname ?? "/dashboard"}
      items={ITEMS}
      onFollow={(e) => {
        e.preventDefault();
        router.push(e.detail.href);
      }}
    />
  );
}
