// app/robots.ts
// ═══════════════════════════════════════════════════════════════
// 🤖 NOWIHT - Dynamic Robots.txt
// Controls search engine crawling
// ═══════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';

/**
 * Generate robots.txt
 * 
 * This function runs at build time and generates robots.txt
 * to control search engine crawlers.
 * 
 * Next.js automatically serves this at /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://nowiht.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api',
          '/api/*',
          '/_next',
          '/_next/*',
          '/account',
          '/account/*',
          '/checkout',
          '/cart',
          '/test-*',
          '/maintenance',
        ],
      },
      // Allow Google Images bot to crawl images
      {
        userAgent: 'Googlebot-Image',
        allow: '/images/*',
      },
      // Block bad bots
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}