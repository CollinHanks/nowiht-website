// lib/checkout.ts
// ═══════════════════════════════════════════════════════════════
// 🛒 NOWIHT - Checkout Utilities
// Helper functions for checkout process
// ═══════════════════════════════════════════════════════════════

import { CartItem } from '@/types';

/**
 * Generate unique order number
 * Format: NOW-YYYY-MM-DD-RANDOM
 * 
 * @example
 * generateOrderNumber() // "NOW-2025-11-15-ABC123"
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Generate random 6-character alphanumeric code
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `NOW-${year}-${month}-${day}-${random}`;
}

/**
 * Calculate cart subtotal
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
}

/**
 * Validate shipping address
 */
export function validateShippingAddress(address: {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!address.firstName || address.firstName.trim().length < 2) {
    errors.push('İsim en az 2 karakter olmalıdır');
  }

  if (!address.lastName || address.lastName.trim().length < 2) {
    errors.push('Soyisim en az 2 karakter olmalıdır');
  }

  if (!address.address || address.address.trim().length < 10) {
    errors.push('Adres en az 10 karakter olmalıdır');
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push('Şehir gereklidir');
  }

  if (!address.country) {
    errors.push('Ülke gereklidir');
  }

  if (!address.zipCode) {
    errors.push('Posta kodu gereklidir');
  }

  // Phone validation (basic)
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (!address.phone || !phoneRegex.test(address.phone)) {
    errors.push('Geçerli bir telefon numarası giriniz');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!address.email || !emailRegex.test(address.email)) {
    errors.push('Geçerli bir email adresi giriniz');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate payment information
 */
export function validatePaymentInfo(payment: {
  method: string;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (payment.method === 'credit-card') {
    // Card number validation (basic - check length and digits)
    if (!payment.cardNumber) {
      errors.push('Kart numarası gereklidir');
    } else {
      const cleaned = payment.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cleaned)) {
        errors.push('Geçerli bir kart numarası giriniz (16 rakam)');
      }
    }

    // Card name validation
    if (!payment.cardName || payment.cardName.trim().length < 3) {
      errors.push('Kart üzerindeki isim gereklidir');
    }

    // Expiry date validation (MM/YY format)
    if (!payment.expiryDate) {
      errors.push('Son kullanma tarihi gereklidir');
    } else {
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(payment.expiryDate)) {
        errors.push('Geçerli bir son kullanma tarihi giriniz (AA/YY)');
      } else {
        // Check if card is not expired
        const [month, year] = payment.expiryDate.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        if (expiry < now) {
          errors.push('Kartınızın süresi dolmuş');
        }
      }
    }

    // CVV validation
    if (!payment.cvv) {
      errors.push('CVV gereklidir');
    } else if (!/^\d{3,4}$/.test(payment.cvv)) {
      errors.push('Geçerli bir CVV giriniz (3-4 rakam)');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Calculate estimated delivery date
 */
export function calculateDeliveryDate(
  shippingMethod: 'standard' | 'express',
  orderDate: Date = new Date()
): string {
  const deliveryDays = shippingMethod === 'standard' ? 7 : 3;
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

  return deliveryDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Generate tracking number
 */
export function generateTrackingNumber(): string {
  const prefix = 'NOWIHT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Check if coupon code is valid
 */
export function validateCouponCode(
  code: string,
  subtotal: number
): {
  valid: boolean;
  discount: number;
  message: string;
} {
  const normalizedCode = code.trim().toUpperCase();

  // Example coupons
  const coupons: Record<string, { discount: number; minAmount?: number }> = {
    'NOWIHT10': { discount: 0.1, minAmount: 50 }, // 10% off, minimum $50
    'WELCOME15': { discount: 0.15, minAmount: 100 }, // 15% off, minimum $100
    'FREESHIP': { discount: 0, minAmount: 0 }, // Free shipping (handled separately)
  };

  const coupon = coupons[normalizedCode];

  if (!coupon) {
    return {
      valid: false,
      discount: 0,
      message: 'Geçersiz kupon kodu',
    };
  }

  if (coupon.minAmount && subtotal < coupon.minAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Bu kupon en az $${coupon.minAmount} alışveriş için geçerlidir`,
    };
  }

  const discountAmount = subtotal * coupon.discount;

  return {
    valid: true,
    discount: discountAmount,
    message: `Kupon uygulandı! ${(coupon.discount * 100).toFixed(0)}% indirim`,
  };
}

/**
 * Prepare order data for database
 */
export function prepareOrderData(checkoutData: {
  items: CartItem[];
  shipping: any;
  payment: any;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
}) {
  const orderNumber = generateOrderNumber();
  const trackingNumber = generateTrackingNumber();

  return {
    orderNumber,
    customerEmail: checkoutData.shipping.email,
    customerName: `${checkoutData.shipping.firstName} ${checkoutData.shipping.lastName}`,
    customerPhone: checkoutData.shipping.phone,
    shippingAddress: {
      firstName: checkoutData.shipping.firstName,
      lastName: checkoutData.shipping.lastName,
      address: checkoutData.shipping.address,
      apartment: checkoutData.shipping.apartment || '',
      city: checkoutData.shipping.city,
      state: checkoutData.shipping.state || '',
      country: checkoutData.shipping.country,
      zipCode: checkoutData.shipping.zipCode,
      phone: checkoutData.shipping.phone,
    },
    items: checkoutData.items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0],
      productSku: item.product.sku || '',
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity,
    })),
    subtotal: checkoutData.subtotal,
    shippingCost: checkoutData.shippingCost,
    tax: checkoutData.tax,
    discount: checkoutData.discount,
    total: checkoutData.total,
    paymentMethod: checkoutData.payment.method,
    paymentStatus: 'pending', // Will be updated after payment
    status: 'pending',
    trackingNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}