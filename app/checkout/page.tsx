// app/checkout/page.tsx
// ═══════════════════════════════════════════════════════════════
// 🛒 NOWIHT - CHECKOUT WITH STRIPE PAYMENT ELEMENT
// ✅ FIXED: Customer info in metadata + Processing state
// 🔥 FIX v2: Customer email/name now sent in metadata to webhook
// 🎟️ FIX v3: Coupon API integration with FREE100 & WELCOME20
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Truck, CreditCard, Check, AlertCircle, Lock, X } from 'lucide-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '@/store/cartStore';
import { shippingSchema, type ShippingFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CheckoutStep = 'shipping' | 'payment';

// ═══════════════════════════════════════════════════════════════
// 🌍 COUNTRY LIST (150+ countries with search)
// ═══════════════════════════════════════════════════════════════
const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Turkey', 'Germany', 'France',
  'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria',
  'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic',
  'Hungary', 'Romania', 'Greece', 'Portugal', 'Ireland', 'Australia',
  'New Zealand', 'Japan', 'South Korea', 'Singapore', 'Malaysia', 'Thailand',
  'Indonesia', 'Philippines', 'Vietnam', 'India', 'Pakistan', 'Bangladesh',
  'China', 'Hong Kong', 'Taiwan', 'United Arab Emirates', 'Saudi Arabia',
  'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Israel', 'Egypt', 'South Africa',
  'Nigeria', 'Kenya', 'Morocco', 'Tunisia', 'Algeria', 'Brazil', 'Argentina',
  'Chile', 'Colombia', 'Peru', 'Mexico', 'Venezuela', 'Ecuador', 'Uruguay',
  'Paraguay', 'Bolivia', 'Panama', 'Costa Rica', 'Guatemala', 'Honduras',
  'El Salvador', 'Nicaragua', 'Dominican Republic', 'Puerto Rico', 'Jamaica',
  'Trinidad and Tobago', 'Barbados', 'Bahamas', 'Cuba', 'Haiti', 'Russia',
  'Ukraine', 'Belarus', 'Kazakhstan', 'Georgia', 'Armenia', 'Azerbaijan',
  'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Mongolia',
  'Afghanistan', 'Iraq', 'Iran', 'Syria', 'Lebanon', 'Jordan', 'Yemen',
  'Libya', 'Sudan', 'Ethiopia', 'Ghana', 'Cameroon', 'Ivory Coast', 'Senegal',
  'Tanzania', 'Uganda', 'Zambia', 'Zimbabwe', 'Mozambique', 'Angola',
  'Botswana', 'Namibia', 'Madagascar', 'Mauritius', 'Seychelles', 'Maldives',
  'Sri Lanka', 'Nepal', 'Bhutan', 'Myanmar', 'Cambodia', 'Laos', 'Brunei',
  'Papua New Guinea', 'Fiji', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands',
  'New Caledonia', 'French Polynesia', 'Guam', 'Iceland', 'Luxembourg',
  'Malta', 'Cyprus', 'Slovenia', 'Croatia', 'Serbia', 'Bosnia', 'Montenegro',
  'Albania', 'North Macedonia', 'Bulgaria', 'Slovakia', 'Lithuania', 'Latvia',
  'Estonia', 'Moldova', 'Kosovo', 'Greenland', 'Faroe Islands', 'Gibraltar',
  'Jersey', 'Guernsey', 'Isle of Man', 'Andorra', 'Monaco', 'Liechtenstein',
  'San Marino', 'Vatican City', 'Palestine', 'Réunion', 'Mayotte', 'Martinique',
  'Guadeloupe', 'French Guiana', 'Suriname', 'Guyana', 'Belize', 'Aruba',
  'Curaçao', 'Sint Maarten', 'Caribbean Netherlands', 'Anguilla', 'Montserrat',
  'British Virgin Islands', 'Cayman Islands', 'Turks and Caicos', 'Bermuda'
].sort();

// ═══════════════════════════════════════════════════════════════
// 💳 STRIPE PAYMENT WRAPPER
// ✅ FIXED: Simplified flow - Success goes directly to success page
// ═══════════════════════════════════════════════════════════════
function StripePaymentForm({
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
  paymentIntentId,
}: {
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  paymentIntentId: string | null;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    if (!stripe || !elements) {
      onError('Payment system not ready. Please refresh the page.');
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // ✅ FIXED: Payment successful - pass intent ID to parent
        onSuccess(paymentIntent.id);
        // Note: isProcessing stays true until redirect completes
      } else {
        onError('Payment could not be processed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      onError('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stripe Payment Element */}
      <div className="bg-gray-50 p-6 border border-gray-200">
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                address: {
                  country: 'US',
                },
              },
            },
          }}
        />
      </div>

      {/* Pay Now Button */}
      <button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || !elements || isProcessing}
        className="w-full py-4 bg-black text-white font-medium tracking-wider hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>PROCESSING...</span>
          </>
        ) : (
          <>
            <span>PAY NOW</span>
            <CreditCard className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock className="w-4 h-4" />
        <span>Your payment is secure and encrypted</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎯 MAIN CHECKOUT COMPONENT
// ✅ FIXED: Simplified flow (Shipping → Payment → Success)
// 🔥 FIX v2: Customer info sent in metadata
// 🎟️ FIX v3: Coupon API integration
// ═══════════════════════════════════════════════════════════════
export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartSubtotal, clearCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');

  // ✅ NEW: Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: string;
    value: number;
    discount: number;
    freeShipping: boolean;
    description?: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // React Hook Form for Shipping
  const {
    register: registerShipping,
    handleSubmit: handleSubmitShipping,
    formState: { errors: shippingErrors },
    getValues: getShippingValues,
    setValue: setShippingValue,
    watch: watchShipping,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      country: 'United States',
      state: '',
      zipCode: '',
      phone: '',
    },
  });

  const selectedCountry = watchShipping('country');

  // ✅ UPDATED: Pricing calculations with coupon support (in cents for Stripe)
  const subtotalDollars = getCartSubtotal();
  const subtotal = Math.round(subtotalDollars * 100); // Convert to cents

  // ✅ NEW: Apply free shipping if coupon provides it
  const baseShippingCost = shippingMethod === 'express' ? 1500 : subtotalDollars > 100 ? 0 : 1000;
  const shippingCost = appliedCoupon?.freeShipping ? 0 : baseShippingCost;

  const discountCents = appliedCoupon?.discount ? Math.round(appliedCoupon.discount * 100) : 0;
  const tax = Math.round((subtotal - discountCents) * 0.08); // 8% tax on discounted amount
  const total = subtotal + shippingCost + tax - discountCents;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect to cart if on shipping step and cart is empty
    // Don't redirect during payment processing or after clearCart() is called
    if (mounted && items.length === 0 && currentStep === 'shipping') {
      router.push('/cart');
    }
  }, [mounted, items.length, currentStep, router]);

  // ✅ NEW: Apply Coupon Handler with API validation
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          subtotal: subtotalDollars,
          userId: null, // Add user ID if logged in
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
        return;
      }

      // ✅ Success!
      setAppliedCoupon(data.coupon);
      alert(`Coupon "${data.coupon.code}" applied successfully!`);
      console.log('✅ Coupon applied:', data.coupon);
    } catch (error) {
      console.error('Error applying coupon:', error);
      alert('Failed to apply coupon. Please try again.');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  // ✅ NEW: Remove Coupon Handler
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    console.log('🗑️ Coupon removed');
  };

  // ═══════════════════════════════════════════════════════════════
  // 📦 STEP 1: SHIPPING SUBMIT
  // 🔥 FIX v2: Customer info sent in metadata object
  // ═══════════════════════════════════════════════════════════════
  const onShippingSubmit = async (data: ShippingFormData) => {
    console.log('✅ Shipping validated:', data);
    setError(null);
    setIsProcessing(true);

    try {
      // 🔥 NEW: Build metadata object with customer info
      const metadata = {
        customer_email: data.email,
        customer_name: `${data.firstName} ${data.lastName}`,
        customer_phone: data.phone,
        shipping_address: data.address,
        shipping_apartment: data.apartment || '',
        shipping_city: data.city,
        shipping_state: data.state,
        shipping_zip: data.zipCode,
        shipping_country: data.country,
        shipping_method: shippingMethod,
        // ✅ NEW: Add coupon to metadata
        coupon_code: appliedCoupon?.code || '',
      };

      console.log('📦 Creating payment intent with metadata:', metadata);

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          metadata, // ✅ Send customer info in metadata
        }),
      });

      const result = await response.json();

      if (!result.clientSecret) {
        throw new Error(result.error || 'Failed to create payment intent');
      }

      console.log('✅ Payment intent created:', result.paymentIntentId);
      setClientSecret(result.clientSecret);
      setPaymentIntentId(result.paymentIntentId);
      setCurrentStep('payment');
    } catch (err: any) {
      console.error('❌ Error creating payment intent:', err);
      setError(err.message || 'Failed to process checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 💳 STEP 2: PAYMENT SUCCESS
  // ✅ FIXED: Redirect to success page with payment intent ID
  // ═══════════════════════════════════════════════════════════════
  const handlePaymentSuccess = (successPaymentIntentId: string) => {
    console.log('✅ Payment successful, redirecting to success page...');
    console.log('📝 Payment Intent ID:', successPaymentIntentId);

    // Clear cart before redirect (important!)
    clearCart();

    // Redirect to success page with payment intent ID
    router.push(`/checkout/success?payment_intent=${successPaymentIntentId}`);
  };

  const handlePaymentError = (errorMessage: string) => {
    console.error('❌ Payment error:', errorMessage);
    setError(errorMessage);
  };

  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-wide mb-2">CHECKOUT</h1>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  currentStep === 'shipping'
                    ? 'bg-black text-white'
                    : 'bg-green-500 text-white'
                )}
              >
                {currentStep === 'payment' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Truck className="w-4 h-4" />
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  currentStep === 'shipping' ? 'text-black' : 'text-green-600'
                )}
              >
                Shipping
              </span>
            </div>

            <div className="w-24 h-px bg-gray-300" />

            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  currentStep === 'payment'
                    ? 'bg-black text-white'
                    : 'bg-gray-300 text-gray-600'
                )}
              >
                <CreditCard className="w-4 h-4" />
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  currentStep === 'payment' ? 'text-black' : 'text-gray-600'
                )}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            {/* STEP 1: SHIPPING */}
            {currentStep === 'shipping' && (
              <form
                onSubmit={handleSubmitShipping(onShippingSubmit)}
                className="space-y-8"
              >
                {/* Contact Information */}
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-6 tracking-wide">
                    CONTACT INFORMATION
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        {...registerShipping('email')}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                        placeholder="you@example.com"
                      />
                      {shippingErrors.email && (
                        <p className="text-red-600 text-xs mt-1">
                          {shippingErrors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-6 tracking-wide">
                    SHIPPING ADDRESS
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First name
                        </label>
                        <input
                          type="text"
                          {...registerShipping('firstName')}
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                        />
                        {shippingErrors.firstName && (
                          <p className="text-red-600 text-xs mt-1">
                            {shippingErrors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last name
                        </label>
                        <input
                          type="text"
                          {...registerShipping('lastName')}
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                        />
                        {shippingErrors.lastName && (
                          <p className="text-red-600 text-xs mt-1">
                            {shippingErrors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        {...registerShipping('address')}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Street address"
                      />
                      {shippingErrors.address && (
                        <p className="text-red-600 text-xs mt-1">
                          {shippingErrors.address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        {...registerShipping('apartment')}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          {...registerShipping('city')}
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                        />
                        {shippingErrors.city && (
                          <p className="text-red-600 text-xs mt-1">
                            {shippingErrors.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          {...registerShipping('state')}
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                        />
                        {shippingErrors.state && (
                          <p className="text-red-600 text-xs mt-1">
                            {shippingErrors.state.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP/Postal Code
                        </label>
                        <input
                          type="text"
                          {...registerShipping('zipCode')}
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                        />
                        {shippingErrors.zipCode && (
                          <p className="text-red-600 text-xs mt-1">
                            {shippingErrors.zipCode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={countrySearch || selectedCountry}
                        onChange={(e) => {
                          setCountrySearch(e.target.value);
                          setShowCountryDropdown(true);
                        }}
                        onFocus={() => setShowCountryDropdown(true)}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Search countries..."
                      />

                      {showCountryDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 max-h-60 overflow-y-auto shadow-lg">
                          {filteredCountries.map((country) => (
                            <button
                              key={country}
                              type="button"
                              onClick={() => {
                                setShippingValue('country', country);
                                setCountrySearch('');
                                setShowCountryDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm"
                            >
                              {country}
                            </button>
                          ))}
                        </div>
                      )}
                      {shippingErrors.country && (
                        <p className="text-red-600 text-xs mt-1">
                          {shippingErrors.country.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...registerShipping('phone')}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                        placeholder="+1 (555) 123-4567"
                      />
                      {shippingErrors.phone && (
                        <p className="text-red-600 text-xs mt-1">
                          {shippingErrors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-6 tracking-wide">
                    SHIPPING METHOD
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border-2 border-black cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value="standard"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-medium text-sm">Standard Shipping</p>
                          <p className="text-xs text-gray-600">5-7 business days</p>
                        </div>
                      </div>
                      <p className="font-medium text-sm">
                        {subtotalDollars >= 100 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          '$10.00'
                        )}
                      </p>
                    </label>

                    <label className="flex items-center justify-between p-4 border-2 border-gray-300 cursor-pointer hover:border-black transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value="express"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-medium text-sm">Express Shipping</p>
                          <p className="text-xs text-gray-600">2-3 business days</p>
                        </div>
                      </div>
                      <p className="font-medium text-sm">$15.00</p>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-black text-white font-medium tracking-wider hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'PROCESSING...' : 'CONTINUE TO PAYMENT'}
                </button>
              </form>
            )}

            {/* STEP 2: PAYMENT (STRIPE) */}
            {currentStep === 'payment' && clientSecret && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-6 tracking-wide">PAYMENT METHOD</h3>
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#000000',
                          colorBackground: '#ffffff',
                          colorText: '#000000',
                          colorDanger: '#dc2626',
                          fontFamily: '"IBM Plex Mono", monospace',
                          borderRadius: '0px',
                        },
                      },
                    }}
                  >
                    <StripePaymentForm
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                      paymentIntentId={paymentIntentId}
                    />
                  </Elements>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep('shipping')}
                  disabled={isProcessing}
                  className="w-full py-3 border-2 border-black text-black font-medium tracking-wider hover:bg-black hover:text-white transition-all disabled:opacity-50"
                >
                  BACK TO SHIPPING
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-light tracking-wide mb-6">ORDER SUMMARY</h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium mb-1">{item.product.name}</p>
                      <p className="text-gray-600 text-xs">
                        {item.size} / {item.color}
                      </p>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ UPDATED: Coupon Code Section with Applied State */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon code
                </label>

                {appliedCoupon ? (
                  // Show applied coupon with remove button
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div>
                        <span className="text-sm font-medium text-green-700">
                          {appliedCoupon.code}
                        </span>
                        {appliedCoupon.freeShipping && (
                          <span className="ml-2 text-xs text-green-600">(Free Shipping)</span>
                        )}
                        {appliedCoupon.discount > 0 && (
                          <span className="ml-2 text-xs text-green-600">
                            (-${appliedCoupon.discount.toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  // Show coupon input
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm uppercase"
                        disabled={couponLoading}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-6 py-2 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {couponLoading ? '...' : 'APPLY'}
                      </button>
                    </div>
                    {/* Hint */}
                    <p className="text-xs text-gray-500 mt-2">
                      Try: <strong>FREE100</strong> (free shipping) or <strong>WELCOME20</strong> (20% off $50+)
                    </p>
                  </>
                )}
              </div>

              {/* ✅ UPDATED: Totals with Coupon Support */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
                </div>

                {/* ✅ NEW: Show discount if applied */}
                {appliedCoupon && appliedCoupon.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="font-medium text-green-600">
                      FREE{appliedCoupon?.freeShipping ? ' (Coupon)' : ''}
                    </span>
                  ) : (
                    <span className="font-medium">${(shippingCost / 100).toFixed(2)}</span>
                  )}
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${(tax / 100).toFixed(2)}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-gray-200 text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${(total / 100).toFixed(2)}</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="text-xs text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <span>Free shipping over $100</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <span>Secure checkout via Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <span>30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}