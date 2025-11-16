import type { Metadata } from "next";
import "./globals.css";
import { BRAND_NAME, SITE_INFO } from "@/lib/constants";
import CartDrawer from "@/components/cart/CartDrawer";
import BackToTop from "@/components/BackToTop";
import BottomNav from "@/components/navigation/BottomNav";
import CookieConsent from "@/components/CookieConsent";
import ToastContainer from "@/components/ui/ToastContainer"; // ✅ Fixed import path
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nowiht.com'),

  title: {
    default: `${BRAND_NAME} - Premium Organic Women's Fashion`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: SITE_INFO.description,
  keywords: [
    "organic clothing",
    "women's fashion",
    "sustainable fashion",
    "eco-friendly clothing",
    "organic cotton",
    "luxury basics",
    "NOWIHT",
  ],
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  applicationName: BRAND_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: BRAND_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nowiht.com",
    siteName: BRAND_NAME,
    title: BRAND_NAME,
    description: SITE_INFO.description,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: BRAND_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@the_nowiht",
    creator: "@the_nowiht",
    title: BRAND_NAME,
    description: SITE_INFO.description,
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NOWIHT" />
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
      </head>
      <body className="antialiased font-mono">
        <Providers>
          {children}
        </Providers>

        {/* Global Components */}
        <CartDrawer />
        <BackToTop />
        <BottomNav />
        <CookieConsent />
        <ToastContainer /> {/* ✅ Toast notifications */}
      </body>
    </html>
  );
}