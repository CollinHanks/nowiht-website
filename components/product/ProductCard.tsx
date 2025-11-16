"use client";

import Link from "next/link";
import { ShoppingBag, Eye, Check, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WishlistHeart from "@/components/wishlist/WishlistHeart";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product, size: string, color: string) => void;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
}

// ✅ HEX COLOR FALLBACK MAP
const COLOR_HEX_MAP: Record<string, string> = {
  black: "#000000", jet: "#0A0A0A", obsidian: "#1C1C1C",
  white: "#FFFFFF", cream: "#FFFDD0", ivory: "#FFFFF0", offwhite: "#FAF9F6",
  gray: "#808080", grey: "#808080", charcoal: "#36454F", slate: "#708090",
  brown: "#964B00", tan: "#D2B48C", beige: "#F5F5DC", caramel: "#C68E17", mocha: "#967969",
  blue: "#0000FF", navy: "#000080", denim: "#1560BD", sky: "#87CEEB",
  green: "#008000", olive: "#808000", forest: "#228B22", sage: "#BCB88A",
  red: "#DC2626", burgundy: "#800020", wine: "#722F37",
  pink: "#FFC0CB", purple: "#800080", yellow: "#FFFF00", orange: "#FFA500",
};

/**
 * ✅ Get color hex with 3-tier fallback
 * 1. Use provided hex
 * 2. Look up in COLOR_HEX_MAP
 * 3. Default to black (#000000)
 */
function getColorHex(color: { name: string; hex?: string }): string {
  // Priority 1: Use provided hex
  if (color.hex && /^#[0-9A-F]{6}$/i.test(color.hex)) {
    return color.hex;
  }

  // Priority 2: Look up in map
  if (color.name) {
    const normalized = color.name.toLowerCase().replace(/\s+/g, "");
    if (COLOR_HEX_MAP[normalized]) {
      return COLOR_HEX_MAP[normalized];
    }
  }

  // Priority 3: Fallback to black
  return "#000000";
}

export default function ProductCard({
  product,
  onQuickAdd,
  onQuickView,
  priority = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isExpanded) {
      setIsExpanded(false);
      setSelectedSize("");
      setSelectedColor("");
      return;
    }
    onQuickView?.(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) return;

    // Toggle expansion
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }

    // Validate selections
    if (!selectedSize || !selectedColor) {
      return;
    }

    // Add to cart
    onQuickAdd?.(product, selectedSize, selectedColor);

    // Reset
    setIsExpanded(false);
    setSelectedSize("");
    setSelectedColor("");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(false);
    setSelectedSize("");
    setSelectedColor("");
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          {/* Wishlist Heart - TOP RIGHT */}
          <div
            className="absolute top-2 right-2 md:top-3 md:right-3 z-20"
            onClick={(e) => e.preventDefault()}
          >
            <WishlistHeart
              productId={product.id}
              product={product}
              size="sm"
            />
          </div>

          {/* Main Image with Fallback */}
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
          />

          {/* Second Image on Hover - Desktop Only */}
          {!isExpanded && product.images.length > 1 && product.images[1] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none hidden md:block"
            >
              <ImageWithFallback
                src={product.images[1]}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Badges - TOP LEFT */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 md:gap-1.5 z-10">
            {product.isNew && (
              <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-black text-white text-[9px] md:text-[10px] font-medium uppercase tracking-wider">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-red-600 text-white text-[9px] md:text-[10px] font-medium uppercase tracking-wider">
                {discountPercentage}%
              </span>
            )}
            {!product.inStock && (
              <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-800 text-white text-[9px] md:text-[10px] font-medium uppercase tracking-wider">
                Out
              </span>
            )}
          </div>
        </Link>

        {/* Quick Actions - Both Mobile & Desktop */}
        {product.inStock && (
          <>
            {/* DESKTOP: Hover Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isHovered && !isExpanded ? 1 : 0,
                y: isHovered && !isExpanded ? 0 : 10,
              }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-0 bottom-3 z-10 hidden md:flex gap-2 px-3"
            >
              {onQuickAdd && (
                <button
                  onClick={handleQuickAdd}
                  className="flex-1 flex items-center justify-center gap-2 bg-white px-3 py-2.5 text-xs font-medium tracking-wide text-black border border-gray-200 transition-all duration-300 hover:bg-black hover:text-white hover:border-black"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              )}
              {onQuickView && (
                <button
                  onClick={handleQuickView}
                  className="flex-1 flex items-center justify-center gap-2 bg-white px-3 py-2.5 text-xs font-medium tracking-wide text-black border border-gray-200 transition-all duration-300 hover:bg-black hover:text-white hover:border-black"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View</span>
                </button>
              )}
            </motion.div>

            {/* MOBILE: Bottom Button */}
            <div className="md:hidden absolute inset-x-0 bottom-0 z-10">
              <button
                onClick={handleQuickAdd}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-all ${isExpanded && selectedSize && selectedColor
                  ? 'bg-black text-white'
                  : isExpanded
                    ? 'bg-gray-300 text-gray-600'
                    : 'bg-white text-black border-t border-gray-200'
                  }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{isExpanded ? 'Confirm & Add' : 'Add to Cart'}</span>
              </button>
            </div>

            {/* EXPANSION PANEL - Mobile & Desktop */}
            <AnimatePresence>
              {isExpanded && (
                <>
                  {/* Desktop: Backdrop Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden md:block absolute inset-0 bg-black/40 backdrop-blur-sm z-20"
                    onClick={handleBackdropClick}
                  />

                  {/* Desktop: Centered Panel */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="hidden md:block absolute inset-4 z-30 flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-white border-2 border-black p-4 w-full max-w-[280px] space-y-4">
                      {/* Close Button */}
                      <button
                        onClick={handleBackdropClick}
                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Color Selection */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2">
                          Color {selectedColor && `- ${selectedColor}`}
                        </p>
                        <div className="flex gap-2">
                          {/* ✅ FIX: Added null check + getColorHex() */}
                          {product.colors && Array.isArray(product.colors) && product.colors.slice(0, 5).map((color) => (
                            <button
                              key={color.name}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedColor(color.name);
                              }}
                              className={`relative w-10 h-10 border-2 transition-all ${selectedColor === color.name
                                ? 'border-black ring-2 ring-black ring-offset-1'
                                : 'border-gray-300'
                                }`}
                              style={{ backgroundColor: getColorHex(color) }}
                              title={color.name}
                            >
                              {selectedColor === color.name && (
                                <Check className="w-5 h-5 absolute inset-0 m-auto text-white drop-shadow-lg" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Size Selection */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2">
                          Size {selectedSize && `- ${selectedSize}`}
                        </p>
                        <div className="grid grid-cols-5 gap-1.5">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedSize(size);
                              }}
                              className={`py-2.5 text-xs font-medium border-2 transition-all ${selectedSize === size
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 hover:border-black'
                                }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Confirm Button */}
                      <button
                        onClick={handleQuickAdd}
                        className={`w-full py-3 text-xs font-medium uppercase tracking-wider transition-all ${selectedSize && selectedColor
                          ? 'bg-black text-white hover:bg-gray-900'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>

                  {/* Mobile: Bottom Expansion */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="md:hidden absolute inset-x-0 bottom-12 bg-white border-t-2 border-black z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 space-y-3">
                      {/* Color */}
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider mb-2">
                          Color {selectedColor && `- ${selectedColor}`}
                        </p>
                        <div className="flex gap-2">
                          {/* ✅ FIX: Added null check + getColorHex() */}
                          {product.colors && Array.isArray(product.colors) && product.colors.slice(0, 5).map((color) => (
                            <button
                              key={color.name}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedColor(color.name);
                              }}
                              className={`relative w-8 h-8 border-2 transition-all ${selectedColor === color.name
                                ? 'border-black ring-2 ring-black ring-offset-1'
                                : 'border-gray-300'
                                }`}
                              style={{ backgroundColor: getColorHex(color) }}
                            >
                              {selectedColor === color.name && (
                                <Check className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow-lg" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Size */}
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider mb-2">
                          Size {selectedSize && `- ${selectedSize}`}
                        </p>
                        <div className="grid grid-cols-5 gap-1.5">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedSize(size);
                              }}
                              className={`py-2 text-xs font-medium border-2 transition-all ${selectedSize === size
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300'
                                }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <Link href={`/product/${product.slug}`} className="block group-hover:underline">
          <h3 className="text-sm font-medium line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-600 capitalize">
          {product.category.replace('-', ' ')}
        </p>

        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">
            {formatPrice(product.price)}
          </p>
          {hasDiscount && (
            <p className="text-xs text-gray-500 line-through">
              {formatPrice(product.compareAtPrice!)}
            </p>
          )}
        </div>

        {/* ✅ FIX: Added null check + getColorHex() */}
        {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <button
                key={index}
                onClick={(e) => e.preventDefault()}
                className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-black transition-colors"
                style={{ backgroundColor: getColorHex(color) }}
                title={color.name}
                aria-label={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-600 self-center ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}