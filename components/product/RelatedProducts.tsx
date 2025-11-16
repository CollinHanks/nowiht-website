"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRelatedProducts } from "@/lib/relatedProducts";
import { useCartStore } from "@/store/cartStore";
import { MOCK_PRODUCTS } from "@/lib/product-data";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import WishlistHeart from "@/components/wishlist/WishlistHeart";

interface RelatedProductsProps {
  product: Product;
  limit?: number;
  title?: string;
  className?: string;
  onQuickView?: (product: Product) => void;
  onQuickAdd?: (product: Product, size: string, color: string) => void;
}

export default function RelatedProducts({
  product,
  limit = 8,
  title = "You May Also Like",
  className,
  onQuickView,
  onQuickAdd,
}: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addItem: addToCart } = useCartStore();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const relatedProducts = useMemo(() => {
    return getRelatedProducts(product, MOCK_PRODUCTS, {
      limit,
      includeSameCategory: true,
      includeSimilarPrice: true,
      priceRangePercent: 20,
    });
  }, [product, limit]);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );

    // Calculate current index for dot indicators
    const cardWidth = container.scrollWidth / relatedProducts.length;
    const index = Math.round(container.scrollLeft / cardWidth);
    setCurrentIndex(index);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [relatedProducts]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const handleQuickAdd = (relatedProduct: Product, size: string, color: string) => {
    addToCart(relatedProduct, size, color, 1);
  };

  if (relatedProducts.length === 0) return null;

  return (
    <section className={cn("py-12 md:py-16 border-t border-gray-100", className)}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Based on your current selection
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "w-10 h-10 flex items-center justify-center border border-gray-300 transition-all",
                canScrollLeft
                  ? "hover:border-black hover:bg-black hover:text-white"
                  : "opacity-40 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "w-10 h-10 flex items-center justify-center border border-gray-300 transition-all",
                canScrollRight
                  ? "hover:border-black hover:bg-black hover:text-white"
                  : "opacity-40 cursor-not-allowed"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Mobile: Horizontal Scroll with Fade Edges */}
          <div className="lg:hidden relative">
            {/* Fade Edge - Left */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            )}

            {/* Fade Edge - Right */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            )}

            <div
              ref={scrollContainerRef}
              className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-shrink-0 w-[45%] sm:w-[32%] snap-start"
                >
                  <RelatedProductCard
                    product={relatedProduct}
                    onQuickAdd={onQuickAdd || handleQuickAdd}
                    onQuickView={onQuickView}
                  />
                </motion.div>
              ))}
            </div>

            {/* Dot Indicators - Mobile Only */}
            {relatedProducts.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {relatedProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const container = scrollContainerRef.current;
                      if (container) {
                        const cardWidth = container.scrollWidth / relatedProducts.length;
                        container.scrollTo({
                          left: cardWidth * index,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className={cn(
                      "h-[2px] transition-all duration-300",
                      currentIndex === index
                        ? "w-8 bg-black"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop: Grid */}
          <div className="hidden lg:grid lg:grid-cols-6 gap-4">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <RelatedProductCard
                  product={relatedProduct}
                  onQuickAdd={onQuickAdd || handleQuickAdd}
                  onQuickView={onQuickView}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedProductCard({
  product,
  onQuickAdd,
  onQuickView,
}: {
  product: Product;
  onQuickAdd?: (product: Product, size: string, color: string) => void;
  onQuickView?: (product: Product) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
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

    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }

    if (!selectedSize || !selectedColor) {
      return;
    }

    onQuickAdd?.(product, selectedSize, selectedColor);
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
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-gray-100 mb-2 md:mb-3 overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 45vw, 200px"
          />

          <div
            className="absolute top-2 right-2 z-20"
            onClick={(e) => e.preventDefault()}
          >
            <WishlistHeart productId={product.id} product={product} size="sm" />
          </div>

          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isNew && (
              <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-semibold uppercase">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-semibold uppercase">
                {discountPercentage}%
              </span>
            )}
            {!product.inStock && (
              <span className="px-1.5 py-0.5 bg-gray-800 text-white text-[9px] font-semibold uppercase">
                Out
              </span>
            )}
          </div>
        </Link>

        {product.inStock && (
          <>
            {/* Desktop: Hover Buttons (WHITE BG) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered && !isExpanded ? 1 : 0, y: isHovered && !isExpanded ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 bottom-2 z-10 hidden md:flex gap-1 px-2"
            >
              {onQuickAdd && (
                <button
                  onClick={handleQuickAdd}
                  className="flex-1 flex items-center justify-center gap-1 bg-white px-2 py-2 text-[10px] font-medium text-black hover:bg-black hover:text-white transition-all border border-gray-200"
                >
                  <ShoppingBag className="h-3 w-3" />
                  <span className="hidden lg:inline">ADD</span>
                </button>
              )}
              {onQuickView && (
                <button
                  onClick={handleQuickView}
                  className="flex-1 flex items-center justify-center gap-1 bg-white px-2 py-2 text-[10px] font-medium text-black hover:bg-black hover:text-white transition-all border border-gray-200"
                >
                  <Eye className="h-3 w-3" />
                  <span className="hidden lg:inline">VIEW</span>
                </button>
              )}
            </motion.div>

            {/* Mobile: Bottom Button (BLACK BG) */}
            <div className="md:hidden absolute inset-x-0 bottom-0 z-10">
              <button
                onClick={handleQuickAdd}
                className={cn(
                  "w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-medium uppercase tracking-wider transition-all",
                  isExpanded && selectedSize && selectedColor
                    ? "bg-black text-white"
                    : isExpanded
                      ? "bg-gray-800 text-gray-300"
                      : "bg-black text-white"
                )}
              >
                <ShoppingBag className="h-3 w-3" />
                <span>{isExpanded ? 'Add' : 'Add'}</span>
              </button>
            </div>

            {/* Expansion Panel */}
            <AnimatePresence>
              {isExpanded && (
                <>
                  {/* Desktop: Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hidden md:block absolute inset-0 bg-black/40 backdrop-blur-sm z-20"
                    onClick={handleBackdropClick}
                  />

                  {/* Desktop: Panel */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hidden md:flex absolute inset-2 z-30 items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-white border-2 border-black p-3 w-full space-y-3">
                      <button onClick={handleBackdropClick} className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                      <div>
                        <p className="text-[9px] font-semibold uppercase mb-1.5">{selectedColor || 'Color'}</p>
                        <div className="flex gap-1.5">
                          {product.colors.slice(0, 4).map((color) => (
                            <button
                              key={color.name}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColor(color.name); }}
                              className={`w-7 h-7 border-2 ${selectedColor === color.name ? 'border-black ring-1 ring-black' : 'border-gray-300'}`}
                              style={{ backgroundColor: color.hex }}
                            >
                              {selectedColor === color.name && <Check className="w-3 h-3 m-auto text-white drop-shadow" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase mb-1.5">{selectedSize || 'Size'}</p>
                        <div className="grid grid-cols-5 gap-1">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(size); }}
                              className={`py-1.5 text-[9px] font-medium border-2 ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300'}`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={handleQuickAdd}
                        className={`w-full py-2 text-[9px] font-medium uppercase ${selectedSize && selectedColor ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'}`}
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>

                  {/* Mobile: Bottom Expansion */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="md:hidden absolute inset-x-0 bottom-8 bg-white border-t-2 border-black z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2 space-y-2">
                      <div>
                        <p className="text-[9px] font-medium uppercase mb-1.5">{selectedColor || 'Color'}</p>
                        <div className="flex gap-1.5">
                          {product.colors.slice(0, 4).map((color) => (
                            <button
                              key={color.name}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColor(color.name); }}
                              className={`w-6 h-6 border-2 ${selectedColor === color.name ? 'border-black ring-1 ring-black' : 'border-gray-300'}`}
                              style={{ backgroundColor: color.hex }}
                            >
                              {selectedColor === color.name && <Check className="w-3 h-3 m-auto text-white drop-shadow-lg" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-medium uppercase mb-1.5">{selectedSize || 'Size'}</p>
                        <div className="grid grid-cols-5 gap-1">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(size); }}
                              className={`py-1.5 text-[10px] font-medium border-2 ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300'}`}
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

      <div className="space-y-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-xs md:text-sm font-medium line-clamp-2 group-hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="text-[10px] md:text-xs text-gray-600 capitalize">
          {product.category.replace("-", " ")}
        </p>
        <div className="flex items-center gap-1.5">
          <p className="text-xs md:text-sm font-semibold">
            {formatPrice(product.price)}
          </p>
          {hasDiscount && product.compareAtPrice && (
            <p className="text-[10px] text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}