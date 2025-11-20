// app/api/products/route.ts
// Public Products API - For Shop/Homepage
// ✅ COMPLETE FIX: NULL check + ID handler + Color parsing

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================
// HELPER: Parse colors from database
// ============================================
function parseProductColors(product: any) {
  // ✅ NULL CHECK - CRITICAL FIX
  if (!product) {
    return product;
  }

  try {
    // If colors is an array of strings (from database)
    if (Array.isArray(product.colors)) {
      product.colors = product.colors.map((color: any) => {
        // If it's already an object, return it
        if (typeof color === 'object' && color !== null && color.name && color.hex) {
          return color;
        }

        // If it's a JSON string, parse it
        if (typeof color === 'string') {
          try {
            const parsed = JSON.parse(color);
            return parsed;
          } catch (e) {
            console.error('❌ Failed to parse color:', color);
            // Return a default color object
            return { name: color, hex: '#000000' };
          }
        }

        return color;
      });
    }

    return product;
  } catch (error) {
    console.error('❌ Error parsing product colors:', error);
    return product;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const slug = searchParams.get('slug');

    // ============================================
    // GET SINGLE PRODUCT BY ID
    // ✅ NEW: Added for admin edit page
    // ============================================
    if (id) {
      console.log('🔍 Fetching product by ID:', id);

      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Product fetch error (by id):', error);
        return NextResponse.json(
          { error: 'Product not found', details: error.message },
          { status: 404 }
        );
      }

      console.log('✅ Product found by ID:', product?.name);

      // ✅ Parse colors before returning
      const parsedProduct = parseProductColors(product);

      return NextResponse.json({
        success: true,
        product: parsedProduct,
      });
    }

    // ============================================
    // GET SINGLE PRODUCT BY SLUG
    // ============================================
    if (slug) {
      console.log('🔍 Fetching product by slug:', slug);

      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('❌ Product fetch error (by slug):', error);
        return NextResponse.json(
          { error: 'Product not found', details: error.message },
          { status: 404 }
        );
      }

      // ✅ Parse colors before returning
      const parsedProduct = parseProductColors(product);

      return NextResponse.json({
        success: true,
        product: parsedProduct,
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

    // ✅ Parse colors for all products
    const parsedProducts = products?.map(parseProductColors) || [];

    return NextResponse.json({
      success: true,
      products: parsedProducts,
      count: parsedProducts.length,
    });
  } catch (error: any) {
    console.error('🚨 Products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}