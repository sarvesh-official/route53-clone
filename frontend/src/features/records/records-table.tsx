"use client";

import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Input from "@cloudscape-design/components/input";
import Modal from "@cloudscape-design/components/modal";
import Pagination from "@cloudscape-design/components/pagination";
import Select from "@cloudscape-design/components/select";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Table from "@cloudscape-design/components/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { recordsApi } from "@/lib/api/dns-records";
import { isApiError } from "@/lib/api/errors";
import { useNotifications } from "@/providers/notifications-provider";
import type {
  DnsRecord,
  CreatableRecordType,
  DnsRecordCreatePayload,
  DnsRecordUpdatePayload,
} from "@/types/dns-record";
import { CREATABLE_RECORD_TYPES } from "@/types/dns-record";
import type { HostedZone } from "@/types/hosted-zone";

import { RECORD_COLUMNS } from "./columns";
import { RecordModal } from "./record-modal";
import { ImportModal } from "./import-modal";

const PAGE_SIZE = 25;
const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  ...CREATABLE_RECORD_TYPES.map((t) => ({ value: t, label: t })),
];

export function RecordsTable({ zone }: { zone: HostedZone }) {
  const queryClient = useQueryClient();
  const { notify } = useNotifications();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | CreatableRecordType>(
    "all",
  );
  const [selected, setSelected] = useState<DnsRecord[]>([]);
  const [modalState, setModalState] = useState<{
    mode: "create" | "edit";
    visible: boolean;
    record: DnsRecord | null;
  }>({ mode: "create", visible: false, record: null });
  const [importOpen, setImportOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DnsRecord | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["records", zone.id, { page, search, typeFilter }],
    queryFn: () =>
      recordsApi.list(zone.id, {
        page,
        page_size: PAGE_SIZE,
        search: search || undefined,
        type: typeFilter === "all" ? undefined : typeFilter,
      }),
  });

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["records", zone.id] });
    queryClient.invalidateQueries({ queryKey: ["zones"] });
    queryClient.invalidateQueries({ queryKey: ["zone", zone.id] });
  }, [queryClient, zone.id]);

  const createMutation = useMutation({
    mutationFn: (payload: DnsRecordCreatePayload) =>
      recordsApi.create(zone.id, payload),
    onSuccess: () => {
      invalidateAll();
      setModalState({ mode: "create", visible: false, record: null });
      notify({ type: "success", content: "Record created successfully." });
    },
    onError: (err) => {
      notify({
        type: "error",
        content: isApiError(err) ? err.message : "Failed to create record.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: DnsRecordUpdatePayload;
    }) => recordsApi.update(id, payload),
    onSuccess: () => {
      invalidateAll();
      setModalState({ mode: "edit", visible: false, record: null });
      setSelected([]);
      notify({ type: "success", content: "Record updated successfully." });
    },
    onError: (err) => {
      notify({
        type: "error",
        content: isApiError(err) ? err.message : "Failed to update record.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: recordsApi.delete,
    onSuccess: () => {
      invalidateAll();
      setDeleteTarget(null);
      setSelected([]);
      notify({ type: "success", content: "Record deleted successfully." });
    },
    onError: (err) => {
      notify({
        type: "error",
        content: isApiError(err) ? err.message : "Failed to delete record.",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => recordsApi.bulkDelete(ids),
    onSuccess: (res) => {
      invalidateAll();
      setBulkDeleteOpen(false);
      setSelected([]);
      notify({
        type: "success",
        content: `${res.deleted} record(s) deleted${
          res.skipped > 0 ? `, ${res.skipped} skipped` : ""
        }.`,
      });
    },
    onError: (err) => {
      notify({
        type: "error",
        content: isApiError(err) ? err.message : "Failed to bulk delete records.",
      });
    },
  });

  const importMutation = useMutation({
    mutationFn: (content: string) => recordsApi.importBind(zone.id, content),
    onSuccess: (res) => {
      invalidateAll();
      setImportOpen(false);
      notify({
        type: "success",
        content: `Imported ${res.imported_count} record(s).`,
      });
    },
    onError: (err) => {
      notify({
        type: "error",
        content: isApiError(err) ? err.message : "Failed to import zone file.",
      });
    },
  });

  const exportJsonMutation = useMutation({
    mutationFn: () => recordsApi.exportJson(zone.id),
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${zone.name.replace(/\.$/, "")}-records.json`;
      a.click();
      URL.revokeObjectURL(url);
      notify({ type: "success", content: "JSON export downloaded." });
    },
    onError: () => {
      notify({ type: "error", content: "Failed to export JSON." });
    },
  });

  const handleExportBind = () => {
    window.open(recordsApi.exportBindUrl(zone.id), "_blank");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) {
        if (e.key === "Escape") {
          (target as HTMLElement).blur();
        }
        return;
      }

      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setModalState({ mode: "create", visible: true, record: null });
      } else if (e.key === "/" || e.key === "?") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        invalidateAll();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [invalidateAll]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const submitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    bulkDeleteMutation.isPending ||
    importMutation.isPending;

  const handleModalSubmit = (payload: DnsRecordCreatePayload | DnsRecordUpdatePayload) => {
    if (modalState.mode === "edit" && modalState.record) {
      updateMutation.mutate({
        id: modalState.record.id,
        payload: payload as DnsRecordUpdatePayload,
      });
    } else {
      createMutation.mutate(payload as DnsRecordCreatePayload);
    }
  };

  return (
    <>
      <SpaceBetween size="l">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-[400px]">
              <span className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-sm text-[#687078]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M7 2a5 5 0 100 10 5 5 0 000-10zM1 7a6 6 0 1110.89 3.476l3.817 3.817a.75.75 0 01-1.06 1.06l-3.817-3.817A6 6 0 011 7z" />
                </svg>
              </span>
              <Input
                ref={searchRef as never}
                value={search}
                onChange={(e) => {
                  setSearch(e.detail.value);
                  setPage(1);
                }}
                placeholder="Filter records by name, type, or value"
                type="search"
              />
            </div>
            <Select
              selectedOption={
                TYPE_OPTIONS.find((o) => o.value === typeFilter) ??
                TYPE_OPTIONS[0]
              }
              onChange={(e) => {
                setTypeFilter(
                  e.detail.selectedOption.value as "all" | CreatableRecordType,
                );
                setPage(1);
              }}
              options={TYPE_OPTIONS}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              iconName="refresh"
              variant="icon"
              ariaLabel="Refresh"
              onClick={() => invalidateAll()}
            />
            <Button onClick={() => setImportOpen(true)}>Import</Button>
            <Button
              onClick={() => exportJsonMutation.mutate()}
              loading={exportJsonMutation.isPending}
            >
              Export JSON
            </Button>
            <Button onClick={handleExportBind}>Export BIND</Button>
            <Button
              disabled={selected.length === 0}
              onClick={() => setBulkDeleteOpen(true)}
            >
              Delete
            </Button>
            <Button
              disabled={selected.length !== 1}
              onClick={() =>
                setModalState({
                  mode: "edit",
                  visible: true,
                  record: selected[0],
                })
              }
            >
              Edit
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                setModalState({ mode: "create", visible: true, record: null })
              }
            >
              Create record
            </Button>
          </div>
        </div>

        <Table
          columnDefinitions={RECORD_COLUMNS}
          items={items}
          loading={isLoading}
          loadingText="Loading records..."
          selectionType="multi"
          selectedItems={selected}
          onSelectionChange={(e) => setSelected(e.detail.selectedItems)}
          empty={
            <Box textAlign="center" padding={{ vertical: "xl" }}>
              <Box variant="strong" fontSize="heading-m">
                No records
              </Box>
              <Box
                variant="p"
                color="text-body-secondary"
                padding={{ top: "s" }}
              >
                There are no DNS records in this hosted zone.
              </Box>
              <Box padding={{ top: "m" }}>
                <Button
                  variant="primary"
                  onClick={() =>
                    setModalState({
                      mode: "create",
                      visible: true,
                      record: null,
                    })
                  }
                >
                  Create record
                </Button>
              </Box>
            </Box>
          }
          resizableColumns
          stickyHeader
          wrapLines
        />

        <div className="flex items-center justify-between">
          <Box variant="small" color="text-body-secondary">
            {total} record{total !== 1 ? "s" : ""} • Press{" "}
            <kbd>c</kbd> to create, <kbd>/</kbd> to search, <kbd>r</kbd> to
            refresh
          </Box>
          <Pagination
            currentPageIndex={page}
            pagesCount={Math.ceil(total / PAGE_SIZE)}
            onChange={(e) => setPage(e.detail.currentPageIndex)}
            ariaLabels={{
              nextPageLabel: "Next page",
              previousPageLabel: "Previous page",
              pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
            }}
          />
        </div>
      </SpaceBetween>

      <RecordModal
        visible={modalState.visible}
        mode={modalState.mode}
        record={modalState.record}
        zoneName={zone.name}
        onDismiss={() =>
          setModalState({ mode: modalState.mode, visible: false, record: null })
        }
        onSubmit={handleModalSubmit}
        submitting={submitting}
      />

      <ImportModal
        visible={importOpen}
        onDismiss={() => setImportOpen(false)}
        onImport={(content) => importMutation.mutate(content)}
        submitting={importMutation.isPending}
      />

      <Modal
        visible={!!deleteTarget}
        onDismiss={() => setDeleteTarget(null)}
        header="Delete record"
        footer={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
              }}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </SpaceBetween>
        }
      >
        <Box variant="p">
          Are you sure you want to delete the record{" "}
          <strong>{deleteTarget?.name}</strong> ({deleteTarget?.type})?
        </Box>
      </Modal>

      <Modal
        visible={bulkDeleteOpen}
        onDismiss={() => setBulkDeleteOpen(false)}
        header="Delete records"
        footer={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => setBulkDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                bulkDeleteMutation.mutate(selected.map((r) => r.id))
              }
              loading={bulkDeleteMutation.isPending}
            >
              Delete {selected.length} record{selected.length !== 1 ? "s" : ""}
            </Button>
          </SpaceBetween>
        }
      >
        <Box variant="p">
          Are you sure you want to delete{" "}
          <strong>{selected.length}</strong> record
          {selected.length !== 1 ? "s" : ""}? This action cannot be undone.
        </Box>
      </Modal>
    </>
  );
}
