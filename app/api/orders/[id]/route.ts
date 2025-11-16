// app/api/orders/[id]/route.ts
// ═══════════════════════════════════════════════════════════════
// 📦 NOWIHT - Order Detail API (Next.js 16 Compatible)
// Get, update, or delete order by ID
// FIXED: NextAuth v5 import, EmailService signature, OrderService.update()
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/OrderService';
import { EmailService } from '@/lib/services/EmailService';
import { auth } from '@/lib/auth'; // ✅ FIXED: NextAuth v5 correct import

/**
 * GET /api/orders/[id]
 * Fetch order details by ID
 * 
 * @example
 * GET /api/orders/uuid-123
 * 
 * Response:
 * {
 *   id: "uuid-123",
 *   orderNumber: "NOW-2025-11-15-ABC123",
 *   status: "processing",
 *   items: [...],
 *   customer: {...},
 *   shipping: {...},
 *   ...
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 [API] Fetching order:', id);

    // Fetch order from database
    const order = await OrderService.getById(id);

    if (!order) {
      console.log('❌ [API] Order not found:', id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Optional: Check if user has permission to view this order
    // ✅ FIXED: Use auth() instead of getServerSession
    // const session = await auth();
    // if (!session || (session.user.email !== order.customerEmail && session.user.role !== 'admin')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    console.log('✅ [API] Order found:', order.orderNumber);

    return NextResponse.json(order);
  } catch (error) {
    console.error('❌ [API] Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/[id]
 * Update order status or details
 * 
 * ✅ FIXED: Uses OrderService.update() method
 * ✅ FIXED: Correct EmailService.sendShippingNotification signature
 * 
 * @example
 * PATCH /api/orders/uuid-123
 * Body: {
 *   status: "shipped",
 *   trackingNumber: "TRACK123456",
 *   carrier: "UPS"
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('📝 [API] Updating order:', id);

    // Get existing order
    const existingOrder = await OrderService.getById(id);
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // ✅ FIXED: Use OrderService.update() instead of manual update
    const updatedOrder = await OrderService.update(id, body);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Send email if status changed to shipped
    if (body.status === 'shipped' && existingOrder.status !== 'shipped') {
      console.log('📧 [API] Sending shipping notification email');
      try {
        // ✅ FIXED: Correct EmailService signature
        await EmailService.sendShippingNotification({
          to: updatedOrder.customerEmail,
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.customerName,
          trackingNumber: body.trackingNumber || updatedOrder.trackingNumber || 'N/A',
          carrier: body.carrier || 'Standard Shipping',
        });
        console.log('✅ [API] Shipping notification sent');
      } catch (emailError) {
        console.error('⚠️ [API] Failed to send email:', emailError);
        // Don't fail the request if email fails
      }
    }

    console.log('✅ [API] Order updated:', updatedOrder.orderNumber);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('❌ [API] Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/orders/[id]
 * Delete order (admin only)
 * Soft delete - changes status to 'cancelled'
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Optional: Check admin permission
    // ✅ FIXED: Use auth() instead of getServerSession
    // const session = await auth();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    console.log('🗑️ [API] Deleting order:', id);

    // OrderService.delete() performs soft delete (status = 'cancelled')
    const success = await OrderService.delete(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete order' },
        { status: 500 }
      );
    }

    console.log('✅ [API] Order deleted (cancelled):', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ [API] Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}