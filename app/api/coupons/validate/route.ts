// app/api/coupons/validate/route.ts
// 🎟️ NOWIHT - Coupon Validation API
// ✅ Validates coupon codes from database

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

// ============================================
// POST: VALIDATE COUPON
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal, userId } = body;

    // Validate input
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (!subtotal || subtotal <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order subtotal' },
        { status: 400 }
      );
    }

    // Fetch coupon from database
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    // Check if coupon exists
    if (error || !coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // ============================================
    // VALIDATION CHECKS
    // ============================================

    // 1. Check if coupon is active
    if (!coupon.is_active) {
      return NextResponse.json(
        { success: false, error: 'This coupon is no longer active' },
        { status: 400 }
      );
    }

    // 2. Check expiry date
    if (coupon.expires_at) {
      const expiryDate = new Date(coupon.expires_at);
      const now = new Date();
      if (now > expiryDate) {
        return NextResponse.json(
          { success: false, error: 'This coupon has expired' },
          { status: 400 }
        );
      }
    }

    // 3. Check minimum order value
    if (coupon.minimum_order && subtotal < coupon.minimum_order) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order value of $${coupon.minimum_order.toFixed(2)} required`,
        },
        { status: 400 }
      );
    }

    // 4. Check usage limit (total)
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json(
        { success: false, error: 'This coupon has reached its usage limit' },
        { status: 400 }
      );
    }

    // 5. Check user-specific usage limit (if user is logged in)
    if (userId && coupon.usage_limit_per_user) {
      const { count } = await supabase
        .from('coupon_usage')
        .select('*', { count: 'exact', head: true })
        .eq('coupon_id', coupon.id)
        .eq('user_id', userId);

      if (count && count >= coupon.usage_limit_per_user) {
        return NextResponse.json(
          { success: false, error: 'You have already used this coupon' },
          { status: 400 }
        );
      }
    }

    // ============================================
    // CALCULATE DISCOUNT
    // ============================================
    let discountAmount = 0;

    if (coupon.type === 'percentage') {
      // Percentage discount
      discountAmount = (subtotal * coupon.value) / 100;

      // Apply max discount if specified
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else if (coupon.type === 'fixed') {
      // Fixed amount discount
      discountAmount = Math.min(coupon.value, subtotal); // Can't exceed subtotal
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;

    // ============================================
    // RETURN SUCCESS
    // ============================================
    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: discountAmount,
        freeShipping: coupon.free_shipping || false,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error('❌ Error validating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

// ============================================
// GET: NOT ALLOWED
// ============================================
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to validate coupons.' },
    { status: 405 }
  );
}