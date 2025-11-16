"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Ruler, Timer, Eye, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuickViewModal from "@/components/modals/QuickViewModal";
import WishlistHeart from "@/components/wishlist/WishlistHeart";
import HomepageSearchBar from "@/components/search/HomepageSearchBar";
import SearchModal from "@/components/search/SearchModal";
import { CATEGORIES } from "@/lib/constants";
// ✅ REMOVED: import { MOCK_PRODUCTS } from "@/lib/product-data";
import { useQuickView } from "@/hooks/useQuickView";
import { useCartStore } from "@/store/cartStore";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface Banner {
  image: string;
  title: string;
  subtitle: string;
}

// PERFORMANCE: Memoized Hero Slide Component
const HeroSlide = memo(({
  banner,
  isActive,
  scrollY,
  index
}: {
  banner: Banner;
  isActive: boolean;
  scrollY: number;
  index: number;
}) => (
  <div
    className={`absolute inset-0 transition-opacity duration-1000 ease-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
  >
    <Image
      src={banner.image}
      alt={banner.title}
      fill
      className="object-cover object-center"
      style={{
        transform: `scale(1.05) translateY(${scrollY * 0.2}px)`,
      }}
      priority={index === 0}
      quality={85}
      sizes="100vw"
      loading={index === 0 ? "eager" : "lazy"}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30" />
  </div>
));

HeroSlide.displayName = "HeroSlide";

// CSS/SVG Fallback Visuals - HARMONIOUS GREY/BLACK/RED
const ServiceVisualFallback = memo(({ type }: { type: 'styling' | 'packaging' | 'craft' }) => {
  if (type === 'styling') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-neutral-200 via-gray-100 to-stone-200 overflow-hidden">
        {/* Elegant dress silhouette */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.25" fill="currentColor" className="text-black">
            {/* Head */}
            <circle cx="200" cy="70" r="35" />
            {/* Shoulders */}
            <line x1="165" y1="105" x2="140" y2="140" strokeWidth="10" stroke="currentColor" strokeLinecap="round" />
            <line x1="235" y1="105" x2="260" y2="140" strokeWidth="10" stroke="currentColor" strokeLinecap="round" />
            {/* Elegant dress */}
            <path d="M150 140 Q200 150 250 140 L270 380 Q200 400 130 380 Z" fillOpacity="0.8" />
            {/* Dress flowing lines */}
            <path d="M160 200 Q200 210 240 200" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
            <path d="M155 260 Q200 272 245 260" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
            <path d="M150 320 Q200 335 250 320" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
          </g>
          {/* Red accent - measuring tape */}
          <g className="text-red-600" opacity="0.3">
            <line x1="70" y1="250" x2="100" y2="250" strokeWidth="3" stroke="currentColor" strokeLinecap="round" />
            <line x1="300" y1="250" x2="330" y2="250" strokeWidth="3" stroke="currentColor" strokeLinecap="round" />
            <circle cx="85" cy="250" r="4" fill="currentColor" />
            <circle cx="315" cy="250" r="4" fill="currentColor" />
          </g>
        </svg>
      </div>
    );
  }

  if (type === 'packaging') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-neutral-200 via-gray-100 to-stone-200 overflow-hidden">
        {/* Luxury gift box */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.25" className="text-black">
            {/* Box base */}
            <rect x="110" y="160" width="180" height="180" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.7" />
            {/* Box lid */}
            <rect x="100" y="140" width="200" height="30" fill="currentColor" fillOpacity="0.8" />
            <rect x="100" y="135" width="200" height="5" fill="currentColor" opacity="0.3" />
          </g>

          {/* Red ribbon - luxury accent */}
          <g className="text-red-600" opacity="0.6">
            {/* Vertical ribbon */}
            <rect x="190" y="140" width="20" height="200" fill="currentColor" />
            {/* Horizontal ribbon */}
            <rect x="90" y="240" width="220" height="20" fill="currentColor" />

            {/* Elegant bow */}
            <ellipse cx="165" cy="145" rx="25" ry="12" fill="currentColor" />
            <ellipse cx="235" cy="145" rx="25" ry="12" fill="currentColor" />
            <circle cx="200" cy="145" r="10" fill="currentColor" />
          </g>

          {/* Subtle sparkles */}
          <g className="text-black" opacity="0.15">
            <circle cx="130" cy="100" r="3" />
            <circle cx="270" cy="120" r="2" />
            <circle cx="150" cy="380" r="3" />
            <circle cx="250" cy="400" r="2" />
          </g>
        </svg>
      </div>
    );
  }

  // type === 'craft'
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-neutral-200 via-gray-100 to-stone-200 overflow-hidden">
      {/* Artisan crafting tools */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.25" className="text-black">
          {/* Sewing needle */}
          <line x1="140" y1="80" x2="170" y2="280" strokeWidth="5" stroke="currentColor" strokeLinecap="round" />
          <circle cx="140" cy="80" r="12" fill="currentColor" />

          {/* Thread path */}
          <path d="M170 280 Q240 230 270 330"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,8"
            opacity="0.5" />

          {/* Scissors */}
          <circle cx="90" cy="380" r="24" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="145" cy="380" r="24" fill="none" stroke="currentColor" strokeWidth="4" />
          <line x1="117" y1="380" x2="117" y2="325" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

          {/* Fabric pattern */}
          <rect x="220" y="140" width="90" height="90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8,8" opacity="0.4" />
          <line x1="220" y1="165" x2="310" y2="165" stroke="currentColor" strokeWidth="0.5" />
          <line x1="220" y1="190" x2="310" y2="190" stroke="currentColor" strokeWidth="0.5" />
          <line x1="220" y1="215" x2="310" y2="215" stroke="currentColor" strokeWidth="0.5" />
        </g>

        {/* Red accent - stitching detail */}
        <g className="text-red-600" opacity="0.3">
          <path d="M80 450 L90 450 L92 448 L94 450 L104 450 L106 448 L108 450 L118 450"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round" />
          <path d="M280 100 L290 100 L292 98 L294 100 L304 100 L306 98 L308 100 L318 100"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
});

ServiceVisualFallback.displayName = "ServiceVisualFallback";

// Hybrid Service Card - Real Image or Fallback
const ServiceCard = memo(({
  type,
  title,
  description,
  href
}: {
  type: 'styling' | 'packaging' | 'craft';
  title: string;
  description: string;
  href: string;
}) => {
  const [imageError, setImageError] = useState(false);

  const imagePaths = {
    styling: '/services/personal-styling.jpg',
    packaging: '/services/luxury-packaging.jpg',
    craft: '/services/handcrafted.jpg'
  };

  return (
    <div className="group">
      <div className="relative aspect-[4/5] mb-5 overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500">
        {!imageError ? (
          <Image
            src={imagePaths[type]}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <ServiceVisualFallback type={type} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      <h3 className="text-lg md:text-xl font-light tracking-wide mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {description}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-medium border-b border-black pb-1 hover:gap-3 transition-all group"
      >
        <span>Discover More</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
});

ServiceCard.displayName = "ServiceCard";

// Best Seller Product Card with Quick View
const BestSellerCard = memo(({
  product,
  onQuickView,
  onQuickAdd
}: {
  product: Product;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      onQuickAdd(product);
    }
  };

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] mb-2 md:mb-3 overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Product Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
          />

          {/* Wishlist Heart */}
          <div className="absolute top-2 right-2 z-20">
            <WishlistHeart productId={product.id} product={product} size="sm" />
          </div>

          {/* Sale Badge */}
          {product.isOnSale && (
            <div className="absolute top-2 left-2 px-2 py-0.5 md:px-2.5 md:py-1 bg-red-600 text-white text-[10px] md:text-xs font-medium uppercase">
              SALE
            </div>
          )}

          {/* Quick Actions - Desktop Only */}
          {product.inStock && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10,
              }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-x-0 bottom-2 z-10 hidden md:flex gap-1 px-2"
            >
              <button
                onClick={handleQuickAdd}
                className="flex-1 flex items-center justify-center gap-1 bg-white px-2 py-2 text-[10px] font-medium text-black hover:bg-black hover:text-white transition-all"
                title="Quick Add"
              >
                <ShoppingBag className="h-3 w-3" />
                <span>ADD</span>
              </button>
              <button
                onClick={handleQuickView}
                className="flex-1 flex items-center justify-center gap-1 bg-white px-2 py-2 text-[10px] font-medium text-black hover:bg-black hover:text-white transition-all"
                title="Quick View"
              >
                <Eye className="h-3 w-3" />
                <span>VIEW</span>
              </button>
            </motion.div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div>
        <h3 className="text-xs md:text-sm font-medium mb-1 md:mb-1.5 line-clamp-2 group-hover:underline">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-sm md:text-base font-medium">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

BestSellerCard.displayName = "BestSellerCard";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplayKey, setAutoplayKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  // ✅ NEW: Backend state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Touch/Drag State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Keyboard Navigation State
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  // Pull to Refresh State
  const [pullStartY, setPullStartY] = useState<number>(0);
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const PULL_THRESHOLD = 80;

  // Quick View Hook
  const { isOpen, product: quickViewProduct, openQuickView, closeQuickView } = useQuickView();
  const { addItem: addToCart } = useCartStore();

  const heroBanners = useMemo<Banner[]>(() => [
    {
      image: "/banner/nowiht-slider-tracksuit-banner-1.png",
      title: "TRACKSUITS COLLECTION",
      subtitle: "Complete sets for the modern woman",
    },
    {
      image: "/banner/nowiht-slider-tracksuit-banner-3.jpg",
      title: "PREMIUM COMFORT & STYLE",
      subtitle: "Where performance meets elegance",
    },
    {
      image: "/banner/nowiht-slider-tracksuit-banner-4.png",
      title: "SUSTAINABLE LUXURY",
      subtitle: "Organic materials, timeless design",
    },
    {
      image: "/banner/nowiht-slider-tracksuit-banner-5.jpg",
      title: "ORGANIC ATHLEISURE",
      subtitle: "Elevated essentials for every occasion",
    },
    {
      image: "/banner/nowiht-slider-tracksuit-banner-6.jpg",
      title: "ELEVATED EVERYDAY WEAR",
      subtitle: "Crafted with care, designed to last",
    },
  ], []);

  // ✅ CHANGED: Best sellers from API
  const bestSellers = useMemo(() =>
    products.filter((p) => p.isBestSeller).slice(0, 4),
    [products]
  );

  const featuredCollections = useMemo(() =>
    CATEGORIES.slice(0, 3),
    []
  );

  // ✅ NEW: Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/products', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ... (rest of the hooks remain the same - autoplay, touch handlers, etc.)
  // Autoplay with pause support
  useEffect(() => {
    if (isAutoplayPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBanners.length, autoplayKey, isAutoplayPaused]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setAutoplayKey(prev => prev + 1);
  }, []);

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % heroBanners.length;
    goToSlide(next);
  }, [currentSlide, heroBanners.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + heroBanners.length) % heroBanners.length;
    goToSlide(prev);
  }, [currentSlide, heroBanners.length, goToSlide]);

  const toggleAutoplay = useCallback(() => {
    setIsAutoplayPaused(prev => !prev);
    setAutoplayKey(prev => prev + 1);
  }, []);

  // Touch Handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, nextSlide, prevSlide]);

  // Mouse Drag Handlers (Desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setTouchStart(e.clientX);
    setTouchEnd(null);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [isDragging, touchStart, touchEnd, nextSlide, prevSlide]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setTouchStart(null);
      setTouchEnd(null);
    }
  }, [isDragging]);

  // Keyboard Navigation Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          toggleAutoplay();
          break;
        case 'Escape':
          e.preventDefault();
          setIsAutoplayPaused(true);
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(heroBanners.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleAutoplay, goToSlide, heroBanners.length]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Quick Add Handler
  const handleQuickAdd = useCallback((product: Product) => {
    const defaultSize = product.sizes[0] || "M";
    const defaultColor = product.colors[0]?.name || "Black";
    addToCart(product, defaultSize, defaultColor, 1);
  }, [addToCart]);

  // Pull to Refresh Handlers
  const handlePullStart = useCallback((clientY: number) => {
    if (window.scrollY === 0 && !isRefreshing) {
      setPullStartY(clientY);
    }
  }, [isRefreshing]);

  const handlePullMove = useCallback((clientY: number) => {
    if (pullStartY > 0 && window.scrollY === 0 && !isRefreshing) {
      const distance = Math.max(0, clientY - pullStartY);
      const resistance = distance > PULL_THRESHOLD ? 0.5 : 1;
      setPullDistance(Math.min(distance * resistance, 120));
    }
  }, [pullStartY, isRefreshing, PULL_THRESHOLD]);

  const handlePullEnd = useCallback(() => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);

      setTimeout(() => {
        setIsRefreshing(false);
        setRefreshSuccess(true);
        setPullDistance(0);
        setPullStartY(0);

        setCurrentSlide(0);
        setAutoplayKey(prev => prev + 1);

        setTimeout(() => {
          setRefreshSuccess(false);
        }, 800);
      }, 1500);
    } else {
      setPullDistance(0);
      setPullStartY(0);
    }
  }, [pullDistance, isRefreshing, PULL_THRESHOLD]);

  const handlePageTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.innerWidth > 768) return;
    handlePullStart(e.touches[0].clientY);
  }, [handlePullStart]);

  const handlePageTouchMove = useCallback((e: React.TouchEvent) => {
    if (window.innerWidth > 768) return;
    handlePullMove(e.touches[0].clientY);
  }, [handlePullMove]);

  const handlePageTouchEnd = useCallback(() => {
    if (window.innerWidth > 768) return;
    handlePullEnd();
  }, [handlePullEnd]);

  if (!mounted) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black" />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <HomepageSearchBar onSearchClick={() => setIsSearchOpen(true)} />

      <main className="bg-white" onTouchStart={handlePageTouchStart} onTouchMove={handlePageTouchMove} onTouchEnd={handlePageTouchEnd}>
        {/* PULL TO REFRESH INDICATOR */}
        <AnimatePresence>
          {(pullDistance > 0 || isRefreshing || refreshSuccess) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
              style={{
                transform: `translateY(${isRefreshing ? '60px' : Math.min(pullDistance, 60)}px)`,
                transition: isRefreshing ? 'transform 0.3s ease-out' : 'none',
              }}
            >
              <div className="bg-white rounded-full shadow-lg px-6 py-4 flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: isRefreshing ? 360 : 0,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isRefreshing ? Infinity : 0,
                    ease: 'linear',
                  }}
                  className="relative w-8 h-8"
                >
                  <Image
                    src="/images/logo-black.png"
                    alt="NOWIHT"
                    fill
                    className="object-contain"
                  />
                </motion.div>

                <AnimatePresence mode="wait">
                  {refreshSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-black uppercase tracking-wider">Refreshed</span>
                    </motion.div>
                  ) : isRefreshing ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm font-medium text-black uppercase tracking-wider"
                    >
                      Loading...
                    </motion.span>
                  ) : pullDistance >= PULL_THRESHOLD ? (
                    <motion.span
                      key="release"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm font-medium text-black uppercase tracking-wider"
                    >
                      Release
                    </motion.span>
                  ) : (
                    <motion.span
                      key="pull"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm font-medium text-black uppercase tracking-wider"
                    >
                      Pull to refresh
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO SECTION - (unchanged, keeping all existing functionality) */}
        <section
          className={cn(
            "relative min-h-[650px] flex items-end overflow-hidden group select-none",
            "h-[calc(100vh-136px)] mt-[136px]",
            "lg:h-[95vh] lg:mt-0"
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          role="region"
          aria-label="Hero carousel"
          aria-roledescription="carousel"
        >
          <div className="absolute inset-0 bg-black pointer-events-none">
            {heroBanners.map((banner, index) => (
              <HeroSlide
                key={index}
                banner={banner}
                isActive={index === currentSlide}
                scrollY={scrollY}
                index={index}
              />
            ))}
          </div>

          <div className="relative z-20 text-center px-4 md:px-6 pb-12 md:pb-16 w-full pointer-events-none">
            <p className="text-sm text-white mb-2 md:mb-3 tracking-[0.3em] font-semibold uppercase animate-fade-in">
              WOMEN
            </p>
            <h1 className="text-lg md:text-xl text-white mb-3 md:mb-4 leading-tight max-w-3xl mx-auto font-semibold tracking-wide animate-fade-in animation-delay-200">
              {heroBanners[currentSlide].title}
            </h1>
            <Link
              href="/shop"
              className="inline-block text-xs text-white font-semibold tracking-[0.25em] uppercase border-b-2 border-white hover:border-white/70 pb-1 transition-all duration-300 animate-fade-in animation-delay-400 hover:scale-105 pointer-events-auto"
            >
              Shop Now
            </Link>
          </div>

          {isAutoplayPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 md:top-8 right-6 md:right-8 z-20 pointer-events-none"
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
                <span>Paused</span>
              </div>
            </motion.div>
          )}

          {/* Slide Counter & Dots */}
          <div className="absolute bottom-6 md:bottom-8 left-4 md:left-8 lg:left-12 z-20 pointer-events-auto">
            <div className="mb-3 text-white/60 text-[10px] md:text-[11px] tracking-[0.2em] font-light">
              {String(currentSlide + 1).padStart(2, '0')} / {String(heroBanners.length).padStart(2, '0')}
            </div>
            <div className="flex gap-2 md:gap-3" role="tablist" aria-label="Carousel navigation">
              {heroBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-[1px] transition-all duration-500 hover:scale-y-150 ${index === currentSlide
                    ? "bg-white w-12 md:w-16"
                    : "bg-white/25 hover:bg-white/40 w-8 md:w-10"
                    }`}
                  role="tab"
                  aria-label={`Go to slide ${index + 1}: ${heroBanners[index].title}`}
                  aria-selected={index === currentSlide}
                  aria-controls={`carousel-slide-${index}`}
                />
              ))}
            </div>
          </div>

          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white hover:text-black hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/30 hover:border-white backdrop-blur-sm hover:scale-110 pointer-events-auto focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Previous slide"
            tabIndex={0}
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white hover:text-black hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/30 hover:border-white backdrop-blur-sm hover:scale-110 pointer-events-auto focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Next slide"
            tabIndex={0}
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Screen Reader Announcements */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            Slide {currentSlide + 1} of {heroBanners.length}: {heroBanners[currentSlide].title}
          </div>
        </section>

        {/* FEATURED COLLECTIONS */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide mb-2">
                Featured Collections
              </h2>
              <p className="text-sm md:text-base text-gray-600">Curated for the modern woman</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
              {featuredCollections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/shop/${collection.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 text-white">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-medium mb-1 md:mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-xs md:text-sm text-white/80 mb-2 md:mb-3 line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center gap-1.5 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs md:text-sm tracking-wide font-medium">SHOP NOW</span>
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ BEST SELLERS - NOW FROM BACKEND */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-6 md:mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide mb-1">Best Sellers</h2>
                <p className="text-sm md:text-base text-gray-600">Our most loved pieces</p>
              </div>
              <Link
                href="/shop?filter=bestsellers"
                className="hidden md:flex items-center gap-2 text-xs md:text-sm tracking-wide hover:gap-3 transition-all duration-300 group"
              >
                <span className="group-hover:underline underline-offset-4">VIEW ALL</span>
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* ✅ Loading State */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 mb-2 md:mb-3" />
                    <div className="h-4 bg-gray-200 mb-2" />
                    <div className="h-4 bg-gray-200 w-1/2" />
                  </div>
                ))}
              </div>
            ) : bestSellers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                {bestSellers.map((product) => (
                  <BestSellerCard
                    key={product.id}
                    product={product}
                    onQuickView={openQuickView}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            ) : (
              /* ✅ Empty State */
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No best sellers yet. Add products from the admin panel!</p>
                <Link href="/admin/products" className="inline-block px-6 py-3 bg-black text-white hover:bg-red-600 transition-colors">
                  Go to Admin
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* LUXURY COMMITMENTS */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              <div className="text-center">
                <h3 className="text-[10px] md:text-xs tracking-[0.3em] text-gray-500 uppercase mb-4">
                  SHIPPING
                </h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-light mb-2 tracking-wide">
                  Worldwide Shipping
                </p>
                <p className="text-xs md:text-sm text-gray-400">
                  We ship to every country
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-[10px] md:text-xs tracking-[0.3em] text-gray-500 uppercase mb-4">
                  SUSTAINABILITY
                </h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-light mb-2 tracking-wide">
                  Carbon-Neutral Delivery
                </p>
                <p className="text-xs md:text-sm text-gray-400">
                  Committed to our planet
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-[10px] md:text-xs tracking-[0.3em] text-gray-500 uppercase mb-4">
                  CRAFTSMANSHIP
                </h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-light mb-2 tracking-wide">
                  Ethical Manufacturing
                </p>
                <p className="text-xs md:text-sm text-gray-400">
                  Fair wages, safe conditions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VIRTUAL STYLING STUDIO */}
        <section className="py-14 md:py-18 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide mb-2">
                Your Personal Styling Experience
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Luxury service, tailored to you
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
              <div className="bg-white p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border-2 border-black">
                    <Ruler className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-medium mb-2">Virtual Fitting Room</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Try before you buy with our advanced virtual fitting technology.
                      Upload your measurements and see how each piece fits your unique body shape.
                    </p>
                    <Link
                      href="/virtual-fitting"
                      className="inline-flex items-center gap-2 text-sm font-medium group"
                    >
                      <span>Start Fitting</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border-2 border-black">
                    <Timer className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-medium mb-2">Personal Stylist</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Book a complimentary 30-minute consultation with our expert stylists.
                      Get personalized recommendations based on your style preferences and lifestyle.
                    </p>
                    <Link
                      href="/book-stylist"
                      className="inline-flex items-center gap-2 text-sm font-medium group"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUSTAINABILITY MESSAGE */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <span className="text-[10px] tracking-[0.4em] text-gray-400 uppercase block mb-4">
              Our Commitment
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide mb-5 md:mb-6">
              Organic & Sustainable
            </h2>
            <p className="text-base md:text-lg text-gray-300 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
              Every piece is crafted from premium organic cotton and sustainable materials. We're
              committed to zero-waste production and ethical manufacturing practices.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 px-8 md:px-10 py-3 md:py-3.5 border border-white hover:bg-white hover:text-black transition-all duration-300 text-sm md:text-base tracking-wider group"
            >
              <span>LEARN MORE</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* THE NOWIHT EXPERIENCE - HYBRID SYSTEM */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide mb-2">
                The NOWIHT Experience
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Where luxury meets craftsmanship
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <ServiceCard
                type="styling"
                title="Personal Styling"
                description="Complimentary consultations with our expert stylists for curated looks."
                href="/services/styling"
              />

              <ServiceCard
                type="packaging"
                title="Luxury Experience"
                description="Every order arrives in signature sustainable packaging with care."
                href="/services/packaging"
              />

              <ServiceCard
                type="craft"
                title="Handcrafted"
                description="Each piece crafted with precision by skilled artisans with 12+ years experience."
                href="/services/craftsmanship"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isOpen}
        onClose={closeQuickView}
      />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  );
}