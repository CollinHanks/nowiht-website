// lib/validations/settings.ts
// Zod validation schemas for account settings

import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
// PROFILE VALIDATION
// ═══════════════════════════════════════════════════════════════

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ═══════════════════════════════════════════════════════════════
// ADDRESS VALIDATION
// ═══════════════════════════════════════════════════════════════

export const addressSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(50, "Label is too long"),
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  street: z
    .string()
    .min(1, "Street address is required")
    .max(200, "Street address is too long"),
  street_line2: z
    .string()
    .max(200, "Address line 2 is too long")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City name is too long"),
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State name is too long"),
  zip: z
    .string()
    .min(1, "ZIP code is required")
    .max(20, "ZIP code is too long"),
  country: z
    .string()
    .min(1, "Country is required"),
  is_default: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

// ═══════════════════════════════════════════════════════════════
// PASSWORD VALIDATION
// ═══════════════════════════════════════════════════════════════

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ═══════════════════════════════════════════════════════════════
// EMAIL PREFERENCES VALIDATION
// ═══════════════════════════════════════════════════════════════

export const emailPreferencesSchema = z.object({
  orderUpdates: z.boolean(),
  newsletter: z.boolean(),
  promotions: z.boolean(),
  smsNotifications: z.boolean(),
});

export type EmailPreferencesFormData = z.infer<typeof emailPreferencesSchema>;