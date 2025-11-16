import type { Product } from "@/types";

interface RelatedProductsOptions {
  limit?: number;
  includeSameCategory?: boolean;
  includeSimilarPrice?: boolean;
  priceRangePercent?: number; // ±20% by default
}

/**
 * Calculate similarity score between two products
 */
function calculateSimilarityScore(
  product: Product,
  candidate: Product,
  options: RelatedProductsOptions
): number {
  let score = 0;

  // 1. Same Category (highest priority) - 40 points
  if (options.includeSameCategory !== false) {
    if (product.category === candidate.category) {
      score += 40;
    }
  }

  // 2. Similar Price Range - 25 points
  if (options.includeSimilarPrice !== false) {
    const priceRange = options.priceRangePercent || 20;
    const minPrice = product.price * (1 - priceRange / 100);
    const maxPrice = product.price * (1 + priceRange / 100);

    if (candidate.price >= minPrice && candidate.price <= maxPrice) {
      score += 25;
    }
  }

  // 3. Common Colors - 15 points
  // ✅ FIX: Added null checks for colors array and color objects
  if (
    product.colors &&
    Array.isArray(product.colors) &&
    product.colors.length > 0 &&
    candidate.colors &&
    Array.isArray(candidate.colors) &&
    candidate.colors.length > 0
  ) {
    const productColors = new Set(
      product.colors
        .filter(c => c && c.name && typeof c.name === 'string')
        .map((c) => c.name.toLowerCase())
    );

    const candidateColors = candidate.colors
      .filter(c => c && c.name && typeof c.name === 'string')
      .map((c) => c.name.toLowerCase());

    const commonColors = candidateColors.filter((c) => productColors.has(c));

    if (commonColors.length > 0) {
      score += Math.min(15, commonColors.length * 5);
    }
  }

  // 4. Same Size Range - 10 points
  // ✅ FIX: Added null checks for sizes array
  if (
    product.sizes &&
    Array.isArray(product.sizes) &&
    product.sizes.length > 0 &&
    candidate.sizes &&
    Array.isArray(candidate.sizes) &&
    candidate.sizes.length > 0
  ) {
    const productSizes = new Set(product.sizes);
    const candidateSizes = candidate.sizes;
    const commonSizes = candidateSizes.filter((s) => productSizes.has(s));

    if (commonSizes.length > 0) {
      score += Math.min(10, commonSizes.length * 2);
    }
  }

  // 5. Same Material - 5 points
  // ✅ FIX: Added null checks for material strings
  if (
    product.material &&
    typeof product.material === 'string' &&
    candidate.material &&
    typeof candidate.material === 'string'
  ) {
    const productMaterial = product.material.toLowerCase();
    const candidateMaterial = candidate.material.toLowerCase();

    if (productMaterial.includes(candidateMaterial) || candidateMaterial.includes(productMaterial)) {
      score += 5;
    }
  }

  // 6. Same Brand - 3 points
  // ✅ FIX: Added null checks for brand
  if (
    product.brand &&
    candidate.brand &&
    product.brand === candidate.brand
  ) {
    score += 3;
  }

  // 7. Same Sale Status - 2 points
  if (product.isOnSale === candidate.isOnSale) {
    score += 2;
  }

  return score;
}

/**
 * Get related products for a given product
 */
export function getRelatedProducts(
  product: Product,
  allProducts: Product[],
  options: RelatedProductsOptions = {}
): Product[] {
  const {
    limit = 8,
    includeSameCategory = true,
    includeSimilarPrice = true,
    priceRangePercent = 20,
  } = options;

  // ✅ FIX: Validate inputs
  if (!product || !Array.isArray(allProducts)) {
    return [];
  }

  // Exclude current product and out of stock (optional)
  const candidates = allProducts.filter(
    (p) => p && p.id && p.id !== product.id // && p.inStock // Uncomment to exclude out of stock
  );

  // Calculate scores for all candidates
  const scoredProducts = candidates.map((candidate) => ({
    product: candidate,
    score: calculateSimilarityScore(product, candidate, {
      limit,
      includeSameCategory,
      includeSimilarPrice,
      priceRangePercent,
    }),
  }));

  // Sort by score (highest first)
  scoredProducts.sort((a, b) => b.score - a.score);

  // Return top N products
  return scoredProducts.slice(0, limit).map((item) => item.product);
}

/**
 * Get category-specific related products (simpler, faster)
 */
export function getRelatedProductsByCategory(
  product: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] {
  // ✅ FIX: Validate inputs
  if (!product || !Array.isArray(allProducts)) {
    return [];
  }

  return allProducts
    .filter(
      (p) =>
        p &&
        p.id &&
        p.id !== product.id &&
        p.category === product.category &&
        p.inStock
    )
    .slice(0, limit);
}

/**
 * Get "You May Also Like" products (different category, similar price)
 */
export function getYouMayAlsoLike(
  product: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] {
  // ✅ FIX: Validate inputs
  if (!product || !Array.isArray(allProducts)) {
    return [];
  }

  const priceRange = 30; // ±30% for "You May Also Like"
  const minPrice = product.price * (1 - priceRange / 100);
  const maxPrice = product.price * (1 + priceRange / 100);

  return allProducts
    .filter(
      (p) =>
        p &&
        p.id &&
        p.id !== product.id &&
        p.category !== product.category && // Different category
        p.price >= minPrice &&
        p.price <= maxPrice &&
        p.inStock
    )
    .slice(0, limit);
}