// app/api/orders/[id]/return/route.ts
// ═══════════════════════════════════════════════════════════════
// 🔄 NOWIHT - Order Return API (Next.js 16 Compatible)
// Create return request for delivered orders
// FIXED: EmailService.sendReturnConfirmation signature
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/OrderService';
import { EmailService } from '@/lib/services/EmailService';

/**
 * POST /api/orders/[id]/return
 * Create a return request
 * 
 * Rules:
 * - Order must be 'delivered' status
 * - Within 30 days of delivery
 * 
 * @example
 * POST /api/orders/uuid-123/return
 * Body: {
 *   reason: "wrong_size",
 *   description: "Item too small",
 *   items: [
 *     { productId: "uuid", quantity: 1 }
 *   ],
 *   images: ["url1", "url2"] // optional
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   returnId: "RET-123456",
 *   message: "..."
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason, description, items, images } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!reason || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Reason and items are required' },
        { status: 400 }
      );
    }

    console.log('🔄 [API] Creating return request for order:', id);

    // Fetch order
    const order = await OrderService.getById(id);

    if (!order) {
      console.log('❌ [API] Order not found:', id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order can be returned
    if (order.status !== 'delivered') {
      console.log('⚠️ [API] Order not delivered yet:', id);
      return NextResponse.json(
        {
          error: 'Order must be delivered to create a return',
          message: 'Sadece teslim edilen siparişler için iade talebi oluşturabilirsiniz.'
        },
        { status: 400 }
      );
    }

    // Check if within return window (30 days)
    const deliveredDate = new Date(order.deliveredAt || order.updatedAt);
    const daysSinceDelivery = Math.floor(
      (Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceDelivery > 30) {
      console.log('⚠️ [API] Return window expired:', id);
      return NextResponse.json(
        {
          error: 'Return window has expired',
          message: 'İade süresi (30 gün) dolmuştur.'
        },
        { status: 400 }
      );
    }

    // Generate return ID
    const returnId = `RET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create return request (you may want to add a 'returns' table in database)
    const returnRequest = {
      id: returnId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      reason,
      description: description || '',
      items,
      images: images || [],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // TODO: Save return request to database
    // await ReturnService.create(returnRequest);

    // Update order with return info
    await OrderService.update(id, {
      status: 'return_requested',
      notes: `Return requested: ${reason}. Description: ${description || 'N/A'}`,
    });

    // ✅ FIXED: Correct EmailService signature
    try {
      console.log('📧 [API] Sending return confirmation email');
      await EmailService.sendReturnConfirmation({
        to: order.customerEmail,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        returnReason: reason,
      });
      console.log('✅ [API] Return confirmation email sent');
    } catch (emailError) {
      console.error('⚠️ [API] Failed to send return email:', emailError);
      // Don't fail the request if email fails
    }

    console.log('✅ [API] Return request created:', returnId);

    return NextResponse.json({
      success: true,
      returnId,
      message: 'İade talebiniz başarıyla oluşturuldu. En kısa sürede size dönüş yapacağız.',
      details: {
        returnNumber: returnId,
        status: 'pending',
        estimatedProcessingTime: '3-5 iş günü',
        instructions: 'Kargo etiketiniz email adresinize gönderilecektir.',
      }
    });
  } catch (error) {
    console.error('❌ [API] Error creating return request:', error);
    return NextResponse.json(
      { error: 'Failed to create return request' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders/[id]/return
 * Get return request details for an order
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

    // TODO: Fetch return request from database
    // const returnRequest = await ReturnService.getByOrderId(id);

    console.log('🔍 [API] Fetching return request for order:', id);

    // Placeholder response
    return NextResponse.json({
      message: 'No return request found for this order',
      orderId: id,
    });
  } catch (error) {
    console.error('❌ [API] Error fetching return request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch return request' },
      { status: 500 }
    );
  }
}