"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import RelatedProducts from "@/components/product/RelatedProducts";
import { Button } from "@/components/ui/Button";
// 🔥 FIXED: Use Supabase instead of mock data
import { getProductBySlug } from "@/lib/supabase/products";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToast } from "@/store/toastStore";
import { addToRecentlyViewed } from "@/lib/recentlyViewed";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Check,
  X,
  Package,
  Clock,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 🚀 LAZY LOADED COMPONENTS (Client-side only)
// ═══════════════════════════════════════════════════════════════

// LAZY: QuickViewModal (~40KB)
const QuickViewModal = dynamic(
  () => import("@/components/modals/QuickViewModal"),
  {
    loading: () => (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg overflow-hidden w-full max-w-4xl animate-pulse">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="aspect-[3/4] bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// LAZY: SizeRecommendation (~25KB)
const SizeRecommendation = dynamic(
  () => import("@/components/product/SizeRecommendation"),
  {
    loading: () => (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // 🔥 FIXED: State for async product loading
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCartStore();
  const toast = useToast();

  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "delivery" | "reviews">("description");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showSizeRecommendation, setShowSizeRecommendation] = useState(false);

  // Quick View State
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Mobile Gallery Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);

  // 🔥 FIXED: Load product from database
  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const productData = await getProductBySlug(slug);
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  // Track product view for Recently Viewed
  useEffect(() => {
    if (product) {
      const timer = setTimeout(() => {
        addToRecentlyViewed(product);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
            <p className="text-sm text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Product not found
  if (!product) {
    return (
      <>
        <Header />
        <main className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <Link href="/shop" className="text-sm underline">
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warning('Please select a size', 'Choose your preferred size to continue');
      return;
    }
    if (!selectedColor) {
      toast.warning('Please select a color', 'Choose your preferred color to continue');
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    toast.success('Added to cart', `${product.name} (${selectedSize}, ${selectedColor})`);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist', product.name);
    } else {
      addToWishlist({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        images: product.images,
        category: product.category,
        isOnSale: product.isOnSale,
        addedAt: new Date().toISOString(),
      });
      toast.success('Added to wishlist', product.name);
    }
  };

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    toast.success('Size selected', `Size ${size} recommended based on your measurements`);
  };

  const nextImage = () => {
    setMainImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setMainImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  // Mobile Gallery Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && mainImageIndex < product.images.length - 1) {
      nextImage();
    } else if (isRightSwipe && mainImageIndex > 0) {
      prevImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Double Tap to Zoom
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      setIsZoomed(!isZoomed);
    }
    setLastTap(now);
  };

  // Quick View Handlers
  const handleQuickView = (productToView: Product) => {
    setQuickViewProduct(productToView);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Quick Add Handler
  const handleQuickAdd = (productToAdd: Product, size: string, color: string) => {
    addItem(productToAdd, size, color, 1);
    toast.success('Added to cart', `${productToAdd.name} (${size}, ${color})`);
  };

  // 🔥 FIXED: Check in_stock field (snake_case) instead of inStock
  const isInStock = product.in_stock ?? (product.stock || 0) > 0;

  return (
    <>
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Breadcrumb */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 py-3 md:py-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5 md:gap-2 text-xs text-gray-600 overflow-x-auto scrollbar-hide">
            <Link href="/" className="hover:text-black transition-colors whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/shop" className="hover:text-black transition-colors whitespace-nowrap">
              Shop
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link
              href={`/shop/${product.category}`}
              className="hover:text-black transition-colors capitalize whitespace-nowrap"
            >
              {product.category.replace("-", " ")}
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-black truncate">{product.name}</span>
          </div>
        </div>

        {/* Product Section - Mobile First */}
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-12">
            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-3">
              {/* Main Image */}
              <div
                className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-3 md:mb-4 group select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={handleDoubleTap}
              >
                <Image
                  src={product.images[mainImageIndex]}
                  alt={`${product.name} - View ${mainImageIndex + 1}`}
                  fill
                  className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  quality={100}
                  unoptimized={true}
                  priority
                />

                {/* Navigation Arrows - Desktop Only */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                {hasDiscount && (
                  <span className="absolute top-3 md:top-4 left-3 md:left-4 px-2 py-1 md:px-3 md:py-1.5 bg-red-600 text-white text-[10px] md:text-xs font-medium uppercase tracking-wider z-10">
                    {discountPercentage}% Off
                  </span>
                )}
                {product.isNew && (
                  <span className="absolute top-3 md:top-4 right-3 md:right-4 px-2 py-1 md:px-3 md:py-1.5 bg-black text-white text-[10px] md:text-xs font-medium uppercase tracking-wider z-10">
                    New
                  </span>
                )}

                {/* Dots Indicator - Mobile Only */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 md:hidden">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMainImageIndex(index);
                        }}
                        className={`h-[2px] transition-all duration-300 ${index === mainImageIndex
                          ? 'w-8 bg-white'
                          : 'w-2 bg-white/40 hover:bg-white/60'
                          }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 px-2 py-1 md:px-3 md:py-1 bg-black/70 text-white text-[10px] md:text-xs rounded-full z-10">
                  {mainImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery - Desktop */}
              <div className="hidden md:grid md:grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className={`relative aspect-[3/4] bg-gray-50 overflow-hidden transition-all ${mainImageIndex === index
                      ? "ring-2 ring-black ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                      quality={100}
                      unoptimized={true}
                    />
                  </button>
                ))}
              </div>

              {/* Mobile Thumbnail Carousel */}
              <div className="md:hidden overflow-x-auto flex gap-2 pb-2 scrollbar-hide snap-x snap-mandatory">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 md:w-20 aspect-[3/4] bg-gray-50 overflow-hidden transition-all snap-start ${mainImageIndex === index
                      ? "ring-2 ring-black ring-offset-1"
                      : "opacity-60"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      quality={100}
                      unoptimized={true}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 space-y-4 md:space-y-6">
                {/* Title & Price */}
                <div className="pb-4 md:pb-6 border-b border-gray-200">
                  <p className="text-[10px] md:text-xs text-gray-600 uppercase tracking-wider mb-2">
                    {product.category.replace("-", " ")}
                  </p>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">{product.name}</h1>

                  <div className="flex items-baseline gap-2 md:gap-3 mb-2 md:mb-3">
                    <p className="text-2xl md:text-3xl font-bold">{formatPrice(product.price)}</p>
                    {hasDiscount && (
                      <>
                        <p className="text-base md:text-lg text-gray-500 line-through">
                          {formatPrice(product.compareAtPrice!)}
                        </p>
                        <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-red-50 text-red-600 text-[10px] md:text-xs font-semibold">
                          Save {discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* 🔥 FIXED: Stock Status - use in_stock field */}
                  <div className="flex items-center gap-2">
                    {isInStock ? (
                      <>
                        <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                        <span className="text-xs md:text-sm text-green-600 font-medium">In Stock</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-600" />
                        <span className="text-xs md:text-sm text-red-600 font-medium">Out of Stock</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{product.description}</p>

                {/* Color Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <label className="text-xs md:text-sm font-semibold">
                      Color:{" "}
                      {selectedColor && (
                        <span className="font-normal text-gray-600">{selectedColor}</span>
                      )}
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`relative w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 transition-all ${selectedColor === color.name
                          ? "border-black ring-2 ring-black ring-offset-2"
                          : "border-gray-300 hover:border-gray-400"
                          }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        aria-label={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check className="w-4 h-4 md:w-5 md:h-5 absolute inset-0 m-auto text-white drop-shadow-lg" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <label className="text-xs md:text-sm font-semibold">Size</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowSizeRecommendation(true)}
                        className="text-[10px] md:text-xs underline hover:no-underline text-black font-semibold"
                      >
                        Find My Size
                      </button>
                      <span className="text-gray-300 text-[10px]">|</span>
                      <button
                        onClick={() => setShowSizeGuide(true)}
                        className="text-[10px] md:text-xs underline hover:no-underline"
                      >
                        Size Guide
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 md:gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 md:py-3 text-xs md:text-sm font-medium border-2 transition-all ${selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-xs md:text-sm font-semibold block mb-2 md:mb-3">Quantity</label>
                  <div className="inline-flex items-center border-2 border-gray-300">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 md:px-4 md:py-2 hover:bg-gray-50 transition-colors text-sm md:text-base"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 md:px-6 md:py-2 font-medium border-x-2 border-gray-300 text-sm md:text-base min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 md:px-4 md:py-2 hover:bg-gray-50 transition-colors text-sm md:text-base"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart - MOBILE OPTIMIZED */}
                <div className="space-y-2 md:space-y-3 pt-2 md:pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                    className="text-xs md:text-sm h-12 md:h-auto"
                  >
                    {isInStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleWishlistToggle}
                      className={`flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2.5 md:px-4 md:py-2.5 border-2 transition-all text-xs md:text-sm ${isWishlisted
                        ? "border-red-600 text-red-600 bg-red-50"
                        : "border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-all ${isWishlisted ? "fill-red-600" : "fill-none"
                          }`}
                      />
                      <span className="hidden sm:inline">{isWishlisted ? "In Wishlist" : "Wishlist"}</span>
                      <span className="sm:hidden">{isWishlisted ? "Saved" : "Save"}</span>
                    </button>
                    <button className="flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2.5 md:px-4 md:py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors text-xs md:text-sm">
                      <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="border-t border-gray-200 pt-4 md:pt-6 space-y-3 md:space-y-4">
                  <div className="flex gap-2.5 md:gap-3">
                    <Truck className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs md:text-sm font-semibold">Free Delivery</p>
                      <p className="text-[10px] md:text-xs text-gray-600">On orders over $100</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 md:gap-3">
                    <Package className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs md:text-sm font-semibold">Express Shipping</p>
                      <p className="text-[10px] md:text-xs text-gray-600">Get it within 2-3 business days</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 md:gap-3">
                    <RefreshCw className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs md:text-sm font-semibold">Easy Returns</p>
                      <p className="text-[10px] md:text-xs text-gray-600">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 md:gap-3">
                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs md:text-sm font-semibold">Secure Payment</p>
                      <p className="text-[10px] md:text-xs text-gray-600">100% secure transactions</p>
                    </div>
                  </div>
                </div>

                {/* Product Highlights */}
                <div className="bg-gray-50 p-3 md:p-4 rounded space-y-1.5 md:space-y-2">
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Product Highlights
                  </p>
                  <ul className="space-y-1 md:space-y-1.5">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-1.5 md:gap-2 text-xs md:text-sm text-gray-700">
                        <Check className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 mt-0.5 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16 border-t border-gray-200">
          {/* Tabs */}
          <div className="flex gap-4 md:gap-8 border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-3 md:pb-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "description"
                ? "border-b-2 border-black"
                : "text-gray-600 hover:text-black"
                }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`pb-3 md:pb-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "delivery"
                ? "border-b-2 border-black"
                : "text-gray-600 hover:text-black"
                }`}
            >
              Delivery & Returns
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 md:pb-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "reviews"
                ? "border-b-2 border-black"
                : "text-gray-600 hover:text-black"
                }`}
            >
              Reviews (12)
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl">
            {activeTab === "description" && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">About This Product</h3>
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{product.description}</p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Material & Care</h3>
                  <p className="text-xs md:text-sm text-gray-700 mb-2">
                    <strong>Material:</strong> {product.material}
                  </p>
                  <p className="text-xs md:text-sm text-gray-700 font-semibold mb-2">Care Instructions:</p>
                  <ul className="space-y-1">
                    {product.care.map((instruction, index) => (
                      <li key={index} className="text-xs md:text-sm text-gray-700 pl-4">
                        • {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Delivery Information</h3>
                  <p className="text-xs md:text-sm text-gray-700 mb-4">
                    We offer free standard shipping on orders over $100. Express shipping options
                    are available at checkout.
                  </p>
                  <ul className="space-y-2 text-xs md:text-sm">
                    <li className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 flex-shrink-0" />
                      <span>Standard Delivery: 5-7 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 flex-shrink-0" />
                      <span>Express Delivery: 2-3 business days</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Returns Policy</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    We accept returns within 30 days of delivery. Items must be unworn, unwashed,
                    and in original condition with tags attached.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-bold">4.8</p>
                    <div className="flex gap-1 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-black" />
                      ))}
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-600">Based on 12 reviews</p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600">Reviews coming soon...</p>
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        <RelatedProducts
          product={product}
          limit={8}
          title="You May Also Like"
          onQuickView={handleQuickView}
          onQuickAdd={handleQuickAdd}
        />

        {/* Recently Viewed */}
        <RecentlyViewed
          excludeId={product.id}
          limit={8}
          onQuickView={handleQuickView}
        />

        {/* LAZY LOADED: Size Recommendation Modal */}
        {showSizeRecommendation && (
          <Suspense fallback={null}>
            <SizeRecommendation
              isOpen={showSizeRecommendation}
              onClose={() => setShowSizeRecommendation(false)}
              category={product.category}
              onSelectSize={handleSelectSize}
            />
          </Suspense>
        )}

        {/* Size Guide Modal */}
        {showSizeGuide && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <div
              className="bg-white max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Size Guide</h2>
                <button onClick={() => setShowSizeGuide(false)}>
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
              <div className="space-y-3 md:space-y-4">
                <p className="text-xs md:text-sm text-gray-600">
                  Measurements are in inches. For the best fit, we recommend measuring yourself
                  and comparing to the size chart below.
                </p>
                <div className="border border-gray-200 overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold">Size</th>
                        <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold">Bust</th>
                        <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold">Waist</th>
                        <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold">Hips</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="px-3 py-2 md:px-4 md:py-3">XS</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">32-34</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">24-26</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">34-36</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="px-3 py-2 md:px-4 md:py-3">S</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">34-36</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">26-28</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">36-38</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="px-3 py-2 md:px-4 md:py-3">M</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">36-38</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">28-30</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">38-40</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="px-3 py-2 md:px-4 md:py-3">L</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">38-40</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">30-32</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">40-42</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="px-3 py-2 md:px-4 md:py-3">XL</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">40-42</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">32-34</td>
                        <td className="px-3 py-2 md:px-4 md:py-3">42-44</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* LAZY LOADED: Quick View Modal */}
      {isQuickViewOpen && quickViewProduct && (
        <Suspense fallback={null}>
          <QuickViewModal
            product={quickViewProduct}
            isOpen={isQuickViewOpen}
            onClose={handleCloseQuickView}
          />
        </Suspense>
      )}

      <Footer />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}