"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onQuickView?: (product: Product) => void;
}

// Stagger animation variants - using 'as const' for type safety
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
} as const;

export default function ProductGrid({
  products,
  isLoading = false,
  onQuickView,
}: ProductGridProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200" />
            <div className="mt-4 space-y-3">
              <div className="h-3 w-20 bg-gray-200" />
              <div className="h-4 w-full bg-gray-200" />
              <div className="h-4 w-24 bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No products found
  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <div className="text-6xl">🔍</div>
        <h3 className="text-xl font-medium tracking-wide">No Products Found</h3>
        <p className="max-w-md text-sm text-gray-600">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product, index) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard
            product={product}
            onQuickView={onQuickView}
            priority={index < 4} // Prioritize first 4 images
          />
        </motion.div>
      ))}
    </motion.div>
  );
}