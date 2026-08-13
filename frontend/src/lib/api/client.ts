// Typed fetch wrapper. The only place that talks to the backend over HTTP.
// Resource modules (auth, hosted-zones, etc.) call into this; components
// never call fetch directly.

import { ApiError } from "./errors";
import { readToken } from "./storage";
import type { APIResponse, ApiErrorEnvelope } from "@/types/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null> | object;
  signal?: AbortSignal;
  raw?: boolean;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(path, API_BASE);
  if (query) {
    const entries = Object.entries(query);
    for (const [k, v] of entries) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined && typeof opts.body !== "string") {
    headers["Content-Type"] = "application/json";
  }
  const token = readToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(buildUrl(path, opts.query), {
    method: opts.method ?? "GET",
    headers,
    body:
      opts.body !== undefined
        ? typeof opts.body === "string"
          ? opts.body
          : JSON.stringify(opts.body)
        : undefined,
    signal: opts.signal,
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : undefined;

  if (!res.ok) {
    const envelope =
      data && typeof data === "object" && "error" in (data as object)
        ? (data as ApiErrorEnvelope)
        : {
            error: {
              code: `http_${res.status}`,
              message: res.statusText,
              details: [],
            },
          };
    throw new ApiError(res.status, envelope);
  }

  if (opts.raw) return data as T;

  // Unwrap APIResponse envelope when present.
  if (
    data &&
    typeof data === "object" &&
    "data" in (data as object) &&
    "items" in (data as object)
  ) {
    return data as T;
  }
  if (data && typeof data === "object" && "data" in (data as object)) {
    return (data as APIResponse<T>).data;
  }
  return data as T;
}
