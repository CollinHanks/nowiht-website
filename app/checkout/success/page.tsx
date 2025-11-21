// app/checkout/success/page.tsx
// ✅ FIXED: Cart import hatası çözüldü
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!paymentIntentId) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Retrieve payment intent to get order number from metadata
        const response = await fetch(`/api/payment-intent/${paymentIntentId}`);
        const data = await response.json();

        if (data.orderNumber) {
          setOrderNumber(data.orderNumber);
        }
      } catch (error) {
        console.error('Error fetching payment intent:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();

    // Clear cart in localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart-storage');
    }
  }, [paymentIntentId]);

  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Success Icon */}
        <div className="mb-12 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center bg-black">
            <Check className="h-12 w-12 text-white" strokeWidth={1} />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-center font-mono text-4xl font-light tracking-wider">
          Order Confirmed
        </h1>
        <p className="mb-12 text-center font-mono text-gray-600">
          Thank you for your purchase from NOWIHT
        </p>

        {/* Order Details */}
        <div className="mb-16 bg-gray-50 p-8">
          <div className="mb-4 text-center font-mono text-xs uppercase tracking-wider text-gray-500">
            Order Number
          </div>
          {loading ? (
            <div className="text-center font-mono text-2xl font-light tracking-wider">
              Loading...
            </div>
          ) : (
            <div className="text-center font-mono text-2xl font-light tracking-wider">
              {orderNumber || 'Processing...'}
            </div>
          )}
          <p className="mt-6 text-center font-mono text-sm text-gray-600">
            A confirmation email has been sent to your email address. You'll receive another email
            when your order ships.
          </p>
        </div>

        {/* What happens next */}
        <div className="mb-16">
          <h2 className="mb-8 text-center font-mono text-xl font-light tracking-wider">
            What happens next?
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center bg-black font-mono text-xl text-white">
                01
              </div>
              <h3 className="mb-2 font-mono text-sm font-medium tracking-wider">
                Order Processing
              </h3>
              <p className="font-mono text-xs text-gray-600">
                We're preparing your order for shipment
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center bg-black font-mono text-xl text-white">
                02
              </div>
              <h3 className="mb-2 font-mono text-sm font-medium tracking-wider">
                Quality Check
              </h3>
              <p className="font-mono text-xs text-gray-600">
                Every item is carefully inspected
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center bg-black font-mono text-xl text-white">
                03
              </div>
              <h3 className="mb-2 font-mono text-sm font-medium tracking-wider">
                On Its Way
              </h3>
              <p className="font-mono text-xs text-gray-600">
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
            className="group inline-flex items-center gap-2 border border-black px-8 py-4 font-mono text-sm uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white"
          >
            View Order
            <ArrowRight
              className="transition-transform group-hover:translate-x-1"
              size={16}
            />
          </Link>
        </div>

        {/* Support */}
        <div className="mt-16 text-center">
          <p className="mb-2 font-mono text-sm text-gray-600">
            Need help with your order?
          </p>
          <Link
            href="/contact"
            className="font-mono text-sm underline hover:no-underline"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}