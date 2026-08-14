"use client";

import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Container from "@cloudscape-design/components/container";
import FormField from "@cloudscape-design/components/form-field";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import Pagination from "@cloudscape-design/components/pagination";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Table from "@cloudscape-design/components/table";
import TextFilter from "@cloudscape-design/components/text-filter";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { statsApi } from "@/lib/api/stats";
import { ActivityFeed } from "@/features/dashboard/activity-feed";

const c = {
  lightInputBorder: "var(--r53-light-input-border)",
} as const;

interface NotificationItem {
  resource: string;
  status: string;
  lastUpdate: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: statsApi.get,
  });
  const [domainInput, setDomainInput] = useState("");
  const [domainCheckMsg, setDomainCheckMsg] = useState<null | { type: "success" | "info"; text: string }>(null);
  const [notifFilter, setNotifFilter] = useState("");

  function handleCheckDomain() {
    if (!domainInput.trim()) return;
    setDomainCheckMsg({
      type: "info",
      text: `Domain "${domainInput.trim()}" availability check is not supported in this clone. Domain registration is a mocked feature.`,
    });
  }

  return (
    <SpaceBetween size="l">
      {/* Page title with Info link */}
      <Box padding={{ top: "xs", horizontal: "m" }}>
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          Route 53 Dashboard
        </Header>
      </Box>

      {/* Resource statistics widget - single container with 4 columns */}
      <Box padding={{ horizontal: "m" }}>
        <Container>
          <ColumnLayout columns={4} minColumnWidth={200} variant="text-grid">
            {/* DNS management */}
            <Box textAlign="center">
              <Header variant="h3">DNS management</Header>
              <Box variant="p" padding={{ bottom: "s" }}>
                A hosted zone tells Route 53 how to respond to DNS queries for a domain such as example.com.
              </Box>
              <Button
                href="/hosted-zones"
                onFollow={(e) => { e.preventDefault(); router.push("/hosted-zones"); }}
              >
                Create hosted zone
              </Button>
            </Box>
            {/* Availability monitoring */}
            <Box textAlign="center">
              <Header variant="h3">Availability monitoring</Header>
              <Box variant="p" padding={{ bottom: "s" }}>
                Health checks monitor your applications and web resources, and direct DNS queries to healthy resources.
              </Box>
              <Button
                href="/health-checks"
                onFollow={(e) => { e.preventDefault(); router.push("/health-checks"); }}
              >
                Create health check
              </Button>
            </Box>
            {/* Traffic management */}
            <Box textAlign="center">
              <Header variant="h3">Traffic management</Header>
              <Box variant="p" padding={{ bottom: "s" }}>
                A visual tool that lets you easily create policies for multiple endpoints in complex configurations.
              </Box>
              <Button
                href="/traffic-policies"
                onFollow={(e) => { e.preventDefault(); router.push("/traffic-policies"); }}
              >
                Create policy
              </Button>
            </Box>
            {/* Domain registration */}
            <Box textAlign="center">
              <Header variant="h3">Domain registration</Header>
              <Box variant="p" padding={{ bottom: "s" }}>
                A domain is the name, such as example.com, that your users use to access your application.
              </Box>
              <Button
                href="/domains/registered"
                onFollow={(e) => { e.preventDefault(); router.push("/domains/registered"); }}
              >
                Register domain
              </Button>
            </Box>
          </ColumnLayout>
        </Container>
      </Box>

      {/* Register domain - full width */}
      <Box padding={{ horizontal: "m" }}>
        <Container header={<Header variant="h2">Register domain</Header>}>
          <SpaceBetween size="m">
            <Box variant="p">
              Find and register an available domain, or{" "}
              <Link onFollow={(e) => { e.preventDefault(); router.push("/domains/registered"); }}>
                transfer your existing domains
              </Link>{" "}
              to Route 53.
            </Box>
            <FormField
              constraintText="Each label (each part between dots) can be up to 63 characters long and must start with a-z or 0-9. Maximum length: 255 characters, including dots. Valid characters: a-z, 0-9, and - (hyphen)"
            >
              <div style={{ maxWidth: "800px" }}>
                <input
                  type="text"
                  placeholder="Enter a domain name"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="h-8 w-full rounded-lg border px-3 py-[5px] text-sm outline-none"
                  style={{ borderColor: c.lightInputBorder }}
                  aria-label="Find and register an available domain."
                />
              </div>
            </FormField>
            <Button onClick={handleCheckDomain}>Check</Button>
            {domainCheckMsg && (
              <Box margin={{ top: "s", bottom: "s" }}>
                <Alert type={domainCheckMsg.type}>{domainCheckMsg.text}</Alert>
              </Box>
            )}
          </SpaceBetween>
        </Container>
      </Box>

      {/* Notifications table - full width with text filter and pagination */}
      <Box padding={{ horizontal: "m" }}>
        <Table<NotificationItem>
          variant="container"
          columnDefinitions={[
            { id: "resource", header: "Resource", cell: (item) => item.resource, width: 250 },
            { id: "status", header: "Status", cell: (item) => item.status, width: 350 },
            { id: "lastUpdate", header: "Last update", cell: (item) => item.lastUpdate, sortingField: "last-update" },
          ]}
          items={[]}
          loadingText="Loading notifications"
          trackBy="resource"
          empty={
            <Box textAlign="center" color="text-body-secondary">
              No notifications to display
            </Box>
          }
          filter={
            <TextFilter
              filteringText={notifFilter}
              filteringPlaceholder="Find notifications"
              onChange={({ detail }) => setNotifFilter(detail.filteringText)}
            />
          }
          header={
            <Header
              variant="h2"
              actions={
                <Button
                  iconName="refresh"
                  variant="icon"
                  ariaLabel="Refresh notifications"
                />
              }
            >
              Notifications
            </Header>
          }
          pagination={
            <Pagination
              currentPageIndex={1}
              pagesCount={1}
              ariaLabels={{
                nextPageLabel: "Next page",
                previousPageLabel: "Previous page",
                pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
              }}
            />
          }
        />
      </Box>

      {/* Stats */}
      {stats && (
        <Box padding={{ horizontal: "m" }}>
          <Container header={<Header variant="h2">Your Route 53 resources</Header>}>
            <ColumnLayout columns={4} minColumnWidth={120} variant="text-grid">
              <Box>
                <Box variant="h3">{stats.total_zones}</Box>
                <Box variant="small" color="text-body-secondary">Hosted zones</Box>
              </Box>
              <Box>
                <Box variant="h3">{stats.public_zones}</Box>
                <Box variant="small" color="text-body-secondary">Public zones</Box>
              </Box>
              <Box>
                <Box variant="h3">{stats.private_zones}</Box>
                <Box variant="small" color="text-body-secondary">Private zones</Box>
              </Box>
              <Box>
                <Box variant="h3">{stats.total_records}</Box>
                <Box variant="small" color="text-body-secondary">DNS records</Box>
              </Box>
            </ColumnLayout>
          </Container>
        </Box>
      )}

      {/* Activity feed */}
      <Box padding={{ horizontal: "m" }}>
        <Container header={<Header variant="h2">Record creation activity (last 7 days)</Header>}>
          <ActivityFeed />
        </Container>
      </Box>

      {/* More resources - list with separators */}
      <Box padding={{ horizontal: "m" }}>
        <Container header={<Header variant="h2">More resources</Header>}>
          <ul className="home-page__list-separator" aria-label="Additional resource links">
            <li><Link variant="secondary" onFollow={(e) => { e.preventDefault(); router.push("/health-checks"); }}>Documentation</Link></li>
            <li><Link variant="secondary" onFollow={(e) => { e.preventDefault(); router.push("/health-checks"); }}>API reference</Link></li>
            <li><Link variant="secondary" onFollow={(e) => { e.preventDefault(); router.push("/health-checks"); }}>FAQs</Link></li>
            <li><Link variant="secondary" onFollow={(e) => { e.preventDefault(); router.push("/health-checks"); }}>Forum - DNS and health checks</Link></li>
            <li><Link variant="secondary" onFollow={(e) => { e.preventDefault(); router.push("/domains/registered"); }}>Forum - Domain name registration</Link></li>
            <li><Link variant="secondary" onFollow={(e) => { e.preventDefault(); router.push("/health-checks"); }}>Request a limit increase</Link></li>
          </ul>
        </Container>
      </Box>

      {/* Service health */}
      <Box padding={{ horizontal: "m", bottom: "m" }}>
        <Container header={<Header variant="h2">Service health</Header>}>
          <Box variant="p">
            To view the current status of Route 53, see the{" "}
            <Link variant="secondary" onFollow={(e) => { e.preventDefault(); router.push("/health-checks"); }}>
              AWS Service Health Dashboard
            </Link>
            .
          </Box>
        </Container>
      </Box>
    </SpaceBetween>
  );
}
