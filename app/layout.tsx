// app/layout.tsx
// NOWIHT E-Commerce - Root Layout
// 🔥 FIXED: Added SessionProvider for NextAuth v5

import type { Metadata } from "next";
import "./globals.css";
import { BRAND_NAME, SITE_INFO } from "@/lib/constants";
import CartDrawer from "@/components/cart/CartDrawer";
import BackToTop from "@/components/BackToTop";
import BottomNav from "@/components/navigation/BottomNav";
import CookieConsent from "@/components/CookieConsent";
import ToastContainer from "@/components/ui/ToastContainer";
import Providers from "./providers";

// ============================================
// METADATA CONFIGURATION (SEO)
// ============================================
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
    "athleisure",
    "premium loungewear",
    "sustainable activewear",
  ],

  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  applicationName: BRAND_NAME,

  // ============================================
  // APPLE WEB APP
  // ============================================
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: BRAND_NAME,
    startupImage: [
      {
        url: "/icons/apple-splash-2048-2732.jpg",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icons/apple-splash-1668-2388.jpg",
        media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icons/apple-splash-1536-2048.jpg",
        media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },

  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },

  // ============================================
  // OPEN GRAPH (Social Media)
  // ============================================
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nowiht.com",
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} - Premium Organic Women's Fashion`,
    description: SITE_INFO.description,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: BRAND_NAME,
        type: "image/jpeg",
      },
      {
        url: "/images/og-image-square.jpg",
        width: 1200,
        height: 1200,
        alt: BRAND_NAME,
        type: "image/jpeg",
      },
    ],
  },

  // ============================================
  // TWITTER CARD
  // ============================================
  twitter: {
    card: "summary_large_image",
    site: "@the_nowiht",
    creator: "@the_nowiht",
    title: `${BRAND_NAME} - Premium Organic Women's Fashion`,
    description: SITE_INFO.description,
    images: ["/images/og-image.jpg"],
  },

  // ============================================
  // ROBOTS & VERIFICATION
  // ============================================
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },

  // ============================================
  // ICONS & MANIFEST
  // ============================================
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/icons/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/apple-icon-167x167.png", sizes: "167x167", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },

  manifest: "/manifest.json",

  // ============================================
  // ALTERNATE LANGUAGES (if multilingual)
  // ============================================
  // alternates: {
  //   canonical: 'https://nowiht.com',
  //   languages: {
  //     'en-US': 'https://nowiht.com/en',
  //     'tr-TR': 'https://nowiht.com/tr',
  //   },
  // },

  // ============================================
  // CATEGORY (App Store)
  // ============================================
  category: 'shopping',
};

// ============================================
// VIEWPORT CONFIGURATION
// ============================================
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// ============================================
// ROOT LAYOUT COMPONENT
// ============================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ============================================ */}
        {/* THEME & PWA META TAGS */}
        {/* ============================================ */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NOWIHT" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon.png" />

        {/* Safari Pinned Tab */}
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#000000" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* ============================================ */}
        {/* PRECONNECT TO EXTERNAL DOMAINS */}
        {/* ============================================ */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://aobcwjpznikcadladlkq.supabase.co" />

        {/* ============================================ */}
        {/* DNS PREFETCH FOR PERFORMANCE */}
        {/* ============================================ */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://aobcwjpznikcadladlkq.supabase.co" />

        {/* ============================================ */}
        {/* STRUCTURED DATA (JSON-LD) */}
        {/* ============================================ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": BRAND_NAME,
              "description": SITE_INFO.description,
              "url": "https://nowiht.com",
              "logo": "https://nowiht.com/icons/icon-512x512.png",
              "image": "https://nowiht.com/images/og-image.jpg",
              "telephone": "+90-XXX-XXX-XXXX",
              "email": "hello@nowiht.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "TR",
                "addressLocality": "Istanbul",
              },
              "sameAs": [
                "https://instagram.com/the_nowiht",
                "https://twitter.com/the_nowiht",
                "https://facebook.com/nowiht",
              ],
              "priceRange": "$$",
              "currenciesAccepted": "USD, EUR, TRY",
              "paymentAccepted": "Credit Card, Debit Card",
            }),
          }}
        />
      </head>

      <body className="antialiased font-mono bg-white text-black">
        {/* ============================================ */}
        {/* PROVIDERS WRAPPER (includes SessionProvider) */}
        {/* ============================================ */}
        <Providers>
          {/* Main content */}
          {children}
        </Providers>

        {/* ============================================ */}
        {/* GLOBAL UI COMPONENTS */}
        {/* ============================================ */}
        <CartDrawer />
        <BackToTop />
        <BottomNav />
        <CookieConsent />
        <ToastContainer />

        {/* ============================================ */}
        {/* ANALYTICS & TRACKING (Production only) */}
        {/* ============================================ */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                        page_path: window.location.pathname,
                      });
                    `,
                  }}
                />
              </>
            )}

            {/* Facebook Pixel */}
            {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                    fbq('track', 'PageView');
                  `,
                }}
              />
            )}
          </>
        )}
      </body>
    </html>
  );
}