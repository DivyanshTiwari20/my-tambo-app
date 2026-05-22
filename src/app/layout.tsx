import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambo — AI Data Analyst & Conversational Analytics Platform",
  description: "Stop building dashboards. Tambo is an AI data analyst that lets teams explore live business data through conversation, real-time analysis, and instant chart generation.",
  verification: {
    google: "9KuTRf3pcPOtam4LDn10hjzD9iBfXaQXc42ncz3adqA",
  },
  openGraph: {
    title: "Tambo — Analytics Without Dashboards",
    description: "AI data analyst for modern teams. Explore business data through conversation, real-time analysis, and instant visual insights.",
    url: "https://tambo.ai",
    siteName: "Tambo",
    type: "website",
    images: [
      {
        url: "https://tambo.ai/images/preview-img-tambo.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tambo — Analytics Without Dashboards",
    description: "Stop building dashboards. Ask questions naturally and explore live business data instantly.",
    images: ["https://tambo.ai/images/preview-img-tambo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
