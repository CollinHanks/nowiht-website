"use client";

/**
 * NOWIHT Product Skeleton
 * - Minimal shimmer animation
 * - Used in shop page, collections
 * - Louis Vuitton aesthetic: subtle, elegant
 */
export default function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="group relative animate-pulse"
          style={{
            animationDelay: `${i * 0.05}s`,
          }}
        >
          {/* Image Skeleton */}
          <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Text Skeletons */}
          <div className="space-y-3">
            {/* Category */}
            <div className="h-3 w-16 bg-gray-100 rounded" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>

            {/* Price */}
            <div className="h-5 w-20 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Single Product Detail Skeleton
 * - For product detail page
 */
export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 animate-pulse">
      {/* Image Gallery Skeleton */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-100 overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className="space-y-6">
        {/* Category */}
        <div className="h-3 w-24 bg-gray-100 rounded" />

        {/* Title */}
        <div className="space-y-3">
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-8 w-1/2 bg-gray-200 rounded" />
        </div>

        {/* Price */}
        <div className="h-10 w-32 bg-gray-100 rounded" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
        </div>

        {/* Size Selector */}
        <div className="space-y-3">
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-12 bg-gray-100 rounded" />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <div className="h-14 w-full bg-gray-200 rounded" />
          <div className="h-14 w-full bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Cart Item Skeleton
 * - For cart drawer
 */
export function CartItemSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 py-4 border-b animate-pulse">
          {/* Image */}
          <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
            <div className="h-5 w-20 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}