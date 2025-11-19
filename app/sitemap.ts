// app/sitemap.ts
// ═══════════════════════════════════════════════════════════════
// 🗺️ NOWIHT - Dynamic Sitemap (Next.js 16 Compatible)
// Generates sitemap.xml for SEO
// FIXED: Proper dynamic rendering + direct Supabase queries
// ═══════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase/client';

// ============================================
// 🔥 CRITICAL: Force dynamic rendering
// ============================================
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Regenerate every hour

/**
 * Generate dynamic sitemap
 * Uses direct Supabase queries (no API calls)
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
    // ============================================
    // 🔥 FIXED: Direct Supabase queries (no API)
    // ============================================

    // Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true });

    const categoryPages: MetadataRoute.Sitemap = (categories || []).map((category) => ({
      url: `${baseUrl}/shop/${category.slug}`,
      lastModified: new Date(category.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Fetch products
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1000);

    const productPages: MetadataRoute.Sitemap = (products || []).map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updated_at || product.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    console.log('✅ Sitemap generated:', {
      static: staticPages.length,
      categories: categoryPages.length,
      products: productPages.length,
      total: staticPages.length + categoryPages.length + productPages.length,
    });

    return [...staticPages, ...categoryPages, ...productPages];
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    return staticPages;
  }
}