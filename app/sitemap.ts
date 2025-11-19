// app/sitemap.ts
// ═══════════════════════════════════════════════════════════════
// 🗺️ NOWIHT - Dynamic Sitemap (Fixed)
// Direct Supabase queries + proper dynamic rendering
// ═══════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nowiht.com';
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Direct Supabase query for categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    const categoryPages: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
      url: `${baseUrl}/shop/${cat.slug}`,
      lastModified: new Date(cat.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Direct Supabase query for products
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
    });

    return [...staticPages, ...categoryPages, ...productPages];
  } catch (error) {
    console.error('❌ Sitemap generation error:', error);
    return staticPages; // Fallback to static pages
  }
}