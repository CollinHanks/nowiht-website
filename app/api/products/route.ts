// app/api/products/route.ts
// Public Products API - For Shop/Homepage
// FIXED: Removed JOIN, using category string

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const slug = searchParams.get('slug');

    // ============================================
    // GET SINGLE PRODUCT BY SLUG
    // ============================================
    if (slug) {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('❌ Product fetch error:', error);
        return NextResponse.json(
          { error: 'Product not found', details: error.message },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        product,
      });
    }

    // ============================================
    // GET MULTIPLE PRODUCTS WITH FILTERS
    // ============================================
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Filter by category (using category string, not category_id)
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Filter by featured (using is_best_seller)
    if (featured === 'true') {
      query = query.eq('is_best_seller', true);
    }

    // Limit results
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('❌ Products fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: products || [],
      count: products?.length || 0,
    });
  } catch (error: any) {
    console.error('🚨 Products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}