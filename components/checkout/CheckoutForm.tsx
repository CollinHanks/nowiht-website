// components/checkout/CheckoutForm.tsx
"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { CheckoutFormData, ShippingAddress } from "@/types/checkout";

interface CheckoutFormProps {
  onSubmit: (data: ShippingAddress) => void;
  isProcessing: boolean;
}

export default function CheckoutForm({
  onSubmit,
  isProcessing,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    saveAddress: false,
    receiveUpdates: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const shippingAddress: ShippingAddress = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      };

      onSubmit(shippingAddress);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-medium tracking-wide uppercase">
          Contact Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="fullName" className="block text-xs text-gray-600 mb-1.5 tracking-wide">
              FULL NAME *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.fullName ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-black transition-colors text-sm`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs text-gray-600 mb-1.5 tracking-wide">
              EMAIL *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-black transition-colors text-sm`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs text-gray-600 mb-1.5 tracking-wide">
              PHONE *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.phone ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-black transition-colors text-sm`}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-medium tracking-wide uppercase">
          Shipping Address
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="addressLine1" className="block text-xs text-gray-600 mb-1.5 tracking-wide">
              ADDRESS *
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.addressLine1 ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-black transition-colors text-sm`}
              placeholder="123 Main Street"
            />
            {errors.addressLine1 && (
              <p className="text-xs text-red-600 mt-1">{errors.addressLine1}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine2" className="block text-xs text-gray-600 mb-1.5 tracking-wide">
              APARTMENT, SUITE, ETC. (OPTIONAL)
            </label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm"
              placeholder="Apt 4B"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-xs text-gray-600 mb-1.5 tracking-wide">
                CITY *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.city ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-black transition-colors text-sm`}
                placeholder="New York"
              />
              {errors.city && (
                <p className="text-xs text-red-600 mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-xs text-gray-600 mb-1.5 tracking-wide">
                STATE *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.state ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-black transition-colors text-sm`}
                placeholder="NY"
              />
              {errors.state && (
                <p className="text-xs text-red-600 mt-1">{errors.state}</p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-xs text-gray-600 mb-1.5 tracking-wide">
                ZIP CODE *
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.postalCode ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-black transition-colors text-sm`}
                placeholder="10001"
              />
              {errors.postalCode && (
                <p className="text-xs text-red-600 mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-xs text-gray-600 mb-1.5 tracking-wide">
              COUNTRY *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.country ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-black transition-colors text-sm bg-white`}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="TR">Turkey</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
            </select>
            {errors.country && (
              <p className="text-xs text-red-600 mt-1">{errors.country}</p>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="bg-white border border-gray-200 p-6 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="saveAddress"
            checked={formData.saveAddress}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 border-gray-300 text-black focus:ring-black"
          />
          <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
            Save this information for next time
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="receiveUpdates"
            checked={formData.receiveUpdates}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 border-gray-300 text-black focus:ring-black"
          />
          <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
            Receive exclusive offers and updates
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-black text-white py-4 px-8 flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <span className="text-sm tracking-wider font-medium">
          CONTINUE TO PAYMENT
        </span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}