import { describe, it, expect } from "vitest";
import { ApiError, isApiError } from "@/lib/api/errors";

describe("ApiError", () => {
  it("constructs with status, code, message, and details", () => {
    const err = new ApiError(404, {
      error: {
        code: "not_found",
        message: "Zone not found",
        details: [{ field: "zone_id", message: "does not exist" }],
      },
    });
    expect(err.status).toBe(404);
    expect(err.code).toBe("not_found");
    expect(err.message).toBe("Zone not found");
    expect(err.details).toHaveLength(1);
    expect(err.details[0].field).toBe("zone_id");
  });

  it("isUnauthorized() returns true for 401 status", () => {
    const err = new ApiError(401, {
      error: { code: "http_401", message: "Unauthorized", details: [] },
    });
    expect(err.isUnauthorized()).toBe(true);
  });

  it("isUnauthorized() returns true for 'unauthorized' code", () => {
    const err = new ApiError(500, {
      error: { code: "unauthorized", message: "Token expired", details: [] },
    });
    expect(err.isUnauthorized()).toBe(true);
  });

  it("isUnauthorized() returns false for other statuses", () => {
    const err = new ApiError(409, {
      error: { code: "conflict", message: "Duplicate zone", details: [] },
    });
    expect(err.isUnauthorized()).toBe(false);
  });

  it("defaults details to empty array when missing", () => {
    const err = new ApiError(400, {
      error: { code: "bad_request", message: "Bad input" },
    } as any);
    expect(err.details).toEqual([]);
  });
});

describe("isApiError", () => {
  it("returns true for ApiError instances", () => {
    const err = new ApiError(500, {
      error: { code: "internal", message: "oops", details: [] },
    });
    expect(isApiError(err)).toBe(true);
  });

  it("returns false for regular Error", () => {
    expect(isApiError(new Error("nope"))).toBe(false);
  });

  it("returns false for non-error values", () => {
    expect(isApiError(null)).toBe(false);
    expect(isApiError("string")).toBe(false);
    expect(isApiError(42)).toBe(false);
  });
});
