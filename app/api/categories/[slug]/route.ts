// app/api/categories/[slug]/route.ts
// ═══════════════════════════════════════════════════════════════
// 📂 NOWIHT - Category by Slug API (Next.js 16 Compatible)
// Get category details and products by slug
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/services/CategoryService';
import { ProductService } from '@/lib/services/ProductService';

/**
 * GET /api/categories/[slug]
 * Fetch category by slug with optional products
 * 
 * @query include_products - Include products in category (default: false)
 * @query limit - Limit number of products (default: 20)
 * 
 * @example
 * GET /api/categories/hoodie?include_products=true&limit=12
 * 
 * Response:
 * {
 *   id: "uuid",
 *   name: "HOODIE",
 *   slug: "hoodie",
 *   description: "...",
 *   image: "...",
 *   productCount: 15,
 *   products: [...] // if include_products=true
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const includeProducts = searchParams.get('include_products') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    console.log('🔍 [API] Fetching category by slug:', slug);

    // Fetch category from database
    const category = await CategoryService.getBySlug(slug);

    if (!category) {
      console.log('❌ [API] Category not found:', slug);
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category is active
    if (category.status !== 'active') {
      console.log('⚠️ [API] Category not active:', slug);
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Build response
    const response: any = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      seoTitle: category.seoTitle,
      seoDescription: category.seoDescription,
      productCount: category.productCount,
    };

    // Include products if requested
    if (includeProducts) {
      console.log('📦 [API] Fetching products for category:', slug);
      const products = await ProductService.getAll({
        category: category.id,
        limit,
        status: 'published',
      });
      response.products = products;
    }

    console.log('✅ [API] Category found:', category.name);

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('❌ [API] Error fetching category by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}