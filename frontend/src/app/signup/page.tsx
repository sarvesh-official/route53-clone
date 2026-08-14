"use client";

import { Mode, applyMode } from "@cloudscape-design/global-styles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isApiError } from "@/lib/api/errors";
import { useAuth } from "@/providers/auth-provider";

/* CSS variable shortcuts for inline use.
   All values are defined in src/app/globals.css :root */
const c = {
  lightBg: "var(--r53-light-bg)",
  lightTextPrimary: "var(--r53-light-text-primary)",
  lightTextMuted: "var(--r53-light-text-muted)",
  lightAccent: "var(--r53-light-accent)",
  lightInputBorder: "var(--r53-light-input-border)",
  lightBorder: "var(--r53-light-border)",
  awsOrange: "var(--r53-aws-orange)",
  sharedWhite: "var(--r53-shared-white)",
  sharedError: "var(--r53-shared-error)",
  sharedErrorBg: "var(--r53-shared-error-bg)",
  darkAccentHover: "var(--r53-dark-accent-hover)",
} as const;

export default function SignupPage() {
  const router = useRouter();
  const { register, status } = useAuth();
  const [email, setEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    applyMode(Mode.Light);
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!accountName.trim()) {
      setError("Please enter an AWS account name.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, "demo1234", accountName);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        isApiError(err) ? err.message : "Sign up failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "r53-input h-9 w-full rounded-lg border bg-white px-3 py-2 outline-none box-border transition-colors";
  const inputStyle = {
    borderColor: c.lightInputBorder,
    color: c.lightTextPrimary,
  };
  const labelCls = "mb-1 block font-medium";
  const labelStyle = { color: c.lightTextPrimary };

  return (
    <div
      className="flex min-h-screen flex-col bg-white font-sans"
      style={{ color: c.lightTextPrimary }}
    >
      {/* Header — language + logo */}
      <div className="flex items-center justify-between px-6 pt-5 sm:px-10">
        {/* Language selector — cosmetic, matches AWS */}
        <div
          className="flex items-center gap-1 text-sm"
          style={{ color: c.lightTextPrimary }}
        >
          <span style={{ fontSize: "14px" }}>English</span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="m8 11 4-6H4l4 6Z" fill={c.lightTextMuted} />
          </svg>
        </div>
        <a href="/login" onClick={(e) => e.preventDefault()}>
          <img
            src="/assets/aws-logo-login.png"
            alt="AWS logo"
            className="h-10 w-16 sm:h-12.75 sm:w-21"
          />
        </a>
        {/* Spacer to center logo */}
        <div className="w-16 sm:w-21" />
      </div>

      {/* Main content — two columns on desktop, single on mobile */}
      <div className="flex flex-1 items-start justify-center px-4 pt-8 sm:px-8 md:pt-12">
        <div className="flex w-full max-w-4xl flex-col items-start gap-8 md:flex-row md:justify-center md:gap-12 lg:gap-16">
          {/* Info panel — hidden on mobile/tablet */}
          <div className="hidden md:block md:w-96 lg:w-[30rem]">
            <h2
              className="mb-3 text-2xl font-semibold leading-7"
              style={{ color: c.lightTextPrimary }}
            >
              Try AWS at no cost for up to 6 months
            </h2>
            <p className="text-sm leading-5 text-[#424650]">
              Start with USD $100 in AWS credits, plus earn up to USD $100 by
              completing various activities.
            </p>
            {/* Rocket illustration placeholder — using AWS orange circle */}
            <div
              className="mt-6 flex h-48 w-full items-center justify-center rounded-lg"
              style={{ backgroundColor: c.lightBg }}
            >
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                <circle cx="60" cy="40" r="30" fill={c.awsOrange} opacity="0.15" />
                <path
                  d="M60 15c-8 0-14 6-14 14v10l-4 6h6v6c0 2 2 4 4 4h2v6h12v-6h2c2 0 4-2 4-4v-6h6l-4-6V29c0-8-6-14-14-14z"
                  fill={c.awsOrange}
                />
                <circle cx="55" cy="32" r="3" fill={c.sharedWhite} />
                <circle cx="65" cy="32" r="3" fill={c.sharedWhite} />
              </svg>
            </div>
          </div>

          {/* Form column */}
          <div className="w-full max-w-[320px] sm:max-w-[340px] md:w-[30rem]">
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-5">
                {/* Heading */}
                <h1
                  className="text-2xl font-semibold leading-7"
                  style={{ color: c.lightTextPrimary }}
                >
                  Sign up for AWS
                </h1>

                {error && (
                  <div
                    className="rounded-lg border px-3.5 py-2.5 text-sm"
                    style={{
                      borderColor: c.sharedError,
                      backgroundColor: c.sharedErrorBg,
                      color: c.sharedError,
                    }}
                  >
                    <strong>There was a problem</strong>
                    <div className="mt-1">{error}</div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="emailAddress"
                    className={labelCls}
                    style={{ fontSize: "14px", ...labelStyle }}
                  >
                    Root user email address
                  </label>
                  <p
                    className="mb-1.5 text-xs"
                    style={{ color: c.lightTextMuted }}
                  >
                    Used for account recovery and as described in the{" "}
                    <a
                      href="https://github.com/sarvesh-official/route53-clone#readme"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 font-normal no-underline"
                      style={{ fontSize: "12px", color: c.darkAccentHover }}
                    >
                      AWS Privacy Notice
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M13 9.012v-6H7M13.02 3 7 9.01M3 5.012v8h8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </p>
                  <input
                    id="emailAddress"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    autoComplete="on"
                    spellCheck={false}
                    placeholder=""
                    className={inputCls}
                    style={{ fontSize: "14px", ...inputStyle }}
                  />
                </div>

                {/* Account name */}
                <div>
                  <label
                    htmlFor="accountName"
                    className={labelCls}
                    style={{ fontSize: "14px", ...labelStyle }}
                  >
                    AWS account name
                  </label>
                  <p
                    className="mb-1.5 text-xs"
                    style={{ color: c.lightTextMuted }}
                  >
                    Choose a name for your account. You can change this name in
                    your account settings after you sign up.
                  </p>
                  <input
                    id="accountName"
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    autoComplete="on"
                    spellCheck={false}
                    placeholder=""
                    className={inputCls}
                    style={{ fontSize: "14px", ...inputStyle }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-9 w-full cursor-pointer appearance-none rounded-md border-none font-medium text-white transition-colors hover:bg-[#0a3a8f]"
                  style={{
                    fontSize: "14px",
                    backgroundColor: c.lightAccent,
                    opacity: submitting ? 0.6 : 1,
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "Verifying..." : "Verify email address"}
                </button>
              </div>
            </form>

            {/* OR divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#d5dbdb]" />
              <span
                className="text-xs font-normal"
                style={{ color: c.lightTextMuted }}
              >
                OR
              </span>
              <div className="h-px flex-1 bg-[#d5dbdb]" />
            </div>

            {/* Sign in to existing account */}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="h-9 w-full cursor-pointer appearance-none rounded-md border bg-white font-medium transition-colors hover:bg-[#f0f4ff]"
              style={{
                fontSize: "14px",
                borderColor: c.lightInputBorder,
                color: c.lightTextPrimary,
              }}
            >
              Sign in to an existing AWS account
            </button>

            {/* Cookie notice */}
            <p
              className="mt-6 text-xs leading-5"
              style={{ color: c.lightTextMuted }}
            >
              This site uses essential cookies. See our{" "}
              <a
                href="https://github.com/sarvesh-official/route53-clone#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-normal no-underline"
                style={{ fontSize: "12px", color: c.darkAccentHover }}
              >
                Cookie Notice
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M13 9.012v-6H7M13.02 3 7 9.01M3 5.012v8h8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>{" "}
              for more information.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-8 border-t px-6 py-5 sm:px-10"
        style={{ borderColor: c.lightBorder }}
      >
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3 text-sm">
            <a
              href="https://github.com/sarvesh-official/route53-clone#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-normal no-underline"
              style={{ fontSize: "14px", color: c.darkAccentHover }}
            >
              Privacy Policy
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M13 9.012v-6H7M13.02 3 7 9.01M3 5.012v8h8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <span className="text-[#d5dbdb]">|</span>
            <a
              href="https://github.com/sarvesh-official/route53-clone#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-normal no-underline"
              style={{ fontSize: "14px", color: c.darkAccentHover }}
            >
              Terms of Use
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M13 9.012v-6H7M13.02 3 7 9.01M3 5.012v8h8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <p
            className="text-xs"
            style={{ color: c.lightTextMuted }}
          >
            (Clone) Route 53 Clone. Built for Scaler AI Labs assignment.
          </p>
        </div>
      </div>
    </div>
  );
}
