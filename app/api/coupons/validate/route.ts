// app/api/coupons/validate/route.ts
// ═══════════════════════════════════════════════════════════════
// 🎟️ NOWIHT - Coupon Validation API
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal, userId } = await request.json();

    // Validate input
    if (!code || !subtotal) {
      return NextResponse.json(
        { success: false, error: 'Code and subtotal are required' },
        { status: 400 }
      );
    }

    console.log('🎟️ Validating coupon:', code, 'for subtotal:', subtotal);

    // Fetch coupon from database
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      console.log('❌ Coupon not found or inactive:', code);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired coupon code' },
        { status: 404 }
      );
    }

    // Check if coupon is valid (dates)
    const now = new Date();
    const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

    if (validFrom && now < validFrom) {
      return NextResponse.json(
        { success: false, error: 'Coupon is not yet valid' },
        { status: 400 }
      );
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json(
        { success: false, error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Check minimum order value
    if (coupon.min_order_value && subtotal < coupon.min_order_value) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order value of $${coupon.min_order_value} required`,
        },
        { status: 400 }
      );
    }

    // Check max uses
    if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    let freeShipping = false;

    switch (coupon.type) {
      case 'percentage':
        discount = (subtotal * coupon.value) / 100;
        break;
      case 'fixed':
        discount = Math.min(coupon.value, subtotal); // Can't exceed subtotal
        break;
      case 'free_shipping':
        freeShipping = true;
        discount = 0; // Handled in shipping calculation
        break;
    }

    console.log('✅ Coupon valid:', {
      code,
      type: coupon.type,
      discount,
      freeShipping,
    });

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
        freeShipping,
        description: coupon.description,
      },
    });
  } catch (error: any) {
    console.error('❌ Error validating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}