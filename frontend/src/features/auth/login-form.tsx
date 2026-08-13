"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { isApiError } from "@/lib/api/errors";
import { useAuth } from "@/providers/auth-provider";

const FONT =
  '"Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif';

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 32,
  borderRadius: 8,
  border: "1px solid #8c8c94",
  padding: "5px 12px",
  fontSize: 14,
  fontFamily: FONT,
  color: "#0f141a",
  backgroundColor: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 700,
  fontFamily: FONT,
  color: "#0f141a",
  marginBottom: 4,
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  height: 32,
  borderRadius: 20,
  border: "2px solid #ff9900",
  backgroundColor: "#ff9900",
  color: "#0f141a",
  fontSize: 14,
  fontWeight: 700,
  fontFamily: FONT,
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  width: "100%",
  height: 32,
  borderRadius: 20,
  border: "2px solid #006ce0",
  backgroundColor: "#fff",
  color: "#006ce0",
  fontSize: 14,
  fontWeight: 700,
  fontFamily: FONT,
  cursor: "pointer",
};

const linkStyle: React.CSSProperties = {
  fontSize: 14,
  fontFamily: FONT,
  color: "#006ce0",
  textDecoration: "underline",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
};

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
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

  return (
    <div style={{ fontFamily: FONT }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          fontFamily: FONT,
          color: "#0f141a",
          margin: "0 0 20px 0",
          lineHeight: "24px",
        }}
      >
        IAM user sign in
      </h2>

      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div
              style={{
                backgroundColor: "#fff4f4",
                border: "1px solid #d13212",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 14,
                fontFamily: FONT,
                color: "#d13212",
              }}
            >
              <strong>There was a problem</strong>
              <div style={{ marginTop: 4 }}>{error}</div>
            </div>
          )}

          <div>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              disabled={submitting}
              placeholder="Enter your email"
              style={inputStyle}
            />
            <div
              style={{
                fontSize: 12,
                color: "#687078",
                marginTop: 4,
                fontFamily: FONT,
              }}
            >
              Demo: demo@example.com
            </div>
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              placeholder="Enter your password"
              style={inputStyle}
            />
            <div
              style={{
                fontSize: 12,
                color: "#687078",
                marginTop: 4,
                fontFamily: FONT,
              }}
            >
              Demo: demo1234
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontFamily: FONT,
              color: "#0f141a",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            Show Password
          </label>

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...primaryBtnStyle,
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <button type="button" style={secondaryBtnStyle}>
          Sign in using root user email
        </button>
        <button type="button" style={secondaryBtnStyle}>
          Create a new AWS account
        </button>
      </div>

      <div
        style={{
          marginTop: 20,
          fontSize: 12,
          color: "#687078",
          fontFamily: FONT,
          lineHeight: "18px",
        }}
      >
        By continuing, you agree to the{" "}
        <a
          href="https://aws.amazon.com/terms"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
        >
          AWS Customer Agreement
        </a>{" "}
        and the{" "}
        <a
          href="https://aws.amazon.com/privacy"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
        >
          Privacy Notice
        </a>
        . This site uses essential cookies. See our{" "}
        <a
          href="https://aws.amazon.com/legal/cookies"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
        >
          Cookie Notice
        </a>{" "}
        for more information.
      </div>
    </div>
  );
}
