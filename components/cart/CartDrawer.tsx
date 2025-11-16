"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartDrawer() {
  const { isOpen, toggleCart, items, removeItem, updateQuantity, getCartSubtotal, getItemCount } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration error - only render cart count after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const subtotal = getCartSubtotal();
  const itemCount = getItemCount();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-lg font-bold">
                Shopping Cart {isMounted && itemCount > 0 && `(${itemCount})`}
              </h2>
            </div>
            <button
              onClick={toggleCart}
              aria-label="Close cart"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                {/* NOWIHT Logo - FIXED: quality=100 + unoptimized */}
                <div className="w-32 h-32 mb-6 relative">
                  <Image
                    src="/images/logo-black.png"
                    alt="NOWIHT"
                    fill
                    className="object-contain opacity-20"
                    quality={100}
                    unoptimized={true}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Add some products to get started!
                </p>
                <Button variant="primary" onClick={toggleCart}>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => {
                  // Create unique key from product id, size, and color
                  const itemKey = `${item.product.id}-${item.size}-${item.color}`;

                  return (
                    <div key={itemKey} className="flex gap-4">
                      {/* Product Image - FIXED: quality=100 + unoptimized */}
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={toggleCart}
                        className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0"
                      >
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                          quality={100}
                          unoptimized={true}
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={toggleCart}
                          className="block hover:underline"
                        >
                          <h3 className="text-sm font-medium line-clamp-2 mb-1">
                            {item.product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <span>Size: {item.size}</span>
                          <span>•</span>
                          <span>Color: {item.color}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="p-1.5 hover:bg-gray-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  item.quantity + 1
                                )
                              }
                              className="p-1.5 hover:bg-gray-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer - Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-lg">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>

              {/* Shipping Note */}
              <p className="text-xs text-gray-600 text-center">
                Shipping and taxes calculated at checkout
              </p>

              {/* Checkout Button */}
              <Button variant="primary" size="lg" fullWidth>
                <Link href="/checkout" onClick={toggleCart} className="w-full">
                  Proceed to Checkout
                </Link>
              </Button>

              {/* Continue Shopping */}
              <button
                onClick={toggleCart}
                className="w-full text-sm text-gray-600 hover:text-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}