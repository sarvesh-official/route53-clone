"use client";

import Button from "@cloudscape-design/components/button";
import { useEffect } from "react";

const c = {
  lightBg: "var(--r53-light-bg)",
  lightTextPrimary: "var(--r53-light-text-primary)",
  lightTextMuted: "var(--r53-light-text-muted)",
  sharedErrorBg: "var(--r53-shared-error-bg)",
  sharedError: "var(--r53-shared-error)",
} as const;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 font-sans" style={{ backgroundColor: c.lightBg, color: c.lightTextPrimary }}>
      <div className="flex max-w-md flex-col items-center text-center">
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: c.sharedErrorBg }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ fill: c.sharedError }}>
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-semibold" style={{ color: c.lightTextPrimary }}>
          Something went wrong
        </h1>
        <p className="mb-6 text-sm leading-5" style={{ color: c.lightTextMuted }}>
          An unexpected error occurred while loading this page. Try again, or
          go back to the dashboard.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="primary" onClick={() => reset()}>
            Try again
          </Button>
          <Button
            variant="link"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
