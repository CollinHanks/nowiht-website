// app/api/orders/[id]/cancel/route.ts
// ═══════════════════════════════════════════════════════════════
// ❌ NOWIHT - Order Cancel API (Next.js 16 Compatible)
// Cancel order (only if not shipped)
// FIXED: EmailService.sendOrderCancellation signature
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/OrderService';
import { EmailService } from '@/lib/services/EmailService';

/**
 * POST /api/orders/[id]/cancel
 * Cancel an order
 * 
 * Rules:
 * - Order must be in 'pending' or 'processing' status
 * - Cannot cancel 'shipped' or 'delivered' orders
 * 
 * @example
 * POST /api/orders/uuid-123/cancel
 * Body: {
 *   reason: "Changed my mind"
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   order: {...}
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('🚫 [API] Canceling order:', id);

    // Fetch order
    const order = await OrderService.getById(id);

    if (!order) {
      console.log('❌ [API] Order not found:', id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order can be canceled
    if (order.status === 'shipped' || order.status === 'delivered') {
      console.log('⚠️ [API] Cannot cancel shipped/delivered order:', id);
      return NextResponse.json(
        {
          error: 'Cannot cancel order that has been shipped or delivered',
          message: 'Bu sipariş zaten kargoya verildiği için iptal edilemez. İade talebi oluşturabilirsiniz.'
        },
        { status: 400 }
      );
    }

    if (order.status === 'cancelled') {
      console.log('⚠️ [API] Order already cancelled:', id);
      return NextResponse.json(
        {
          error: 'Order is already cancelled',
          message: 'Bu sipariş zaten iptal edilmiş.'
        },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    const updatedOrder = await OrderService.update(id, {
      status: 'cancelled',
      notes: reason ? `Cancelled by customer: ${reason}` : 'Cancelled by customer',
      cancelledAt: new Date().toISOString(),
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Failed to cancel order' },
        { status: 500 }
      );
    }

    // ✅ FIXED: Correct EmailService signature
    try {
      console.log('📧 [API] Sending cancellation email');
      await EmailService.sendOrderCancellation({
        to: order.customerEmail,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        refundAmount: order.total,
      });
      console.log('✅ [API] Cancellation email sent');
    } catch (emailError) {
      console.error('⚠️ [API] Failed to send cancellation email:', emailError);
      // Don't fail the request if email fails
    }

    console.log('✅ [API] Order cancelled:', order.orderNumber);

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Siparişiniz başarıyla iptal edildi. İade işleminiz 5-7 iş günü içinde tamamlanacaktır.'
    });
  } catch (error) {
    console.error('❌ [API] Error canceling order:', error);
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}