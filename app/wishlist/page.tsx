"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Heart, ArrowRight, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuickViewModal from "@/components/modals/QuickViewModal";
import { useWishlistStore, type WishlistItem } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useQuickView } from "@/hooks/useQuickView";
import type { Product } from "@/types";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  // Quick View
  const { isOpen, product: quickViewProduct, openQuickView, closeQuickView } = useQuickView();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMoveToCart = (item: WishlistItem) => {
    const productForCart: Product = {
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      images: item.images,
      category: item.category,
      description: `${item.name} - Premium quality organic clothing`,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [{ name: "Black", hex: "#000000" }],
      material: "100% Organic Cotton",
      care: ["Machine wash cold", "Tumble dry low", "Do not bleach", "Iron on low heat"],
      features: ["Premium organic materials", "Sustainable", "Breathable", "Perfect fit"],
      inStock: true,
      isNew: false,
      isBestSeller: false,
      isOnSale: item.isOnSale || false,
      createdAt: item.addedAt,
    };

    addToCart(productForCart, "M", "Black", 1);
    removeItem(item.id);
  };

  const handleQuickView = (item: WishlistItem) => {
    // Convert WishlistItem to Product for QuickViewModal
    const productForQuickView: Product = {
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      images: item.images,
      category: item.category,
      description: `${item.name} - Premium quality organic clothing`,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [{ name: "Black", hex: "#000000" }],
      material: "100% Organic Cotton",
      care: ["Machine wash cold", "Tumble dry low", "Do not bleach", "Iron on low heat"],
      features: ["Premium organic materials", "Sustainable", "Breathable", "Perfect fit"],
      inStock: true,
      isNew: false,
      isBestSeller: false,
      isOnSale: item.isOnSale || false,
      createdAt: item.addedAt,
    };

    openQuickView(productForQuickView);
  };

  if (!mounted) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 md:pt-20 bg-white">
        {/* Compact Header */}
        <section className="border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide mb-1">
                  My Wishlist
                </h1>
                <p className="text-sm text-gray-600">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
              {items.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={clearWishlist}
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 text-sm hover:gap-3 transition-all"
                  >
                    <span className="hidden sm:inline">Continue Shopping</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Wishlist Content */}
        <section className="py-6 md:py-10">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            {items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {items.map((item) => (
                  <WishlistProductCard
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onAddToCart={handleMoveToCart}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            ) : (
              /* Empty State - Compact & Modern */
              <div className="text-center py-16 md:py-24 px-4">
                <div className="max-w-sm mx-auto">
                  {/* Icon */}
                  <div className="mb-6 md:mb-8 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full">
                    <Heart className="w-8 h-8 md:w-10 md:h-10 text-gray-300" />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-light mb-3 md:mb-4 tracking-wide">
                    Your Wishlist is Empty
                  </h2>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 leading-relaxed">
                    Save items you love and keep track of your favorites
                  </p>

                  {/* CTA Button - Compact */}
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-black text-white text-sm md:text-base font-medium tracking-wide hover:bg-gray-800 transition-colors"
                  >
                    <span>Start Shopping</span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </Link>

                  {/* Quick Links - Compact */}
                  <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm">
                    <Link href="/collections" className="text-gray-600 hover:text-black transition-colors">
                      Collections
                    </Link>
                    <span className="text-gray-300">•</span>
                    <Link href="/shop?filter=new" className="text-gray-600 hover:text-black transition-colors">
                      New Arrivals
                    </Link>
                    <span className="text-gray-300">•</span>
                    <Link href="/shop?filter=bestsellers" className="text-gray-600 hover:text-black transition-colors">
                      Best Sellers
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related/Trending Section - Compact */}
        {items.length > 0 && (
          <section className="py-10 md:py-14 bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-light tracking-wide">
                  You May Also Like
                </h2>
                <Link
                  href="/shop"
                  className="text-xs md:text-sm text-gray-600 hover:text-black flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </Link>
              </div>

              <div className="text-center text-sm md:text-base text-gray-600">
                <p>Discover more products you'll love</p>
              </div>
            </div>
          </section>
        )}
      </main>

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

// Wishlist Product Card Component with Quick View
function WishlistProductCard({
  item,
  onRemove,
  onAddToCart,
  onQuickView,
}: {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onAddToCart: (item: WishlistItem) => void;
  onQuickView: (item: WishlistItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(item);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-2 right-2 z-10 p-1.5 md:p-2 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Remove"
      >
        <X className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
      </button>

      {/* Product Card */}
      <Link href={`/product/${item.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] mb-2 md:mb-3 overflow-hidden bg-gray-50">
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {item.isOnSale && (
            <div className="absolute top-2 left-2 px-2 py-0.5 md:px-2.5 md:py-1 bg-red-600 text-white text-[10px] md:text-xs font-medium uppercase tracking-wide">
              Sale
            </div>
          )}

          {/* Quick View Button - Desktop Only */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 bottom-2 z-10 hidden md:block px-2"
          >
            <button
              onClick={handleQuickView}
              className="w-full flex items-center justify-center gap-1.5 bg-white px-3 py-2 text-[10px] font-medium text-black hover:bg-black hover:text-white transition-all"
            >
              <Eye className="h-3 w-3" />
              <span>QUICK VIEW</span>
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="space-y-1 md:space-y-1.5">
          <h3 className="text-xs md:text-sm font-medium group-hover:text-gray-600 transition-colors line-clamp-2 leading-tight">
            {item.name}
          </h3>
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-sm md:text-base font-semibold">
              ${item.price}
            </span>
            {item.compareAtPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${item.compareAtPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button - Compact */}
      <button
        onClick={() => onAddToCart(item)}
        className="w-full mt-2 md:mt-3 px-3 py-2 md:py-2.5 bg-black text-white text-xs md:text-sm font-medium tracking-wide hover:bg-gray-800 transition-all flex items-center justify-center gap-1.5 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-0 md:group-hover:translate-y-0"
      >
        <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}