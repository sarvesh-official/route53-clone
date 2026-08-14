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
    type: "section",
    text: "Global Resolver",
    defaultExpanded: true,
    items: [
      { type: "link", text: "Global resolvers", href: "/global-resolvers", info: "New" },
      { type: "link", text: "Shared DNS views", href: "/shared-dns-views", info: "New" },
    ],
  },
  {
    type: "section",
    text: "VPC Resolver",
    defaultExpanded: true,
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
    type: "section",
    text: "Domains",
    defaultExpanded: true,
    items: [
      { type: "link", text: "Registered domains", href: "/domains/registered" },
      { type: "link", text: "Requests", href: "/domains/requests" },
    ],
  },
  {
    type: "section",
    text: "IP-based routing",
    defaultExpanded: true,
    items: [
      { type: "link", text: "CIDR collections", href: "/cidr-collections" },
    ],
  },
  {
    type: "section",
    text: "Traffic flow",
    defaultExpanded: true,
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
