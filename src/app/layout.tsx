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
  title: "Urban Air Quality Assistant - Smart AQI Guidance for Healthy Living",
  description: "GenAI-powered assistant helping families and communities navigate urban air pollution with personalized low-emission routines, indoor air quality hacks, and sustainable alternatives.",
  keywords: ["air quality", "AQI", "pollution", "health", "sustainability", "smog", "PM2.5", "air purifier", "indoor air"],
  authors: [{ name: "Urban Air Quality Assistant" }],
  creator: "Urban Air Quality Assistant",
  publisher: "Urban Air Quality Assistant",
  robots: "index, follow",
  openGraph: {
    title: "Urban Air Quality Assistant - Smart AQI Guidance for Healthy Living",
    description: "GenAI-powered assistant helping families and communities navigate urban air pollution with personalized recommendations.",
    type: "website",
    locale: "en_US",
    siteName: "Urban Air Quality Assistant",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Air Quality Assistant",
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