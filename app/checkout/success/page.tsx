// app/checkout/success/page.tsx
// ═══════════════════════════════════════════════════════════════
// 🎉 NOWIHT - CHECKOUT SUCCESS PAGE
// ✅ FIXED: Cart import hatası çözüldü
// 🚀 FIX v4: Kupon bilgileri ve pricing breakdown gösterimi
// ═══════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowRight, Package, Truck, Shield } from 'lucide-react';

interface OrderDetails {
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  couponCode: string | null;
  freeShipping: boolean;
  customerEmail: string;
  customerName: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!paymentIntentId) {
        setError('No payment information found');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching payment intent:', paymentIntentId);

        // ✅ Retrieve payment intent with metadata
        const response = await fetch(`/api/payment-intent/${paymentIntentId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch payment intent');
        }

        const data = await response.json();
        console.log('✅ Payment intent data received:', data);

        // 🚀 Parse metadata from payment intent
        const metadata = data.metadata || {};

        const details: OrderDetails = {
          orderNumber: metadata.orderNumber || data.orderNumber || 'Processing...',
          total: data.amount / 100, // Convert from cents
          subtotal: parseInt(metadata.subtotal_cents || '0') / 100,
          shipping: parseInt(metadata.shipping_cost_cents || '0') / 100,
          tax: parseInt(metadata.tax_cents || '0') / 100,
          discount: parseInt(metadata.discount_cents || '0') / 100,
          couponCode: metadata.coupon_code || null,
          freeShipping: metadata.coupon_free_shipping === 'true',
          customerEmail: metadata.customer_email || metadata.customerEmail || '',
          customerName: metadata.customer_name || metadata.customerName || 'Valued Customer',
        };

        console.log('📦 Order details parsed:', details);
        setOrderDetails(details);
      } catch (error) {
        console.error('❌ Error fetching payment intent:', error);
        setError('Unable to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();

    // Clear cart in localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart-storage');
      console.log('🗑️ Cart cleared from localStorage');
    }
  }, [paymentIntentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-white py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center bg-red-100">
              <span className="text-4xl">⚠️</span>
            </div>
          </div>
          <h1 className="mb-4 font-mono text-3xl font-light tracking-wider">
            Unable to Load Order
          </h1>
          <p className="mb-8 font-mono text-gray-600">
            {error || 'Something went wrong. Please contact support.'}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-black px-8 py-4 font-mono text-sm uppercase tracking-wider text-white transition-all hover:bg-gray-900"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Success Icon */}
        <div className="mb-12 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center bg-black">
            <Check className="h-12 w-12 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-center font-mono text-4xl font-light tracking-wider">
          Order Confirmed
        </h1>
        <p className="mb-12 text-center font-mono text-gray-600">
          Thank you for your purchase, {orderDetails.customerName}
        </p>

        {/* Order Details Card */}
        <div className="mb-12 bg-gray-50 border border-gray-200 p-8">
          {/* Order Number */}
          <div className="mb-6 text-center">
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-gray-500">
              Order Number
            </div>
            <div className="font-mono text-2xl font-light tracking-wider">
              {orderDetails.orderNumber}
            </div>
          </div>

          {/* Coupon Applied Badge */}
          {orderDetails.couponCode && (
            <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="font-mono text-sm font-medium text-green-800">
                  Coupon "{orderDetails.couponCode}" Applied
                </span>
              </div>
              <div className="mt-2 text-center">
                {orderDetails.discount > 0 && (
                  <span className="font-mono text-xs text-green-700">
                    You saved ${orderDetails.discount.toFixed(2)}
                  </span>
                )}
                {orderDetails.freeShipping && (
                  <span className="font-mono text-xs text-green-700">
                    {orderDetails.discount > 0 ? ' + ' : ''}Free Shipping
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-4 font-mono text-sm font-medium uppercase tracking-wider text-gray-700">
              Order Summary
            </h3>

            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${orderDetails.subtotal.toFixed(2)}</span>
              </div>

              {orderDetails.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${orderDetails.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                {orderDetails.shipping === 0 ? (
                  <span className="text-green-600 font-medium">
                    FREE
                  </span>
                ) : (
                  <span>${orderDetails.shipping.toFixed(2)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${orderDetails.tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-gray-300 pt-3 text-base font-semibold">
                <span>Total</span>
                <span>${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Email Notice */}
          <div className="mt-6 border-t border-gray-200 pt-6 text-center">
            <p className="font-mono text-sm text-gray-600">
              A confirmation email has been sent to{' '}
              <span className="font-medium text-gray-900">{orderDetails.customerEmail}</span>
            </p>
            <p className="mt-2 font-mono text-xs text-gray-500">
              You'll receive another email with tracking information when your order ships
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="mb-16">
          <h2 className="mb-8 text-center font-mono text-xl font-light tracking-wider">
            What Happens Next?
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center bg-black">
                <Package className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-gray-500">
                Step 01
              </div>
              <h3 className="mb-2 font-mono text-sm font-medium tracking-wider">
                Order Processing
              </h3>
              <p className="font-mono text-xs text-gray-600 leading-relaxed">
                We're preparing your order for shipment
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center bg-black">
                <Shield className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-gray-500">
                Step 02
              </div>
              <h3 className="mb-2 font-mono text-sm font-medium tracking-wider">
                Quality Check
              </h3>
              <p className="font-mono text-xs text-gray-600 leading-relaxed">
                Every item is carefully inspected
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center bg-black">
                <Truck className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-gray-500">
                Step 03
              </div>
              <h3 className="mb-2 font-mono text-sm font-medium tracking-wider">
                On Its Way
              </h3>
              <p className="font-mono text-xs text-gray-600 leading-relaxed">
                You'll receive tracking information
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 bg-black px-8 py-4 font-mono text-sm uppercase tracking-wider text-white transition-all hover:bg-gray-900"
          >
            Continue Shopping
            <ArrowRight
              className="transition-transform group-hover:translate-x-1"
              size={16}
            />
          </Link>
          <Link
            href="/account"
            className="group inline-flex items-center gap-2 border-2 border-black px-8 py-4 font-mono text-sm uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white"
          >
            View Orders
            <ArrowRight
              className="transition-transform group-hover:translate-x-1"
              size={16}
            />
          </Link>
        </div>

        {/* Support Section */}
        <div className="mt-16 border-t border-gray-200 pt-8 text-center">
          <p className="mb-2 font-mono text-sm text-gray-600">
            Need help with your order?
          </p>
          <Link
            href="/contact"
            className="font-mono text-sm font-medium underline hover:no-underline"
          >
            Contact Support
          </Link>
        </div>

        {/* Delivery Information */}
        <div className="mt-8 bg-gray-50 border border-gray-200 p-6">
          <h3 className="mb-4 font-mono text-sm font-medium uppercase tracking-wider">
            Delivery Information
          </h3>
          <div className="space-y-3 font-mono text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-black rounded-full mt-2" />
              <span>Standard Shipping: 5-7 business days</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-black rounded-full mt-2" />
              <span>Express Shipping: 2-3 business days</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-black rounded-full mt-2" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-black rounded-full mt-2" />
              <span>30-day returns on all items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}