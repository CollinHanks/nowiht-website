"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CATEGORIES } from "@/lib/constants";
import { MOCK_PRODUCTS } from "@/lib/product-data";

export default function CollectionsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate product count for each category
  const categoriesWithCount = CATEGORIES.map((category) => {
    const productCount = MOCK_PRODUCTS.filter(
      (product) => product.category === category.slug
    ).length;
    return { ...category, productCount };
  });

  if (!mounted) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-[70px] flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-[70px] bg-white">
        {/* Hero Section - Minimal & Elegant */}
        <section className="border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6 text-black">
              COLLECTIONS
            </h1>
            <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto leading-relaxed font-light">
              Discover our carefully curated collections. Each piece designed with
              intention, crafted with care.
            </p>
          </div>
        </section>

        {/* Collections Grid - LV Style */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
              {categoriesWithCount.map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/shop/${category.slug}`}
                  className="group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-50">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={index < 4}
                    />
                  </div>

                  {/* Text Below Image - LV Style */}
                  <div className="space-y-2">
                    {/* Category Name */}
                    <h3 className="text-base md:text-lg font-medium text-black group-hover:text-gray-600 transition-colors duration-300">
                      {category.name}
                    </h3>

                    {/* Product Count */}
                    <p className="text-xs md:text-sm text-gray-500 font-light">
                      {category.productCount}{" "}
                      {category.productCount === 1 ? "Item" : "Items"}
                    </p>

                    {/* Discover Link - Appears on Hover */}
                    <div className="flex items-center gap-1 text-xs text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="tracking-wide">Discover</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="h-px bg-gray-100" />
        </div>

        {/* CTA Section - Minimalist */}
        <section className="py-16 md:py-24">
          <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-2xl md:text-4xl font-light mb-6 text-black tracking-wide">
              Explore All Products
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-10 leading-relaxed font-light">
              Browse our complete collection for more styles and options.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-10 py-3 border border-black text-black text-sm tracking-wider hover:bg-black hover:text-white transition-all duration-300"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}