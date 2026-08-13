// Shared API types mirroring backend response envelopes.

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    details: Array<{ field?: string; message?: string; type?: string }>;
  };
}

export interface APIResponse<T> {
  data: T;
}

export interface Page<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}
