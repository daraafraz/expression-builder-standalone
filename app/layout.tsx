import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Root layout component for the Expression Builder application
 * 
 * This component sets up the basic HTML structure, fonts, and metadata
 * for the entire application. It uses Next.js 15 app directory structure.
 */

// Configure Geist Sans font for UI text
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font for code/monospace text
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Application metadata for SEO and browser display
export const metadata: Metadata = {
  title: "Expression Builder",
  description: "No-code expression builder with live JSON output and lazy loading",
};

/**
 * Root layout component that wraps all pages
 * 
 * @param children - React children components (pages)
 * @returns JSX element with HTML structure and font variables
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
