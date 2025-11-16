import type { UserMeasurements, SizeRecommendation, SizeMeasurement } from "@/types";

/**
 * NOWIHT Size Calculator
 * 
 * Smart algorithm to recommend clothing sizes based on:
 * - Height & Weight (BMI calculation)
 * - Body type (Slim, Average, Athletic, Curvy)
 * - Fit preference (Tight, Regular, Loose)
 * - Category-specific measurements
 * 
 * Returns recommended size + alternatives with confidence score
 */

// Size chart data (inches)
const SIZE_CHARTS: Record<string, SizeMeasurement[]> = {
  // T-shirts, Tops, Polo Shirts
  tops: [
    { size: "XS", bust: "32-34", waist: "24-26", hips: "34-36" },
    { size: "S", bust: "34-36", waist: "26-28", hips: "36-38" },
    { size: "M", bust: "36-38", waist: "28-30", hips: "38-40" },
    { size: "L", bust: "38-40", waist: "30-32", hips: "40-42" },
    { size: "XL", bust: "40-42", waist: "32-34", hips: "42-44" },
  ],
  // Hoodies, Sweatshirts
  outerwear: [
    { size: "XS", bust: "34-36", waist: "26-28", hips: "36-38" },
    { size: "S", bust: "36-38", waist: "28-30", hips: "38-40" },
    { size: "M", bust: "38-40", waist: "30-32", hips: "40-42" },
    { size: "L", bust: "40-42", waist: "32-34", hips: "42-44" },
    { size: "XL", bust: "42-44", waist: "34-36", hips: "44-46" },
  ],
  // Dresses
  dresses: [
    { size: "XS", bust: "32-34", waist: "24-26", hips: "34-36" },
    { size: "S", bust: "34-36", waist: "26-28", hips: "36-38" },
    { size: "M", bust: "36-38", waist: "28-30", hips: "38-40" },
    { size: "L", bust: "38-40", waist: "30-32", hips: "40-42" },
    { size: "XL", bust: "40-42", waist: "32-34", hips: "42-44" },
  ],
  // Bottoms (Pants, Tracksuits)
  bottoms: [
    { size: "XS", bust: "32-34", waist: "24-26", hips: "34-36" },
    { size: "S", bust: "34-36", waist: "26-28", hips: "36-38" },
    { size: "M", bust: "36-38", waist: "28-30", hips: "38-40" },
    { size: "L", bust: "38-40", waist: "30-32", hips: "40-42" },
    { size: "XL", bust: "40-42", waist: "32-34", hips: "42-44" },
  ],
};

// Category mapping
const CATEGORY_MAP: Record<string, keyof typeof SIZE_CHARTS> = {
  "t-shirts": "tops",
  "polo-shirts": "tops",
  "hoodies": "outerwear",
  "sweatshirts": "outerwear",
  "dresses": "dresses",
  "tracksuits": "bottoms",
  "pajama-sets": "tops",
};

/**
 * Calculate BMI from height (cm) and weight (kg)
 */
function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

/**
 * Estimate bust measurement based on BMI and body type
 */
function estimateBust(bmi: number, bodyType: UserMeasurements["bodyType"]): number {
  let bust = 0;

  // Base bust from BMI
  if (bmi < 18.5) {
    bust = 32; // Underweight
  } else if (bmi < 25) {
    bust = 34; // Normal weight
  } else if (bmi < 30) {
    bust = 38; // Overweight
  } else {
    bust = 42; // Obese
  }

  // Adjust for body type
  switch (bodyType) {
    case "slim":
      bust -= 2;
      break;
    case "average":
      // No adjustment
      break;
    case "athletic":
      bust += 1;
      break;
    case "curvy":
      bust += 3;
      break;
  }

  return bust;
}

/**
 * Estimate waist measurement (typically 2-4 inches less than bust)
 */
function estimateWaist(bust: number, bodyType: UserMeasurements["bodyType"]): number {
  let difference = 4; // Standard difference

  switch (bodyType) {
    case "slim":
      difference = 6;
      break;
    case "average":
      difference = 4;
      break;
    case "athletic":
      difference = 3;
      break;
    case "curvy":
      difference = 8;
      break;
  }

  return bust - difference;
}

/**
 * Estimate hips measurement (typically 2 inches more than bust)
 */
function estimateHips(bust: number, bodyType: UserMeasurements["bodyType"]): number {
  let difference = 2;

  switch (bodyType) {
    case "slim":
      difference = 2;
      break;
    case "average":
      difference = 2;
      break;
    case "athletic":
      difference = 1;
      break;
    case "curvy":
      difference = 4;
      break;
  }

  return bust + difference;
}

/**
 * Parse size range (e.g., "34-36") and check if measurement fits
 */
function isInRange(measurement: number, range: string): boolean {
  const [min, max] = range.split("-").map(Number);
  return measurement >= min && measurement <= max;
}

/**
 * Find best matching size from measurements
 */
function findMatchingSize(
  bust: number,
  waist: number,
  hips: number,
  sizeChart: SizeMeasurement[]
): { size: string; confidence: number } {
  let bestMatch = sizeChart[2]; // Default to M
  let bestScore = 0;

  for (const sizeMeasurement of sizeChart) {
    let score = 0;

    if (isInRange(bust, sizeMeasurement.bust)) score += 3;
    if (isInRange(waist, sizeMeasurement.waist)) score += 3;
    if (isInRange(hips, sizeMeasurement.hips)) score += 2;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = sizeMeasurement;
    }
  }

  // Calculate confidence (0-100)
  const maxScore = 8; // 3 + 3 + 2
  const confidence = Math.round((bestScore / maxScore) * 100);

  return {
    size: bestMatch.size,
    confidence: Math.min(confidence, 95), // Cap at 95%
  };
}

/**
 * Adjust size based on fit preference
 */
function adjustForFitPreference(
  size: string,
  fitPreference: UserMeasurements["fitPreference"],
  sizeChart: SizeMeasurement[]
): string {
  const sizeIndex = sizeChart.findIndex((s) => s.size === size);

  if (fitPreference === "tight" && sizeIndex > 0) {
    // Go one size smaller
    return sizeChart[sizeIndex - 1].size;
  } else if (fitPreference === "loose" && sizeIndex < sizeChart.length - 1) {
    // Go one size larger
    return sizeChart[sizeIndex + 1].size;
  }

  return size; // Regular fit - no change
}

/**
 * Get alternative sizes (one smaller, one larger)
 */
function getAlternatives(size: string, sizeChart: SizeMeasurement[]): string[] {
  const sizeIndex = sizeChart.findIndex((s) => s.size === size);
  const alternatives: string[] = [];

  if (sizeIndex > 0) {
    alternatives.push(sizeChart[sizeIndex - 1].size);
  }
  if (sizeIndex < sizeChart.length - 1) {
    alternatives.push(sizeChart[sizeIndex + 1].size);
  }

  return alternatives;
}

/**
 * Generate recommendation reason
 */
function generateReason(
  measurements: UserMeasurements,
  confidence: number
): string {
  const { height, weight, bodyType, fitPreference } = measurements;
  const bmi = calculateBMI(height, weight);

  let reason = `Based on your height (${height}cm), weight (${weight}kg), `;
  reason += `${bodyType} body type, and ${fitPreference} fit preference. `;

  if (confidence >= 90) {
    reason += "Highly confident match!";
  } else if (confidence >= 75) {
    reason += "Good match based on your measurements.";
  } else {
    reason += "Consider trying on before purchasing.";
  }

  return reason;
}

/**
 * Main function: Calculate size recommendation
 */
export function calculateSizeRecommendation(
  measurements: UserMeasurements,
  category: string
): SizeRecommendation {
  // Get appropriate size chart
  const chartKey = CATEGORY_MAP[category] || "tops";
  const sizeChart = SIZE_CHARTS[chartKey];

  // Calculate BMI
  const bmi = calculateBMI(measurements.height, measurements.weight);

  // Estimate body measurements
  const bust = estimateBust(bmi, measurements.bodyType);
  const waist = estimateWaist(bust, measurements.bodyType);
  const hips = estimateHips(bust, measurements.bodyType);

  // Find matching size
  const { size, confidence } = findMatchingSize(bust, waist, hips, sizeChart);

  // Adjust for fit preference
  const adjustedSize = adjustForFitPreference(
    size,
    measurements.fitPreference,
    sizeChart
  );

  // Get alternatives
  const alternatives = getAlternatives(adjustedSize, sizeChart);

  // Generate reason
  const reason = generateReason(measurements, confidence);

  return {
    recommendedSize: adjustedSize,
    alternatives,
    confidence,
    reason,
  };
}

/**
 * Get size chart for a category
 */
export function getSizeChart(category: string): SizeMeasurement[] {
  const chartKey = CATEGORY_MAP[category] || "tops";
  return SIZE_CHARTS[chartKey];
}

/**
 * Save user measurements to localStorage
 */
export function saveUserMeasurements(measurements: UserMeasurements): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("nowiht-measurements", JSON.stringify(measurements));
  }
}

/**
 * Load user measurements from localStorage
 */
export function loadUserMeasurements(): UserMeasurements | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("nowiht-measurements");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
}