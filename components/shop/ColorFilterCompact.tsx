'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Search } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { FILTER_CONSTANTS } from '@/lib/filterConstants';

/**
 * NOWIHT - Compact Color Filter
 * 
 * Minimal color selector with search
 * Features:
 * - Small color swatches (32px)
 * - No color names below
 * - Search functionality
 * - Tooltip on hover
 * - Grid layout (5 per row)
 */

export default function ColorFilterCompact() {
  const { selectedColors, toggleColor } = useFilterStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter colors by search query
  const filteredColors = FILTER_CONSTANTS.COLORS.filter((color) =>
    color.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search colors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 focus:border-black 
                     focus:outline-none transition-colors"
        />
      </div>

      {/* Color Swatches Grid - 5 per row */}
      <div className="grid grid-cols-5 gap-2">
        {filteredColors.map((color) => {
          const isSelected = selectedColors.includes(color.value);
          const isWhite = color.value === 'white';

          return (
            <motion.button
              key={color.value}
              onClick={() => toggleColor(color.value)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={color.name} // Tooltip on hover
              className={`
                relative w-8 h-8 rounded-full transition-all
                ${isWhite ? 'border border-gray-300' : ''}
                ${isSelected ? 'ring-2 ring-black ring-offset-2' : ''}
              `}
              style={{ backgroundColor: color.hex }}
              aria-label={`Filter by ${color.name}`}
            >
              {/* Check mark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Check
                    className={`w-4 h-4 ${isWhite || color.value === 'beige' || color.value === 'champagne' || color.value === 'natural'
                        ? 'text-black'
                        : 'text-white'
                      }`}
                    strokeWidth={3}
                  />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* No results */}
      {filteredColors.length === 0 && (
        <p className="text-xs text-gray-500 text-center py-2">No colors found</p>
      )}

      {/* Selected count */}
      {selectedColors.length > 0 && (
        <p className="text-xs text-gray-600">
          {selectedColors.length} {selectedColors.length === 1 ? 'color' : 'colors'} selected
        </p>
      )}
    </div>
  );
}