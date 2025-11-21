// app/api/payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe/paymentIntent';
import { calculateOrderTotal } from '@/lib/stripe/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, customerEmail, customerName, items } = body;

    // Validation
    if (!amount || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount < 50) {
      // Minimum $0.50 or 0.50₺
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      );
    }

    // Calculate total with shipping
    const total = calculateOrderTotal(amount);

    // Create PaymentIntent
    const paymentIntent = await createPaymentIntent({
      amount: total,
      customerEmail,
      customerName,
      metadata: {
        itemCount: items?.length?.toString() || '0',
        source: 'nowiht-checkout',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}