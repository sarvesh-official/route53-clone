"use client";

import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import Modal from "@cloudscape-design/components/modal";
import Pagination from "@cloudscape-design/components/pagination";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Table from "@cloudscape-design/components/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { zonesApi } from "@/lib/api/hosted-zones";
import { isApiError } from "@/lib/api/errors";
import { useNotifications } from "@/providers/notifications-provider";
import type { HostedZone } from "@/types/hosted-zone";

export default function HostedZonesPage() {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<HostedZone[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["zones", { page, search }],
    queryFn: () => zonesApi.list({ page, page_size: 10, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: zonesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      setDeleteOpen(false);
      setSelectedItems([]);
      notify({ type: "success", content: "Hosted zone deleted successfully." });
    },
    onError: (err) => {
      notify({
        type: "error",
        content: isApiError(err) ? err.message : "Failed to delete hosted zone.",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => zonesApi.bulkDelete(ids),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      setDeleteOpen(false);
      setSelectedItems([]);
      notify({
        type: "success",
        content: `${res.deleted} hosted zone(s) deleted${res.skipped > 0 ? `, ${res.skipped} skipped` : ""}.`,
      });
    },
    onError: (err) => {
      notify({
        type: "error",
        content: isApiError(err) ? err.message : "Failed to bulk delete hosted zones.",
      });
    },
  });

  const [deleteOpen, setDeleteOpen] = useState(false);

  const totalZones = data?.total ?? 0;
  const zones = data?.items ?? [];

  return (
    <>
    <Box padding={{ top: "m", horizontal: "l" }}>
      <SpaceBetween size="l">
        <Header
          variant="h1"
          counter={`(${totalZones})`}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                iconName="refresh"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["zones"] })}
              >
                Refresh
              </Button>
              <Button disabled={selectedItems.length !== 1}>View details</Button>
              <Button disabled={selectedItems.length !== 1}>Edit</Button>
              <Button
                disabled={selectedItems.length === 0}
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
              <Button variant="primary" href="/hosted-zones/create">
                Create hosted zone
              </Button>
            </SpaceBetween>
          }
        >
          Hosted zones
        </Header>

        <Box variant="p">
          Automatic mode is the current search behavior optimized for best filter results.{" "}
          <Link href="#" onClick={(e) => e.preventDefault()}>
            To change modes go to settings.
          </Link>
        </Box>

        <Container>
          <SpaceBetween size="l">
            <div className="flex items-center justify-between">
              <div className="relative w-[648px]">
                <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-[#687078]">
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="m11 11 4 4M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.detail.value);
                    setPage(1);
                  }}
                  placeholder="Filter hosted zones by property or value"
                  type="search"
                />
              </div>
              <div className="flex items-center gap-2">
                <Pagination
                  currentPageIndex={page}
                  pagesCount={Math.ceil(totalZones / 10)}
                  onChange={(e) => setPage(e.detail.currentPageIndex)}
                  ariaLabels={{
                    nextPageLabel: "Next page",
                    previousPageLabel: "Previous page",
                    pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
                  }}
                />
                <Button iconName="settings" variant="icon" ariaLabel="Preferences">
                  Preferences
                </Button>
              </div>
            </div>

            <Table
              columnDefinitions={[
                {
                  id: "name",
                  header: "Hosted zone name",
                  cell: (item: HostedZone) => (
                    <Link href={`/hosted-zones/${item.id}`} style={{ color: "#006ce0" }}>
                      {item.name}
                    </Link>
                  ),
                  sortingField: "name",
                },
                {
                  id: "type",
                  header: "Type",
                  cell: (item: HostedZone) => item.type,
                  sortingField: "type",
                },
                {
                  id: "created_by",
                  header: "Created by",
                  cell: (item: HostedZone) => item.created_by,
                },
                {
                  id: "record_count",
                  header: "Record count",
                  cell: (item: HostedZone) => item.record_count,
                  sortingField: "record_count",
                },
                {
                  id: "id",
                  header: "Hosted zone ID",
                  cell: (item: HostedZone) => item.id,
                },
              ]}
              items={zones}
              loading={isLoading}
              loadingText="Loading hosted zones..."
              selectionType="multi"
              selectedItems={selectedItems}
              onSelectionChange={(e) => setSelectedItems(e.detail.selectedItems)}
              empty={
                <Box textAlign="center" padding={{ vertical: "xl" }}>
                  <Box variant="strong" fontSize="heading-m">
                    No hosted zones
                  </Box>
                  <Box variant="p" color="text-body-secondary" padding={{ top: "s" }}>
                    There are no hosted zones created for this account.
                  </Box>
                  <Box padding={{ top: "m" }}>
                    <Button variant="primary" href="/hosted-zones/create">
                      Create hosted zone
                    </Button>
                  </Box>
                </Box>
              }
              submitEdit={async () => {}}
              resizableColumns
              stickyHeader
              wrapLines
            />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Box>

      <Modal
        visible={deleteOpen}
        onDismiss={() => setDeleteOpen(false)}
        header="Delete hosted zone(s)"
        footer={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={deleteMutation.isPending || bulkDeleteMutation.isPending}
              onClick={() => {
                if (selectedItems.length === 1) {
                  deleteMutation.mutate(selectedItems[0].id);
                } else if (selectedItems.length > 1) {
                  bulkDeleteMutation.mutate(selectedItems.map((z) => z.id));
                }
              }}
            >
              Delete {selectedItems.length} hosted zone
              {selectedItems.length !== 1 ? "s" : ""}
            </Button>
          </SpaceBetween>
        }
      >
        <Box variant="p">
          Are you sure you want to delete{" "}
          <strong>{selectedItems.length}</strong> hosted zone
          {selectedItems.length !== 1 ? "s" : ""}? All DNS records within{" "}
          {selectedItems.length !== 1 ? "these zones" : "this zone"} will be
          permanently deleted.
        </Box>
      </Modal>
    </>
  );
}
