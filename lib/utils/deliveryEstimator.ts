// lib/utils/deliveryEstimator.ts
// ═══════════════════════════════════════════════════════════════
// 📦 NOWIHT - Delivery Time Estimator
// Calculate estimated delivery based on country/region
// ═══════════════════════════════════════════════════════════════

/**
 * Delivery zones with estimated days
 */
const DELIVERY_ZONES = {
  USA: {
    countries: ['United States', 'USA', 'US'],
    minDays: 1,
    maxDays: 3,
    label: '1-3 business days'
  },
  EUROPE: {
    countries: [
      'United Kingdom', 'UK', 'GB',
      'Germany', 'DE',
      'France', 'FR',
      'Italy', 'IT',
      'Spain', 'ES',
      'Netherlands', 'NL',
      'Belgium', 'BE',
      'Austria', 'AT',
      'Sweden', 'SE',
      'Denmark', 'DK',
      'Norway', 'NO',
      'Finland', 'FI',
      'Poland', 'PL',
      'Czech Republic', 'CZ',
      'Portugal', 'PT',
      'Greece', 'GR',
      'Ireland', 'IE',
      'Switzerland', 'CH',
      'Turkey', 'TR', 'Türkiye', // ✅ Turkey included in Europe zone
    ],
    minDays: 1,
    maxDays: 2,
    label: '1-2 business days'
  },
  REST_OF_WORLD: {
    countries: [], // Default for all other countries
    minDays: 1,
    maxDays: 7,
    label: '1-7 business days'
  }
} as const;

/**
 * Get delivery zone for a country
 */
function getDeliveryZone(country: string) {
  const normalizedCountry = country.trim();

  // Check USA
  if (DELIVERY_ZONES.USA.countries.some(c =>
    normalizedCountry.toLowerCase().includes(c.toLowerCase())
  )) {
    return DELIVERY_ZONES.USA;
  }

  // Check Europe
  if (DELIVERY_ZONES.EUROPE.countries.some(c =>
    normalizedCountry.toLowerCase().includes(c.toLowerCase())
  )) {
    return DELIVERY_ZONES.EUROPE;
  }

  // Default: Rest of world
  return DELIVERY_ZONES.REST_OF_WORLD;
}

/**
 * Calculate estimated delivery date
 * @param country - Shipping country
 * @param orderDate - Order date (defaults to now)
 * @returns ISO date string for estimated delivery
 */
export function calculateEstimatedDelivery(
  country: string,
  orderDate: Date = new Date()
): string {
  const zone = getDeliveryZone(country);

  // Use average of min/max days
  const avgDays = Math.ceil((zone.minDays + zone.maxDays) / 2);

  // Calculate delivery date (skip weekends)
  let deliveryDate = new Date(orderDate);
  let businessDaysAdded = 0;

  while (businessDaysAdded < avgDays) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    // Skip weekends (0 = Sunday, 6 = Saturday)
    const dayOfWeek = deliveryDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDaysAdded++;
    }
  }

  return deliveryDate.toISOString();
}

/**
 * Get delivery time label for a country
 */
export function getDeliveryTimeLabel(country: string): string {
  const zone = getDeliveryZone(country);
  return zone.label;
}

/**
 * Get delivery date range
 */
export function getDeliveryDateRange(
  country: string,
  orderDate: Date = new Date()
): { min: Date; max: Date; label: string } {
  const zone = getDeliveryZone(country);

  // Calculate min date
  let minDate = new Date(orderDate);
  let businessDaysAdded = 0;
  while (businessDaysAdded < zone.minDays) {
    minDate.setDate(minDate.getDate() + 1);
    const dayOfWeek = minDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDaysAdded++;
    }
  }

  // Calculate max date
  let maxDate = new Date(orderDate);
  businessDaysAdded = 0;
  while (businessDaysAdded < zone.maxDays) {
    maxDate.setDate(maxDate.getDate() + 1);
    const dayOfWeek = maxDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDaysAdded++;
    }
  }

  return {
    min: minDate,
    max: maxDate,
    label: zone.label
  };
}

/**
 * Format delivery estimate for display
 */
export function formatDeliveryEstimate(estimatedDelivery: string): string {
  const date = new Date(estimatedDelivery);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Check if delivery is expedited (USA/Europe)
 */
export function isExpeditedDelivery(country: string): boolean {
  const zone = getDeliveryZone(country);
  return zone === DELIVERY_ZONES.USA || zone === DELIVERY_ZONES.EUROPE;
}