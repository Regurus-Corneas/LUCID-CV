import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React, { ReactNode } from "react";
import "./globals.css";
import { ClerkAuthProvider } from "./lib/clerk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LUCID CV | AI Resume Auditor",
  description: "Compare your CV against any job in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkAuthProvider>
          {children}
        </ClerkAuthProvider>
      </body>
    </html>
  );
}
