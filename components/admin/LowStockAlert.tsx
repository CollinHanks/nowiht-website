"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import type { Product } from "@/types";

/**
 * LowStockAlert Component
 * 
 * Displays products with low stock (≤ 10 units)
 * Alerts admin to restock
 * 
 * DESIGN: Warning style, actionable
 */

interface LowStockAlertProps {
  products: Product[];
}

export default function LowStockAlert({ products }: LowStockAlertProps) {
  // Filter products with low stock (≤ 10)
  const lowStockProducts = products
    .filter((p) => (p.stock || 0) <= 10 && (p.stock || 0) > 0)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Low Stock Alert
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Products with 10 or fewer units in stock
        </p>
      </div>

      {/* Product List */}
      <div className="divide-y divide-gray-200">
        {lowStockProducts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-600 mb-2">
              All products are well stocked
            </p>
            <p className="text-xs text-gray-500">
              No low stock alerts at the moment
            </p>
          </div>
        ) : (
          lowStockProducts.map((product) => (
            <div
              key={product.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${(product.stock || 0) <= 5 ? "bg-red-50" : ""
                }`}
            >
              <div className="flex items-center gap-4">
                {/* Product Image */}
                <div className="w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={product.images?.[0] || "/placeholder-product.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate mb-1">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    SKU: {product.sku || "N/A"}
                  </div>
                </div>

                {/* Stock Badge */}
                <div className="flex-shrink-0">
                  <span
                    className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded border ${(product.stock || 0) <= 2
                        ? "bg-red-600 text-white border-red-600"
                        : (product.stock || 0) <= 5
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }`}
                  >
                    {product.stock || 0} Left
                  </span>
                </div>

                {/* Edit Link */}
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex-shrink-0 text-gray-600 hover:text-black transition-colors p-2"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Link */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/admin/products?filter=low-stock"
            className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            View all low stock products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}