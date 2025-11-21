// lib/stripe/client.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover', // ✅ FIX: Updated to latest version
  typescript: true,
  appInfo: {
    name: 'NOWIHT E-Commerce',
    version: '1.0.0',
    url: 'https://nowiht.com',
  },
});

// Test mode check
export const isTestMode = process.env.STRIPE_SECRET_KEY.includes('test');

// Currency configuration
export const CURRENCY = 'usd'; // Change to 'try' for Turkish Lira
export const CURRENCY_SYMBOL = '$'; // Change to '₺' for Turkish Lira

// Shipping cost (in cents/kuruş)
export const SHIPPING_COST = 1000; // $10.00 standard shipping
export const EXPRESS_SHIPPING_COST = 1500; // $15.00 express shipping
export const FREE_SHIPPING_THRESHOLD = 10000; // $100.00 or 100.00₺

export const formatStripeAmount = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${(amount / 100).toFixed(2)}`;
};

export const calculateOrderTotal = (
  subtotal: number,
  shippingCost: number = SHIPPING_COST
): number => {
  // Free shipping over threshold
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingCost;
  return subtotal + shipping;
};