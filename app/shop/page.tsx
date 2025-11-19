"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import FilterDrawer from "@/components/shop/FilterDrawer";
import QuickViewModal from "@/components/modals/QuickViewModal";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";
import { useFilterStore, filterProducts } from "@/store/filterStore";
import { advancedSortProducts } from "@/lib/advancedSort";
import { FILTER_CONSTANTS } from "@/lib/filterConstants";
import { useQuickView } from "@/hooks/useQuickView";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { addItem } = useCartStore();
  const [filterOpen, setFilterOpen] = useState(false);

  // Backend state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick View
  const { isOpen, product: quickViewProduct, openQuickView, closeQuickView } = useQuickView();

  // Filter store
  const filters = useFilterStore();

  // 🔥 FIXED: Fetch products from PUBLIC API (not admin endpoint)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/products', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch products`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to load products');
        }

        setProducts(data.products || []);
      } catch (error: any) {
        console.error('❌ Error fetching products:', error);
        setError(error.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter, search, and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let productsToFilter = [...products];

    // 1. Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      productsToFilter = productsToFilter.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // 2. Apply filters
    productsToFilter = filterProducts(productsToFilter, filters);

    // 3. Sort products
    productsToFilter = advancedSortProducts(productsToFilter, filters.sortBy);

    return productsToFilter;
  }, [searchQuery, filters, products]);

  const activeFilterCount = filters.getActiveFilterCount();

  return (
    <>
      <Header />

      <main className="pt-20 md:pt-24 min-h-screen bg-white">
        {/* Page Header */}
        <section className="bg-black text-white py-16 md:py-20">
          <div className="max-w-[1920px] mx-auto px-6 lg:px-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              {searchQuery ? `Search: "${searchQuery}"` : "Shop All"}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              {searchQuery
                ? `Found ${filteredAndSortedProducts.length} ${filteredAndSortedProducts.length === 1 ? 'product' : 'products'} matching your search`
                : "Explore our complete collection of premium organic women's fashion"
              }
            </p>
          </div>
        </section>

        {/* Category Filter Tabs */}
        <section className="border-b border-gray-200 sticky top-16 md:top-16 bg-white z-30">
          <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
            <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-8 py-4">
              <Link
                href="/shop"
                className="text-sm font-medium whitespace-nowrap border-b-2 border-black pb-2"
              >
                All Products
              </Link>
              {CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop/${category.slug}`}
                  className="text-sm font-medium text-gray-600 hover:text-black whitespace-nowrap border-b-2 border-transparent hover:border-gray-300 pb-2 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
            {/* Top Bar - Filters & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              {/* Left - Product Count + Filters Button */}
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-black">{filteredAndSortedProducts.length}</span> products
                  {searchQuery && <span> for &quot;{searchQuery}&quot;</span>}
                </p>

                {/* FILTERS BUTTON */}
                <button
                  onClick={() => setFilterOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium hover:border-black transition-colors relative"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Right - Sort Dropdown */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => filters.setSortBy(e.target.value as any)}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 text-sm font-medium bg-white hover:border-black transition-colors cursor-pointer"
                >
                  {FILTER_CONSTANTS.SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content - Loading/Error/Products */}
            {loading ? (
              /* Loading State */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 mb-4" />
                    <div className="h-4 bg-gray-200 mb-2" />
                    <div className="h-4 bg-gray-200 w-2/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 px-4"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-light mb-4">
                    Failed to Load Products
                  </h3>
                  <p className="text-gray-600 mb-8 text-base md:text-lg">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-black text-white font-medium uppercase tracking-wider hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            ) : filteredAndSortedProducts.length > 0 ? (
              /* Product Grid */
              <>
                <ProductGrid
                  products={filteredAndSortedProducts}
                  onQuickView={openQuickView}
                />

                {/* Load More */}
                <div className="mt-16 flex justify-center">
                  <button className="px-8 py-3 border-2 border-black text-black font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300">
                    Load More Products
                  </button>
                </div>
              </>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 px-4"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-light mb-4">
                    {searchQuery ? `No results for "${searchQuery}"` : 'No products found'}
                  </h3>
                  <p className="text-gray-600 mb-8 text-base md:text-lg">
                    {searchQuery
                      ? "Try adjusting your search or filters to find what you're looking for"
                      : "We couldn't find any products matching your filters"
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {searchQuery && (
                      <Link
                        href="/shop"
                        className="inline-block px-6 py-3 border-2 border-gray-300 text-black font-medium uppercase tracking-wider hover:border-black transition-all duration-300"
                      >
                        View All Products
                      </Link>
                    )}
                    <button
                      onClick={filters.clearAllFilters}
                      className="px-6 py-3 bg-black text-white font-medium uppercase tracking-wider hover:bg-red-600 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Filter Drawer */}
      <AnimatePresence>
        {filterOpen && (
          <FilterDrawer onClose={() => setFilterOpen(false)} />
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isOpen}
        onClose={closeQuickView}
      />

      <Footer />
    </>
  );
}