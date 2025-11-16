"use client";

import { useState, useEffect } from "react";
import {
  getRecentlyViewed,
  addToRecentlyViewed,
  clearRecentlyViewed,
  type RecentlyViewedItem,
} from "@/lib/recentlyViewed";
import type { Product } from "@/types";

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items on mount (client-side only)
  useEffect(() => {
    const loadItems = () => {
      const viewedItems = getRecentlyViewed();
      setItems(viewedItems);
      setIsLoading(false);
    };

    loadItems();

    // Listen for storage changes (sync across tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nowiht-recently-viewed") {
        loadItems();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Add product to recently viewed
  const addProduct = (product: Product) => {
    addToRecentlyViewed(product);
    setItems(getRecentlyViewed());
  };

  // Clear all
  const clearAll = () => {
    clearRecentlyViewed();
    setItems([]);
  };

  return {
    items,
    isLoading,
    addProduct,
    clearAll,
    hasItems: items.length > 0,
  };
}