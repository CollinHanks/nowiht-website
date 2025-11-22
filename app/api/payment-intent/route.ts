// app/api/payment-intent/route.ts
// ═══════════════════════════════════════════════════════════════
// 💳 NOWIHT - PAYMENT INTENT CREATION API
// 🔥 FIX v6: Forward ALL metadata to Stripe (no filtering!)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [PAYMENT-INTENT] Starting payment intent creation...');

    // 1️⃣ Parse request body
    const body = await request.json();
    console.log('📦 [PAYMENT-INTENT] Request body received');

    const { amount, currency = 'usd', metadata } = body;

    // 2️⃣ Validate amount
    if (!amount || amount <= 0) {
      console.error('❌ [PAYMENT-INTENT] Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be greater than 0.' },
        { status: 400 }
      );
    }

    if (isNaN(amount)) {
      console.error('❌ [PAYMENT-INTENT] Amount is not a number:', amount);
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be a number.' },
        { status: 400 }
      );
    }

    // 3️⃣ Validate Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ [PAYMENT-INTENT] Stripe secret key not configured');
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // 4️⃣ Generate order number ONCE
    const orderNumber = `NOW-${Date.now().toString().slice(-8)}`;
    console.log('🎫 [PAYMENT-INTENT] Generated order number:', orderNumber);

    // 5️⃣ ✅ FIX: Forward ALL metadata from frontend + add orderNumber
    // Don't filter or transform - send everything!
    const paymentMetadata = {
      ...metadata, // ✅ Spread ALL fields from frontend
      orderNumber, // ✅ Add generated order number
      source: 'nowiht-checkout', // ✅ Add source identifier
    };

    console.log('📋 [PAYMENT-INTENT] Metadata keys:', Object.keys(paymentMetadata));
    console.log('🎟️ [PAYMENT-INTENT] Coupon code:', paymentMetadata.coupon_code || 'none');
    console.log('🛒 [PAYMENT-INTENT] Cart items length:', paymentMetadata.cart_items?.length || 0);

    // 6️⃣ Create payment intent with Stripe
    console.log('💳 [PAYMENT-INTENT] Calling Stripe API...');
    console.log('💳 [PAYMENT-INTENT] Amount in cents:', Math.round(amount));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount already in cents from frontend
      currency,
      metadata: paymentMetadata, // ✅ Send COMPLETE metadata
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('✅ [PAYMENT-INTENT] Stripe payment intent created:', paymentIntent.id);

    // 7️⃣ Return success response
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderNumber,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error: any) {
    // 8️⃣ Detailed error logging
    console.error('❌ [PAYMENT-INTENT] Error occurred:');
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Error type:', error?.type);
    console.error('Error stack:', error?.stack);

    // Stripe-specific errors
    if (error?.type === 'StripeCardError') {
      console.error('💳 Card Error:', error.message);
      return NextResponse.json(
        { error: `Card error: ${error.message}` },
        { status: 400 }
      );
    }

    if (error?.type === 'StripeInvalidRequestError') {
      console.error('🔴 Invalid Request:', error.message);
      return NextResponse.json(
        { error: `Invalid request: ${error.message}` },
        { status: 400 }
      );
    }

    if (error?.type === 'StripeAPIError') {
      console.error('🔴 Stripe API Error:', error.message);
      return NextResponse.json(
        { error: 'Payment system error. Please try again.' },
        { status: 500 }
      );
    }

    if (error?.type === 'StripeAuthenticationError') {
      console.error('🔑 Authentication Error:', error.message);
      return NextResponse.json(
        { error: 'Payment authentication failed. Please contact support.' },
        { status: 500 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'Failed to create payment intent',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}