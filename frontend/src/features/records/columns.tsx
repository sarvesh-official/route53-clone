"use client";

import type { TableProps } from "@cloudscape-design/components/table";

import type { DnsRecord } from "@/types/dns-record";

export const RECORD_COLUMNS: TableProps.ColumnDefinition<DnsRecord>[] = [
  {
    id: "name",
    header: "Record name",
    cell: (item) => item.name,
    sortingField: "name",
  },
  {
    id: "type",
    header: "Type",
    cell: (item) => item.type,
    sortingField: "type",
  },
  {
    id: "ttl",
    header: "TTL (seconds)",
    cell: (item) => item.ttl,
    sortingField: "ttl",
  },
  {
    id: "value",
    header: "Value",
    cell: (item) => item.value,
    sortingField: "value",
  },
  {
    id: "routing_policy",
    header: "Routing policy",
    cell: (item) => item.routing_policy,
  },
];
