// lib/shipping.ts
// ═══════════════════════════════════════════════════════════════
// 🚚 NOWIHT - Shipping Utilities
// Shipping cost calculations and delivery estimates
// FIXED: Added type annotation for restrictedCountries
// ═══════════════════════════════════════════════════════════════

/**
 * Shipping zones and their rates
 */
export const SHIPPING_ZONES = {
  // Zone 1: Turkey (Domestic)
  TR: {
    name: 'Türkiye',
    standard: {
      cost: 25,
      days: '2-4',
      freeShippingThreshold: 500, // Free shipping over 500 TRY
    },
    express: {
      cost: 50,
      days: '1-2',
      freeShippingThreshold: null,
    },
  },

  // Zone 2: Europe
  EU: {
    name: 'Europe',
    standard: {
      cost: 15,
      days: '5-7',
      freeShippingThreshold: 100,
    },
    express: {
      cost: 30,
      days: '2-3',
      freeShippingThreshold: null,
    },
  },

  // Zone 3: North America
  NA: {
    name: 'North America',
    standard: {
      cost: 20,
      days: '7-10',
      freeShippingThreshold: 150,
    },
    express: {
      cost: 40,
      days: '3-5',
      freeShippingThreshold: null,
    },
  },

  // Zone 4: Asia
  AS: {
    name: 'Asia',
    standard: {
      cost: 18,
      days: '7-12',
      freeShippingThreshold: 120,
    },
    express: {
      cost: 35,
      days: '3-5',
      freeShippingThreshold: null,
    },
  },

  // Zone 5: Rest of World
  ROW: {
    name: 'Rest of World',
    standard: {
      cost: 25,
      days: '10-15',
      freeShippingThreshold: 200,
    },
    express: {
      cost: 50,
      days: '5-7',
      freeShippingThreshold: null,
    },
  },
} as const;

/**
 * Country to zone mapping
 */
const COUNTRY_TO_ZONE: Record<string, keyof typeof SHIPPING_ZONES> = {
  // Turkey
  'Turkey': 'TR',
  'Türkiye': 'TR',

  // Europe
  'Austria': 'EU',
  'Belgium': 'EU',
  'Bulgaria': 'EU',
  'Croatia': 'EU',
  'Cyprus': 'EU',
  'Czech Republic': 'EU',
  'Denmark': 'EU',
  'Estonia': 'EU',
  'Finland': 'EU',
  'France': 'EU',
  'Germany': 'EU',
  'Greece': 'EU',
  'Hungary': 'EU',
  'Ireland': 'EU',
  'Italy': 'EU',
  'Latvia': 'EU',
  'Lithuania': 'EU',
  'Luxembourg': 'EU',
  'Malta': 'EU',
  'Netherlands': 'EU',
  'Poland': 'EU',
  'Portugal': 'EU',
  'Romania': 'EU',
  'Slovakia': 'EU',
  'Slovenia': 'EU',
  'Spain': 'EU',
  'Sweden': 'EU',
  'United Kingdom': 'EU',
  'Norway': 'EU',
  'Switzerland': 'EU',
  'Iceland': 'EU',

  // North America
  'United States': 'NA',
  'Canada': 'NA',
  'Mexico': 'NA',

  // Asia
  'Japan': 'AS',
  'South Korea': 'AS',
  'China': 'AS',
  'Hong Kong': 'AS',
  'Taiwan': 'AS',
  'Singapore': 'AS',
  'Malaysia': 'AS',
  'Thailand': 'AS',
  'Indonesia': 'AS',
  'Philippines': 'AS',
  'Vietnam': 'AS',
  'India': 'AS',
  'United Arab Emirates': 'AS',
  'Saudi Arabia': 'AS',
  'Qatar': 'AS',
  'Kuwait': 'AS',
  'Israel': 'AS',

  // Rest of World (default)
};

/**
 * Get shipping zone for a country
 */
export function getShippingZone(country: string): keyof typeof SHIPPING_ZONES {
  return COUNTRY_TO_ZONE[country] || 'ROW';
}

/**
 * Calculate shipping cost
 */
export function calculateShippingCost(
  country: string,
  subtotal: number,
  method: 'standard' | 'express' = 'standard'
): {
  cost: number;
  isFree: boolean;
  zone: string;
  estimatedDays: string;
} {
  const zone = getShippingZone(country);
  const zoneData = SHIPPING_ZONES[zone];
  const methodData = zoneData[method];

  // Check if free shipping applies
  const isFree =
    methodData.freeShippingThreshold !== null &&
    subtotal >= methodData.freeShippingThreshold;

  return {
    cost: isFree ? 0 : methodData.cost,
    isFree,
    zone: zoneData.name,
    estimatedDays: methodData.days,
  };
}

/**
 * Get all shipping options for a country
 */
export function getShippingOptions(
  country: string,
  subtotal: number
): Array<{
  method: 'standard' | 'express';
  name: string;
  cost: number;
  isFree: boolean;
  estimatedDays: string;
  description: string;
}> {
  const zone = getShippingZone(country);
  const zoneData = SHIPPING_ZONES[zone];

  const options = [];

  // Standard shipping
  const standardCost = calculateShippingCost(country, subtotal, 'standard');
  options.push({
    method: 'standard' as const,
    name: 'Standard Shipping',
    cost: standardCost.cost,
    isFree: standardCost.isFree,
    estimatedDays: standardCost.estimatedDays,
    description: `Delivered in ${standardCost.estimatedDays} business days`,
  });

  // Express shipping
  const expressCost = calculateShippingCost(country, subtotal, 'express');
  options.push({
    method: 'express' as const,
    name: 'Express Shipping',
    cost: expressCost.cost,
    isFree: expressCost.isFree,
    estimatedDays: expressCost.estimatedDays,
    description: `Delivered in ${expressCost.estimatedDays} business days`,
  });

  return options;
}

/**
 * Calculate estimated delivery date
 */
export function calculateDeliveryDate(
  country: string,
  method: 'standard' | 'express' = 'standard',
  orderDate: Date = new Date()
): {
  earliest: Date;
  latest: Date;
  formatted: string;
} {
  const zone = getShippingZone(country);
  const zoneData = SHIPPING_ZONES[zone];
  const methodData = zoneData[method];

  // Parse days range (e.g., "2-4" -> [2, 4])
  const [minDays, maxDays] = methodData.days.split('-').map(d => parseInt(d));

  const earliest = new Date(orderDate);
  earliest.setDate(earliest.getDate() + minDays);

  const latest = new Date(orderDate);
  latest.setDate(latest.getDate() + maxDays);

  const formatted = `${earliest.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long'
  })} - ${latest.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })}`;

  return {
    earliest,
    latest,
    formatted,
  };
}

/**
 * Check if country ships to (can add restricted countries here)
 */
export function canShipToCountry(country: string): boolean {
  // ✅ FIXED: Added type annotation
  const restrictedCountries: string[] = [
    // Add restricted countries here if needed
    // Example: 'North Korea', 'Syria', etc.
  ];

  return !restrictedCountries.includes(country);
}

/**
 * Get shipping recommendations
 */
export function getShippingRecommendations(
  country: string,
  subtotal: number
): {
  recommendedMethod: 'standard' | 'express';
  savings?: number;
  message: string;
} {
  const zone = getShippingZone(country);
  const zoneData = SHIPPING_ZONES[zone];

  // Calculate how much more needed for free shipping
  const standardThreshold = zoneData.standard.freeShippingThreshold;

  if (standardThreshold && subtotal < standardThreshold) {
    const amountNeeded = standardThreshold - subtotal;
    return {
      recommendedMethod: 'standard',
      savings: zoneData.standard.cost,
      message: `Ücretsiz kargo için sepete ${amountNeeded.toFixed(2)} TRY daha ekleyin!`,
    };
  }

  if (standardThreshold && subtotal >= standardThreshold) {
    return {
      recommendedMethod: 'standard',
      message: 'Tebrikler! Ücretsiz kargo kazandınız!',
    };
  }

  return {
    recommendedMethod: 'standard',
    message: 'Standard kargo önerilir',
  };
}

/**
 * Format shipping info for display
 */
export function formatShippingInfo(
  country: string,
  method: 'standard' | 'express',
  subtotal: number
): string {
  const shippingCost = calculateShippingCost(country, subtotal, method);
  const deliveryDate = calculateDeliveryDate(country, method);

  if (shippingCost.isFree) {
    return `ÜCRETSİZ KARGO • ${deliveryDate.formatted} arası teslimat`;
  }

  return `${shippingCost.cost} TRY • ${deliveryDate.formatted} arası teslimat`;
}