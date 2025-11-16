// app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET inventory data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lowStock = searchParams.get('lowStock');

    let query = supabase
      .from('products')
      .select('id, sku, name, stock, alert_level, status, price');

    // Get all products or just low stock
    const { data, error } = await query.order('stock', { ascending: true });

    if (error) throw error;

    // Add status field based on stock levels
    const inventoryData = data?.map(product => ({
      ...product,
      inventory_status:
        product.stock === 0 ? 'out_of_stock' :
          product.stock <= product.alert_level ? 'low_stock' :
            'in_stock'
    }));

    // Filter if needed
    let result = inventoryData || [];
    if (lowStock === 'true') {
      result = result.filter(p => p.stock <= p.alert_level);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

// POST stock adjustment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, adjustment, reason = 'Manual adjustment' } = body;

    if (!productId || adjustment === undefined) {
      return NextResponse.json(
        { error: 'Product ID and adjustment required' },
        { status: 400 }
      );
    }

    // Get current stock
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const newStock = Math.max(0, (product.stock || 0) + adjustment);

    // Update stock
    const { data, error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      product: data,
      message: `Stock updated to ${newStock}`
    });
  } catch (error: any) {
    console.error('Stock adjustment error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to adjust stock' },
      { status: 500 }
    );
  }
}

// PUT bulk update
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates must be an array' },
        { status: 400 }
      );
    }

    const results = {
      success: [] as string[],
      failed: [] as any[]
    };

    for (const update of updates) {
      try {
        const { sku, stock } = update;

        const { data, error } = await supabase
          .from('products')
          .update({ stock: Math.max(0, stock) })
          .eq('sku', sku)
          .select()
          .single();

        if (error) throw error;

        results.success.push(sku);
      } catch (err: any) {
        results.failed.push({
          sku: update.sku,
          error: err?.message || 'Unknown error'
        });
      }
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Bulk update error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to bulk update' },
      { status: 500 }
    );
  }
}