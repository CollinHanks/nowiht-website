"use client";

import { useState, useEffect, useMemo } from "react";
import { use } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

interface CategoryPageParams {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageParams) {
  // Next.js 16: Unwrap params
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.category;

  const { addItem } = useCartStore();

  const [sortBy, setSortBy] = useState("featured");
  const [mounted, setMounted] = useState(false);

  // Backend state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fix hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?category=${categorySlug}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchProducts();
    }
  }, [categorySlug, mounted]);

  // Find category info
  const category = CATEGORIES.find((cat) => cat.slug === categorySlug);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!products.length) return [];

    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
        case "name-a-z":
          return a.name.localeCompare(b.name);
        default:
          // Featured: prioritize soldCount
          return (b.soldCount || 0) - (a.soldCount || 0);
      }
    });
  }, [products, sortBy]);

  const handleQuickAdd = (product: Product) => {
    addItem(product, product.sizes[0], product.colors[0]?.name || "Default", 1);
  };

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen pt-[70px] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  // 404 if category not found
  if (!category) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-[70px]">
          <main className="flex items-center justify-center py-20">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
              <p className="text-gray-600 mb-8">
                The category "{categorySlug}" does not exist.
              </p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Back to Shop
              </Link>
            </div>
          </main>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-[70px]">
        {/* Breadcrumb */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-20 py-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/shop" className="hover:text-black transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black font-medium">{category.name}</span>
          </div>
        </div>

        {/* Category Header */}
        <section className="bg-black text-white py-16 md:py-24">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-20 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              {category.name}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto">
              {category.description}
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-20">
            {/* Filters & Sort Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="text-sm text-gray-600">
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    Showing <span className="font-medium text-black">{sortedProducts.length}</span>{" "}
                    {sortedProducts.length === 1 ? "product" : "products"}
                  </>
                )}
              </p>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium bg-white hover:border-black transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                disabled={loading}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="name-a-z">Name: A-Z</option>
              </select>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 mb-4" />
                    <div className="h-4 bg-gray-200 mb-2" />
                    <div className="h-4 bg-gray-200 w-2/3" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              /* Product Grid */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-light mb-4">No Products Yet</h3>
                <p className="text-gray-600 mb-6">
                  No products found in this category yet.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Category Features */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
                <p className="text-sm text-gray-600">
                  Crafted from the finest organic materials
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Sustainable</h3>
                <p className="text-sm text-gray-600">
                  Eco-friendly production and ethical practices
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Made with Love</h3>
                <p className="text-sm text-gray-600">
                  Every piece is crafted with care and attention
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}