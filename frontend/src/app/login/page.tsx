"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FeedbackModal } from "@/features/auth/feedback-modal";
import { LoginForm } from "@/features/auth/login-form";
import { useAuth } from "@/providers/auth-provider";

/* CSS variable shortcuts for inline use.
   All values are defined in src/app/globals.css :root */
const c = {
  lightBg: "var(--r53-light-bg)",
  lightTextPrimary: "var(--r53-light-text-primary)",
  lightTextMuted: "var(--r53-light-text-muted)",
  lightAccent: "var(--r53-light-accent)",
  lightBorder: "var(--r53-light-border)",
  awsOrange: "var(--r53-aws-orange)",
  darkAccentHover: "var(--r53-dark-accent-hover)",
} as const;

const MARKETING_IMAGES = [
  "/assets/marketing/aws-marketing-01.png",
  "/assets/marketing/aws-marketing-02.png",
  "/assets/marketing/aws-marketing-03.png",
  "/assets/marketing/aws-marketing-04.png",
  "/assets/marketing/aws-marketing-05.png",
  "/assets/marketing/aws-marketing-06.jpeg",
  "/assets/marketing/aws-marketing-07.png",
  "/assets/marketing/aws-marketing-08.jpeg",
  "/assets/marketing/aws-marketing-09.jpeg",
];

function randomMarketingImg() {
  return MARKETING_IMAGES[Math.floor(Math.random() * MARKETING_IMAGES.length)];
}

export default function LoginPage() {
  const router = useRouter();
  const { status } = useAuth();
  const [marketingImg] = useState(randomMarketingImg);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: c.lightBg }}
      >
        <div
          className="h-6 w-6 animate-spin rounded-full border-3"
          style={{ borderColor: c.lightBorder, borderTopColor: c.awsOrange }}
        />
        <style>{`@keyframes r53-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col font-sans md:[background-image:url(/assets/aws-bg-left.png),url(/assets/aws-bg-right.png)] md:[background-position:left_bottom,right_bottom] md:[background-repeat:no-repeat]"
      style={{ backgroundColor: c.lightBg, color: c.lightTextPrimary }}
    >
      {/* Desktop only — hidden on mobile, links move to bottom */}
      <div className="hidden justify-end px-5 pt-5 md:flex">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex h-8 cursor-pointer appearance-none items-center rounded-full border-2 border-transparent bg-transparent px-4 no-underline transition-colors hover:bg-[#e9f3ff]"
            style={{ fontSize: "13px", fontWeight: 600, color: c.lightAccent }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0a3a8f")}
            onMouseLeave={(e) => (e.currentTarget.style.color = c.lightAccent)}
          >
            Provide feedback
          </button>
          <a
            href="https://github.com/sarvesh-official/route53-clone"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 cursor-pointer appearance-none items-center rounded-full border-none bg-transparent px-4 no-underline"
            style={{ fontSize: "13px", fontWeight: 600, color: c.lightAccent }}
          >
            Source Code
          </a>
          <a
            href="https://github.com/sarvesh-official/route53-clone#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 cursor-pointer appearance-none items-center rounded-full border-none bg-transparent px-4 no-underline"
            style={{ fontSize: "13px", fontWeight: 600, color: c.lightAccent }}
          >
            English
          </a>
        </div>
      </div>

      {/* Logo */}
      <div className="flex justify-center pt-5 md:pt-5">
        <a href="/login" onClick={(e) => e.preventDefault()}>
          <img
            src="/assets/aws-logo-login.png"
            alt="Amazon Web Services logo"
            className="h-12.75 w-21"
          />
        </a>
      </div>

      {/* Row on desktop, stacked on mobile */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pt-8 md:flex-row md:items-start md:px-0">
        <div className="w-full max-w-[340px] md:w-85 md:shrink-0">
          <div className="rounded-2xl border border-[#d5dbdb] bg-white px-6 pb-6 pt-4">
            <LoginForm />
          </div>
          <p
            className="mt-4 px-2 text-center text-xs leading-[18px]"
            style={{ color: "#72747d", fontWeight: 500 }}
          >
            By continuing, you acknowledge this is a demo application. No real
            AWS credentials are used. Authentication is mocked. See the{" "}
            <a
              href="https://github.com/sarvesh-official/route53-clone#readme"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: c.darkAccentHover, textDecoration: "underline", fontWeight: 500 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = c.lightTextPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = c.darkAccentHover)}
            >
              project documentation
            </a>{" "}
            for details.
          </p>
        </div>

        {/* Hidden on mobile — AWS does the same */}
        <div className="hidden shrink-0 md:block" data-testid="marketing_image_container">
          <img
            src={marketingImg}
            alt="Amazon Web Services Marketing"
            width={570}
            height={450}
            className="h-112.5 w-142.5 object-cover"
          />
        </div>
      </div>

      {/* Copyright footer */}
      <div
        className="px-6 py-4 text-center text-xs font-sans"
        style={{ color: c.lightTextMuted }}
      >
        (Clone) 2026 Route 53 Clone. Built for Scaler AI Labs assignment.
      </div>

      {/* Mobile only — utility links at bottom, AWS does the same */}
      <div className="flex flex-col items-center gap-3 px-4 pb-6 md:hidden">
        <button
          onClick={() => setFeedbackOpen(true)}
          className="cursor-pointer appearance-none border-none bg-transparent no-underline"
          style={{ fontSize: "13px", fontWeight: 600, color: c.lightAccent }}
        >
          Provide feedback
        </button>
        <a
          href="https://github.com/sarvesh-official/route53-clone"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer appearance-none border-none bg-transparent no-underline"
          style={{ fontSize: "13px", fontWeight: 600, color: c.lightAccent }}
        >
          Source Code
        </a>
        <a
          href="https://github.com/sarvesh-official/route53-clone#readme"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer appearance-none border-none bg-transparent no-underline"
          style={{ fontSize: "13px", fontWeight: 600, color: c.lightAccent }}
        >
          English
        </a>
      </div>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}
