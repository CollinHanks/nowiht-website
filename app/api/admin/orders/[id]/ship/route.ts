// app/api/admin/orders/[id]/ship/route.ts
// ═══════════════════════════════════════════════════════════════
// 📦 NOWIHT - ADMIN SHIPPING NOTIFICATION API (FIXED)
// Phase 10: Email System Integration
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { EmailService } from '@/lib/services/EmailService';

interface ShipOrderRequest {
  trackingNumber: string;
  carrier: string; // e.g., "UPS", "FedEx", "DHL"
}

/**
 * POST /api/admin/orders/[id]/ship
 * Mark order as shipped and send shipping notification email
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: ShipOrderRequest = await request.json();

    // ───────────────────────────────────────────────────────────────
    // ✅ VALIDATE INPUT
    // ───────────────────────────────────────────────────────────────

    if (!body.trackingNumber || !body.carrier) {
      return NextResponse.json(
        { error: 'Missing tracking number or carrier' },
        { status: 400 }
      );
    }

    // ───────────────────────────────────────────────────────────────
    // 🔍 GET ORDER DETAILS
    // ───────────────────────────────────────────────────────────────

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is already shipped
    if (order.status === 'shipped' || order.status === 'delivered') {
      return NextResponse.json(
        { error: 'Order already shipped' },
        { status: 400 }
      );
    }

    // ───────────────────────────────────────────────────────────────
    // 📦 UPDATE ORDER STATUS
    // ───────────────────────────────────────────────────────────────

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'shipped',
        tracking_number: body.trackingNumber,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('❌ Order update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // ───────────────────────────────────────────────────────────────
    // 📧 SEND SHIPPING NOTIFICATION EMAIL
    // ───────────────────────────────────────────────────────────────

    try {
      // ✅ FIXED: Use correct method name
      await EmailService.sendShippingNotification({
        to: order.customer_email,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        trackingNumber: body.trackingNumber,
        carrier: body.carrier,
      });
      console.log('✅ Shipping notification email sent:', order.customer_email);
    } catch (emailError) {
      console.error('⚠️  Shipping notification email failed (non-blocking):', emailError);
      // Don't fail the update if email fails
    }

    // ───────────────────────────────────────────────────────────────
    // ✅ SUCCESS RESPONSE
    // ───────────────────────────────────────────────────────────────

    return NextResponse.json({
      success: true,
      message: 'Order marked as shipped and customer notified',
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: 'shipped',
        trackingNumber: body.trackingNumber,
      },
    });

  } catch (error) {
    console.error('❌ Shipping notification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}