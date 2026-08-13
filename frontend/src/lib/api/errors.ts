export class ApiError extends Error {
  status: number;
  code: string;
  details: Array<{ field?: string; message?: string; type?: string }>;

  constructor(
    status: number,
    envelope: {
      error: {
        code: string;
        message: string;
        details: Array<{ field?: string; message?: string; type?: string }>;
      };
    },
  ) {
    super(envelope.error.message);
    this.name = "ApiError";
    this.status = status;
    this.code = envelope.error.code;
    this.details = envelope.error.details ?? [];
  }

  isUnauthorized(): boolean {
    return this.status === 401 || this.code === "unauthorized";
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}
