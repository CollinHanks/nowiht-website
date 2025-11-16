'use client';

import { motion } from 'framer-motion';
import { useFilterStore } from '@/store/filterStore';
import { FILTER_CONSTANTS } from '@/lib/filterConstants';

/**
 * NOWIHT - Size Filter
 * 
 * Size button selector
 * Features:
 * - Button grid layout
 * - Multiple selection
 * - Hover effects
 * - Active state styling
 */

export default function SizeFilter() {
  const { selectedSizes, toggleSize } = useFilterStore();

  return (
    <div className="grid grid-cols-3 gap-2">
      {FILTER_CONSTANTS.SIZES.map((size) => {
        const isSelected = selectedSizes.includes(size);

        return (
          <motion.button
            key={size}
            onClick={() => toggleSize(size)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              py-3 text-sm font-medium tracking-wide transition-all
              ${
                isSelected
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-300 hover:border-black'
              }
            `}
          >
            {size}
          </motion.button>
        );
      })}
    </div>
  );
}