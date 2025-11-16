// app/api/orders/create/route.ts
// ═══════════════════════════════════════════════════════════════
// 📦 NOWIHT - ORDER CREATION API (ULTRA-FIXED)
// Phase 10: Email System Integration - Cart prices fix
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { EmailService } from '@/lib/services/EmailService';
import type { OrderDB, OrderItemDB } from '@/types';

/**
 * Generate unique order number
 * Format: NOW-YYYY-MM-DD-RANDOM6
 * Example: NOW-2025-11-15-A1B2C3
 */
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Generate random 6-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const random = Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');

  return `NOW-${year}-${month}-${day}-${random}`;
}

/**
 * POST /api/orders/create
 * Create a new order and send confirmation email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.customerEmail || !body.customerName || !body.shippingAddress || !body.items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // ───────────────────────────────────────────────────────────────
    // 💰 CALCULATE PRICING (Using cart prices - NO Supabase fetch)
    // ───────────────────────────────────────────────────────────────

    // Calculate subtotal from cart items
    let subtotal = 0;
    const cartItemsMap = new Map();

    for (const item of body.items) {
      // Cart items already have price from frontend
      if (!item.price) {
        return NextResponse.json(
          { error: `Item ${item.productId} missing price` },
          { status: 400 }
        );
      }
      subtotal += item.price * item.quantity;
      cartItemsMap.set(item.productId, item.price);
    }

    const shippingMethod = body.shippingMethod || 'standard';
    const shippingCost = shippingMethod === 'express' ? 15 : subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax
    const discount = body.discount || 0;
    const total = subtotal + shippingCost + tax - discount;

    // ───────────────────────────────────────────────────────────────
    // 🗄️ CREATE ORDER IN DATABASE
    // ───────────────────────────────────────────────────────────────

    const orderData: Omit<OrderDB, 'id' | 'created_at' | 'updated_at'> = {
      order_number: orderNumber,
      customer_email: body.customerEmail,
      customer_name: body.customerName,
      customer_phone: body.customerPhone,
      shipping_address: body.shippingAddress,
      subtotal,
      shipping_cost: shippingCost,
      tax,
      discount,
      total,
      status: 'pending',
      payment_method: body.paymentMethod,
      payment_status: 'pending',
      notes: body.notes,
      tracking_number: undefined,
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError || !order) {
      console.error('❌ Order creation error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // ───────────────────────────────────────────────────────────────
    // 📋 CREATE ORDER ITEMS (Using cart data)
    // ───────────────────────────────────────────────────────────────

    const orderItemsData: Omit<OrderItemDB, 'id' | 'created_at'>[] = body.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName || 'Product',
      product_image: item.productImage || '',
      product_sku: item.productSku || '',
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('❌ Order items creation error:', itemsError);
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // ───────────────────────────────────────────────────────────────
    // 📧 SEND ORDER CONFIRMATION EMAIL
    // ───────────────────────────────────────────────────────────────

    try {
      await EmailService.sendOrderConfirmation({
        to: body.customerEmail,
        orderNumber: orderNumber,
        customerName: body.customerName,
        total,
        items: orderItemsData.map(item => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          image: item.product_image,
        })),
        shippingAddress: {
          street: body.shippingAddress.address,
          city: body.shippingAddress.city,
          state: body.shippingAddress.state,
          zip: body.shippingAddress.zipCode,
          country: body.shippingAddress.country,
        },
      });
      console.log('✅ Order confirmation email sent:', body.customerEmail);
    } catch (emailError) {
      console.error('⚠️  Order confirmation email failed (non-blocking):', emailError);
    }

    // ───────────────────────────────────────────────────────────────
    // ✅ SUCCESS RESPONSE
    // ───────────────────────────────────────────────────────────────

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        total: order.total,
        createdAt: order.created_at,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}