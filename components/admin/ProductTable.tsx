"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import { useAdminStore, useFilteredProducts } from "@/store/adminStore";
import { ProductService } from "@/lib/services/ProductService";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductTableProps {
  onDelete?: (id: string) => void;
}

export default function ProductTable({ onDelete }: ProductTableProps) {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  const { products: filteredProducts, total, page, perPage, totalPages } = useFilteredProducts();
  const {
    selectedProducts,
    toggleSelectProduct,
    selectAllProducts,
    clearSelection,
    setPagination,
    deleteProduct,
  } = useAdminStore();

  const allSelected = filteredProducts.length > 0 &&
    filteredProducts.every(p => selectedProducts.includes(p.id));

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAllProducts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await ProductService.delete(id);
      deleteProduct(id);
      onDelete?.(id);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-50 transition-colors ${selectedProducts.includes(product.id) ? "bg-blue-50" : ""
                  }`}
              >
                {/* Checkbox */}
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleSelectProduct(product.id)}
                    className="rounded border-gray-300"
                  />
                </td>

                {/* Product Info */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="font-medium text-gray-900 hover:text-red-600 line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      {product.isNew && (
                        <span className="inline-block px-1.5 py-0.5 bg-black text-white text-[10px] font-medium uppercase tracking-wider rounded mt-1">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* SKU */}
                <td className="px-4 py-4 text-sm text-gray-600">
                  {product.sku || '—'}
                </td>

                {/* Category - FIXED: Added null check */}
                <td className="px-4 py-4 text-sm text-gray-600 capitalize">
                  {product.category ? product.category.replace(/-/g, ' ') : '—'}
                </td>

                {/* Price */}
                <td className="px-4 py-4 text-sm">
                  <div className="font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                  {product.compareAtPrice && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </div>
                  )}
                </td>

                {/* Stock */}
                <td className="px-4 py-4 text-sm">
                  <div className={`font-medium ${(product.stock || 0) === 0
                    ? 'text-red-600'
                    : (product.stock || 0) <= 10
                      ? 'text-yellow-600'
                      : 'text-green-600'
                    }`}>
                    {product.stock || 0}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {product.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="View product"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Edit product"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-red-50 rounded transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, total)} of {total} products
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${page === pageNum
                      ? 'bg-black text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-300 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}