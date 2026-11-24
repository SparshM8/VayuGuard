import type { Metadata, Viewport } from "next";
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
  title: "VayuGuard AI - Smart Winter Smog & Urban Clean-Air Navigator",
  description: "GenAI-powered assistant helping families and communities navigate severe winter smog and urban air pollution with personalized low-emission routines, indoor air quality hacks, and sustainable alternatives.",
  keywords: ["air quality", "AQI", "VayuGuard", "smog", "winter smog", "pollution", "health", "sustainability", "PM2.5", "air purifier", "indoor air", "CPCB", "Open-Meteo"],
  authors: [{ name: "VayuGuard AI" }],
  creator: "VayuGuard AI",
  publisher: "VayuGuard AI",
  robots: "index, follow",
  openGraph: {
    title: "VayuGuard AI - Smart Winter Smog & Urban Clean-Air Navigator",
    description: "GenAI-powered assistant helping families and communities navigate urban air pollution with personalized recommendations.",
    type: "website",
    locale: "en_US",
    siteName: "VayuGuard AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "VayuGuard AI",
    description: "GenAI-powered assistant for navigating urban air pollution with personalized guidance.",
  },
  verification: {
    google: "google-site-verification",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://air-quality-api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://air-quality-api.open-meteo.com" />
        <link rel="preconnect" href="https://geocoding-api.open-meteo.com" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}