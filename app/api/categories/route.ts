// app/api/categories/route.ts
// NOWIHT E-Commerce - Categories API
// 🔥 FIXED: Proper admin client handling with null checks

import { NextRequest, NextResponse } from 'next/server';
import { supabase, requireAdmin } from '@/lib/supabase/client';

// ============================================
// GET - Fetch categories
// ============================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Single category by slug
    if (slug) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Category fetch error:', error);
        throw error;
      }

      return NextResponse.json(data);
    }

    // All categories
    let query = supabase.from('categories').select('*');

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error) {
      console.error('Categories fetch error:', error);
      throw error;
    }

    return NextResponse.json(data || []);

  } catch (error) {
    console.error('❌ GET /api/categories error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create new category
// ============================================
export async function POST(req: NextRequest) {
  try {
    // 🔥 FIXED: Check admin access first
    const admin = requireAdmin();

    const body = await req.json();

    // Validation
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Create category
    const { data, error } = await admin
      .from('categories')
      .insert([{
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image_url: body.image_url || null,
        meta_title: body.meta_title || null,
        meta_description: body.meta_description || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
        sort_order: body.sort_order || 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Category create error:', error);

      // Handle duplicate slug
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 409 }
        );
      }

      throw error;
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('❌ POST /api/categories error:', error);

    // Handle admin access error
    if (error instanceof Error && error.message.includes('Admin access not available')) {
      return NextResponse.json(
        {
          error: 'Admin access required',
          details: 'SUPABASE_SERVICE_ROLE_KEY is not configured'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update existing category
// ============================================
export async function PUT(req: NextRequest) {
  try {
    // 🔥 FIXED: Check admin access first
    const admin = requireAdmin();

    const body = await req.json();
    const { id, ...updateData } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // Update category
    const { data, error } = await admin
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Category update error:', error);
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ PUT /api/categories error:', error);

    // Handle admin access error
    if (error instanceof Error && error.message.includes('Admin access not available')) {
      return NextResponse.json(
        {
          error: 'Admin access required',
          details: 'SUPABASE_SERVICE_ROLE_KEY is not configured'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Remove category
// ============================================
export async function DELETE(req: NextRequest) {
  try {
    // 🔥 FIXED: Check admin access first
    const admin = requireAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Validation
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category has products
    const { data: products } = await admin
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products' },
        { status: 400 }
      );
    }

    // Delete category
    const { error } = await admin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Category delete error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ DELETE /api/categories error:', error);

    // Handle admin access error
    if (error instanceof Error && error.message.includes('Admin access not available')) {
      return NextResponse.json(
        {
          error: 'Admin access required',
          details: 'SUPABASE_SERVICE_ROLE_KEY is not configured'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}