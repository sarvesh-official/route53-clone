import { apiFetch } from "./client";
import type { TokenResponse, User } from "@/types/auth";

export const authApi = {
  login(email: string, password: string): Promise<TokenResponse> {
    return apiFetch<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },
  register(email: string, password: string, displayName: string): Promise<TokenResponse> {
    return apiFetch<TokenResponse>("/api/auth/register", {
      method: "POST",
      body: { email, password, display_name: displayName },
    });
  },
  logout(): Promise<void> {
    return apiFetch<void>("/api/auth/logout", { method: "POST" });
  },
  me(): Promise<User> {
    return apiFetch<User>("/api/auth/me");
  },
};
