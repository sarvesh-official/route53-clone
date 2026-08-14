"use client";

/* CSS variable shortcuts — see src/app/globals.css :root */
const c = {
  darkSurface: "#161D26",
  darkBorderAlt: "var(--r53-dark-border-alt)",
  sharedWhite: "var(--r53-shared-white)",
  darkAccent: "var(--r53-dark-accent)",
} as const;

export function ConsoleFooter() {
  const footerStyle: React.CSSProperties = {
    backgroundColor: c.darkSurface,
    borderTop: `1px solid ${c.darkBorderAlt}`,
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
    fontSize: "12px",
    color: c.sharedWhite,
    flexShrink: 0,
    width: "100%",
    zIndex: 100,
  };

  const linkStyle: React.CSSProperties = {
    color: c.sharedWhite,
    cursor: "default",
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  };

  const leftSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  };

  const rightSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  return (
    <footer style={footerStyle} data-testid="awsc-nav-footer">
      {/* Left section - static labels, no redirects */}
      <div style={leftSectionStyle}>
        <button type="button" style={linkStyle} title="Open CloudShell">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M5 5l2.997 2.998L5 11m4.997-.002H12m3-7.626A2.374 2.374 0 0012.627 1H3.37A2.372 2.372 0 001 3.372v9.256a2.373 2.373 0 002.37 2.373h9.257A2.375 2.375 0 0015 12.628V3.372z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          CloudShell
        </button>

        <button type="button" style={linkStyle} title="Agent Toolkit for AWS">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="2" width="14" height="11" rx="1" stroke="currentColor" strokeWidth="2" />
            <line x1="1" y1="5" x2="15" y2="5" stroke="currentColor" />
            <circle cx="8" cy="5" r="2" fill="currentColor" />
          </svg>
          Agent Toolkit for AWS
        </button>

        <button type="button" style={linkStyle} title="Feedback">
          Feedback
        </button>

        <button type="button" style={linkStyle} title="Console mobile app">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 11.9998H3.33333V3.99984H8V2.6665H3.33333V1.99984H8V0.673171L3.33333 0.666504C2.6 0.666504 2 1.2665 2 1.99984V13.9998C2 14.7332 2.6 15.3332 3.33333 15.3332H10C10.7333 15.3332 11.3333 14.7332 11.3333 13.9998V10.6665H10V11.9998ZM10 13.9998H3.33333V13.3332H10V13.9998Z" fill="currentColor" />
            <path d="M10.6667 9.33317L14 5.99984L13.06 5.05984L11.3333 6.77984V1.99984H10V6.77984L8.27333 5.05984L7.33333 5.99984L10.6667 9.33317Z" fill="currentColor" />
          </svg>
          Console mobile app
        </button>
      </div>

      {/* Center section */}
      <span data-testid="awsc-footer-copyright">
        © 2026, Amazon Web Services, Inc. or its affiliates.
      </span>

      {/* Right section - static labels */}
      <ul style={rightSectionStyle}>
        <li>
          <button type="button" style={linkStyle} title="Privacy">
            Privacy
          </button>
        </li>
        <li>
          <button type="button" style={linkStyle} title="Terms">
            Terms
          </button>
        </li>
        <li>
          <button type="button" style={linkStyle} title="Cookie preferences">
            Cookie preferences
          </button>
        </li>
      </ul>
    </footer>
  );
}
