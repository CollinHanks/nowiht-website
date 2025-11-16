"use client";

import { useState, useCallback } from "react";
import type { Product } from "@/types";

interface UseQuickViewReturn {
  isOpen: boolean;
  product: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

/**
 * Custom hook for managing Quick View modal state
 * 
 * @description
 * Provides a clean interface for managing the Quick View modal across the application.
 * Handles modal open/close state and product selection with proper cleanup.
 * 
 * @usage
 * ```tsx
 * const { isOpen, product, openQuickView, closeQuickView } = useQuickView();
 * 
 * <ProductCard onQuickView={openQuickView} />
 * <QuickViewModal product={product} isOpen={isOpen} onClose={closeQuickView} />
 * ```
 * 
 * @returns {UseQuickViewReturn} Object containing modal state and control functions
 */
export function useQuickView(): UseQuickViewReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const openQuickView = useCallback((selectedProduct: Product) => {
    setProduct(selectedProduct);
    setIsOpen(true);

    // Prevent body scroll when modal opens
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const closeQuickView = useCallback(() => {
    setIsOpen(false);

    // Restore body scroll
    if (typeof window !== "undefined") {
      document.body.style.overflow = "unset";
    }

    // Delay clearing product to allow modal exit animation (300ms matches Framer Motion default)
    setTimeout(() => {
      setProduct(null);
    }, 300);
  }, []);

  return {
    isOpen,
    product,
    openQuickView,
    closeQuickView,
  };
}