"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { isApiError } from "@/lib/api/errors";
import { useAuth } from "@/providers/auth-provider";

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
  const inputStyle = { fontSize: "14px" };
  const inputCls =
    "r53-input h-8 w-full rounded-lg border border-[#8c8c94] bg-white px-3 py-[5px] text-[#0f141a] outline-none box-border transition-colors";
  const labelCls = "mb-1 block font-medium text-[#0f141a]";
  const labelStyle = { fontSize: "14px" };
  const primaryBtnCls =
    "h-8 w-full cursor-pointer appearance-none rounded-full border-2 border-[#ff9900] bg-[#ff9900] font-medium text-[#0f141a]";
  const primaryBtnStyle = { fontSize: "14px" };

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
        <h2 className="mb-1 mt-0 text-xl font-medium leading-6 text-[#0f141a]">
          {step === 1
            ? "Sign In"
            : accountType === "root"
              ? "Root user sign in"
              : "IAM user sign in"}
        </h2>

        {step === 1 && (
          <p className="mb-4 text-sm font-normal leading-5 text-[#687078]">
            Access your AWS account by user type. Use the root user email to
            sign in with root account credentials, or an IAM user name to sign
            in with IAM credentials.
          </p>
        )}

        {step === 2 && (
          <p className="mb-4 text-sm font-normal leading-5 text-[#687078]">
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
                  border: selected ? "2px solid #006ce0" : "1px solid #8c8c94",
                  backgroundColor: selected ? "#f0fbff" : "#fff",
                }}
              >
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 bg-white"
                  style={{
                    borderColor: selected ? "#006ce0" : "#8c8c94",
                  }}
                >
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-[#006ce0]" />
                  )}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#0f141a]">
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
                <div className="rounded-lg border border-[#d13212] bg-[#fff4f4] px-3.5 py-2.5 text-sm text-[#d13212]">
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
                <div className="mt-1 text-xs text-[#687078]">
                  Demo: demo@example.com
                </div>
              </div>

              <button type="submit" className={primaryBtnCls} style={primaryBtnStyle}>
                Next
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-[#d5dbdb]" />
                <strong className="text-xs font-normal text-[#687078]">OR</strong>
                <div className="h-px flex-1 bg-[#d5dbdb]" />
              </div>

              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="h-8 w-full cursor-pointer appearance-none rounded-full border-2 bg-white px-4 font-medium"
                style={{ fontSize: "14px", color: "#006ce0", borderColor: "#006ce0" }}
              >
                New to AWS? Sign up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={onSignIn}>
            <div className="flex flex-col gap-4">
              {error && (
                <div className="rounded-lg border border-[#d13212] bg-[#fff4f4] px-3.5 py-2.5 text-sm text-[#d13212]">
                  <strong>There was a problem</strong>
                  <div className="mt-1">{error}</div>
                </div>
              )}

              <div className="text-sm text-[#0f141a]">
                <strong className="font-semibold">{email} </strong>
                <button
                  type="button"
                  onClick={goBack}
                  className="cursor-pointer appearance-none border-none bg-transparent p-0 font-normal no-underline"
                  style={{ fontSize: "14px", color: "#1C7AE3" }}
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
                <div className="mt-1 text-xs text-[#687078]">
                  Demo: demo1234
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[#0f141a]">
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2"
                    style={{
                      borderColor: showPassword ? "#006ce0" : "#8c8c94",
                      backgroundColor: showPassword ? "#006ce0" : "#fff",
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
                  style={{ fontSize: "14px", color: "#1C7AE3" }}
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
                style={{ fontSize: "14px", color: "#1C7AE3" }}
              >
                Sign in to a different account
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="cursor-pointer appearance-none border-none bg-transparent p-0 font-normal text-[#006ce0] no-underline"
                  style={{ fontSize: "14px" }}
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
