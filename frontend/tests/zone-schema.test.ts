import { describe, it, expect } from "vitest";
import { zoneCreateSchema, zoneEditSchema } from "@/lib/validation/zone-schema";

describe("zoneCreateSchema", () => {
  const validZone = {
    name: "example.com.",
    type: "PUBLIC" as const,
  };

  it("accepts a valid zone", () => {
    const result = zoneCreateSchema.safeParse(validZone);
    expect(result.success).toBe(true);
  });

  it("accepts a zone with comment", () => {
    const result = zoneCreateSchema.safeParse({
      ...validZone,
      comment: "My production zone",
    });
    expect(result.success).toBe(true);
  });

  it("accepts PRIVATE type", () => {
    const result = zoneCreateSchema.safeParse({ ...validZone, type: "PRIVATE" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid type", () => {
    const result = zoneCreateSchema.safeParse({ ...validZone, type: "SHARED" });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = zoneCreateSchema.safeParse({ ...validZone, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid domain name", () => {
    const result = zoneCreateSchema.safeParse({ ...validZone, name: "not_a_domain" });
    expect(result.success).toBe(false);
  });

  it("rejects comment over 256 characters", () => {
    const result = zoneCreateSchema.safeParse({
      ...validZone,
      comment: "x".repeat(257),
    });
    expect(result.success).toBe(false);
  });

  it("accepts domain without trailing dot", () => {
    const result = zoneCreateSchema.safeParse({ ...validZone, name: "example.com" });
    expect(result.success).toBe(true);
  });
});

describe("zoneEditSchema", () => {
  it("accepts a valid comment", () => {
    const result = zoneEditSchema.safeParse({ comment: "Updated note" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object (no changes)", () => {
    const result = zoneEditSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects comment over 256 characters", () => {
    const result = zoneEditSchema.safeParse({ comment: "x".repeat(257) });
    expect(result.success).toBe(false);
  });
});
