import { describe, it, expect, beforeEach } from "vitest";
import { readToken, writeToken, clearToken } from "@/lib/api/storage";

describe("token storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when no token is stored", () => {
    expect(readToken()).toBeNull();
  });

  it("saves and reads a token", () => {
    writeToken("test-token-abc123");
    expect(readToken()).toBe("test-token-abc123");
  });

  it("clears a stored token", () => {
    writeToken("test-token-abc123");
    expect(readToken()).toBe("test-token-abc123");
    clearToken();
    expect(readToken()).toBeNull();
  });

  it("overwrites a previous token", () => {
    writeToken("first-token");
    writeToken("second-token");
    expect(readToken()).toBe("second-token");
  });
});
