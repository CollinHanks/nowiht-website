"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Tag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const { items, removeItem, updateQuantity, getCartSubtotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getCartSubtotal();
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08; // 8% tax
  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + shipping + tax - discount;

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === "nowiht10") {
      setPromoApplied(true);
    }
  };

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

  return (
    <>
      <Header />

      <main className="min-h-screen pt-20 md:pt-24 pb-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide">
              Shopping Cart
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>

          {items.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Cart Items - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="flex gap-4 md:gap-6 p-4 md:p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 overflow-hidden group"
                    >
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 96px, 128px"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between gap-4 mb-2">
                        <div>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="font-medium text-base md:text-lg hover:text-gray-600 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            Size: {item.size} • Color: {item.color}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.size, item.color)}
                          className="text-gray-400 hover:text-red-600 transition-colors h-fit"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.color,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-2 hover:bg-gray-50 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="p-2 hover:bg-gray-50 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg md:text-xl font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              ${item.product.price} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary - Right Side */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Summary Card */}
                  <div className="border border-gray-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-xl font-medium mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">
                          {shipping === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            `$${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (8%)</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount (10%)</span>
                          <span className="font-medium">-${discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Total</span>
                        <span className="text-2xl font-semibold">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Link
                      href="/checkout"
                      className="block w-full py-4 bg-black text-white text-center font-medium tracking-wider hover:bg-gray-800 transition-colors mb-3"
                    >
                      PROCEED TO CHECKOUT
                    </Link>

                    <Link
                      href="/shop"
                      className="block w-full py-4 border-2 border-black text-black text-center font-medium tracking-wider hover:bg-black hover:text-white transition-all"
                    >
                      CONTINUE SHOPPING
                    </Link>

                    {shipping > 0 && (
                      <p className="text-xs text-gray-600 text-center mt-4">
                        Add ${(100 - subtotal).toFixed(2)} more for free shipping
                      </p>
                    )}
                  </div>

                  {/* Promo Code */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Promo Code
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        disabled={promoApplied}
                        className={cn(
                          "flex-1 px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors",
                          promoApplied && "bg-gray-50 cursor-not-allowed"
                        )}
                      />
                      <button
                        onClick={handlePromoCode}
                        disabled={promoApplied}
                        className={cn(
                          "px-6 py-2 text-sm font-medium transition-colors",
                          promoApplied
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                        )}
                      >
                        {promoApplied ? "APPLIED" : "APPLY"}
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ Promo code applied successfully!
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Try code: <span className="font-mono font-medium">NOWIHT10</span>
                    </p>
                  </div>

                  {/* Trust Badges */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <span>Free shipping on orders over $100</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <span>30-day easy returns</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <span>Secure checkout</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <span>100% organic materials</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Cart State */
            <div className="text-center py-16 md:py-24 px-4">
              <div className="max-w-md mx-auto">
                <div className="mb-8 inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-full">
                  <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-gray-300" />
                </div>

                <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide">
                  Your Cart is Empty
                </h2>

                <p className="text-base text-gray-600 mb-8 leading-relaxed">
                  Looks like you haven't added anything to your cart yet. Explore our collections and find something you love.
                </p>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-medium tracking-wider hover:bg-gray-800 transition-colors"
                >
                  <span>START SHOPPING</span>
                  <ShoppingBag className="w-5 h-5" />
                </Link>

                <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
                  <Link href="/collections" className="text-gray-600 hover:text-black transition-colors">
                    Collections
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/shop?filter=new" className="text-gray-600 hover:text-black transition-colors">
                    New Arrivals
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/shop?filter=bestsellers" className="text-gray-600 hover:text-black transition-colors">
                    Best Sellers
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}