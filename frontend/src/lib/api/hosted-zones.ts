import { apiFetch } from "./client";
import type { Page } from "@/types/api";
import type {
  HostedZone,
  HostedZoneCreatePayload,
  HostedZoneUpdatePayload,
  ListZonesParams,
} from "@/types/hosted-zone";

export const zonesApi = {
  list(params: ListZonesParams = {}): Promise<Page<HostedZone>> {
    return apiFetch<Page<HostedZone>>("/api/hosted-zones", {
      query: params,
    });
  },
  get(zoneId: string): Promise<HostedZone> {
    return apiFetch<HostedZone>(`/api/hosted-zones/${zoneId}`);
  },
  create(payload: HostedZoneCreatePayload): Promise<HostedZone> {
    return apiFetch<HostedZone>("/api/hosted-zones", {
      method: "POST",
      body: payload,
    });
  },
  update(zoneId: string, payload: HostedZoneUpdatePayload): Promise<HostedZone> {
    return apiFetch<HostedZone>(`/api/hosted-zones/${zoneId}`, {
      method: "PATCH",
      body: payload,
    });
  },
  delete(zoneId: string): Promise<void> {
    return apiFetch<void>(`/api/hosted-zones/${zoneId}`, {
      method: "DELETE",
    });
  },
  bulkDelete(zoneIds: string[]): Promise<{ deleted: number; skipped: number }> {
    return apiFetch<{ deleted: number; skipped: number }>(
      "/api/hosted-zones/bulk-delete",
      { method: "POST", body: { zone_ids: zoneIds } },
    );
  },
};
