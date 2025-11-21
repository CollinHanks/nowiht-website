// types/checkout.ts

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutFormData extends ShippingAddress {
  saveAddress?: boolean;
  receiveUpdates?: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface OrderSummaryData {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export interface CheckoutError {
  type: 'validation' | 'payment' | 'network' | 'unknown';
  message: string;
  field?: string;
}

export type CheckoutStep = 'information' | 'payment' | 'processing' | 'complete';

export interface CheckoutState {
  currentStep: CheckoutStep;
  shippingAddress: ShippingAddress | null;
  paymentIntentId: string | null;
  orderId: string | null;
  isProcessing: boolean;
  error: CheckoutError | null;
}