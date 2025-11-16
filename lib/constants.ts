// Brand Constants
export const BRAND_NAME = "NOWIHT";
export const BRAND_TAGLINE = "Premium Organic Women's Fashion";

// Categories
export const CATEGORIES = [
  {
    slug: "polo-shirts",
    name: "Polo Shirts",
    description: "Classic polo shirts with a modern athletic twist. Perfect for any occasion with premium organic cotton.",
    image: "/images/categories/polo-1.jpg",
  },
  {
    slug: "hoodies",
    name: "Hoodies",
    description: "Stay warm and stylish with our luxury hoodies. Perfect for workouts and everyday wear.",
    image: "/images/categories/hoodie-1.jpg",
  },
  {
    slug: "sweatshirts",
    name: "Sweatshirts",
    description: "Premium sweatshirts for active lifestyles. Comfortable, breathable, and effortlessly stylish.",
    image: "/images/categories/sweat-1.jpg",
  },
  {
    slug: "t-shirts",
    name: "T-Shirts",
    description: "Discover our collection of premium athletic t-shirts. Designed for performance and style.",
    image: "/images/categories/tee-1.jpg",
  },
  {
    slug: "dresses",
    name: "Dresses",
    description: "Elegant athletic dresses that transition from studio to street with ease.",
    image: "/images/categories/dress-1.jpg",
  },
  {
    slug: "pajama-sets",
    name: "Pajama Sets",
    description: "Luxurious satin and organic cotton pajama sets for ultimate comfort and relaxation.",
    image: "/images/categories/pajama-1.jpg",
  },
  {
    slug: "tracksuits",
    name: "Tracksuits",
    description: "Comfortable organic tracksuits that blend style with functionality for any activity.",
    image: "/images/categories/track-1.jpg",
  },
] as const;

// Navigation
export const MAIN_NAVIGATION = [
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "New Arrivals", href: "/shop?filter=new" },
  { name: "Best Sellers", href: "/shop?filter=bestsellers" },
  { name: "Sale", href: "/shop?filter=sale" },
  { name: "About", href: "/about" },
] as const;

// Footer Menus
export const FOOTER_MENUS = {
  "CUSTOMER CARE": [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ's", href: "/faq" },
    { name: "Legal Notice", href: "/legal-notice" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Return & Refund", href: "/return-refund" },
    { name: "Shipping Information", href: "/shipping" },
    { name: "Terms & Conditions", href: "/terms" },
  ],
  ECOLOGIC: [
    { name: "Community & Impact", href: "/community" },
    { name: "Eco-Friendly Materials", href: "/materials" },
    { name: "Ethical Manufacturing", href: "/manufacturing" },
    { name: "Our Carbon Footprint", href: "/carbon-footprint" },
    { name: "Sustainability Vision", href: "/sustainability" },
    { name: "Zero-Waste Production", href: "/zero-waste" },
  ],
  "EXPLORE MORE": [
    { name: "About Us", href: "/about" },
    { name: "Join Our Team", href: "/careers" },
    { name: "News & Updates", href: "/news" },
    { name: "Share & Earn", href: "/referral" },
  ],
  "MY ORDER": [
    { name: "Track Your Order", href: "/track-order" },
    { name: "My Account", href: "/account" },
    { name: "View Cart", href: "/cart" },
    { name: "Return Policy", href: "/return-policy" },
    { name: "Shipping", href: "/shipping" },
  ],
} as const;

// Social Media
export const SOCIAL_MEDIA = {
  instagram: "https://instagram.com/the_nowiht",
  facebook: "https://facebook.com/the_nowiht",
  x: "https://x.com/the_nowiht",
  pinterest: "https://pinterest.com/the_nowiht",
} as const;

// Site Info
export const SITE_INFO = {
  description:
    "At NOWIHT, our story is built on a passion for creating luxurious, comfortable, and sustainable clothing. We believe in blending style with responsibility, crafting each piece to elevate your everyday wardrobe while staying true to our commitment to quality and ethical practices.",
  email: "hello@nowiht.com",
  phone: "+1 (555) 123-4567",
} as const;

// Product Sizes
export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

// Product Colors
export const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#6B7280" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Beige", hex: "#D4C5B9" },
] as const;

// Category Type (for TypeScript)
export type CategorySlug = typeof CATEGORIES[number]['slug'];