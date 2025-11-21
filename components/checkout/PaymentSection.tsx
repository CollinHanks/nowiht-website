// components/checkout/PaymentSection.tsx
"use client";

import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ArrowRight } from "lucide-react";

interface PaymentSectionProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export default function PaymentSection({
  amount,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
}: PaymentSectionProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(error.message || "Payment failed");
        onError(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError("An unexpected error occurred");
      onError("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-sm font-medium tracking-wide uppercase mb-4">
          Payment Details
        </h3>
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                address: {
                  country: "US",
                },
              },
            },
            terms: {
              card: "never",
            },
          }}
        />
      </div>

      {/* Error Message */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{paymentError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-black text-white py-4 px-8 flex items-center justify-center gap-3 hover:bg-red-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm tracking-wider font-medium">
              PROCESSING...
            </span>
          </>
        ) : (
          <>
            <span className="text-sm tracking-wider font-medium">
              PAY ${(amount / 100).toFixed(2)}
            </span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      {/* Security Note */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Your payment information is secure and encrypted
        </p>
      </div>
    </form>
  );
}