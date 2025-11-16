"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Download, Trash2, Upload } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductTable from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/Button";
import { useAdminStore, useFilteredProducts } from "@/store/adminStore";
import { ProductService } from "@/lib/services/ProductService";
import { CategoryService } from "@/lib/services/CategoryService";
import { ExcelService } from "@/lib/services/ExcelService";

export default function AdminProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  const {
    setProducts,
    setCategories: setStoreCategories,
    productFilters,
    setProductFilters,
    resetFilters,
    selectedProducts,
    clearSelection,
    deleteProducts,
    isSidebarOpen,
  } = useAdminStore();

  const { total } = useFilteredProducts();

  // Load data
  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [products, cats] = await Promise.all([
        ProductService.getAll(),
        CategoryService.getAll(),
      ]);
      setProducts(products);
      setStoreCategories(cats);
      setCategories(cats);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedProducts.length} product${selectedProducts.length > 1 ? "s" : ""
      }?`
    );

    if (!confirmed) return;

    try {
      await Promise.all(selectedProducts.map((id) => ProductService.delete(id)));
      deleteProducts(selectedProducts);
      clearSelection();
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("Failed to delete products");
    }
  };

  const handleExport = async () => {
    try {
      const products = await ProductService.getAll();
      ExcelService.exportProducts(products);
    } catch (error) {
      console.error("Error exporting products:", error);
      alert("Failed to export products");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main
        className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"
          }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your product catalog
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Link href="/admin/products/import">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </Link>
              <Link href="/admin/products/add">
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productFilters.search}
                    onChange={(e) =>
                      setProductFilters({ search: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={productFilters.category}
                  onChange={(e) =>
                    setProductFilters({ category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={productFilters.status}
                  onChange={(e) =>
                    setProductFilters({ status: e.target.value as any })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {total} product{total !== 1 ? "s" : ""} found
              </div>
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Reset filters
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-blue-900">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""} selected
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </Button>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-blue-700 hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Table */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black" />
              <p className="text-sm text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <ProductTable onDelete={loadData} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}