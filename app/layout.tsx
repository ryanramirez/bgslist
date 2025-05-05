import React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "BGSList",
  description: "Board Game Sale Listings",
  icons: {
    icon: '/favicon.ico?v=1',
    apple: '/apple-icon.png?v=1',
    shortcut: '/favicon.ico?v=1',
  },
  openGraph: {
    title: "BGSList",
    description: "Board Game Sale Listings",
    url: "https://www.bgslist.com",
    siteName: "BGSList",
    images: [
      {
        url: "https://www.bgslist.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "BGSList - Board Game Sale Listings",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BGSList",
    description: "Board Game Sale Listings",
    images: ["https://www.bgslist.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?v=1" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pixelifySans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
} 