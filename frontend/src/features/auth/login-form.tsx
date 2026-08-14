"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { isApiError } from "@/lib/api/errors";
import { useAuth } from "@/providers/auth-provider";

/* CSS variable shortcuts for inline use.
   All values are defined in src/app/globals.css :root */
const c = {
  lightTextPrimary: "var(--r53-light-text-primary)",
  lightTextMuted: "var(--r53-light-text-muted)",
  lightAccent: "var(--r53-light-accent)",
  lightInputBorder: "var(--r53-light-input-border)",
  awsOrange: "var(--r53-aws-orange)",
  sharedWhite: "var(--r53-shared-white)",
  sharedError: "var(--r53-shared-error)",
  sharedErrorBg: "var(--r53-shared-error-bg)",
  darkAccentHover: "var(--r53-dark-accent-hover)",
} as const;

type AccountType = "root" | "iam";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [accountType, setAccountType] = useState<AccountType>("root");
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setError(null);
    setDirection("forward");
    setStep(2);
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        isApiError(err) ? err.message : "Sign in failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    setDirection("backward");
    setError(null);
    setStep(1);
  };

  // Cloudscape's reset forces font-size: 100% on inputs/buttons, which
  // overrides Tailwind utilities. Inline styles bypass that.
  const inputStyle = {
    fontSize: "14px",
    borderColor: c.lightInputBorder,
    color: c.lightTextPrimary,
  };
  const inputCls =
    "r53-input h-8 w-full rounded-lg border bg-white px-3 py-[5px] outline-none box-border transition-colors";
  const labelCls = "mb-1 block font-medium";
  const labelStyle = { fontSize: "14px", color: c.lightTextPrimary };
  const primaryBtnCls =
    "h-8 w-full cursor-pointer appearance-none rounded-full border-2 font-medium";
  const primaryBtnStyle = {
    fontSize: "14px",
    borderColor: c.awsOrange,
    backgroundColor: c.awsOrange,
    color: c.lightTextPrimary,
  };

  const slideStyle: React.CSSProperties = {
    animation: `${direction === "forward" ? "r53-slide-in-right" : "r53-slide-in-left"} 0.3s ease-out`,
  };

  return (
    <div className="font-sans">
      <style>{`
        @keyframes r53-slide-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes r53-slide-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div key={step} style={slideStyle}>
        <h2
          className="mb-1 mt-0 text-xl font-medium leading-6"
          style={{ color: c.lightTextPrimary }}
        >
          {step === 1
            ? "Sign In"
            : accountType === "root"
              ? "Root user sign in"
              : "IAM user sign in"}
        </h2>

        {step === 1 && (
          <p
            className="mb-4 text-sm font-normal leading-5"
            style={{ color: c.lightTextMuted }}
          >
            Access your AWS account by user type. Use the root user email to
            sign in with root account credentials, or an IAM user name to sign
            in with IAM credentials.
          </p>
        )}

        {step === 2 && (
          <p
            className="mb-4 text-sm font-normal leading-5"
            style={{ color: c.lightTextMuted }}
          >
            Enter the password for
          </p>
        )}
      </div>

      {/* Root/IAM is cosmetic — backend auths by email only */}
      {step === 1 && (
        <div className="mb-5 flex flex-col gap-2">
          {(["root", "iam"] as const).map((type) => {
            const selected = accountType === type;
            return (
              <div
                key={type}
                onClick={() => setAccountType(type)}
                className="flex w-full cursor-pointer items-start gap-2 rounded-lg border px-3 pb-3 pt-2"
                style={{
                  border: selected ? `2px solid ${c.lightAccent}` : `1px solid ${c.lightInputBorder}`,
                  backgroundColor: selected ? "#f0fbff" : c.sharedWhite,
                }}
              >
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 bg-white"
                  style={{
                    borderColor: selected ? c.lightAccent : c.lightInputBorder,
                  }}
                >
                  {selected && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: c.lightAccent }}
                    />
                  )}
                </span>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: c.lightTextPrimary }}
                  >
                    {type === "root" ? "Root user" : "IAM user"}
                  </div>
                  <div className="mt-0.5 text-xs font-normal text-[#424650]">
                    {type === "root"
                      ? "Account owner that performs tasks requiring unrestricted access"
                      : "User within an account that performs daily tasks"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div key={`step-${step}`} style={slideStyle}>
        {step === 1 ? (
          <form onSubmit={onNext}>
            <div className="flex flex-col gap-4">
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

              <div>
                <label htmlFor="email" className={labelCls} style={labelStyle}>
                  {accountType === "root"
                    ? "Email address"
                    : "Account ID (12 digits) or account alias"}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  placeholder={
                    accountType === "root" ? "username@example.com" : ""
                  }
                  className={`${inputCls} placeholder-italic`}
                  style={inputStyle}
                />
                <div
                  className="mt-1 text-xs"
                  style={{ color: c.lightTextMuted }}
                >
                  Demo: demo@example.com
                </div>
              </div>

              <button type="submit" className={primaryBtnCls} style={primaryBtnStyle}>
                Next
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-[#d5dbdb]" />
                <strong
                  className="text-xs font-normal"
                  style={{ color: c.lightTextMuted }}
                >
                  OR
                </strong>
                <div className="h-px flex-1 bg-[#d5dbdb]" />
              </div>

              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="h-8 w-full cursor-pointer appearance-none rounded-full border-2 bg-white px-4 font-medium"
                style={{ fontSize: "14px", color: c.lightAccent, borderColor: c.lightAccent }}
              >
                New to AWS? Sign up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={onSignIn}>
            <div className="flex flex-col gap-4">
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

              <div className="text-sm" style={{ color: c.lightTextPrimary }}>
                <strong className="font-semibold">{email} </strong>
                <button
                  type="button"
                  onClick={goBack}
                  className="cursor-pointer appearance-none border-none bg-transparent p-0 font-normal no-underline"
                  style={{ fontSize: "14px", color: c.darkAccentHover }}
                >
                  (not you?)
                </button>
              </div>

              <div>
                <label htmlFor="password" className={labelCls} style={labelStyle}>
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  disabled={submitting}
                  placeholder="Enter your password"
                  className={`${inputCls} placeholder-italic`}
                  style={inputStyle}
                />
                <div
                  className="mt-1 text-xs"
                  style={{ color: c.lightTextMuted }}
                >
                  Demo: demo1234
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label
                  className="flex cursor-pointer items-center gap-2 text-sm"
                  style={{ color: c.lightTextPrimary }}
                >
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2"
                    style={{
                      borderColor: showPassword ? c.lightAccent : c.lightInputBorder,
                      backgroundColor: showPassword ? c.lightAccent : c.sharedWhite,
                    }}
                  >
                    {showPassword && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  Show password
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="cursor-pointer font-normal no-underline"
                  style={{ fontSize: "14px", color: c.darkAccentHover }}
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={primaryBtnCls}
                style={{
                  fontSize: "14px",
                  borderColor: c.awsOrange,
                  backgroundColor: c.awsOrange,
                  color: c.lightTextPrimary,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>

              <button
                type="button"
                onClick={goBack}
                className="h-8 w-full cursor-pointer appearance-none rounded-full border border-[#d5dbdb] bg-white px-4 font-medium"
                style={{ fontSize: "14px", color: c.darkAccentHover }}
              >
                Sign in to a different account
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="cursor-pointer appearance-none border-none bg-transparent p-0 font-normal no-underline"
                  style={{ fontSize: "14px", color: c.lightAccent }}
                >
                  Create a new AWS account
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
