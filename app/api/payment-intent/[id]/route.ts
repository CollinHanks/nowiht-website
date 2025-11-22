// app/api/payment-intent/[id]/route.ts
// ═══════════════════════════════════════════════════════════════
// 🔍 NOWIHT - RETRIEVE PAYMENT INTENT API
// Used by success page to fetch order details
// 🔧 FIX: Next.js 15 - params is now a Promise
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

// ✅ Next.js 15: params is now a Promise
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔧 Await params to get the id
    const { id: paymentIntentId } = await params;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Retrieving payment intent:', paymentIntentId);

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Payment intent not found' },
        { status: 404 }
      );
    }

    console.log('✅ Payment intent retrieved successfully');

    // Return payment intent with metadata
    return NextResponse.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
      created: paymentIntent.created,
      // Include order number if available
      orderNumber: paymentIntent.metadata.orderNumber || null,
    });
  } catch (error: any) {
    console.error('❌ Error retrieving payment intent:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve payment intent',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}