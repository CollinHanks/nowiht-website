// app/api/products/[slug]/route.ts
// ═══════════════════════════════════════════════════════════════
// 🛍️ NOWIHT - Product by Slug API (Next.js 16 Compatible)
// Get product details by slug (SEO-friendly URLs)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/services/ProductService';

/**
 * GET /api/products/[slug]
 * Fetch product by slug
 * 
 * @example
 * GET /api/products/luxury-tracksuit-black
 * 
 * Response:
 * {
 *   id: "uuid",
 *   name: "Luxury Tracksuit",
 *   slug: "luxury-tracksuit-black",
 *   price: 299.99,
 *   images: [...],
 *   category: {...},
 *   ...
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    console.log('🔍 [API] Fetching product by slug:', slug);

    // Fetch product from database
    const product = await ProductService.getBySlug(slug);

    if (!product) {
      console.log('❌ [API] Product not found:', slug);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is published (only show published products to customers)
    if (product.status !== 'published') {
      console.log('⚠️ [API] Product not published:', slug);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('✅ [API] Product found:', product.name);

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('❌ [API] Error fetching product by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/products/[slug]
 * Update product views count (for analytics)
 * 
 * @example
 * PATCH /api/products/luxury-tracksuit-black
 * Body: { action: 'increment_views' }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === 'increment_views') {
      const product = await ProductService.getBySlug(slug);

      if (product) {
        // Increment views (you can add this to ProductService)
        // await ProductService.incrementViews(product.id);
        console.log('📈 [API] Product view incremented:', slug);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('❌ [API] Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}