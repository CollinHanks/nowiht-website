"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  Truck,
  Mail,
  ArrowRight,
  Phone,
  MessageCircle,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useOrderStore } from "@/store/orderStore";
import { cn, formatPrice } from "@/lib/utils";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { getOrderById } = useOrderStore();
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const order = orderId ? getOrderById(orderId) : null;

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setShowSuccess(true), 300);
  }, []);

  if (!mounted) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  // No order found
  if (!order) {
    return (
      <>
        <Header />
        <main className="pt-20 md:pt-24 min-h-screen bg-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h1 className="text-3xl font-light mb-4 tracking-wide">Order not found</h1>
            <p className="text-gray-600 mb-8">
              We couldn't find the order you're looking for.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-black text-white font-medium tracking-wider hover:bg-gray-800 transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Format dates
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const estimatedDelivery = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "TBD";

  return (
    <>
      <Header />

      <main className="pt-20 md:pt-24 min-h-screen bg-white pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          {/* Success Header */}
          <div className="text-center mb-12">
            {/* Success Icon with Animation */}
            <div className="relative inline-flex mb-6">
              <div
                className={cn(
                  "w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-50 flex items-center justify-center transition-all duration-700",
                  showSuccess ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              >
                <CheckCircle2
                  className={cn(
                    "w-12 h-12 md:w-14 md:h-14 text-green-600 transition-all duration-700 delay-200",
                    showSuccess ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  )}
                />
              </div>

              {/* Pulse rings */}
              <div
                className={cn(
                  "absolute inset-0 rounded-full bg-green-200 transition-all duration-1000",
                  showSuccess ? "scale-150 opacity-0" : "scale-100 opacity-50"
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 rounded-full bg-green-200 transition-all duration-1000 delay-300",
                  showSuccess ? "scale-150 opacity-0" : "scale-100 opacity-50"
                )}
              />
            </div>

            <h1
              className={cn(
                "text-3xl md:text-4xl lg:text-5xl font-light tracking-wide mb-4 transition-all duration-700 delay-400",
                showSuccess ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Order Confirmed!
            </h1>
            <p
              className={cn(
                "text-base md:text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-500",
                showSuccess ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Thank you for your order. We've sent a confirmation email to{" "}
              <span className="font-medium text-black">{order.customerEmail}</span>
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white border border-gray-200 p-6 md:p-8 mb-6">
            {/* Order Number & Date */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-xl font-semibold">{order.orderNumber}</p>
              </div>
              <div className="mt-4 md:mt-0 md:text-right">
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-base font-medium">{orderDate}</p>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 mb-6">
              <Truck className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Estimated Delivery
                </p>
                <p className="text-sm text-gray-600">
                  Your order will arrive by{" "}
                  <span className="font-semibold text-black">
                    {estimatedDelivery}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.productImage || '/images/placeholder.jpg'}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.total)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="pt-6 border-t border-gray-200 mb-6">
              <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-900">
                  {order.customerName}
                </p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.apartment && (
                  <p>{order.shippingAddress.apartment}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.customerPhone && (
                  <p className="pt-2">{order.customerPhone}</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-6 border-t border-gray-200 mb-6">
              <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-700">
                  {order.paymentMethod || "Payment method"}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-8">
                Status: <span className="font-medium capitalize">{order.paymentStatus}</span>
              </p>
            </div>

            {/* Order Summary */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(order.shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(order.discount)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-lg font-semibold">Order Total</span>
                <span className="text-2xl font-bold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <Link
              href="/account/orders"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-medium tracking-wider hover:bg-gray-800 transition-all duration-300"
            >
              <Package className="w-5 h-5" />
              <span>VIEW MY ORDERS</span>
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-black text-black font-medium tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* What's Next Section */}
          <div className="bg-gray-50 border border-gray-200 p-6 md:p-8 mb-6">
            <h3 className="text-xl font-semibold mb-6 text-center">
              What Happens Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
                  <Mail className="w-6 h-6 text-gray-700" />
                </div>
                <h4 className="font-semibold mb-2">Order Confirmation</h4>
                <p className="text-sm text-gray-600">
                  You'll receive an email confirmation with order details
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
                  <Package className="w-6 h-6 text-gray-700" />
                </div>
                <h4 className="font-semibold mb-2">Order Processing</h4>
                <p className="text-sm text-gray-600">
                  We'll prepare your items and notify you when shipped
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
                  <Truck className="w-6 h-6 text-gray-700" />
                </div>
                <h4 className="font-semibold mb-2">Fast Delivery</h4>
                <p className="text-sm text-gray-600">
                  Estimated delivery in 5-7 business days
                </p>
              </div>
            </div>
          </div>

          {/* Need Help Section */}
          <div className="border border-gray-200 p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Need Help?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/contact"
                className="flex items-center gap-3 p-4 border border-gray-300 hover:border-black transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
                <div>
                  <p className="font-medium group-hover:text-black transition-colors">
                    Contact Us
                  </p>
                  <p className="text-sm text-gray-600">
                    Get help with your order
                  </p>
                </div>
              </Link>
              <a
                href="tel:+18058022931"
                className="flex items-center gap-3 p-4 border border-gray-300 hover:border-black transition-colors group"
              >
                <Phone className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
                <div>
                  <p className="font-medium group-hover:text-black transition-colors">
                    Call Us
                  </p>
                  <p className="text-sm text-gray-600">+1 (805) 802 29 31</p>
                </div>
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Questions about your order?
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link
                  href="/shipping"
                  className="text-gray-700 hover:text-black underline underline-offset-4"
                >
                  Shipping Information
                </Link>
                <Link
                  href="/returns"
                  className="text-gray-700 hover:text-black underline underline-offset-4"
                >
                  Return Policy
                </Link>
                <Link
                  href="/faq"
                  className="text-gray-700 hover:text-black underline underline-offset-4"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Share your NOWIHT experience with us
            </p>
            <div className="flex justify-center gap-2">
              <span className="px-4 py-2 bg-gray-100 text-sm font-medium">
                #NOWIHT
              </span>
              <span className="px-4 py-2 bg-gray-100 text-sm font-medium">
                @nowiht
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}