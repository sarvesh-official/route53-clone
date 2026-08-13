"use client";

import Button from "@cloudscape-design/components/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 font-sans text-[#0f141a]">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* 404 illustration */}
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: "#f0f4ff" }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93C7.05 19.44 4 16.08 4 12c0-.61.08-1.21.21-1.78L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.93 5.78 20 8.65 20 12c0 2.08-.8 3.97-2.1 5.39z"
              fill="#006ce0"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-3xl font-semibold text-[#0f141a]">
          404
        </h1>
        <h2 className="mb-3 text-lg font-medium text-[#0f141a]">
          Page not found
        </h2>
        <p className="mb-6 text-sm leading-5 text-[#687078]">
          The page you requested could not be found. It may have been moved,
          deleted, or the URL might be incorrect.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="primary"
            onClick={() => router.push("/dashboard")}
          >
            Go to dashboard
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/login")}
          >
            Back to sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
