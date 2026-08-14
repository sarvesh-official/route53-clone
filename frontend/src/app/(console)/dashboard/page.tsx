"use client";

import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Table from "@cloudscape-design/components/table";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { statsApi } from "@/lib/api/stats";
import { ActivityFeed } from "@/features/dashboard/activity-feed";

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

  return (
    <SpaceBetween size="l">
      <Box padding={{ top: "m", horizontal: "l" }}>
        <Header
          variant="h1"
          actions={
            <Button iconName="status-info" variant="icon" ariaLabel="More information about Route 53 Dashboard">
              Info
            </Button>
          }
        >
          Route 53 Dashboard
        </Header>
      </Box>

      {/* 4 product cards */}
      <Box padding={{ horizontal: "l" }}>
        <ColumnLayout columns={4} variant="text-grid">
          <Container>
            <Header variant="h3">DNS management</Header>
            <Box variant="p">
              A hosted zone tells Route 53 how to respond to DNS queries for a domain such as example.com.
            </Box>
            <Link onFollow={(e) => { e.preventDefault(); router.push("/hosted-zones"); }}>
              Create hosted zone
            </Link>
          </Container>
          <Container>
            <Header variant="h3">Availability monitoring</Header>
            <Box variant="p">
              Health checks monitor your applications and web resources, and direct DNS queries to healthy resources.
            </Box>
            <Link onFollow={(e) => { e.preventDefault(); router.push("/health-checks"); }}>
              Create health check
            </Link>
          </Container>
          <Container>
            <Header variant="h3">Traffic management</Header>
            <Box variant="p">
              A visual tool that lets you easily create policies for multiple endpoints in complex configurations.
            </Box>
            <Link onFollow={(e) => { e.preventDefault(); router.push("/traffic-policies"); }}>
              Create policy
            </Link>
          </Container>
          <Container>
            <Header variant="h3">Domain registration</Header>
            <Box variant="p">
              A domain is the name, such as example.com, that your users use to access your application.
            </Box>
            <Link onFollow={(e) => { e.preventDefault(); router.push("/domains/registered"); }}>
              Register domain
            </Link>
          </Container>
        </ColumnLayout>
      </Box>

      {/* Register domain + Notifications */}
      <Box padding={{ horizontal: "l" }}>
        <ColumnLayout columns={2} variant="text-grid">
          <Container header={<Header variant="h2">Register domain</Header>}>
            <SpaceBetween size="m">
              <Box variant="p">
                Find and register an available domain, or{" "}
                <Link href="https://console.aws.amazon.com/route53/home?#DomainTransfer:" external>
                  Transfer Domain to Route 53
                </Link>{" "}
                transfer your existing domains to Route 53.
              </Box>
              <Box>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter a domain name"
                    className="h-8 flex-1 rounded-lg border border-[#8c8c94] px-3 py-[5px] text-sm outline-none"
                  />
                  <Button>Check</Button>
                </div>
                <Box variant="small" color="text-body-secondary">
                  Each label (each part between dots) can be up to 63 characters long and must start with a-z or 0-9. Maximum length: 255 characters, including dots. Valid characters: a-z, 0-9, and - (hyphen)
                </Box>
              </Box>
            </SpaceBetween>
          </Container>
          <Container
            header={
              <Header
                variant="h2"
                actions={<Button iconName="refresh" variant="icon" ariaLabel="Refresh notifications">Refresh</Button>}
              >
                Notifications
              </Header>
            }
          >
            <Table<NotificationItem>
              columnDefinitions={[
                { id: "resource", header: "Resource", cell: (item) => item.resource },
                { id: "status", header: "Status", cell: (item) => item.status },
                { id: "lastUpdate", header: "Last update", cell: (item) => item.lastUpdate },
              ]}
              items={[]}
              empty={
                <Box textAlign="center" color="text-body-secondary">
                  No notifications to display
                </Box>
              }
            />
          </Container>
        </ColumnLayout>
      </Box>

      {/* Stats */}
      {stats && (
        <Box padding={{ horizontal: "l", bottom: "l" }}>
          <Container header={<Header variant="h2">Your Route 53 resources</Header>}>
            <ColumnLayout columns={4} variant="text-grid">
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
      <Box padding={{ horizontal: "l", bottom: "l" }}>
        <Container header={<Header variant="h2">Record creation activity (last 7 days)</Header>}>
          <ActivityFeed />
        </Container>
      </Box>

      {/* More resources */}
      <Box padding={{ horizontal: "l", bottom: "l" }}>
        <Container header={<Header variant="h2">More resources</Header>}>
          <SpaceBetween size="m">
            <Link href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html" external>Documentation</Link>
            <Link href="https://docs.aws.amazon.com/Route53/latest/APIReference/" external>API reference</Link>
            <Link href="https://aws.amazon.com/route53/faqs/" external>FAQs</Link>
            <Link href="https://repost.aws/tags/TAO7Z4bI5hQ5a2VgZJyYyZ5g/aws-route-53-dns-and-health-checks" external>Forum - DNS and health checks</Link>
            <Link href="https://repost.aws/tags/TAO7Z4bI5hQ5a2VgZJyYyZ5g/aws-route-53-domain-name-registration" external>Forum - Domain name registration</Link>
            <Link href="https://console.aws.amazon.com/support/home#/case/create?issueType=service-limit-increase" external>Request a limit increase</Link>
          </SpaceBetween>
        </Container>
      </Box>

      {/* Service health */}
      <Box padding={{ horizontal: "l", bottom: "l" }}>
        <Container header={<Header variant="h2">Service health</Header>}>
          <Box variant="p">
            To view the current status of Route 53, see the{" "}
            <Link href="https://health.aws.amazon.com/health/current" external>
              AWS Service Health Dashboard
            </Link>
            .
          </Box>
        </Container>
      </Box>
    </SpaceBetween>
  );
}
