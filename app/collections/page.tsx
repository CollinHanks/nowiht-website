"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// ============================================
// TYPES
// ============================================
interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

// ============================================
// DEFAULT CATEGORIES (Fallback)
// ============================================
const DEFAULT_CATEGORIES = [
  {
    slug: "hoodie",
    name: "Hoodies",
    description: "Premium hooded sweatshirts",
    image: "/images/categories/athleisure/hoodie-1.jpg",
  },
  {
    slug: "tracksuit",
    name: "Tracksuits",
    description: "Luxury matching sets",
    image: "/images/categories/athleisure/tracksuit-1.jpg",
  },
  {
    slug: "polo",
    name: "Polo Shirts",
    description: "Elegant polo shirts",
    image: "/images/categories/athleisure/polo-1.jpg",
  },
  {
    slug: "dress",
    name: "Dresses",
    description: "Sophisticated athleisure dresses",
    image: "/images/categories/athleisure/dress-1.jpg",
  },
  {
    slug: "sweatshirt",
    name: "Sweatshirts",
    description: "Classic crewneck sweatshirts",
    image: "/images/categories/athleisure/sweatshirt-1.jpg",
  },
  {
    slug: "t-shirt",
    name: "T-Shirts",
    description: "Essential luxury tees",
    image: "/images/categories/athleisure/tshirt-1.jpg",
  },
  {
    slug: "pajama-set",
    name: "Pajama Sets",
    description: "Premium loungewear sets",
    image: "/images/categories/athleisure/pajama-1.jpg",
  },
  {
    slug: "nightgown",
    name: "Nightgowns",
    description: "Luxurious sleepwear dresses",
    image: "/images/categories/lingerie/nightgown-1.jpg",
  },
  {
    slug: "babydoll",
    name: "Babydolls",
    description: "Romantic sleep sets",
    image: "/images/categories/lingerie/babydoll-1.jpg",
  },
  {
    slug: "lingerie",
    name: "Lingerie",
    description: "High-end intimate apparel",
    image: "/images/categories/lingerie/lingerie-1.jpg",
  },
  {
    slug: "lingerie-set",
    name: "Lingerie Sets",
    description: "Coordinated intimate sets",
    image: "/images/categories/lingerie/lingerie-set-1.jpg",
  },
  {
    slug: "panties",
    name: "Panties",
    description: "Luxury underwear",
    image: "/images/categories/lingerie/panties-1.jpg",
  },
  {
    slug: "bra",
    name: "Bras",
    description: "Premium support & comfort",
    image: "/images/categories/lingerie/bra-1.jpg",
  },
];

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch categories with product counts from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // Fetch all products to count by category
        const response = await fetch('/api/products', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        const products = data.products || [];

        // Count products per category
        const categoryCounts: Record<string, number> = {};
        products.forEach((product: any) => {
          const cat = product.category || 'unknown';
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        // Map categories with counts
        const categoriesWithCount = DEFAULT_CATEGORIES.map((cat) => ({
          ...cat,
          productCount: categoryCounts[cat.slug] || 0,
        }));

        setCategories(categoriesWithCount);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories with 0 count
        setCategories(
          DEFAULT_CATEGORIES.map((cat) => ({
            ...cat,
            productCount: 0,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchCategories();
    }
  }, [mounted]);

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
            {loading ? (
              /* Loading State */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 mb-4" />
                    <div className="h-4 bg-gray-200 mb-2" />
                    <div className="h-3 bg-gray-200 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              /* Categories Grid */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
                {categories.map((category, index) => (
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
            )}
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
              href="/product"
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