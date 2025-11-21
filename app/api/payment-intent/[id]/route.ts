// app/api/payment-intent/[id]/route.ts
// ✅ NEW: Retrieve payment intent to get order number
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentIntentId = params.id;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID required' },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      orderNumber: paymentIntent.metadata.orderNumber,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment intent' },
      { status: 500 }
    );
  }
}