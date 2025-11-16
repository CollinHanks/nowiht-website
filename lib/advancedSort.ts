/**
 * NOWIHT - Advanced Product Sorting Algorithm
 * 
 * Zalando/Amazon level intelligent sorting
 * Multi-factor scoring system
 */

import type { Product } from '@/types';

// Product with calculated scores
interface ScoredProduct extends Product {
  popularityScore?: number;
  trendingScore?: number;
  relevanceScore?: number;
}

/**
 * Calculate Popularity Score
 * Factors: Sales, Views, Wishlist adds, Recent engagement
 */
function calculatePopularityScore(product: Product): number {
  const weights = {
    sales: 0.4,        // 40% - Most important
    views: 0.25,       // 25%
    wishlist: 0.2,     // 20%
    rating: 0.15,      // 15%
  };

  // Sales score (normalized to 0-100)
  const salesScore = Math.min((product.soldCount || 0) / 10, 100);

  // Views score (if we had view tracking)
  const viewsScore = Math.min((product.views || 0) / 50, 100);

  // Wishlist score (if we had wishlist tracking)
  const wishlistScore = Math.min((product.wishlistCount || 0) / 20, 100);

  // Rating score (if we had ratings)
  const ratingScore = (product.rating || 4) * 20; // Convert 5-star to 0-100

  return (
    salesScore * weights.sales +
    viewsScore * weights.views +
    wishlistScore * weights.wishlist +
    ratingScore * weights.rating
  );
}

/**
 * Calculate Trending Score
 * Factors: Recent sales velocity, New product boost, Seasonal relevance
 */
function calculateTrendingScore(product: Product): number {
  const now = new Date();
  const createdDate = new Date(product.createdAt);
  const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

  // New product boost (0-30 days = 100%, then decay)
  const newProductBoost = Math.max(0, 100 - (daysSinceCreated / 30) * 100);

  // Sales velocity (sales per day since creation)
  const salesVelocity = daysSinceCreated > 0
    ? ((product.soldCount || 0) / daysSinceCreated) * 10
    : 0;

  // Sale items get boost
  const saleBoost = product.isOnSale ? 20 : 0;

  // Best seller badge boost
  const bestSellerBoost = product.isBestSeller ? 30 : 0;

  return Math.min(
    newProductBoost * 0.3 +
    salesVelocity * 0.4 +
    saleBoost +
    bestSellerBoost,
    100
  );
}

/**
 * Calculate Relevance Score
 * Factors: Stock status, Price competitiveness, Reviews
 */
function calculateRelevanceScore(product: Product): number {
  // In stock = 100, out of stock = 0
  const stockScore = product.inStock ? 100 : 0;

  // Price competitiveness (if compareAtPrice exists, it's a good deal)
  const priceScore = product.compareAtPrice
    ? ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
    : 50;

  // Feature completeness (has all fields filled)
  const hasImages = product.images && product.images.length > 1;
  const hasDescription = product.description && product.description.length > 50;
  const hasFeatures = product.features && product.features.length > 0;
  const completenessScore = (
    (hasImages ? 33 : 0) +
    (hasDescription ? 33 : 0) +
    (hasFeatures ? 34 : 0)
  );

  return (
    stockScore * 0.4 +
    priceScore * 0.3 +
    completenessScore * 0.3
  );
}

/**
 * Advanced Sort Products
 * Intelligent multi-factor sorting
 */
export function advancedSortProducts(
  products: Product[],
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'trending' | 'recommended' | 'name-asc' | 'name-desc'
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);

    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

    case 'popular':
      // Multi-factor popularity
      return sorted
        .map(product => ({
          ...product,
          popularityScore: calculatePopularityScore(product),
        }))
        .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));

    case 'trending':
      // Trending algorithm
      return sorted
        .map(product => ({
          ...product,
          trendingScore: calculateTrendingScore(product),
        }))
        .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));

    case 'recommended':
      // Smart recommendation (combines all factors)
      return sorted
        .map(product => {
          const popularity = calculatePopularityScore(product);
          const trending = calculateTrendingScore(product);
          const relevance = calculateRelevanceScore(product);

          // Weighted combination
          const recommendationScore = (
            popularity * 0.35 +
            trending * 0.35 +
            relevance * 0.30
          );

          return {
            ...product,
            recommendationScore,
          };
        })
        .sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0));

    default:
      return sorted;
  }
}

/**
 * Product Score Calculator (for debugging/admin)
 */
export function getProductScores(product: Product) {
  return {
    popularity: calculatePopularityScore(product),
    trending: calculateTrendingScore(product),
    relevance: calculateRelevanceScore(product),
  };
}