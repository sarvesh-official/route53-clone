import { apiFetch } from "./client";
import type { Page } from "@/types/api";
import type {
  DnsRecord,
  DnsRecordCreatePayload,
  DnsRecordUpdatePayload,
  ListRecordsParams,
} from "@/types/dns-record";

export const recordsApi = {
  list(zoneId: string, params: ListRecordsParams = {}): Promise<Page<DnsRecord>> {
    return apiFetch<Page<DnsRecord>>(
      `/api/hosted-zones/${zoneId}/records`,
      { query: params },
    );
  },
  get(recordId: string): Promise<DnsRecord> {
    return apiFetch<DnsRecord>(`/api/records/${recordId}`);
  },
  create(zoneId: string, payload: DnsRecordCreatePayload): Promise<DnsRecord> {
    return apiFetch<DnsRecord>(`/api/hosted-zones/${zoneId}/records`, {
      method: "POST",
      body: payload,
    });
  },
  update(recordId: string, payload: DnsRecordUpdatePayload): Promise<DnsRecord> {
    return apiFetch<DnsRecord>(`/api/records/${recordId}`, {
      method: "PATCH",
      body: payload,
    });
  },
  delete(recordId: string): Promise<void> {
    return apiFetch<void>(`/api/records/${recordId}`, { method: "DELETE" });
  },
  bulkDelete(recordIds: string[]): Promise<{ deleted: number; skipped: number }> {
    return apiFetch<{ deleted: number; skipped: number }>(
      "/api/records/bulk-delete",
      { method: "POST", body: { record_ids: recordIds } },
    );
  },
  importBind(zoneId: string, content: string): Promise<{ imported_count: number }> {
    return apiFetch<{ imported_count: number }>(
      `/api/hosted-zones/${zoneId}/import`,
      { method: "POST", body: content, raw: true },
    );
  },
  exportJson(zoneId: string): Promise<unknown> {
    return apiFetch<unknown>(`/api/hosted-zones/${zoneId}/export`);
  },
  exportBindUrl(zoneId: string): string {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
    return `${base}/api/hosted-zones/${zoneId}/export?format=bind`;
  },
};
