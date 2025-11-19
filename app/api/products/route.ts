// app/api/products/route.ts
// Public Products API - For Shop/Homepage

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

    let query = supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_active', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Filter by category
    if (category && category !== 'all') {
      query = query.eq('category_id', category);
    }

    // Filter by featured
    if (featured === 'true') {
      query = query.eq('is_featured', true);
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