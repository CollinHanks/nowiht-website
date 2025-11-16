// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ğŸ†• METAOBJECTS SYSTEM (Shopify-like) - WITH CODE FIELD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export type MetaObjectType = 'color' | 'size' | 'material' | 'fabric';

export interface MetaObject {
  id: string;
  type: MetaObjectType;
  code?: string; // ğŸ†• Unique 2-5 letter code (e.g., "BLK", "COT", "XS")
  name: string; // e.g., "Black", "XS", "Cotton", "Fleece"
  value?: string; // Hex code for colors: "#000000"
  metadata?: Record<string, any>; // Extra data (JSONB)
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Client-side (camelCase)
export interface MetaObjectClient {
  id: string;
  type: MetaObjectType;
  code?: string; // ğŸ†•
  name: string;
  value?: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Color-specific
export interface ColorMetaObject extends MetaObject {
  type: 'color';
  value: string; // Hex code is required for colors
}

// Create/Update requests
export interface CreateMetaObjectRequest {
  type: MetaObjectType;
  code?: string; // ğŸ†•
  name: string;
  value?: string;
  metadata?: Record<string, any>;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateMetaObjectRequest extends Partial<CreateMetaObjectRequest> {
  id: string;
}

// Bulk import result
export interface BulkImportResult {
  success: boolean;
  summary: {
    total: number;
    inserted: number;
    updated: number;
    skipped: number;
  };
  errors?: string[];
  skipped?: string[];
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PRODUCT TYPES (UPDATED WITH METAOBJECTS)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  sizes: string[]; // Array of size names
  colors: ProductColor[]; // Array of color objects with name + hex
  inStock: boolean; // Client-side usage (camelCase)
  in_stock?: boolean; // Database field (snake_case) - for Supabase compatibility
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  material: string;
  care: string[];
  features: string[];
  createdAt: string;
  brand?: string;
  soldCount?: number;
  collection?: string;
  tags?: string[];
  views?: number;
  wishlistCount?: number;
  rating?: number;
  reviewCount?: number;

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // ğŸ†• ADMIN PANEL FIELDS
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  ean13?: string; // EAN-13 Barcode (13 digits) - for inventory tracking
  sku?: string; // Stock Keeping Unit
  stock?: number; // Numerical stock quantity (0-9999)
  status?: 'draft' | 'published'; // Product visibility status
  seoTitle?: string; // SEO-optimized title
  seoDescription?: string; // SEO meta description
  updatedAt?: string; // Last updated timestamp
  updated_at?: string; // Database field (snake_case)

  // ğŸ†• METAOBJECTS (from metaobjects table)
  fabrics?: string[]; // Array of fabric names (from metaobjects)
}

export interface ProductColor {
  name: string;
  hex: string;
}

// Size Chart Types
export interface SizeMeasurement {
  size: string;
  bust: string;
  waist: string;
  hips: string;
}

export interface SizeChart {
  category: string;
  unit: "inches" | "cm";
  measurements: SizeMeasurement[];
}

// Size Recommendation Types
export interface UserMeasurements {
  height: number; // cm
  weight: number; // kg
  bodyType: "slim" | "average" | "athletic" | "curvy";
  fitPreference: "tight" | "regular" | "loose";
}

export interface SizeRecommendation {
  recommendedSize: string;
  alternatives: string[];
  confidence: number; // 0-100
  reason: string;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CATEGORY TYPES - FULL INTERFACE (CategoryService compatible)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;        // For nested categories
  seoTitle?: string;        // SEO-optimized title
  seoDescription?: string;  // SEO meta description
  status: "active" | "inactive";
  sortOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
}

// Footer Types
export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterMenu {
  title: string;
  links: FooterLink[];
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  brand?: string;
  collection?: string;
  material?: string;
}

// Sort Types
export type SortOption =
  | "newest"
  | "price-low-high"
  | "price-high-low"
  | "name-a-z"
  | "name-z-a"
  | "popular"
  | "trending"
  | "recommended";

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ğŸ†• ORDERS SYSTEM TYPES (PHASE 4) - UPDATED WITH NEW STATUSES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"           // âœ… NEW: For cancelled orders
  | "return_requested"    // âœ… NEW: For return requests
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface ShippingAddress {
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItemSnapshot {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  productSku?: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  total: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;

  // Customer Info
  customerEmail: string;
  customerName: string;
  customerPhone?: string;

  // Shipping
  shippingAddress: ShippingAddress;
  estimatedDelivery?: string; // ✅ NEW: Estimated delivery date (ISO string)

  // Pricing
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;

  // Status & Payment
  status: OrderStatus;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;

  // Additional
  notes?: string;
  trackingNumber?: string;

  // Items (populated separately)
  items?: OrderItemSnapshot[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;   // âœ… NEW: When order was cancelled
  deliveredAt?: string;   // âœ… NEW: When order was delivered
}

// Database field mapping (snake_case)
export interface OrderDB {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment_method?: string;
  payment_status: PaymentStatus;
  notes?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;  // âœ… NEW: Snake_case for database
  delivered_at?: string;  // âœ… NEW: Snake_case for database
}

export interface OrderItemDB {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  product_sku?: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

// Create Order Request (from frontend)
export interface CreateOrderRequest {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  items: Array<{
    productId: string;
    size: string;
    color: string;
    quantity: number;
  }>;
  paymentMethod?: string;
  notes?: string;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// LEGACY ORDER TYPES (Keep for backwards compatibility)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface PaymentInfo {
  method: "credit-card" | "paypal" | "bank-transfer";
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface PaymentInfoStored {
  method: string;
  last4: string;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ğŸ  ADDRESSES SYSTEM TYPES (PHASE 9)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface Address {
  id: string;
  user_id: string;
  label: string; // "Home", "Work", "Mom's House"
  first_name: string;
  last_name: string;
  phone: string | null;
  street: string;
  street_line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Address form data (for create/update)
export interface AddressFormData {
  label: string;
  first_name: string;
  last_name: string;
  phone: string;
  street: string;
  street_line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

// Address create request
export interface CreateAddressRequest extends Omit<AddressFormData, 'is_default'> {
  is_default?: boolean;
}

// Address update request
export interface UpdateAddressRequest extends Partial<AddressFormData> { }