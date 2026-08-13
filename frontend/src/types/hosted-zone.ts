export type ZoneType = "PUBLIC" | "PRIVATE";

export interface HostedZone {
  id: string;
  name: string;
  type: ZoneType;
  comment: string;
  record_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface HostedZoneCreatePayload {
  name: string;
  type: ZoneType;
  comment?: string;
}

export interface HostedZoneUpdatePayload {
  comment: string;
}

export interface ListZonesParams {
  page?: number;
  page_size?: number;
  search?: string;
  type?: ZoneType;
  sort?: string;
}
