// app/checkout/page.tsx
// ═══════════════════════════════════════════════════════════════
// 🛒 NOWIHT - ULTRA-FIXED CHECKOUT PAGE
// Phase 10: Auto-format expiry + Country search + Cart price fix
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Truck, CreditCard, Check, AlertCircle, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { shippingSchema, paymentSchema, type ShippingFormData, type PaymentFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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

  // React Hook Form for Payment
  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    formState: { errors: paymentErrors },
    getValues: getPaymentValues,
    watch: watchPayment,
    setValue: setPaymentValue,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'credit-card',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const paymentMethod = watchPayment('method');
  const selectedCountry = watchShipping('country');

  // ═══════════════════════════════════════════════════════════════
  // 💳 AUTO-FORMAT EXPIRY DATE (MM/YY)
  // ═══════════════════════════════════════════════════════════════
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    setPaymentValue('expiryDate', value.slice(0, 5)); // Max MM/YY
  };

  // Pricing calculations
  const subtotal = getCartSubtotal();
  const shippingCost = shippingMethod === 'express' ? 15 : subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax - discount;

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
      setDiscount(subtotal * 0.1);
      alert('Coupon applied! 10% discount');
    } else {
      alert('Invalid coupon code. Try: NOWIHT10');
    }
  };

  const onShippingSubmit = (data: ShippingFormData) => {
    console.log('✅ Shipping validated:', data);
    setCurrentStep('payment');
  };

  const onPaymentSubmit = (data: PaymentFormData) => {
    console.log('✅ Payment validated:', data);
    setCurrentStep('review');
  };

  // ═══════════════════════════════════════════════════════════════
  // 🚀 PLACE ORDER - Cart prices (NO Supabase fetch)
  // ═══════════════════════════════════════════════════════════════
  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const shippingData = getShippingValues();
      const paymentData = getPaymentValues();

      // ✅ FIX: Include price, productName, productImage from cart
      const orderRequest = {
        customerEmail: shippingData.email,
        customerName: `${shippingData.firstName} ${shippingData.lastName}`,
        customerPhone: shippingData.phone,
        shippingAddress: {
          address: shippingData.address,
          apartment: shippingData.apartment || undefined,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: shippingData.country,
        },
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          productSku: item.product.sku || '',
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.product.price, // ✅ From cart
        })),
        paymentMethod: paymentData.method,
        notes: undefined,
        shippingMethod: shippingMethod,
        discount: discount,
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderRequest),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      console.log('✅ Order created successfully:', data.order);

      clearCart();

      alert(`Order placed successfully! Order number: ${data.order.orderNumber}\n\nCheck your email for confirmation.`);

      router.push('/account/orders');

    } catch (error) {
      console.error('❌ Order creation failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🌍 COUNTRY SEARCH FILTER
  // ═══════════════════════════════════════════════════════════════
  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  if (!mounted) return null;
  if (items.length === 0) return null;

  const steps = [
    { id: 'shipping' as CheckoutStep, label: 'Shipping', icon: Truck },
    { id: 'payment' as CheckoutStep, label: 'Payment', icon: CreditCard },
    { id: 'review' as CheckoutStep, label: 'Review', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Steps */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all',
                      currentStep === step.id
                        ? 'border-black bg-black text-white'
                        : steps.indexOf(steps.find((s) => s.id === currentStep)!) > index
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-400'
                    )}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      'text-xs uppercase tracking-wider',
                      currentStep === step.id ? 'text-black font-medium' : 'text-gray-500'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-gray-200 mx-2 md:mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              {/* Shipping Form */}
              {currentStep === 'shipping' && (
                <form onSubmit={handleSubmitShipping(onShippingSubmit)} className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6">
                    Shipping Information
                  </h2>

                  {/* Email */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                      Email Address *
                    </label>
                    <input
                      {...registerShipping('email')}
                      type="email"
                      className={cn(
                        'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                        shippingErrors.email ? 'border-red-500' : 'border-gray-300 focus:border-black'
                      )}
                      placeholder="your@email.com"
                    />
                    {shippingErrors.email && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {shippingErrors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                        First Name *
                      </label>
                      <input
                        {...registerShipping('firstName')}
                        type="text"
                        className={cn(
                          'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                          shippingErrors.firstName ? 'border-red-500' : 'border-gray-300 focus:border-black'
                        )}
                      />
                      {shippingErrors.firstName && (
                        <p className="mt-1 text-xs text-red-600">{shippingErrors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                        Last Name *
                      </label>
                      <input
                        {...registerShipping('lastName')}
                        type="text"
                        className={cn(
                          'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                          shippingErrors.lastName ? 'border-red-500' : 'border-gray-300 focus:border-black'
                        )}
                      />
                      {shippingErrors.lastName && (
                        <p className="mt-1 text-xs text-red-600">{shippingErrors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                      Street Address *
                    </label>
                    <input
                      {...registerShipping('address')}
                      type="text"
                      className={cn(
                        'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                        shippingErrors.address ? 'border-red-500' : 'border-gray-300 focus:border-black'
                      )}
                      placeholder="123 Main Street"
                    />
                    {shippingErrors.address && (
                      <p className="mt-1 text-xs text-red-600">{shippingErrors.address.message}</p>
                    )}
                  </div>

                  {/* Apartment */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                      Apartment, Suite, etc.
                    </label>
                    <input
                      {...registerShipping('apartment')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm transition-colors"
                      placeholder="Apt 4B"
                    />
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                        City *
                      </label>
                      <input
                        {...registerShipping('city')}
                        type="text"
                        className={cn(
                          'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                          shippingErrors.city ? 'border-red-500' : 'border-gray-300 focus:border-black'
                        )}
                      />
                      {shippingErrors.city && (
                        <p className="mt-1 text-xs text-red-600">{shippingErrors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                        State *
                      </label>
                      <input
                        {...registerShipping('state')}
                        type="text"
                        className={cn(
                          'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                          shippingErrors.state ? 'border-red-500' : 'border-gray-300 focus:border-black'
                        )}
                      />
                      {shippingErrors.state && (
                        <p className="mt-1 text-xs text-red-600">{shippingErrors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                        ZIP Code *
                      </label>
                      <input
                        {...registerShipping('zipCode')}
                        type="text"
                        className={cn(
                          'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                          shippingErrors.zipCode ? 'border-red-500' : 'border-gray-300 focus:border-black'
                        )}
                      />
                      {shippingErrors.zipCode && (
                        <p className="mt-1 text-xs text-red-600">{shippingErrors.zipCode.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Country (Searchable) & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={selectedCountry}
                        onChange={(e) => {
                          setCountrySearch(e.target.value);
                          setShippingValue('country', e.target.value);
                          setShowCountryDropdown(true);
                        }}
                        onFocus={() => setShowCountryDropdown(true)}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                        placeholder="Type to search..."
                      />
                      {showCountryDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 max-h-60 overflow-y-auto shadow-lg">
                          {filteredCountries.map((country) => (
                            <div
                              key={country}
                              onClick={() => {
                                setShippingValue('country', country);
                                setCountrySearch('');
                                setShowCountryDropdown(false);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {country}
                            </div>
                          ))}
                          {filteredCountries.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500">No countries found</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                        Phone Number *
                      </label>
                      <input
                        {...registerShipping('phone')}
                        type="tel"
                        className={cn(
                          'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                          shippingErrors.phone ? 'border-red-500' : 'border-gray-300 focus:border-black'
                        )}
                      />
                      {shippingErrors.phone && (
                        <p className="mt-1 text-xs text-red-600">{shippingErrors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-4 tracking-wide">Shipping Method</h3>
                    <div className="space-y-3">
                      <label
                        className={cn(
                          'flex items-center justify-between p-4 border-2 cursor-pointer transition-all',
                          shippingMethod === 'standard'
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shipping"
                            value="standard"
                            checked={shippingMethod === 'standard'}
                            onChange={(e) => setShippingMethod(e.target.value as 'standard' | 'express')}
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-medium">Standard Shipping</p>
                            <p className="text-sm text-gray-600">5-7 business days</p>
                          </div>
                        </div>
                        <span className="font-semibold">
                          {subtotal > 100 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            '$10.00'
                          )}
                        </span>
                      </label>

                      <label
                        className={cn(
                          'flex items-center justify-between p-4 border-2 cursor-pointer transition-all',
                          shippingMethod === 'express'
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shipping"
                            value="express"
                            checked={shippingMethod === 'express'}
                            onChange={(e) => setShippingMethod(e.target.value as 'standard' | 'express')}
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-medium">Express Shipping</p>
                            <p className="text-sm text-gray-600">2-3 business days</p>
                          </div>
                        </div>
                        <span className="font-semibold">$15.00</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-black text-white font-medium tracking-wider hover:bg-gray-800 transition-all"
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </form>
              )}

              {/* Payment Form */}
              {currentStep === 'payment' && (
                <form onSubmit={handleSubmitPayment(onPaymentSubmit)} className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6">
                    Payment Information
                  </h2>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                      Payment Method *
                    </label>
                    <select
                      {...registerPayment('method')}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    >
                      <option value="credit-card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank-transfer">Bank Transfer</option>
                    </select>
                  </div>

                  {/* Credit Card Fields */}
                  {paymentMethod === 'credit-card' && (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                          Card Number *
                        </label>
                        <input
                          {...registerPayment('cardNumber')}
                          type="text"
                          className={cn(
                            'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                            paymentErrors.cardNumber ? 'border-red-500' : 'border-gray-300 focus:border-black'
                          )}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                        />
                        {paymentErrors.cardNumber && (
                          <p className="mt-1 text-xs text-red-600">{paymentErrors.cardNumber.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                          Cardholder Name *
                        </label>
                        <input
                          {...registerPayment('cardName')}
                          type="text"
                          className={cn(
                            'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                            paymentErrors.cardName ? 'border-red-500' : 'border-gray-300 focus:border-black'
                          )}
                          placeholder="JOHN DOE"
                        />
                        {paymentErrors.cardName && (
                          <p className="mt-1 text-xs text-red-600">{paymentErrors.cardName.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                            Expiry Date *
                          </label>
                          <input
                            {...registerPayment('expiryDate')}
                            type="text"
                            onChange={handleExpiryChange}
                            className={cn(
                              'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                              paymentErrors.expiryDate ? 'border-red-500' : 'border-gray-300 focus:border-black'
                            )}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {paymentErrors.expiryDate && (
                            <p className="mt-1 text-xs text-red-600">{paymentErrors.expiryDate.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
                            CVV *
                          </label>
                          <input
                            {...registerPayment('cvv')}
                            type="text"
                            className={cn(
                              'w-full px-4 py-3 border text-sm focus:outline-none transition-colors',
                              paymentErrors.cvv ? 'border-red-500' : 'border-gray-300 focus:border-black'
                            )}
                            placeholder="123"
                            maxLength={4}
                          />
                          {paymentErrors.cvv && (
                            <p className="mt-1 text-xs text-red-600">{paymentErrors.cvv.message}</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Security Notice */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200">
                    <Lock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Secure Payment</p>
                      <p>Your payment information is encrypted and secure.</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="flex-1 py-4 border-2 border-black text-black font-medium tracking-wider hover:bg-black hover:text-white transition-all"
                    >
                      BACK
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-black text-white font-medium tracking-wider hover:bg-gray-800 transition-all"
                    >
                      REVIEW ORDER
                    </button>
                  </div>
                </form>
              )}

              {/* Review & Place Order */}
              {currentStep === 'review' && (
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6">
                    Review Your Order
                  </h2>

                  {/* Shipping Info Review */}
                  <div className="pb-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Shipping Address</h3>
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
                  <div className="pb-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Shipping Method</h3>
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
                  <div className="pb-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Payment Method</h3>
                      <button
                        onClick={() => setCurrentStep('payment')}
                        className="text-sm text-gray-600 hover:text-black underline underline-offset-4"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 capitalize">
                      {getPaymentValues('method').replace('-', ' ')}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8">
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
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200 text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
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
                  <span>Secure checkout</span>
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