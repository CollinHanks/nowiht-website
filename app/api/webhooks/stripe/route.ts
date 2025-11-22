// app/api/webhooks/stripe/route.ts
// ═══════════════════════════════════════════════════════════════
// 🎯 NOWIHT - STRIPE WEBHOOK HANDLER
// ✅ FIXED: Order number metadata'dan alınıyor
// 🚀 FIX v4: FULL METADATA PARSE - Kupon, pricing, cart items
// 🔧 FIX v5: supabaseAdmin.raw() hatası düzeltildi
// ═══════════════════════════════════════════════════════════════

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
      console.error('❌ No stripe-signature header');
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
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('✅ Webhook received:', event.type);

    // Handle events
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// 💳 PAYMENT SUCCESS HANDLER
// 🚀 Parse FULL metadata and save to database
// ═══════════════════════════════════════════════════════════════
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('💳 Payment succeeded:', paymentIntent.id);

    const metadata = paymentIntent.metadata;

    // ✅ Extract order number (generated in payment-intent route)
    const orderNumber = metadata.orderNumber || `NOW-${Date.now().toString().slice(-8)}`;
    console.log('📦 Order Number:', orderNumber);

    // 🛒 Parse cart items from JSON string
    let cartItems: any[] = [];
    try {
      cartItems = metadata.cart_items ? JSON.parse(metadata.cart_items) : [];
      console.log('🛒 Cart Items:', cartItems.length, 'items');
    } catch (error) {
      console.error('❌ Error parsing cart items:', error);
      cartItems = [];
    }

    // 💰 Parse pricing details
    const subtotal = parseInt(metadata.subtotal_cents || '0');
    const shippingCost = parseInt(metadata.shipping_cost_cents || '0');
    const originalShipping = parseInt(metadata.original_shipping_cents || '0');
    const tax = parseInt(metadata.tax_cents || '0');
    const discount = parseInt(metadata.discount_cents || '0');
    const total = parseInt(metadata.total_cents || paymentIntent.amount.toString());

    console.log('💰 Pricing:', {
      subtotal: `$${(subtotal / 100).toFixed(2)}`,
      shipping: `$${(shippingCost / 100).toFixed(2)}`,
      originalShipping: `$${(originalShipping / 100).toFixed(2)}`,
      tax: `$${(tax / 100).toFixed(2)}`,
      discount: `$${(discount / 100).toFixed(2)}`,
      total: `$${(total / 100).toFixed(2)}`,
    });

    // 🎟️ Parse coupon details
    const couponCode = metadata.coupon_code || null;
    const couponType = metadata.coupon_type || null;
    const couponValue = metadata.coupon_value ? parseFloat(metadata.coupon_value) : null;
    const couponDiscount = metadata.coupon_discount ? parseFloat(metadata.coupon_discount) : 0;
    const freeShippingApplied = metadata.coupon_free_shipping === 'true';

    if (couponCode) {
      console.log('🎟️ Coupon Applied:', {
        code: couponCode,
        type: couponType,
        value: couponValue,
        discount: `$${couponDiscount}`,
        freeShipping: freeShippingApplied,
      });
    }

    // 📦 Prepare order data for database
    const orderData = {
      // Order identification
      order_number: orderNumber,
      payment_intent_id: paymentIntent.id,

      // Customer information
      customer_email: metadata.customer_email,
      customer_name: metadata.customer_name || metadata.customerName, // Support both formats
      customer_phone: metadata.customer_phone,

      // Shipping address (JSON object)
      shipping_address: {
        address: metadata.shipping_address,
        apartment: metadata.shipping_apartment || '',
        city: metadata.shipping_city,
        state: metadata.shipping_state,
        zip: metadata.shipping_zip,
        country: metadata.shipping_country,
      },
      shipping_method: metadata.shipping_method || 'standard',

      // Pricing (in cents)
      subtotal,
      shipping_cost: shippingCost,
      original_shipping_cost: originalShipping,
      tax,
      discount,
      total,
      currency: paymentIntent.currency || 'usd',

      // Coupon information
      coupon_code: couponCode,
      coupon_type: couponType,
      coupon_value: couponValue,
      coupon_discount: couponDiscount,
      free_shipping_applied: freeShippingApplied,

      // Cart items (JSON array)
      items: cartItems,
      item_count: parseInt(metadata.item_count || '0'),

      // Status
      status: 'pending', // Will be updated to 'processing' by admin
      payment_status: 'succeeded',

      // Full metadata for reference
      metadata: metadata,

      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('💾 Saving order to database...');

    // 📝 Insert order into Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('❌ Error creating order in database:', orderError);
      throw orderError;
    }

    console.log('✅ Order created successfully:', {
      id: order.id,
      orderNumber: order.order_number,
      total: `$${(order.total / 100).toFixed(2)}`,
      items: order.item_count,
    });

    // 🎟️ Update coupon usage count if coupon was used
    if (couponCode) {
      console.log('🎟️ Updating coupon usage count for:', couponCode);

      try {
        // 🔧 FIX: Manual increment instead of supabaseAdmin.raw()
        // Step 1: Get current coupon data
        const { data: coupon, error: fetchError } = await supabaseAdmin
          .from('coupons')
          .select('used_count')
          .eq('code', couponCode)
          .single();

        if (fetchError) {
          console.error('⚠️ Error fetching coupon:', fetchError);
        } else if (coupon) {
          // Step 2: Increment used_count
          const newUsedCount = (coupon.used_count || 0) + 1;

          const { error: updateError } = await supabaseAdmin
            .from('coupons')
            .update({
              used_count: newUsedCount,
              updated_at: new Date().toISOString(),
            })
            .eq('code', couponCode);

          if (updateError) {
            console.error('⚠️ Error updating coupon usage:', updateError);
          } else {
            console.log(`✅ Coupon usage updated: ${couponCode} used ${newUsedCount} times`);
          }
        }
      } catch (couponError) {
        console.error('⚠️ Coupon update error:', couponError);
        // Don't throw - this shouldn't fail the order
      }
    }

    // 📧 Send confirmation email
    try {
      console.log('📧 Sending confirmation email to:', metadata.customer_email);

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@updates.nowiht.com',
        to: metadata.customer_email,
        subject: `Order Confirmation #${orderNumber} - NOWIHT`,
        html: generateOrderConfirmationEmail({
          orderNumber,
          customerName: metadata.customer_name || metadata.customerName || 'Valued Customer',
          total: total / 100,
          subtotal: subtotal / 100,
          shipping: shippingCost / 100,
          tax: tax / 100,
          discount: discount / 100,
          couponCode,
          freeShippingApplied,
          items: cartItems,
          shippingAddress: orderData.shipping_address,
        }),
      });

      console.log('✅ Confirmation email sent successfully');
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError);
      // Don't throw - email failure shouldn't fail the webhook
    }

    console.log('✅ Payment intent succeeded handler completed');
  } catch (error) {
    console.error('❌ Error handling payment success:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// ❌ PAYMENT FAILED HANDLER
// ═══════════════════════════════════════════════════════════════
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('❌ Payment failed:', paymentIntent.id);

    const { customerEmail, customer_email, customerName, customer_name } = paymentIntent.metadata;
    const email = customerEmail || customer_email;
    const name = customerName || customer_name || 'Valued Customer';

    if (email) {
      console.log('📧 Sending payment failed email to:', email);

      // Send payment failed email
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@updates.nowiht.com',
          to: email,
          subject: 'Payment Failed - NOWIHT',
          html: `
            <div style="font-family: 'IBM Plex Mono', monospace; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="font-weight: 300; font-size: 24px; letter-spacing: 0.1em; margin-bottom: 24px;">PAYMENT FAILED</h1>
              <p style="margin-bottom: 16px;">Dear ${name},</p>
              <p style="margin-bottom: 16px;">Unfortunately, your payment could not be processed.</p>
              <p style="margin-bottom: 16px;">Please try again or use a different payment method.</p>
              <p style="margin-bottom: 32px;">If you continue to experience issues, please contact our support team at support@nowiht.com</p>
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
              <p style="color: #666; font-size: 12px; text-align: center;">NOWIHT - Luxury Lifestyle</p>
            </div>
          `,
        });

        console.log('✅ Payment failed email sent');
      } catch (emailError) {
        console.error('❌ Error sending payment failed email:', emailError);
      }
    }
  } catch (error) {
    console.error('❌ Error handling payment failure:', error);
  }
}

// ═══════════════════════════════════════════════════════════════
// 📧 EMAIL TEMPLATE GENERATOR
// ═══════════════════════════════════════════════════════════════
function generateOrderConfirmationEmail(data: {
  orderNumber: string;
  customerName: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  couponCode: string | null;
  freeShippingApplied: boolean;
  items: any[];
  shippingAddress: any;
}) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
        <div style="font-weight: 500;">${item.name}</div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">
          Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'IBM Plex Mono', monospace; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #000000; color: #ffffff; padding: 32px 20px; text-align: center;">
          <h1 style="margin: 0; font-weight: 300; font-size: 28px; letter-spacing: 0.15em;">NOWIHT</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 20px;">
          <!-- Thank You Message -->
          <h2 style="margin: 0 0 16px 0; font-weight: 300; font-size: 24px; letter-spacing: 0.1em;">ORDER CONFIRMED</h2>
          <p style="margin: 0 0 24px 0; color: #666;">Thank you for your purchase, ${data.customerName}.</p>

          <!-- Order Number -->
          <div style="background-color: #f9fafb; padding: 20px; margin-bottom: 32px; border-left: 4px solid #000000;">
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Order Number</div>
            <div style="font-size: 20px; font-weight: 500; letter-spacing: 0.05em;">${data.orderNumber}</div>
          </div>

          ${data.couponCode ? `
          <!-- Coupon Applied -->
          <div style="background-color: #dcfce7; border: 1px solid #86efac; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
            <div style="color: #166534; font-weight: 500; margin-bottom: 4px;">🎟️ Coupon Applied: ${data.couponCode}</div>
            <div style="color: #15803d; font-size: 14px;">
              ${data.discount > 0 ? `Discount: -$${data.discount.toFixed(2)}` : ''}
              ${data.freeShippingApplied ? ' | Free Shipping' : ''}
            </div>
          </div>
          ` : ''}

          <!-- Order Items -->
          <h3 style="margin: 0 0 16px 0; font-weight: 500; font-size: 16px; text-transform: uppercase; letter-spacing: 0.1em;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
            ${itemsHtml}
          </table>

          <!-- Order Summary -->
          <table style="width: 100%; margin-bottom: 32px;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Subtotal</td>
              <td style="padding: 8px 0; text-align: right;">$${data.subtotal.toFixed(2)}</td>
            </tr>
            ${data.discount > 0 ? `
            <tr>
              <td style="padding: 8px 0; color: #16a34a;">Discount</td>
              <td style="padding: 8px 0; text-align: right; color: #16a34a;">-$${data.discount.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; color: #666;">Shipping</td>
              <td style="padding: 8px 0; text-align: right;">
                ${data.shipping === 0 ? '<span style="color: #16a34a;">FREE</span>' : `$${data.shipping.toFixed(2)}`}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Tax</td>
              <td style="padding: 8px 0; text-align: right;">$${data.tax.toFixed(2)}</td>
            </tr>
            <tr style="border-top: 2px solid #000000;">
              <td style="padding: 16px 0 8px 0; font-weight: 600; font-size: 18px;">Total</td>
              <td style="padding: 16px 0 8px 0; text-align: right; font-weight: 600; font-size: 18px;">$${data.total.toFixed(2)}</td>
            </tr>
          </table>

          <!-- Shipping Address -->
          <div style="background-color: #f9fafb; padding: 20px; margin-bottom: 32px;">
            <h3 style="margin: 0 0 12px 0; font-weight: 500; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Shipping Address</h3>
            <div style="color: #666; line-height: 1.6;">
              ${data.shippingAddress.address}<br>
              ${data.shippingAddress.apartment ? `${data.shippingAddress.apartment}<br>` : ''}
              ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}<br>
              ${data.shippingAddress.country}
            </div>
          </div>

          <!-- What's Next -->
          <h3 style="margin: 0 0 16px 0; font-weight: 500; font-size: 16px; text-transform: uppercase; letter-spacing: 0.1em;">What's Next?</h3>
          <div style="color: #666; line-height: 1.8; margin-bottom: 32px;">
            1. We're preparing your order for shipment<br>
            2. Quality check - Every item is carefully inspected<br>
            3. You'll receive tracking information once shipped
          </div>

          <!-- Support -->
          <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Need help with your order?</p>
            <a href="mailto:support@nowiht.com" style="color: #000000; text-decoration: underline;">Contact Support</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #000000; color: #ffffff; padding: 24px 20px; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 12px; opacity: 0.8;">NOWIHT - Luxury Lifestyle</p>
          <p style="margin: 0; font-size: 11px; opacity: 0.6;">© ${new Date().getFullYear()} NOWIHT. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}