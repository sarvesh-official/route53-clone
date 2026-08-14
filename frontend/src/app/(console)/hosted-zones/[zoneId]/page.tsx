"use client";

import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Spinner from "@cloudscape-design/components/spinner";
import { use } from "react";

import { ZoneHeader } from "@/features/records/zone-header";
import { RecordsTable } from "@/features/records/records-table";
import { zonesApi } from "@/lib/api/hosted-zones";
import { displayDomain } from "@/lib/format/dns";
import { useRegisterBreadcrumb } from "@/providers/breadcrumb-provider";
import { useQuery } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ zoneId: string }>;
}

export default function HostedZoneDetailPage({ params }: PageProps) {
  const { zoneId } = use(params);
  const { data: zone, error, isLoading } = useQuery({
    queryKey: ["zone", zoneId],
    queryFn: () => zonesApi.get(zoneId),
  });

  useRegisterBreadcrumb(zoneId, zone?.name ? displayDomain(zone.name) : null);

  if (isLoading) {
    return (
      <Box padding={{ top: "xs", horizontal: "m" }}>
        <Header variant="h1">Hosted zone</Header>
        <Box padding={{ top: "l" }}>
          <Spinner size="large" />
        </Box>
      </Box>
    );
  }

  if (error || !zone) {
    return (
      <Box padding={{ top: "xs", horizontal: "m" }}>
        <Header variant="h1">Hosted zone not found</Header>
        <Box padding={{ top: "l" }}>
          <Alert type="error" header="Could not load hosted zone">
            {error?.message ?? "The hosted zone may have been deleted."}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <SpaceBetween size="l">
      <Box padding={{ top: "xs", horizontal: "m" }}>
        <Header variant="h1">{displayDomain(zone.name)}</Header>
      </Box>
      <Box padding={{ horizontal: "m" }}>
        <ZoneHeader zone={zone} />
      </Box>
      <Box padding={{ horizontal: "m" }}>
        <RecordsTable zone={zone} />
      </Box>
    </SpaceBetween>
  );
}
