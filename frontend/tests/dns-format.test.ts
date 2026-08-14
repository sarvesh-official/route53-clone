import { describe, it, expect } from "vitest";
import { displayDomain } from "@/lib/format/dns";

describe("displayDomain", () => {
  it("strips a single trailing dot", () => {
    expect(displayDomain("example.com.")).toBe("example.com");
  });

  it("strips multiple trailing dots", () => {
    expect(displayDomain("example.com..")).toBe("example.com");
  });

  it("leaves a name without trailing dot unchanged", () => {
    expect(displayDomain("example.com")).toBe("example.com");
  });

  it("handles subdomains", () => {
    expect(displayDomain("www.example.com.")).toBe("www.example.com");
  });

  it("handles root zone", () => {
    expect(displayDomain(".")).toBe("");
  });

  it("handles empty string", () => {
    expect(displayDomain("")).toBe("");
  });
});
