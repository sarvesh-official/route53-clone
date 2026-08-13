// Feedback API client — public endpoint, no auth required.

import { apiFetch } from "./client";

export interface FeedbackCreate {
  name?: string;
  email?: string;
  role?: string;
  rating?: number;
  message: string;
}

export interface FeedbackOut {
  id: number;
  name: string | null;
  email: string | null;
  role: string | null;
  rating: number | null;
  message: string;
  created_at: string;
}

export async function submitFeedback(
  payload: FeedbackCreate,
): Promise<FeedbackOut> {
  return apiFetch<FeedbackOut>("/api/feedback", {
    method: "POST",
    body: payload,
  });
}
