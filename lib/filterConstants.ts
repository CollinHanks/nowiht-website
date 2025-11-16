/**
 * NOWIHT - Filter Constants
 * 
 * Available filter options for products
 */

export const FILTER_CONSTANTS = {
  // Available colors
  COLORS: [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Gray', value: 'gray', hex: '#9CA3AF' },
    { name: 'Beige', value: 'beige', hex: '#D4C5B9' },
    { name: 'Navy', value: 'navy', hex: '#1E3A8A' },
    { name: 'Olive', value: 'olive', hex: '#6B7280' },
    { name: 'Burgundy', value: 'burgundy', hex: '#800020' },
    { name: 'Red', value: 'red', hex: '#DC2626' },
    { name: 'Champagne', value: 'champagne', hex: '#F7E7CE' },
    { name: 'Natural', value: 'natural', hex: '#F5F5DC' },
    { name: 'Terracotta', value: 'terracotta', hex: '#E07A5F' },
    { name: 'Forest', value: 'forest', hex: '#2D5016' },
  ],

  // Available sizes
  SIZES: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

  // Brands
  BRANDS: ['NOWIHT', 'NOWIHT BASICS', 'NOWIHT ACTIVE', 'NOWIHT STUDIO'],

  // Collections
  COLLECTIONS: [
    { name: 'Spring/Summer 2025', value: 'spring-summer-2025' },
    { name: 'Fall/Winter 2024', value: 'fall-winter-2024' },
    { name: 'Essentials', value: 'essentials' },
    { name: 'Limited Edition', value: 'limited-edition' },
    { name: 'Sustainable Collection', value: 'sustainable' },
    { name: 'Performance Series', value: 'performance' },
  ],

  // Materials
  MATERIALS: [
    { name: 'Organic Cotton', value: 'organic-cotton' },
    { name: 'Linen', value: 'linen' },
    { name: 'Silk', value: 'silk' },
    { name: 'Recycled Polyester', value: 'recycled-polyester' },
    { name: 'Modal', value: 'modal' },
    { name: 'Bamboo', value: 'bamboo' },
    { name: 'Wool', value: 'wool' },
    { name: 'Cashmere', value: 'cashmere' },
  ],

  // Categories
  CATEGORIES: [
    { name: 'All', value: 'all' },
    { name: 'T-Shirts', value: 't-shirts' },
    { name: 'Polo Shirts', value: 'polo-shirts' },
    { name: 'Hoodies', value: 'hoodies' },
    { name: 'Sweatshirts', value: 'sweatshirts' },
    { name: 'Dresses', value: 'dresses' },
    { name: 'Pajama Sets', value: 'pajama-sets' },
    { name: 'Tracksuits', value: 'tracksuits' },
  ],

  // Sort options - UPDATED with intelligent sorting
  SORT_OPTIONS: [
    { label: 'Recommended', value: 'recommended', icon: '⭐' },      // NEW - Smart AI
    { label: 'Trending', value: 'trending', icon: '🔥' },           // NEW - Hot items
    { label: 'Most Popular', value: 'popular', icon: '❤️' },
    { label: 'Newest First', value: 'newest', icon: '✨' },
    { label: 'Price: Low to High', value: 'price-asc', icon: '💰' },
    { label: 'Price: High to Low', value: 'price-desc', icon: '💎' },
    { label: 'A-Z', value: 'name-asc', icon: '🔤' },
    { label: 'Z-A', value: 'name-desc', icon: '🔤' },
  ],

  // Price range
  PRICE: {
    MIN: 0,
    MAX: 1000,
    STEP: 10,
  },
} as const;