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
    backgroundColor: c.sharedWhite,
  };
  const labelCls = "mb-1 block font-medium";
  const labelStyle = { color: c.lightTextPrimary };
  const externalIcon = (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="inline-block">
      <path d="M13 9.012v-6H7M13.02 3 7 9.01M3 5.012v8h8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div
      className="flex min-h-screen flex-col bg-white font-sans"
      style={{
        color: c.lightTextPrimary,
        backgroundImage: "url(/assets/signup-bg-light.png)",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header — English on right (desktop), logo centered */}
      <div className="hidden justify-end px-5 pt-5 md:flex">
        <div className="flex items-center gap-1 text-sm" style={{ color: c.lightTextPrimary }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: c.lightAccent }}>English</span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="m8 11 4-6H4l4 6Z" fill={c.lightTextMuted} />
          </svg>
        </div>
      </div>

      {/* Logo — centered */}
      <div className="flex justify-center pt-5 md:pt-5">
        <a href="/login" onClick={(e) => e.preventDefault()}>
          <img
            src="/assets/aws-logo-signup.png"
            alt="AWS logo"
            className="h-12.75 w-21"
          />
        </a>
      </div>

      {/* Main content — two columns on desktop, single on mobile */}
      <div className="flex flex-1 items-center justify-center px-5 pt-8 md:px-0 md:pt-12">
        <div className="flex w-full max-w-3xl flex-col items-start gap-8 md:flex-row md:justify-center md:gap-8 lg:gap-10">
          {/* Info panel — hidden on small screens */}
          <div className="hidden md:block md:w-72 lg:w-80">
            <h2
              className="mb-3 text-xl font-semibold leading-6"
              style={{ color: c.lightTextPrimary }}
            >
              Manage your DNS with Route 53 Clone
            </h2>
            <p className="text-sm leading-5 text-[#424650]">
              Create hosted zones, DNS records, traffic policies,<br />
              and health checks. Built with Next.js and Cloudscape.
            </p>
            <img
              src="/assets/free-tier-rocket.png"
              alt="Route 53 Clone"
              width={220}
              height={146}
              className="mt-5 mx-auto h-auto w-[220px]"
            />
          </div>

          {/* Page divider — hidden on mobile */}
          <div
            className="hidden md:block"
            style={{
              width: "1px",
              alignSelf: "stretch",
              backgroundColor: c.lightBorder,
            }}
          />

          {/* Form column */}
          <div className="w-full max-w-[320px] sm:max-w-[340px] md:w-72 lg:w-80 md:mt-[-16px]">
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-5">
                {/* Heading */}
                <h1
                  className="text-2xl font-semibold leading-7"
                  style={{ color: c.lightTextPrimary }}
                >
                  Create your account
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
                    Used to sign in to your Route 53 Clone account. See the{" "}
                    <a
                      href="https://github.com/sarvesh-official/route53-clone#readme"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 font-normal no-underline"
                      style={{ fontSize: "12px", color: c.darkAccentHover }}
                    >
                      project README
                      {externalIcon}
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
                    Account name
                  </label>
                  <p
                    className="mb-1.5 text-xs"
                    style={{ color: c.lightTextMuted }}
                  >
                    A display name for your account. This is shown in the
                    console navigation bar after sign in.
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

                {/* Submit — AWS primary blue button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-8 w-full cursor-pointer appearance-none rounded-full border-2 font-medium"
                  style={{
                    fontSize: "14px",
                    borderColor: c.awsOrange,
                    backgroundColor: c.awsOrange,
                    color: c.lightTextPrimary,
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
              className="h-8 w-full cursor-pointer appearance-none rounded-full border-2 bg-white px-4 font-medium"
              style={{
                fontSize: "14px",
                color: c.lightAccent,
                borderColor: c.lightAccent,
              }}
            >
              Sign in to an existing AWS account
            </button>

            {/* Cookie notice */}
            <p
              className="mt-6 text-xs leading-5"
              style={{ color: c.lightTextMuted }}
            >
              This is a demo application. No real AWS credentials are used.
              Authentication is mocked. See the{" "}
              <a
                href="https://github.com/sarvesh-official/route53-clone#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-normal no-underline"
                style={{ fontSize: "12px", color: c.darkAccentHover }}
              >
                project README
                {externalIcon}
              </a>{" "}
              for details.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile only — English link at bottom */}
      <div className="flex justify-center pb-4 md:hidden">
        <div className="flex items-center gap-1 text-sm" style={{ color: c.lightTextPrimary }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: c.lightAccent }}>English</span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="m8 11 4-6H4l4 6Z" fill={c.lightTextMuted} />
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-8 px-6 py-5 sm:px-10"
      >
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3 text-sm">
            <a
              href="https://github.com/sarvesh-official/route53-clone"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-normal no-underline"
              style={{ fontSize: "14px", color: c.darkAccentHover }}
            >
              Source Code
              {externalIcon}
            </a>
            <span className="text-[#d5dbdb]">|</span>
            <a
              href="https://github.com/sarvesh-official/route53-clone#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-normal no-underline"
              style={{ fontSize: "14px", color: c.darkAccentHover }}
            >
              README
              {externalIcon}
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
