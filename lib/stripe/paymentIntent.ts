// lib/stripe/paymentIntent.ts
import { stripe, CURRENCY, calculateOrderTotal } from './client';
import type Stripe from 'stripe';

interface CreatePaymentIntentParams {
  amount: number; // in cents
  currency?: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
}

export const createPaymentIntent = async ({
  amount,
  currency = CURRENCY,
  customerId,
  customerEmail,
  customerName,
  metadata = {},
}: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      receipt_email: customerEmail,
      description: `NOWIHT Order - ${customerName}`,
      metadata: {
        customerName,
        customerEmail,
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
};

export const updatePaymentIntent = async (
  paymentIntentId: string,
  params: Partial<Stripe.PaymentIntentUpdateParams>
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      params
    );
    return paymentIntent;
  } catch (error) {
    console.error('Error updating payment intent:', error);
    throw new Error('Failed to update payment intent');
  }
};

export const retrievePaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw new Error('Failed to retrieve payment intent');
  }
};

export const cancelPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error canceling payment intent:', error);
    throw new Error('Failed to cancel payment intent');
  }
};