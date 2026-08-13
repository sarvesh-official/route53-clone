"use client";

import Box from "@cloudscape-design/components/box";
import { useQuery } from "@tanstack/react-query";

import { statsApi } from "@/lib/api/stats";

export function ActivityFeed() {
  const { data, isLoading } = useQuery({
    queryKey: ["activity"],
    queryFn: () => statsApi.activity(7),
  });

  if (isLoading) {
    return <Box variant="p">Loading activity...</Box>;
  }

  const buckets = data?.buckets ?? [];
  const max = Math.max(1, ...buckets.map((b) => b.records_created));

  if (buckets.length === 0) {
    return (
      <Box textAlign="center" padding={{ vertical: "l" }}>
        <Box variant="strong">No recent activity</Box>
        <Box variant="p" color="text-body-secondary">
          No DNS records have been created in the last 7 days.
        </Box>
      </Box>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 12,
        height: 160,
        padding: "8px 0",
      }}
    >
      {buckets.map((b) => {
        const h = Math.round((b.records_created / max) * 140);
        const date = new Date(b.day);
        const label = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        return (
          <div
            key={b.day}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              flex: 1,
            }}
          >
            <Box variant="small" color="text-body-secondary">
              {b.records_created}
            </Box>
            <div
              style={{
                width: "100%",
                maxWidth: 48,
                height: Math.max(h, 2),
                backgroundColor: "#ff9900",
                borderRadius: 4,
                transition: "height 0.3s ease",
              }}
              title={`${b.records_created} records on ${label}`}
            />
            <Box variant="small" color="text-body-secondary">
              {label}
            </Box>
          </div>
        );
      })}
    </div>
  );
}
