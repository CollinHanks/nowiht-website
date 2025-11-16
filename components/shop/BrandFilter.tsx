'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { FILTER_CONSTANTS } from '@/lib/filterConstants';

/**
 * NOWIHT - Brand Filter
 * 
 * Brand checkbox selector
 * Features:
 * - Custom checkbox design
 * - Multiple selection
 * - Hover effects
 * - Accessibility
 */

export default function BrandFilter() {
  const { selectedBrands, toggleBrand } = useFilterStore();

  return (
    <div className="space-y-3">
      {FILTER_CONSTANTS.BRANDS.map((brand) => {
        const isSelected = selectedBrands.includes(brand);

        return (
          <motion.button
            key={brand}
            onClick={() => toggleBrand(brand)}
            whileHover={{ x: 2 }}
            className="flex items-center gap-3 w-full text-left group"
          >
            {/* Custom checkbox */}
            <div
              className={`
                w-5 h-5 border-2 flex items-center justify-center transition-all
                ${
                  isSelected
                    ? 'bg-black border-black'
                    : 'border-gray-300 group-hover:border-black'
                }
              `}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </div>

            {/* Brand name */}
            <span
              className={`
                text-sm tracking-wide transition-colors
                ${isSelected ? 'text-black font-medium' : 'text-gray-700 group-hover:text-black'}
              `}
            >
              {brand}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}