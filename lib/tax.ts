// lib/tax.ts
// ═══════════════════════════════════════════════════════════════
// 💰 NOWIHT - Tax Utilities
// Tax calculations for different countries (VAT, Sales Tax, etc.)
// ═══════════════════════════════════════════════════════════════

/**
 * Tax rates by country
 * VAT (Value Added Tax) for Europe and Turkey
 * Sales Tax for US
 */
export const TAX_RATES: Record<string, {
  rate: number;
  name: string;
  included: boolean; // Is tax included in product price?
}> = {
  // Turkey
  'Turkey': {
    rate: 0.20, // 20% KDV
    name: 'KDV',
    included: true,
  },
  'Türkiye': {
    rate: 0.20,
    name: 'KDV',
    included: true,
  },

  // Europe (VAT)
  'Austria': { rate: 0.20, name: 'VAT', included: true },
  'Belgium': { rate: 0.21, name: 'VAT', included: true },
  'Bulgaria': { rate: 0.20, name: 'VAT', included: true },
  'Croatia': { rate: 0.25, name: 'VAT', included: true },
  'Cyprus': { rate: 0.19, name: 'VAT', included: true },
  'Czech Republic': { rate: 0.21, name: 'VAT', included: true },
  'Denmark': { rate: 0.25, name: 'VAT', included: true },
  'Estonia': { rate: 0.20, name: 'VAT', included: true },
  'Finland': { rate: 0.24, name: 'VAT', included: true },
  'France': { rate: 0.20, name: 'VAT', included: true },
  'Germany': { rate: 0.19, name: 'VAT', included: true },
  'Greece': { rate: 0.24, name: 'VAT', included: true },
  'Hungary': { rate: 0.27, name: 'VAT', included: true },
  'Ireland': { rate: 0.23, name: 'VAT', included: true },
  'Italy': { rate: 0.22, name: 'VAT', included: true },
  'Latvia': { rate: 0.21, name: 'VAT', included: true },
  'Lithuania': { rate: 0.21, name: 'VAT', included: true },
  'Luxembourg': { rate: 0.17, name: 'VAT', included: true },
  'Malta': { rate: 0.18, name: 'VAT', included: true },
  'Netherlands': { rate: 0.21, name: 'VAT', included: true },
  'Poland': { rate: 0.23, name: 'VAT', included: true },
  'Portugal': { rate: 0.23, name: 'VAT', included: true },
  'Romania': { rate: 0.19, name: 'VAT', included: true },
  'Slovakia': { rate: 0.20, name: 'VAT', included: true },
  'Slovenia': { rate: 0.22, name: 'VAT', included: true },
  'Spain': { rate: 0.21, name: 'VAT', included: true },
  'Sweden': { rate: 0.25, name: 'VAT', included: true },

  // United Kingdom
  'United Kingdom': { rate: 0.20, name: 'VAT', included: true },

  // Switzerland
  'Switzerland': { rate: 0.077, name: 'VAT', included: true },

  // Norway
  'Norway': { rate: 0.25, name: 'VAT', included: true },

  // United States (varies by state - using average)
  'United States': { rate: 0.08, name: 'Sales Tax', included: false },

  // Canada
  'Canada': { rate: 0.13, name: 'HST', included: false }, // Varies by province

  // Australia
  'Australia': { rate: 0.10, name: 'GST', included: true },

  // Japan
  'Japan': { rate: 0.10, name: 'Consumption Tax', included: true },

  // Default for countries not listed
  'DEFAULT': { rate: 0.08, name: 'Tax', included: false },
};

/**
 * Get tax rate for a country
 */
export function getTaxRate(country: string): {
  rate: number;
  name: string;
  included: boolean;
} {
  return TAX_RATES[country] || TAX_RATES['DEFAULT'];
}

/**
 * Calculate tax amount
 * 
 * @param subtotal - Order subtotal (before tax)
 * @param country - Shipping country
 * @param includeInPrice - If true, tax is already included in product prices
 * 
 * @returns Tax amount to add to order
 */
export function calculateTax(
  subtotal: number,
  country: string,
  includeInPrice: boolean = false
): {
  amount: number;
  rate: number;
  name: string;
  included: boolean;
} {
  const taxInfo = getTaxRate(country);

  // If tax is included in product price, don't add it again
  if (taxInfo.included && includeInPrice) {
    return {
      amount: 0,
      rate: taxInfo.rate,
      name: taxInfo.name,
      included: true,
    };
  }

  // Calculate tax amount
  const amount = subtotal * taxInfo.rate;

  return {
    amount,
    rate: taxInfo.rate,
    name: taxInfo.name,
    included: false,
  };
}

/**
 * Calculate price excluding tax (if tax is included)
 */
export function calculatePriceExcludingTax(
  priceIncludingTax: number,
  country: string
): {
  priceExcludingTax: number;
  taxAmount: number;
  rate: number;
} {
  const taxInfo = getTaxRate(country);

  if (!taxInfo.included) {
    return {
      priceExcludingTax: priceIncludingTax,
      taxAmount: 0,
      rate: taxInfo.rate,
    };
  }

  // Calculate price excluding tax: price / (1 + rate)
  const priceExcludingTax = priceIncludingTax / (1 + taxInfo.rate);
  const taxAmount = priceIncludingTax - priceExcludingTax;

  return {
    priceExcludingTax,
    taxAmount,
    rate: taxInfo.rate,
  };
}

/**
 * Calculate price including tax (if tax is not included)
 */
export function calculatePriceIncludingTax(
  priceExcludingTax: number,
  country: string
): {
  priceIncludingTax: number;
  taxAmount: number;
  rate: number;
} {
  const taxInfo = getTaxRate(country);

  // Calculate price including tax: price * (1 + rate)
  const priceIncludingTax = priceExcludingTax * (1 + taxInfo.rate);
  const taxAmount = priceIncludingTax - priceExcludingTax;

  return {
    priceIncludingTax,
    taxAmount,
    rate: taxInfo.rate,
  };
}

/**
 * Format tax info for display
 */
export function formatTaxInfo(
  subtotal: number,
  country: string
): string {
  const tax = calculateTax(subtotal, country);

  if (tax.included && tax.amount === 0) {
    return `${tax.name} dahil (${(tax.rate * 100).toFixed(0)}%)`;
  }

  return `${tax.name} (${(tax.rate * 100).toFixed(0)}%): ${tax.amount.toFixed(2)} TRY`;
}

/**
 * Check if tax is required for business sales
 */
export function isBusinessTaxExempt(
  country: string,
  hasValidVatNumber: boolean
): boolean {
  const taxInfo = getTaxRate(country);

  // In EU, businesses with valid VAT number can be exempt from VAT
  // when buying from another EU country (B2B transactions)
  if (taxInfo.name === 'VAT' && hasValidVatNumber) {
    return true;
  }

  return false;
}

/**
 * Validate VAT number format (basic validation)
 */
export function validateVatNumber(vatNumber: string, country: string): boolean {
  const cleaned = vatNumber.replace(/\s/g, '').toUpperCase();

  // EU VAT number formats (simplified)
  const vatFormats: Record<string, RegExp> = {
    'Austria': /^ATU\d{8}$/,
    'Belgium': /^BE0\d{9}$/,
    'Bulgaria': /^BG\d{9,10}$/,
    'Croatia': /^HR\d{11}$/,
    'Cyprus': /^CY\d{8}[A-Z]$/,
    'Czech Republic': /^CZ\d{8,10}$/,
    'Denmark': /^DK\d{8}$/,
    'Estonia': /^EE\d{9}$/,
    'Finland': /^FI\d{8}$/,
    'France': /^FR[A-Z0-9]{2}\d{9}$/,
    'Germany': /^DE\d{9}$/,
    'Greece': /^EL\d{9}$/,
    'Hungary': /^HU\d{8}$/,
    'Ireland': /^IE\d[A-Z0-9]\d{5}[A-Z]$/,
    'Italy': /^IT\d{11}$/,
    'Latvia': /^LV\d{11}$/,
    'Lithuania': /^LT\d{9,12}$/,
    'Luxembourg': /^LU\d{8}$/,
    'Malta': /^MT\d{8}$/,
    'Netherlands': /^NL\d{9}B\d{2}$/,
    'Poland': /^PL\d{10}$/,
    'Portugal': /^PT\d{9}$/,
    'Romania': /^RO\d{2,10}$/,
    'Slovakia': /^SK\d{10}$/,
    'Slovenia': /^SI\d{8}$/,
    'Spain': /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
    'Sweden': /^SE\d{12}$/,
    'United Kingdom': /^GB\d{9}$|^GB\d{12}$|^GBGD\d{3}$|^GBHA\d{3}$/,
  };

  const format = vatFormats[country];
  if (!format) return true; // No validation for this country

  return format.test(cleaned);
}

/**
 * Calculate tax breakdown for order summary
 */
export function getTaxBreakdown(
  subtotal: number,
  country: string
): {
  subtotalExcludingTax: number;
  taxAmount: number;
  subtotalIncludingTax: number;
  taxName: string;
  taxRate: number;
  taxIncluded: boolean;
} {
  const taxInfo = getTaxRate(country);

  if (taxInfo.included) {
    const breakdown = calculatePriceExcludingTax(subtotal, country);
    return {
      subtotalExcludingTax: breakdown.priceExcludingTax,
      taxAmount: breakdown.taxAmount,
      subtotalIncludingTax: subtotal,
      taxName: taxInfo.name,
      taxRate: taxInfo.rate,
      taxIncluded: true,
    };
  } else {
    const tax = calculateTax(subtotal, country);
    return {
      subtotalExcludingTax: subtotal,
      taxAmount: tax.amount,
      subtotalIncludingTax: subtotal + tax.amount,
      taxName: tax.name,
      taxRate: tax.rate,
      taxIncluded: false,
    };
  }
}