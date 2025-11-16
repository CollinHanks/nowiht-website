// app/sitemap.ts
// ═══════════════════════════════════════════════════════════════
// 🗺️ NOWIHT - Dynamic Sitemap (Next.js 16 Compatible)
// Generates sitemap.xml for SEO
// ═══════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';
import { ProductService } from '@/lib/services/ProductService';
import { CategoryService } from '@/lib/services/CategoryService';

/**
 * Generate dynamic sitemap
 * 
 * This function runs at build time (ISR) and generates a sitemap
 * with all products, categories, and static pages.
 * 
 * Next.js automatically serves this at /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nowiht.com';
  const currentDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lookbook`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/size-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Services pages
    {
      url: `${baseUrl}/services/styling`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/services/packaging`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/services/craftsmanship`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Ecology pages
    {
      url: `${baseUrl}/ecologic/sustainability-vision`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ecologic/eco-friendly-materials`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ecologic/ethical-manufacturing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ecologic/zero-waste-production`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ecologic/carbon-footprint`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ecologic/community-impact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  try {
    // Fetch all active categories
    const categories = await CategoryService.getAll();
    const categoryPages: MetadataRoute.Sitemap = categories
      .filter((cat) => cat.status === 'active')
      .map((category) => ({
        url: `${baseUrl}/shop/${category.slug}`,
        lastModified: new Date(category.updatedAt),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }));

    // Fetch all published products
    const products = await ProductService.getAll({
      status: 'published',
      limit: 1000, // Adjust as needed
    });

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updatedAt || product.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    console.log('✅ Sitemap generated:', {
      static: staticPages.length,
      categories: categoryPages.length,
      products: productPages.length,
      total: staticPages.length + categoryPages.length + productPages.length,
    });

    // Combine all pages
    return [...staticPages, ...categoryPages, ...productPages];
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    // Return at least static pages if database fetch fails
    return staticPages;
  }
}

/**
 * Next.js 16: ISR (Incremental Static Regeneration)
 * Regenerate sitemap every hour
 */
export const revalidate = 3600; // 1 hour in seconds

/**
 * Force cache all fetches in this route
 * Prevents "Dynamic server usage" errors
 */
export const fetchCache = 'force-cache';