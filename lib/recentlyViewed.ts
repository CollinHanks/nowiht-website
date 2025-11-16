import type { Product } from "@/types";

const STORAGE_KEY = "nowiht-recently-viewed";
const MAX_ITEMS = 12; // Store max 12, display 8

export interface RecentlyViewedItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
  isOnSale?: boolean;
  viewedAt: string;
}

/**
 * Get recently viewed products from localStorage
 */
export const getRecentlyViewed = (): RecentlyViewedItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const items: RecentlyViewedItem[] = JSON.parse(data);

    // Sort by viewedAt (most recent first)
    return items.sort(
      (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    );
  } catch (error) {
    console.error("Error reading recently viewed:", error);
    return [];
  }
};

/**
 * Add product to recently viewed
 */
export const addToRecentlyViewed = (product: Product): void => {
  if (typeof window === "undefined") return;

  try {
    const items = getRecentlyViewed();

    // Remove if already exists (to update timestamp)
    const filtered = items.filter((item) => item.id !== product.id);

    // Create new item
    const newItem: RecentlyViewedItem = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      images: product.images,
      category: product.category,
      inStock: product.inStock,
      isOnSale: product.isOnSale,
      viewedAt: new Date().toISOString(),
    };

    // Add to beginning and limit to MAX_ITEMS
    const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving recently viewed:", error);
  }
};

/**
 * Clear all recently viewed products
 */
export const clearRecentlyViewed = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing recently viewed:", error);
  }
};

/**
 * Remove specific product from recently viewed
 */
export const removeFromRecentlyViewed = (productId: string): void => {
  if (typeof window === "undefined") return;

  try {
    const items = getRecentlyViewed();
    const filtered = items.filter((item) => item.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing from recently viewed:", error);
  }
};