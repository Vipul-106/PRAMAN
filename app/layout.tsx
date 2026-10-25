import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "P.R.A.M.A.N. — Regulatory Command Center",
  description: "Platform for Regulatory Approval, Monitoring & Authentication Network | AICTE Decision-Support Prototype",
};

import { SessionProvider } from "@/lib/session-context";
import { PrismGradient } from "@/components/ui/prism-gradient";
import { CursorTrail } from "@/components/ui/cursor-trail";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-slate-950 text-slate-100">
        <PrismGradient speed={0.35} noise={{ opacity: 0.15 }} className="fixed inset-0 z-0 opacity-25 pointer-events-none" />
        <CursorTrail color="bg-cyan-500/50" count={5} size={6} />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
