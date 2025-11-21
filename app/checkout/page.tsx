// app/checkout/page.tsx
// ═══════════════════════════════════════════════════════════════
// 🛒 NOWIHT - CHECKOUT WITH STRIPE PAYMENT ELEMENT
// Luxury design + Secure Stripe integration
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Truck, CreditCard, Check, AlertCircle, Lock } from 'lucide-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '@/store/cartStore';
import { shippingSchema, type ShippingFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CheckoutStep = 'shipping' | 'payment' | 'review';

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
// ═══════════════════════════════════════════════════════════════
function StripePaymentForm({
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
  total,
}: {
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  total: number;
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
        onSuccess();
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

      {/* Continue Button */}
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
            <span>CONTINUE TO REVIEW</span>
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
// ═══════════════════════════════════════════════════════════════
export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartSubtotal, clearCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
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

  // Pricing calculations (in cents for Stripe)
  const subtotalDollars = getCartSubtotal();
  const subtotal = Math.round(subtotalDollars * 100); // Convert to cents
  const shippingCost = shippingMethod === 'express' ? 1500 : subtotalDollars > 100 ? 0 : 1000;
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const discountCents = Math.round(discount * 100);
  const total = subtotal + shippingCost + tax - discountCents;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart');
    }
  }, [mounted, items.length, router]);

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'nowiht10') {
      setDiscount(subtotalDollars * 0.1);
      alert('Coupon applied! 10% discount');
    } else {
      alert('Invalid coupon code. Try: NOWIHT10');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 📦 STEP 1: SHIPPING SUBMIT
  // ═══════════════════════════════════════════════════════════════
  const onShippingSubmit = async (data: ShippingFormData) => {
    console.log('✅ Shipping validated:', data);
    setError(null);
    setIsProcessing(true);

    try {
      // Create PaymentIntent
      const response = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          customerEmail: data.email,
          customerName: `${data.firstName} ${data.lastName}`,
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const paymentData = await response.json();
      setClientSecret(paymentData.clientSecret);
      setPaymentIntentId(paymentData.paymentIntentId);
      setCurrentStep('payment');
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 💳 STEP 2: PAYMENT SUCCESS
  // ═══════════════════════════════════════════════════════════════
  const handlePaymentSuccess = () => {
    console.log('✅ Payment succeeded, moving to review');
    setCurrentStep('review');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setIsProcessing(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // 🚀 STEP 3: PLACE ORDER (Final Confirmation)
  // ═══════════════════════════════════════════════════════════════
  const handlePlaceOrder = () => {
    // Clear cart and redirect to success
    clearCart();
    router.push(`/checkout/success?payment_intent=${paymentIntentId}`);
  };

  // Filter countries for search
  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  if (!mounted || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-2">CHECKOUT</h1>
          <p className="text-sm text-gray-600">Complete your order in 3 simple steps</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl">
            {[
              { step: 'shipping', label: 'Shipping', icon: Truck },
              { step: 'payment', label: 'Payment', icon: CreditCard },
              { step: 'review', label: 'Review', icon: Check },
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all',
                      currentStep === step
                        ? 'bg-black text-white'
                        : ['shipping', 'payment'].indexOf(currentStep) > index
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium tracking-wider uppercase',
                      currentStep === step ? 'text-black' : 'text-gray-500'
                    )}
                  >
                    {label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={cn(
                      'h-[2px] flex-1 mx-2',
                      ['shipping', 'payment'].indexOf(currentStep) > index ? 'bg-green-600' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">Payment Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            {/* STEP 1: SHIPPING */}
            {currentStep === 'shipping' && (
              <form onSubmit={handleSubmitShipping(onShippingSubmit)} className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-6 tracking-wide">CONTACT INFORMATION</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...registerShipping('email')}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                        placeholder="your.email@example.com"
                      />
                      {shippingErrors.email && (
                        <p className="text-xs text-red-600 mt-1">{shippingErrors.email.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-6 tracking-wide">SHIPPING ADDRESS</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          {...registerShipping('firstName')}
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                          placeholder="John"
                        />
                        {shippingErrors.firstName && (
                          <p className="text-xs text-red-600 mt-1">{shippingErrors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          {...registerShipping('lastName')}
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                          placeholder="Doe"
                        />
                        {shippingErrors.lastName && (
                          <p className="text-xs text-red-600 mt-1">{shippingErrors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        {...registerShipping('address')}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                        placeholder="123 Main Street"
                      />
                      {shippingErrors.address && (
                        <p className="text-xs text-red-600 mt-1">{shippingErrors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        {...registerShipping('apartment')}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          {...registerShipping('city')}
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                          placeholder="New York"
                        />
                        {shippingErrors.city && (
                          <p className="text-xs text-red-600 mt-1">{shippingErrors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          {...registerShipping('state')}
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                          placeholder="NY"
                        />
                        {shippingErrors.state && (
                          <p className="text-xs text-red-600 mt-1">{shippingErrors.state.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          {...registerShipping('zipCode')}
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                          placeholder="10001"
                        />
                        {shippingErrors.zipCode && (
                          <p className="text-xs text-red-600 mt-1">{shippingErrors.zipCode.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={countrySearch || selectedCountry}
                        onChange={(e) => {
                          setCountrySearch(e.target.value);
                          setShowCountryDropdown(true);
                        }}
                        onFocus={() => setShowCountryDropdown(true)}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                        placeholder="Search country..."
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
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            >
                              {country}
                            </button>
                          ))}
                        </div>
                      )}
                      {shippingErrors.country && (
                        <p className="text-xs text-red-600 mt-1">{shippingErrors.country.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        {...registerShipping('phone')}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                      {shippingErrors.phone && (
                        <p className="text-xs text-red-600 mt-1">{shippingErrors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-6 tracking-wide">SHIPPING METHOD</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border-2 border-gray-300 cursor-pointer hover:border-black transition-colors">
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
                        {subtotalDollars > 100 ? (
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
                      total={total}
                    />
                  </Elements>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep('shipping')}
                  className="w-full py-3 border-2 border-black text-black font-medium tracking-wider hover:bg-black hover:text-white transition-all"
                >
                  BACK TO SHIPPING
                </button>
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                {/* Shipping Address Review */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg tracking-wide">SHIPPING ADDRESS</h3>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-sm text-gray-600 hover:text-black underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-medium">
                      {getShippingValues('firstName')} {getShippingValues('lastName')}
                    </p>
                    <p>{getShippingValues('address')}</p>
                    {getShippingValues('apartment') && <p>{getShippingValues('apartment')}</p>}
                    <p>
                      {getShippingValues('city')}, {getShippingValues('state')}{' '}
                      {getShippingValues('zipCode')}
                    </p>
                    <p>{getShippingValues('country')}</p>
                    <p className="pt-2">{getShippingValues('phone')}</p>
                    <p>{getShippingValues('email')}</p>
                  </div>
                </div>

                {/* Shipping Method Review */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg tracking-wide">SHIPPING METHOD</h3>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-sm text-gray-600 hover:text-black underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">
                    {shippingMethod === 'standard'
                      ? 'Standard Shipping (5-7 business days)'
                      : 'Express Shipping (2-3 business days)'}
                  </p>
                </div>

                {/* Payment Method Review */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg tracking-wide">PAYMENT METHOD</h3>
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="text-sm text-gray-600 hover:text-black underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Lock className="w-4 h-4" />
                    <span>Secure payment via Stripe</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('payment')}
                    className="flex-1 py-4 border-2 border-black text-black font-medium tracking-wider hover:bg-black hover:text-white transition-all"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-black text-white font-medium tracking-wider hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'PROCESSING...' : 'PLACE ORDER'}
                  </button>
                </div>
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

              {/* Coupon Code */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-6 py-2 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${(shippingCost / 100).toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${(tax / 100).toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
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