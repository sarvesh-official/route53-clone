"use client";

import { useState } from "react";

import { submitFeedback } from "@/lib/api/feedback";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [type, setType] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [satisfied, setSatisfied] = useState<"positive" | "negative" | "">("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await submitFeedback({
        email: email.trim() || undefined,
        role: type || undefined,
        rating: satisfied === "positive" ? 5 : satisfied === "negative" ? 1 : undefined,
        message: message.trim(),
      });
      setSuccess(true);
    } catch {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Same Cloudscape reset issue as login-form — inline styles bypass it
  const inputStyle = { fontSize: "13px" };
  const inputCls =
    "h-8 w-full rounded-lg border border-[#8c8c94] bg-white px-3 py-[5px] text-[#0f141a] outline-none box-border";
  const labelCls = "mb-1 block font-medium text-[#0f141a]";
  const labelStyle = { fontSize: "13px" };

  return (
    <div
      className="fixed inset-0 z-2000 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative w-140 max-w-[90vw] rounded-2xl bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-1 pb-2">
          <h2 className="text-lg font-bold text-[#0f141a]">
            Feedback for Route 53 Clone
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer appearance-none items-center justify-center rounded-full border-none bg-transparent text-[#687078] transition-colors hover:bg-black/5"
            aria-label="Close feedback dialog"
            title="Close feedback dialog"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="m2 1.71 12 12M2 13.71l12-12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center">
            <div className="mb-3 text-2xl">&#10003;</div>
            <h3 className="mb-2 text-lg font-medium text-[#0f141a]">
              Thank you for your feedback!
            </h3>
            <p className="mb-4 text-sm text-[#687078]">
              Your feedback on this Route 53 clone assignment has been recorded.
            </p>
            <button
              onClick={onClose}
              className="h-8 cursor-pointer appearance-none rounded-full border-2 border-[#006ce0] bg-white px-6 text-sm font-bold text-[#006ce0]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-2">
              <p className="mb-4 text-sm text-[#0f141a]">
                Thank you for reviewing this assignment. Your
                feedback helps improve the project.
              </p>

              <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-4">
                  {error && (
                    <div className="rounded-lg border border-[#d13212] bg-[#fff4f4] px-3 py-2 text-sm text-[#d13212]">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className={labelCls} style={labelStyle} htmlFor="fb-type">
                      Type
                    </label>
                    <p className="mb-1 text-xs text-[#687078]">
                      Choose the type of feedback you are submitting.
                    </p>
                    <div className="relative">
                      <select
                        id="fb-type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        onFocus={() => setTypeOpen(true)}
                        onBlur={() => setTypeOpen(false)}
                        className="h-8 w-full cursor-pointer appearance-none rounded-lg bg-white px-3 py-1.5 pr-8 text-[#0f141a] outline-none box-border transition-colors"
                        style={{
                          fontSize: "13px",
                          border: typeOpen
                            ? "2px solid #006ce0"
                            : "1px solid #8c8c94",
                        }}
                      >
                        <option value="">Select a type...</option>
                        <option value="Bug">Bug</option>
                        <option value="Suggestion">Suggestion</option>
                        <option value="Compliment">Compliment</option>
                        <option value="Question">Question</option>
                      </select>
                      <span
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-150"
                        style={{
                          transform: typeOpen
                            ? "translateY(-50%) rotate(180deg)"
                            : "translateY(-50%)",
                          color: typeOpen ? "#006ce0" : "#687078",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <path d="m8 11 4-6H4l4 6Z" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls} style={labelStyle} htmlFor="fb-message">
                      Enter your message below
                    </label>
                    <textarea
                      id="fb-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                      rows={3}
                      className="w-full rounded-lg border border-[#8c8c94] bg-white px-3 py-2 text-[#0f141a] outline-none box-border"
                      style={inputStyle}
                      placeholder=""
                    />
                    <p className="mt-1 text-xs text-[#687078]">
                      {1000 - message.length} characters available. Do not
                      disclose any personal, commercially sensitive, or
                      confidential information.
                    </p>
                  </div>

                  <div>
                    <label className={labelCls} style={labelStyle}>
                      Are you satisfied with your experience?
                    </label>
                    <div className="flex gap-4">
                      {(["positive", "negative"] as const).map((val) => {
                        const selected = satisfied === val;
                        return (
                          <label
                            key={val}
                            className="flex cursor-pointer items-center gap-2 text-sm text-[#0f141a]"
                          >
                            <span
                              onClick={() => setSatisfied(val)}
                              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 bg-white"
                              style={{
                                borderColor: selected ? "#006ce0" : "#8c8c94",
                              }}
                            >
                              {selected && (
                                <span className="h-2 w-2 rounded-full bg-[#006ce0]" />
                              )}
                            </span>
                            {val === "positive" ? "Yes" : "No"}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls} style={labelStyle} htmlFor="fb-email">
                      We may want to contact you about your feedback. If you
                      agree, provide your email address.{" "}
                      <span className="italic text-[#687078]">- optional</span>
                    </label>
                    <input
                      id="fb-email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      style={{ fontSize: "13px", fontStyle: "italic" }}
                      className={inputCls}
                    />
                    <p className="mt-1 text-xs text-[#687078]">
                      Personal information you provide to us will be handled in
                      accordance with the AWS Privacy Notice
                      (https://aws.amazon.com/privacy/).
                    </p>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#d5dbdb] px-6 pb-5 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer appearance-none border-none bg-transparent px-4 py-1 font-medium text-[#006ce0] no-underline"
                style={{ fontSize: "12px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={onSubmit}
                disabled={submitting}
                className="h-7 cursor-pointer appearance-none rounded-full border-2 border-[#ff9900] bg-[#ff9900] px-5 font-bold text-[#0f141a]"
                style={{
                  fontSize: "12px",
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
