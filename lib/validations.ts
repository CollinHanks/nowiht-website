import { z } from "zod";

// Shipping Info Schema
export const shippingSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State/Province is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zip code (e.g., 12345 or 12345-6789)"),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, "Invalid phone number").min(10, "Phone number must be at least 10 digits"),
});

// Payment Info Schema
export const paymentSchema = z.object({
  method: z.enum(["credit-card", "paypal", "bank-transfer"]),
  cardNumber: z.string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Invalid card number (16 digits)")
    .optional()
    .or(z.literal("")),
  cardName: z.string()
    .min(3, "Cardholder name must be at least 3 characters")
    .optional()
    .or(z.literal("")),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)")
    .optional()
    .or(z.literal("")),
  cvv: z.string()
    .regex(/^\d{3,4}$/, "Invalid CVV (3-4 digits)")
    .optional()
    .or(z.literal("")),
}).refine(
  (data) => {
    if (data.method === "credit-card") {
      return !!(data.cardNumber && data.cardName && data.expiryDate && data.cvv);
    }
    return true;
  },
  {
    message: "All credit card fields are required",
    path: ["cardNumber"],
  }
);

// Coupon Schema
export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters"),
});

// Types inferred from schemas
export type ShippingFormData = z.infer<typeof shippingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;