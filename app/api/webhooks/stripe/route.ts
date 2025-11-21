// app/api/webhooks/stripe/route.ts
// ✅ FIXED: Order number metadata'dan alınıyor
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Resend } from 'resend';
import type Stripe from 'stripe';

const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No stripe-signature header');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle events
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment succeeded:', paymentIntent.id);

    const { orderNumber, customerName, customerEmail } = paymentIntent.metadata;

    // ✅ FIXED: Use order number from metadata (generated in payment-intent route)
    // If somehow missing, generate as fallback
    const finalOrderNumber = orderNumber || `NOW-${Date.now().toString().slice(-8)}`;

    // Create order in Supabase
    const orderData = {
      order_number: finalOrderNumber, // ✅ From metadata
      payment_intent_id: paymentIntent.id,
      customer_email: customerEmail,
      customer_name: customerName,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'pending',
      payment_status: 'succeeded',
      metadata: paymentIntent.metadata,
      created_at: new Date().toISOString(),
    };

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('✅ Order created:', order.id, '| Order Number:', finalOrderNumber);

    // Send confirmation email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@updates.nowiht.com',
        to: customerEmail,
        subject: 'Order Confirmation - NOWIHT',
        html: `
          <div style="font-family: 'IBM Plex Mono', monospace; max-width: 600px; margin: 0 auto;">
            <h1 style="font-weight: 300; font-size: 24px; letter-spacing: 0.1em;">ORDER CONFIRMED</h1>
            <p>Thank you for your purchase, ${customerName}.</p>
            <p>Order Number: <strong>${finalOrderNumber}</strong></p>
            <p>Amount: <strong>$${(paymentIntent.amount / 100).toFixed(2)}</strong></p>
            <p>We'll send you a shipping confirmation when your order ships.</p>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
            <p style="color: #666; font-size: 12px;">NOWIHT - Luxury Lifestyle</p>
          </div>
        `,
      });

      console.log('✅ Confirmation email sent to:', customerEmail);
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      // Don't throw - email failure shouldn't fail the webhook
    }
  } catch (error) {
    console.error('❌ Error handling payment success:', error);
    throw error;
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment failed:', paymentIntent.id);

    const { customerEmail, customerName } = paymentIntent.metadata;

    if (customerEmail) {
      // Send payment failed email
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@updates.nowiht.com',
          to: customerEmail,
          subject: 'Payment Failed - NOWIHT',
          html: `
            <div style="font-family: 'IBM Plex Mono', monospace; max-width: 600px; margin: 0 auto;">
              <h1 style="font-weight: 300; font-size: 24px; letter-spacing: 0.1em;">PAYMENT FAILED</h1>
              <p>Dear ${customerName},</p>
              <p>Your payment could not be processed. Please try again or use a different payment method.</p>
              <p>If you continue to experience issues, please contact our support team.</p>
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
              <p style="color: #666; font-size: 12px;">NOWIHT - Luxury Lifestyle</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error sending payment failed email:', emailError);
      }
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}