// app/api/admin/products/route.ts
// ═══════════════════════════════════════════════════════════════
// 🔒 NOWIHT - Admin Products API (NextAuth v5 Compatible)
// Protected with adminGuard + Supabase service role
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, getCurrentAdmin } from '@/lib/auth/adminGuard';
import { requireAdmin } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/products
 * Get all products (including drafts)
 * PROTECTED: Admin only
 */
export async function GET() {
  try {
    // ✅ Step 1: Check admin access (NextAuth v5)
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 401 }
      );
    }

    // ✅ Step 2: Use service role (bypasses RLS)
    const supabaseAdmin = requireAdmin();

    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      products: products || [],
    });
  } catch (error: any) {
    console.error('❌ Error fetching products:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Create a new product
 * PROTECTED: Admin only (using withAdminAuth wrapper)
 */
export const POST = withAdminAuth(async (request, admin) => {
  try {
    const productData = await request.json();
    const supabaseAdmin = requireAdmin();

    // Add metadata
    const enrichedData = {
      ...productData,
      created_by: admin.email,
      updated_by: admin.email,
      in_stock: (productData.stock || 0) > 0,
    };

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([enrichedData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/admin/products?id=xxx
 * Update a product
 * PROTECTED: Admin only
 */
export async function PUT(request: NextRequest) {
  try {
    // ✅ Check admin access
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const productData = await request.json();
    const supabaseAdmin = requireAdmin();

    // Add metadata
    const enrichedData = {
      ...productData,
      updated_by: admin.email,
      updated_at: new Date().toISOString(),
    };

    if ('stock' in productData) {
      enrichedData.in_stock = (productData.stock || 0) > 0;
    }

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(enrichedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error('❌ Error updating product:', error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products?id=xxx
 * Delete a product
 * PROTECTED: Admin only
 */
export async function DELETE(request: NextRequest) {
  try {
    // ✅ Check admin access
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = requireAdmin();

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error deleting product:', error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}