"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Color {
  name: string;
  hex?: string; // Optional hex value
}

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: string;
  onColorChange: (colorName: string) => void;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const COLOR_HEX_MAP: Record<string, string> = {
  // Blacks
  black: "#000000",
  jet: "#0A0A0A",
  obsidian: "#1C1C1C",

  // Whites
  white: "#FFFFFF",
  cream: "#FFFDD0",
  ivory: "#FFFFF0",
  offwhite: "#FAF9F6",

  // Grays
  gray: "#808080",
  grey: "#808080",
  charcoal: "#36454F",
  slate: "#708090",

  // Browns
  brown: "#964B00",
  tan: "#D2B48C",
  beige: "#F5F5DC",
  caramel: "#C68E17",
  mocha: "#967969",

  // Blues
  blue: "#0000FF",
  navy: "#000080",
  denim: "#1560BD",
  sky: "#87CEEB",

  // Greens
  green: "#008000",
  olive: "#808000",
  forest: "#228B22",
  sage: "#BCB88A",

  // Reds
  red: "#DC2626",
  burgundy: "#800020",
  wine: "#722F37",

  // Other
  pink: "#FFC0CB",
  purple: "#800080",
  yellow: "#FFFF00",
  orange: "#FFA500",
};

/**
 * Get hex color with fallback strategy:
 * 1. Use provided hex
 * 2. Look up in COLOR_HEX_MAP
 * 3. Fallback to black
 */
function getColorHex(color: Color): string {
  // Priority 1: Use provided hex
  if (color.hex && /^#[0-9A-F]{6}$/i.test(color.hex)) {
    return color.hex;
  }

  // Priority 2: Look up in map (case-insensitive)
  if (color.name) {
    const normalized = color.name.toLowerCase().replace(/\s+/g, "");
    if (COLOR_HEX_MAP[normalized]) {
      return COLOR_HEX_MAP[normalized];
    }
  }

  // Priority 3: Fallback to black
  return "#000000";
}

/**
 * Check if color is light (for border visibility)
 */
function isLightColor(hex: string): boolean {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 200;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onColorChange,
  size = "md",
  showLabel = true,
}: ColorSelectorProps) {
  // ✅ NULL CHECK: Validate colors array
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const checkSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      {showLabel && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium uppercase tracking-[0.2em]">
            Color
          </label>
          <span className="text-sm text-gray-600 font-light">
            {selectedColor || colors[0]?.name || "Select"}
          </span>
        </div>
      )}

      {/* Color Swatches */}
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => {
          // ✅ NULL CHECK: Validate color object
          if (!color || !color.name) {
            return null;
          }

          const hex = getColorHex(color);
          const isSelected = selectedColor === color.name;
          const isLight = isLightColor(hex);

          return (
            <motion.button
              key={`${color.name}-${index}`}
              onClick={() => onColorChange(color.name)}
              className={`
                ${sizeClasses[size]}
                relative rounded-full
                transition-all duration-200
                ${isSelected ? "ring-2 ring-black ring-offset-2" : ""}
                hover:scale-110
                ${isLight ? "border border-gray-300" : ""}
              `}
              style={{ backgroundColor: hex }}
              whileTap={{ scale: 0.95 }}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            >
              {/* Check Icon for Selected */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Check
                    className={`${checkSizes[size]} ${isLight ? "text-black" : "text-white"
                      }`}
                    strokeWidth={3}
                  />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}