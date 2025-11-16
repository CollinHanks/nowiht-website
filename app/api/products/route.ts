// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug)
      `);

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Products fetch error:', error);
      return NextResponse.json([], { status: 200 }); // Return empty array instead of error
    }

    // Ensure all products have required fields
    const products = (data || []).map(product => ({
      ...product,
      images: product.images || ['/images/products/placeholder.jpg'],
      sizes: product.sizes || ['S', 'M', 'L'],
      colors: product.colors || ['Black', 'White'],
      stock: product.stock || 0,
      alert_level: product.alert_level || 10
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Ensure arrays are properly formatted
    body.images = body.images || [];
    body.sizes = body.sizes || ['S', 'M', 'L', 'XL'];
    body.colors = body.colors || ['Black', 'White'];

    const { data, error } = await supabase
      .from('products')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Product create error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}