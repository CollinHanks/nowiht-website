"use client";

import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * TopProducts Component
 * 
 * Displays top 5 best-selling products
 * Shows sales count and revenue
 * 
 * DESIGN: Ranked list with metrics
 */

interface TopProductsProps {
  products: Product[];
}

export default function TopProducts({ products }: TopProductsProps) {
  // Sort products by soldCount and get top 5
  const topProducts = [...products]
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-900" />
            <h2 className="text-lg font-semibold text-gray-900">
              Best Selling Products
            </h2>
          </div>
          <Link
            href="/admin/products?sort=best-sellers"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            View all
          </Link>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Top performing products this month
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <p className="text-sm text-gray-500">No sales data yet</p>
                </td>
              </tr>
            ) : (
              topProducts.map((product, index) => {
                const rank = index + 1;
                const revenue = product.price * (product.soldCount || 0);

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded ${rank === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : rank === 2
                              ? "bg-gray-100 text-gray-700"
                              : rank === 3
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-50 text-gray-600"
                          }`}
                      >
                        {rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 flex-shrink-0 overflow-hidden rounded">
                          <img
                            src={product.images?.[0] || "/placeholder-product.jpg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            SKU: {product.sku || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {product.soldCount || 0} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatPrice(revenue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded transition-colors inline-flex"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {topProducts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">No sales data yet</p>
          </div>
        ) : (
          topProducts.map((product, index) => {
            const rank = index + 1;
            const revenue = product.price * (product.soldCount || 0);

            return (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}/edit`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 rounded ${rank === 1
                        ? "bg-yellow-100 text-yellow-700"
                        : rank === 2
                          ? "bg-gray-100 text-gray-700"
                          : rank === 3
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-50 text-gray-600"
                      }`}
                  >
                    {rank}
                  </div>

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
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {product.category} • SKU: {product.sku || "N/A"}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-gray-600">
                        <span className="font-semibold text-gray-900">
                          {product.soldCount || 0}
                        </span>{" "}
                        units
                      </div>
                      <div className="text-gray-600">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}