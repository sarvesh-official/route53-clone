import type { Metadata, Viewport } from "next";
import "@cloudscape-design/global-styles/index.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Route 53 Console (Clone)",
  description: "AWS Route 53 console clone built with Next.js and Cloudscape",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/tailwind.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          try {
            var t = localStorage.getItem('r53.theme');
            if (t === 'dark') {
              document.documentElement.classList.add('dark');
            }
          } catch(e) {}
        `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
