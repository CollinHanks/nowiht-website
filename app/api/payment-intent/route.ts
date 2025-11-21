// app/api/payment-intent/route.ts
// ✅ FIXED: Order number metadata'ya eklendi
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'usd', metadata } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // ✅ Generate order number ONCE
    const orderNumber = `NOW-${Date.now().toString().slice(-8)}`;

    // Create payment intent with metadata INCLUDING order number
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderNumber, // ✅ ADDED
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderNumber, // ✅ Return order number to frontend
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}