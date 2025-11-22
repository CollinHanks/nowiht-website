// app/api/admin/products/route.ts
// ═══════════════════════════════════════════════════════════════
// 🔒 NOWIHT - Admin Products API (NextAuth v5 Compatible)
// Protected with adminGuard + Supabase service role
// ✅ PROFESSIONAL: With audit trail + AUTO SLUG GENERATION
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, getCurrentAdmin } from '@/lib/auth/adminGuard';
import { requireAdmin } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

// ============================================
// HELPER: Generate slug from name
// ============================================
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

// ============================================
// HELPER: Transform camelCase to snake_case
// ============================================
function transformFieldNames(data: any): any {
  const transformed: any = {};

  for (const [key, value] of Object.entries(data)) {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    transformed[snakeKey] = value;
  }

  return transformed;
}

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
 * ✅ NEW: Auto-generates slug from name
 */
export const POST = withAdminAuth(async (request, admin) => {
  try {
    const productData = await request.json();
    const supabaseAdmin = requireAdmin();

    console.log('📦 Creating product, original data:', Object.keys(productData));

    // ✅ Transform camelCase to snake_case
    const transformedData = transformFieldNames(productData);
    console.log('🔄 Transformed data:', Object.keys(transformedData));

    // ✅ AUTO-GENERATE SLUG if not provided
    if (!transformedData.slug && transformedData.name) {
      transformedData.slug = generateSlug(transformedData.name);
      console.log('🏷️ Auto-generated slug:', transformedData.slug);
    }

    // ✅ PROFESSIONAL: Add audit trail metadata
    const enrichedData = {
      ...transformedData,
      created_by: admin.email,              // Who created
      updated_by: admin.email,              // Who last updated
      in_stock: (transformedData.stock || 0) > 0,
    };

    console.log('👤 Audit trail: created_by =', admin.email);

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([enrichedData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating product:', error);
      throw error;
    }

    console.log('✅ Product created:', product.name, 'by', admin.email);

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
 * ✅ NEW: Auto-generates slug if name changed
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

    console.log('📝 Updating product ID:', id);

    const productData = await request.json();
    const supabaseAdmin = requireAdmin();

    console.log('📦 Original data fields:', Object.keys(productData));

    // ✅ Transform camelCase to snake_case
    const transformedData = transformFieldNames(productData);
    console.log('🔄 Transformed fields:', Object.keys(transformedData));

    // ✅ AUTO-GENERATE SLUG if name provided but slug not
    if (transformedData.name && !transformedData.slug) {
      transformedData.slug = generateSlug(transformedData.name);
      console.log('🏷️ Auto-generated slug:', transformedData.slug);
    }

    // ✅ PROFESSIONAL: Add audit trail metadata
    const enrichedData = {
      ...transformedData,
      updated_by: admin.email,              // Track who updated
      updated_at: new Date().toISOString(), // Track when updated
    };

    if ('stock' in transformedData) {
      enrichedData.in_stock = (transformedData.stock || 0) > 0;
    }

    console.log('👤 Audit trail: updated_by =', admin.email);

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(enrichedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating product:', error);
      throw error;
    }

    console.log('✅ Product updated:', product.name, 'by', admin.email);

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

    console.log('🗑️ Deleting product ID:', id, 'by', admin.email);

    const supabaseAdmin = requireAdmin();

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting product:', error);
      throw error;
    }

    console.log('✅ Product deleted by', admin.email);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error deleting product:', error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}