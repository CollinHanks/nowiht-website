// app/checkout/success/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  const [isLoading, setIsLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string>("");

  useEffect(() => {
    if (!paymentIntentId) {
      router.push("/");
      return;
    }

    // Simulate order number generation
    // In production, fetch from your database
    setOrderNumber(`NOW-${Date.now().toString().slice(-8)}`);
    setIsLoading(false);
  }, [paymentIntentId, router]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-black flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide mb-4">
            Order Confirmed
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8">
            Thank you for your purchase from NOWIHT
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 border border-gray-200 p-6 md:p-8 mb-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Order Number
                </p>
                <p className="text-xl font-medium">{orderNumber}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to your email address.
                  You'll receive another email when your order ships.
                </p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-12">
            <h2 className="text-lg font-medium tracking-wide mb-4">
              What happens next?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-3 text-sm font-medium">
                  01
                </div>
                <h3 className="text-sm font-medium mb-2">Order Processing</h3>
                <p className="text-xs text-gray-600">
                  We're preparing your order for shipment
                </p>
              </div>

              <div>
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-3 text-sm font-medium">
                  02
                </div>
                <h3 className="text-sm font-medium mb-2">Quality Check</h3>
                <p className="text-xs text-gray-600">
                  Every item is carefully inspected
                </p>
              </div>

              <div>
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-3 text-sm font-medium">
                  03
                </div>
                <h3 className="text-sm font-medium mb-2">On Its Way</h3>
                <p className="text-xs text-gray-600">
                  You'll receive tracking information
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white hover:bg-red-600 transition-colors group"
            >
              <span className="text-sm tracking-wider font-medium">
                CONTINUE SHOPPING
              </span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors group"
            >
              <span className="text-sm tracking-wider font-medium">
                VIEW ORDER
              </span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Support */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Need help with your order?
            </p>
            <Link
              href="/contact"
              className="text-sm font-medium underline underline-offset-4 hover:text-red-600 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </main>
          <Footer />
        </>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}