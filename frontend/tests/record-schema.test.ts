import { describe, it, expect } from "vitest";
import { recordCreateSchema, recordEditSchema } from "@/lib/validation/record-schema";

describe("recordCreateSchema", () => {
  const validRecord = {
    name: "www.example.com.",
    type: "A" as const,
    ttl: 300,
    value: "192.168.1.1",
  };

  it("accepts a valid record", () => {
    const result = recordCreateSchema.safeParse(validRecord);
    expect(result.success).toBe(true);
  });

  it("accepts all creatable record types", () => {
    for (const type of ["A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"] as const) {
      const result = recordCreateSchema.safeParse({ ...validRecord, type });
      expect(result.success).toBe(true);
    }
  });

  it("rejects TTL > 604800", () => {
    const result = recordCreateSchema.safeParse({ ...validRecord, ttl: 604801 });
    expect(result.success).toBe(false);
  });

  it("rejects TTL < 0", () => {
    const result = recordCreateSchema.safeParse({ ...validRecord, ttl: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = recordCreateSchema.safeParse({ ...validRecord, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects empty value", () => {
    const result = recordCreateSchema.safeParse({ ...validRecord, value: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid record type", () => {
    const result = recordCreateSchema.safeParse({ ...validRecord, type: "SOA" });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer TTL", () => {
    const result = recordCreateSchema.safeParse({ ...validRecord, ttl: 300.5 });
    expect(result.success).toBe(false);
  });

  it("defaults routing_policy to SIMPLE", () => {
    const result = recordCreateSchema.safeParse(validRecord);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.routing_policy).toBe("SIMPLE");
    }
  });
});

describe("recordEditSchema", () => {
  it("accepts only ttl", () => {
    const result = recordEditSchema.safeParse({ ttl: 600 });
    expect(result.success).toBe(true);
  });

  it("accepts only value", () => {
    const result = recordEditSchema.safeParse({ value: "10.0.0.1" });
    expect(result.success).toBe(true);
  });

  it("accepts both ttl and value", () => {
    const result = recordEditSchema.safeParse({ ttl: 600, value: "10.0.0.1" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object (no changes)", () => {
    const result = recordEditSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects ttl > 604800", () => {
    const result = recordEditSchema.safeParse({ ttl: 604801 });
    expect(result.success).toBe(false);
  });

  it("rejects empty value string", () => {
    const result = recordEditSchema.safeParse({ value: "" });
    expect(result.success).toBe(false);
  });
});
