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
  title: "Focal - Chat with your database.",
  description: "Focal is an AI-powered SaaS tool that allows users to connect their database and chat with it in plain English to get instant answers, charts, and insights. No SQL needed.",
  openGraph: {
    title: "Focal - Chat with your database.",
    description: "Focal is an AI-powered SaaS tool that allows users to connect their database and chat with it in plain English to get instant answers, charts, and insights.",
    url: "https://focal-chat.vercel.app",
    siteName: "Focal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focal - Chat with your database.",
    description: "Focal is an AI-powered SaaS tool that allows users to connect their database and chat with it in plain English to get instant answers, charts, and insights.",
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
