/**
 * NOWIHT Search Logic
 * Improved search with category matching, fuzzy search, and better relevance
 */

import { MOCK_PRODUCTS } from "./product-data";
import { CATEGORIES } from "./constants";

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  relevance: number; // Search relevance score
}

/**
 * Normalize text for search comparison
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, " "); // Normalize spaces
};

/**
 * Calculate similarity score between two strings (0-1)
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);

  // Exact match
  if (s1 === s2) return 1.0;

  // Contains match
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  // Word match
  const words1 = s1.split(" ");
  const words2 = s2.split(" ");
  const matchingWords = words1.filter((w) => words2.some((w2) => w2.includes(w) || w.includes(w2)));
  if (matchingWords.length > 0) {
    return 0.5 + (matchingWords.length / Math.max(words1.length, words2.length)) * 0.3;
  }

  // Character overlap (simple fuzzy)
  let matches = 0;
  const minLen = Math.min(s1.length, s2.length);
  for (let i = 0; i < minLen; i++) {
    if (s1[i] === s2[i]) matches++;
  }
  return matches / Math.max(s1.length, s2.length) * 0.3;
};

/**
 * Search products with improved relevance scoring
 */
export const searchProducts = (query: string, limit: number = 20): SearchResult[] => {
  if (!query || query.trim().length < 2) return [];

  const normalizedQuery = normalizeText(query);
  const queryWords = normalizedQuery.split(" ");

  const results = MOCK_PRODUCTS.map((product) => {
    let relevance = 0;

    // 1. Product name matching (highest priority)
    const nameScore = calculateSimilarity(product.name, query);
    relevance += nameScore * 10;

    // 2. Category matching (high priority)
    const categoryScore = calculateSimilarity(product.category, query);
    relevance += categoryScore * 8;

    // Check category aliases (e.g., "polo" → "Polo Shirts")
    const category = CATEGORIES.find((cat) => cat.slug === product.category);
    if (category) {
      const categoryNameScore = calculateSimilarity(category.name, query);
      relevance += categoryNameScore * 8;
    }

    // 3. Description matching (medium priority)
    const descScore = calculateSimilarity(product.description, query);
    relevance += descScore * 5;

    // 4. Tags matching (medium priority) - FIXED: Check if tags exists
    if (product.tags && Array.isArray(product.tags)) {
      const tagMatches = product.tags.filter((tag) =>
        calculateSimilarity(tag, query) > 0.5
      );
      relevance += tagMatches.length * 3;
    }

    // 5. Word-by-word matching (handles multi-word queries like "polo shirts")
    queryWords.forEach((word) => {
      if (word.length > 2) {
        if (normalizeText(product.name).includes(word)) relevance += 2;
        if (normalizeText(product.category).includes(word)) relevance += 2;
        if (normalizeText(product.description).includes(word)) relevance += 1;
      }
    });

    return {
      ...product,
      relevance,
    } as SearchResult;
  });

  // Filter by minimum relevance threshold and sort
  return results
    .filter((r) => r.relevance > 1) // Minimum threshold
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
};

/**
 * Get search suggestions (autocomplete)
 */
export const getSearchSuggestions = (query: string, limit: number = 5): string[] => {
  if (!query || query.trim().length < 2) return [];

  const normalizedQuery = normalizeText(query);
  const suggestions = new Set<string>();

  // Add product names
  MOCK_PRODUCTS.forEach((product) => {
    if (normalizeText(product.name).includes(normalizedQuery)) {
      suggestions.add(product.name);
    }
  });

  // Add category names
  CATEGORIES.forEach((category) => {
    if (normalizeText(category.name).includes(normalizedQuery)) {
      suggestions.add(category.name);
    }
  });

  return Array.from(suggestions).slice(0, limit);
};

/**
 * Popular search terms (static for now, could be dynamic based on analytics)
 */
export const POPULAR_SEARCHES = [
  "Tracksuits",
  "Hoodies",
  "T-Shirts",
  "Polo Shirts",
  "Sweatshirts",
  "Pajama Sets",
  "Sports Bras",
  "Leggings",
];