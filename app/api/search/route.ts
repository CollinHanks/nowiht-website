// app/api/search/route.ts
// ═══════════════════════════════════════════════════════════════
// 🔍 NOWIHT - Search API
// Search products by name, category, tags
// FIXED: ProductService.search() and CategoryService.search() signatures
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/services/ProductService';
import { CategoryService } from '@/lib/services/CategoryService';

/**
 * GET /api/search
 * Search products and categories
 * 
 * @query q - Search query (required)
 * @query type - Search type: 'products', 'categories', 'all' (default: 'all')
 * @query limit - Results limit (default: 20)
 * 
 * @example
 * GET /api/search?q=hoodie&type=products&limit=10
 * 
 * Response:
 * {
 *   query: "hoodie",
 *   results: {
 *     products: [...],
 *     categories: [...],
 *     totalResults: 15
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const searchType = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    console.log('🔍 [API] Searching for:', query);

    const results: any = {
      query: query.trim(),
      products: [],
      categories: [],
      totalResults: 0,
    };

    // Search products
    if (searchType === 'all' || searchType === 'products') {
      // ✅ FIXED: ProductService.search() takes only 1 parameter
      let products = await ProductService.search(query);

      // Filter for published products and apply limit
      products = products
        .filter((p) => p.status === 'published')
        .slice(0, limit);

      results.products = products;
      results.totalResults += products.length;
    }

    // Search categories
    if (searchType === 'all' || searchType === 'categories') {
      // ✅ FIXED: CategoryService.search() takes only 1 parameter
      let categories = await CategoryService.search(query);

      // Filter for active categories and apply limit
      categories = categories
        .filter((c) => c.status === 'active')
        .slice(0, 10);

      results.categories = categories;
      results.totalResults += categories.length;
    }

    console.log('✅ [API] Search completed:', results.totalResults, 'results found');

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('❌ [API] Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/search
 * Advanced search with filters
 * 
 * @example
 * POST /api/search
 * Body: {
 *   query: "tracksuit",
 *   filters: {
 *     categories: ["hoodie", "tracksuit"],
 *     minPrice: 100,
 *     maxPrice: 500,
 *     colors: ["black", "white"],
 *     sizes: ["M", "L"],
 *     inStock: true
 *   },
 *   sort: "price_asc",
 *   limit: 20,
 *   offset: 0
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters, sort, limit = 20, offset = 0 } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    console.log('🔍 [API] Advanced search:', query, filters);

    // ✅ FIXED: ProductService.search() takes only 1 parameter
    // Get all matching products first
    let products = await ProductService.search(query);

    // Apply filters manually
    if (filters) {
      // Filter by status
      products = products.filter((p) => p.status === 'published');

      // Filter by categories
      if (filters.categories?.length > 0) {
        products = products.filter((p) =>
          filters.categories.includes(p.category)
        );
      }

      // Filter by price range
      if (filters.minPrice) {
        products = products.filter((p) => p.price >= filters.minPrice);
      }
      if (filters.maxPrice) {
        products = products.filter((p) => p.price <= filters.maxPrice);
      }

      // Filter by colors
      if (filters.colors?.length > 0) {
        products = products.filter((p) =>
          p.colors?.some((c) =>
            filters.colors.includes(c.name.toLowerCase())
          )
        );
      }

      // Filter by sizes
      if (filters.sizes?.length > 0) {
        products = products.filter((p) =>
          p.sizes?.some((s) => filters.sizes.includes(s))
        );
      }

      // Filter by stock
      if (filters.inStock !== undefined) {
        products = products.filter((p) => p.inStock === filters.inStock);
      }
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
          products.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    }

    // Apply pagination
    const totalCount = products.length;
    const paginatedProducts = products.slice(offset, offset + limit);

    console.log('✅ [API] Advanced search completed:', paginatedProducts.length, 'results');

    return NextResponse.json({
      query,
      results: paginatedProducts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      appliedFilters: filters,
    });
  } catch (error) {
    console.error('❌ [API] Advanced search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}