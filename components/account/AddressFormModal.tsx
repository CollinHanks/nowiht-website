// components/account/AddressFormModal.tsx
// Modal for creating or editing addresses - WITH FULL COUNTRIES LIST

"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import type { Address, AddressFormData } from "@/types";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddressFormData) => Promise<void>;
  address?: Address | null; // If editing
  mode: "create" | "edit";
}

// ✅ FULL COUNTRIES LIST (195+ countries)
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const INITIAL_FORM_DATA: AddressFormData = {
  label: "",
  first_name: "",
  last_name: "",
  phone: "",
  street: "",
  street_line2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  is_default: false,
};

export default function AddressFormModal({
  isOpen,
  onClose,
  onSave,
  address,
  mode,
}: AddressFormModalProps) {
  const [formData, setFormData] = useState<AddressFormData>(INITIAL_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);

  // Load address data when editing
  useEffect(() => {
    if (mode === "edit" && address) {
      setFormData({
        label: address.label,
        first_name: address.first_name,
        last_name: address.last_name,
        phone: address.phone || "",
        street: address.street,
        street_line2: address.street_line2 || "",
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        is_default: address.is_default,
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [address, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-light tracking-wide">
              {mode === "create" ? "ADD NEW ADDRESS" : "EDIT ADDRESS"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Label */}
            <div>
              <label htmlFor="label" className="block text-sm font-medium mb-2">
                Label <span className="text-red-600">*</span>
              </label>
              <input
                id="label"
                name="label"
                type="text"
                required
                value={formData.label}
                onChange={handleChange}
                placeholder="e.g., Home, Work, Mom's House"
                className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Name */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium mb-2">
                  First Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Jane"
                  className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium mb-2">
                  Last Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Street */}
            <div>
              <label htmlFor="street" className="block text-sm font-medium mb-2">
                Street Address <span className="text-red-600">*</span>
              </label>
              <input
                id="street"
                name="street"
                type="text"
                required
                value={formData.street}
                onChange={handleChange}
                placeholder="123 Main Street"
                className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Apartment */}
            <div>
              <label htmlFor="street_line2" className="block text-sm font-medium mb-2">
                Apartment, Suite, etc.
              </label>
              <input
                id="street_line2"
                name="street_line2"
                type="text"
                value={formData.street_line2}
                onChange={handleChange}
                placeholder="Apt 4B"
                className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                  City <span className="text-red-600">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-2">
                  State <span className="text-red-600">*</span>
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                  className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label htmlFor="zip" className="block text-sm font-medium mb-2">
                  ZIP Code <span className="text-red-600">*</span>
                </label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  required
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="10001"
                  className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Country <span className="text-red-600">*</span>
              </label>
              <select
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors bg-white"
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-center gap-3">
              <input
                id="is_default"
                name="is_default"
                type="checkbox"
                checked={formData.is_default}
                onChange={handleChange}
                className="w-4 h-4 text-black border-gray-300 focus:ring-black"
              />
              <label htmlFor="is_default" className="text-sm text-gray-700">
                Set as default shipping address
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-sm font-medium tracking-wider hover:border-black transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-black text-white text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SAVING...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{mode === "create" ? "ADD ADDRESS" : "SAVE CHANGES"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}