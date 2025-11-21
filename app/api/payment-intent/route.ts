// app/api/payment-intent/route.ts
// ✅ FIXED: Removed double shipping calculation
import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe/paymentIntent';

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

    // ✅ FIXED: Use amount directly (frontend already calculated total)
    // No need to recalculate - prevents double shipping charge
    const paymentIntent = await createPaymentIntent({
      amount, // ✅ Direct use - already includes subtotal + shipping + tax
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