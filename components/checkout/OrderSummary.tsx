// components/checkout/OrderSummary.tsx
"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { OrderSummaryData } from "@/types/checkout";

interface OrderSummaryProps {
  data: OrderSummaryData;
}

export default function OrderSummary({ data }: OrderSummaryProps) {
  const { items, subtotal, shipping, total, itemCount } = data;

  return (
    <div className="bg-gray-50 rounded-none border border-gray-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-base font-medium tracking-wide uppercase">
          Order Summary
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Items List */}
      <div className="px-6 py-5 space-y-4 max-h-[400px] overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 border border-gray-200">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
              {item.quantity > 1 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-xs flex items-center justify-center rounded-full">
                  {item.quantity}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h3>
              <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                <p>Size: {item.size}</p>
                <p>Color: {item.color}</p>
              </div>
              <p className="text-sm font-medium text-gray-900 mt-2">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="px-6 py-5 border-t border-gray-200 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {/* Total */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-medium tracking-wide uppercase">
              Total
            </span>
            <span className="text-xl font-semibold">
              {formatPrice(total)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            Including all taxes
          </p>
        </div>
      </div>

      {/* Free Shipping Message */}
      {subtotal < 10000 && (
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            Add{" "}
            <span className="font-medium text-gray-900">
              {formatPrice(10000 - subtotal)}
            </span>{" "}
            more for free shipping
          </p>
        </div>
      )}
    </div>
  );
}