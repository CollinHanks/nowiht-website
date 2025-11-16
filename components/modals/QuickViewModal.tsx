"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Minus, Plus, Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const { addItem: addToCart } = useCartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const isInWishlist = product ? wishlistItems.some((item) => item.id === product.id) : false;
  const hasDiscount = product?.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount && product?.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0]?.name || "");
      setQuantity(1);
      setCurrentImageIndex(0);
    }
  }, [product]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        ...product,
        addedAt: new Date().toISOString(),
      });
    }
  };

  // Image navigation
  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (!product) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 bg-black/80"
                onClick={onClose}
              />
            </Dialog.Overlay>

            {/* Content - Desktop Only (hidden on mobile) */}
            <div className="hidden md:flex fixed inset-0 z-[60] items-center justify-center p-6 pointer-events-none">
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative w-full max-w-5xl max-h-[90vh] pointer-events-auto bg-white shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center bg-white border border-gray-300 transition-all duration-300 hover:bg-black hover:text-white hover:border-black"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] max-h-[90vh] overflow-hidden">
                    {/* Left: Image Gallery - FIXED: quality=100 + unoptimized */}
                    <div className="relative bg-gray-100 overflow-hidden">
                      {/* Maintain 3:4 aspect ratio */}
                      <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
                        {/* Badges - Minimal */}
                        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
                          {product.isNew && (
                            <span className="px-2 py-0.5 bg-black text-white text-[9px] font-medium uppercase tracking-wider">
                              New
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-medium uppercase tracking-wider">
                              {discountPercentage}%
                            </span>
                          )}
                        </div>

                        {/* Image */}
                        <Image
                          src={product.images[currentImageIndex]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="55vw"
                          quality={100}
                          unoptimized={true}
                          priority
                        />

                        {/* Navigation Arrows */}
                        {product.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center bg-white border border-gray-300 transition-all hover:bg-black hover:text-white"
                              aria-label="Previous"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center bg-white border border-gray-300 transition-all hover:bg-black hover:text-white"
                              aria-label="Next"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                              {product.images.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentImageIndex(idx)}
                                  className={cn(
                                    "h-1 rounded-full transition-all",
                                    idx === currentImageIndex ? "w-6 bg-white" : "w-1 bg-white/50"
                                  )}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right: Product Info - Scrollable */}
                    <div className="overflow-y-auto scrollbar-thin p-8 lg:p-10">
                      {/* Brand */}
                      {product.brand && (
                        <p className="text-[10px] tracking-widest text-gray-500 uppercase mb-3">
                          {product.brand}
                        </p>
                      )}

                      {/* Title */}
                      <Dialog.Title asChild>
                        <h2 className="text-2xl lg:text-3xl font-medium tracking-tight mb-4">
                          {product.name}
                        </h2>
                      </Dialog.Title>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-5">
                        {hasDiscount ? (
                          <>
                            <span className="text-3xl font-semibold text-red-600">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                              {formatPrice(product.compareAtPrice!)}
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-semibold">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <Dialog.Description asChild>
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                          {product.description}
                        </p>
                      </Dialog.Description>

                      <div className="h-px bg-gray-200 mb-6" />

                      {/* Size */}
                      <div className="mb-5">
                        <label className="block text-xs font-medium uppercase tracking-wider mb-3">
                          Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={cn(
                                "h-10 min-w-[48px] px-4 text-sm font-medium transition-all",
                                selectedSize === size
                                  ? "bg-black text-white"
                                  : "bg-white border border-gray-300 hover:border-black"
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color - YUVARLAK (ProductCard ile aynı) */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-5">
                          <label className="block text-xs font-medium uppercase tracking-wider mb-3">
                            Color
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {product.colors.map((color) => (
                              <button
                                key={color.name}
                                onClick={() => setSelectedColor(color.name)}
                                onMouseEnter={() => setHoveredColor(color.name)}
                                onMouseLeave={() => setHoveredColor(null)}
                                className="relative group"
                                title={color.name}
                              >
                                {/* YUVARLAK - ProductCard ile aynı */}
                                <div
                                  className={cn(
                                    "w-8 h-8 rounded-full border-2 transition-all",
                                    selectedColor === color.name
                                      ? "border-black scale-110"
                                      : "border-gray-300 hover:border-black"
                                  )}
                                  style={{ backgroundColor: color.hex }}
                                />

                                {/* Tooltip */}
                                <AnimatePresence>
                                  {hoveredColor === color.name && (
                                    <motion.span
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0 }}
                                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] whitespace-nowrap pointer-events-none z-10"
                                    >
                                      {color.name}
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quantity */}
                      <div className="mb-6">
                        <label className="block text-xs font-medium uppercase tracking-wider mb-3">
                          Quantity
                        </label>
                        <div className="flex items-center border border-gray-300 w-fit">
                          <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="h-10 w-12 flex items-center justify-center text-sm font-medium border-x border-gray-300">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="h-px bg-gray-200 mb-6" />

                      {/* Actions */}
                      <div className="space-y-3">
                        {/* Add to Cart */}
                        <button
                          onClick={handleAddToCart}
                          disabled={!product.inStock || !selectedSize || !selectedColor}
                          className={cn(
                            "w-full h-12 flex items-center justify-center gap-2 bg-black text-white text-xs font-medium uppercase tracking-wider transition-all",
                            !product.inStock || !selectedSize || !selectedColor
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:bg-gray-900"
                          )}
                        >
                          <ShoppingBag className="h-4 w-4" />
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>

                        {/* Secondary Actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={handleWishlistToggle}
                            className={cn(
                              "h-11 flex items-center justify-center gap-2 border text-xs font-medium uppercase tracking-wider transition-all",
                              isInWishlist
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-black"
                            )}
                          >
                            <Heart className={cn("h-4 w-4", isInWishlist && "fill-white")} />
                            <span className="hidden lg:inline">{isInWishlist ? "Saved" : "Save"}</span>
                          </button>

                          <Link
                            href={`/product/${product.slug}`}
                            onClick={onClose}
                            className="h-11 flex items-center justify-center border border-gray-300 text-xs font-medium uppercase tracking-wider hover:border-black transition-all"
                          >
                            Details
                          </Link>
                        </div>
                      </div>

                      {/* Material */}
                      {product.material && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <p className="text-xs text-gray-600">
                            <span className="font-medium text-black">Material:</span> {product.material}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}