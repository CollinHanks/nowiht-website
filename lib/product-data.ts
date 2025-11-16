import type { Product } from "@/types";

// Mock product data - Will be replaced with real database data later
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Organic Cotton Classic Tee",
    slug: "organic-cotton-classic-tee",
    description: "Ultra-soft organic cotton tee with a relaxed fit. Perfect for everyday wear.",
    price: 89,
    compareAtPrice: 120,
    category: "t-shirts",
    images: [
      "/products/tee-1.jpg",
      "/products/tee-1-alt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Gray", hex: "#9CA3AF" },
    ],
    inStock: true,
    isNew: true,
    isBestSeller: true,
    isOnSale: true,
    material: "100% Organic Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
    features: ["Organic cotton", "Relaxed fit", "Ribbed crew neck", "Sustainable production"],
    createdAt: new Date("2025-10-15").toISOString(),
    brand: "NOWIHT",
    soldCount: 312,
    collection: "spring-summer-2025", // ← YENİ
  },
  {
    id: "2",
    name: "Premium Polo Shirt",
    slug: "premium-polo-shirt",
    description: "Classic polo shirt crafted from premium organic cotton with modern details.",
    price: 99,
    category: "polo-shirts",
    images: [
      "/products/polo-1.jpg",
      "/products/polo-1-alt.jpg",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Navy", hex: "#1E3A8A" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Olive", hex: "#6B7280" },
    ],
    inStock: true,
    isNew: true,
    isBestSeller: false,
    isOnSale: false,
    material: "100% Organic Cotton Pique",
    care: ["Machine wash cold", "Tumble dry low", "Iron if needed"],
    features: ["3-button placket", "Ribbed collar and cuffs", "Side vents", "Relaxed fit"],
    createdAt: new Date("2025-09-20").toISOString(),
    brand: "NOWIHT BASICS",
    soldCount: 245,
    collection: "essentials", // ← YENİ
  },
  {
    id: "3",
    name: "Cozy Organic Hoodie",
    slug: "cozy-organic-hoodie",
    description: "Supremely comfortable hoodie made from organic cotton fleece.",
    price: 169,
    compareAtPrice: 220,
    category: "hoodies",
    images: [
      "/products/hoodie-1.jpg",
      "/products/hoodie-1-alt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Beige", hex: "#D4C5B9" },
      { name: "Forest", hex: "#2D5016" },
    ],
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
    material: "80% Organic Cotton, 20% Recycled Polyester",
    care: ["Machine wash cold", "Tumble dry low", "Do not iron print"],
    features: ["Adjustable drawstring hood", "Kangaroo pocket", "Ribbed cuffs and hem", "Brushed fleece interior"],
    createdAt: new Date("2025-08-10").toISOString(),
    brand: "NOWIHT ACTIVE",
    soldCount: 423,
    collection: "fall-winter-2024", // ← YENİ
  },
  {
    id: "4",
    name: "Essential Sweatshirt",
    slug: "essential-sweatshirt",
    description: "Timeless crewneck sweatshirt in organic cotton fleece.",
    price: 119,
    category: "sweatshirts",
    images: [
      "/products/sweat-1.jpg",
      "/products/sweat-1-alt.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Gray", hex: "#9CA3AF" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
    ],
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isOnSale: false,
    material: "100% Organic Cotton Fleece",
    care: ["Machine wash cold", "Tumble dry low", "Cool iron if needed"],
    features: ["Ribbed crew neck", "Ribbed cuffs and hem", "Relaxed fit", "Brushed interior"],
    createdAt: new Date("2025-07-15").toISOString(),
    brand: "NOWIHT BASICS",
    soldCount: 189,
    collection: "essentials", // ← YENİ
  },
  {
    id: "5",
    name: "Organic Linen Dress",
    slug: "organic-linen-dress",
    description: "Breathable linen dress perfect for warm weather.",
    price: 189,
    category: "dresses",
    images: [
      "/products/dress-1.jpg",
      "/products/dress-1-alt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Natural", hex: "#F5F5DC" },
      { name: "Black", hex: "#000000" },
      { name: "Terracotta", hex: "#E07A5F" },
    ],
    inStock: true,
    isNew: true,
    isBestSeller: false,
    isOnSale: false,
    material: "100% Organic Linen",
    care: ["Dry clean or hand wash", "Line dry", "Steam iron"],
    features: ["V-neckline", "Adjustable straps", "Side pockets", "Midi length"],
    createdAt: new Date("2025-10-01").toISOString(),
    brand: "NOWIHT STUDIO",
    soldCount: 156,
    collection: "spring-summer-2025", // ← YENİ
  },
  {
    id: "6",
    name: "Luxury Satin Pajama Set",
    slug: "luxury-satin-pajama-set",
    description: "Silky smooth satin pajama set for ultimate comfort.",
    price: 149,
    compareAtPrice: 199,
    category: "pajama-sets",
    images: [
      "/products/pajama-1.jpg",
      "/products/pajama-1-alt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Champagne", hex: "#F7E7CE" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1E3A8A" },
    ],
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
    material: "100% Silk Satin",
    care: ["Hand wash or delicate machine wash", "Air dry", "Cool iron if needed"],
    features: ["Button-up top", "Elastic waist pants", "Contrast piping", "Relaxed fit"],
    createdAt: new Date("2025-06-20").toISOString(),
    brand: "NOWIHT",
    soldCount: 267,
    collection: "limited-edition", // ← YENİ
  },
  {
    id: "7",
    name: "Organic Cotton Tracksuit",
    slug: "organic-cotton-tracksuit",
    description: "Complete tracksuit set in premium organic cotton.",
    price: 199,
    category: "tracksuits",
    images: [
      "/products/track-1.jpg",
      "/products/track-1-alt.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Gray", hex: "#9CA3AF" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1E3A8A" },
    ],
    inStock: true,
    isNew: true,
    isBestSeller: false,
    isOnSale: false,
    material: "95% Organic Cotton, 5% Elastane",
    care: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
    features: ["Matching hoodie and joggers", "Adjustable drawstrings", "Side pockets", "Elastic cuffs and waistband"],
    createdAt: new Date("2025-09-05").toISOString(),
    brand: "NOWIHT ACTIVE",
    soldCount: 98,
    collection: "performance", // ← YENİ
  },
];

// Helper function to get products by category
export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((product) => product.category === category);
}

// Helper function to get single product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.slug === slug);
}

// Helper function to get featured products
export function getFeaturedProducts(limit: number = 4): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.isBestSeller).slice(0, limit);
}

// Helper function to get new arrivals
export function getNewArrivals(limit: number = 4): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.isNew).slice(0, limit);
}

// Helper function to get sale products
export function getSaleProducts(limit: number = 4): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.isOnSale).slice(0, limit);
}