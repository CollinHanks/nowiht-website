'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { FILTER_CONSTANTS } from '@/lib/filterConstants';

/**
 * NOWIHT - Collections Filter
 * 
 * Filter products by collection
 * Features:
 * - Checkbox list
 * - Multiple selection
 * - Hover effects
 */

export default function CollectionsFilter() {
  const { selectedCollections, toggleCollection } = useFilterStore();

  return (
    <div className="space-y-2">
      {FILTER_CONSTANTS.COLLECTIONS.map((collection) => {
        const isSelected = selectedCollections.includes(collection.value);

        return (
          <motion.button
            key={collection.value}
            onClick={() => toggleCollection(collection.value)}
            whileHover={{ x: 2 }}
            className="flex items-center gap-3 w-full text-left group"
          >
            {/* Custom checkbox */}
            <div
              className={`
                w-4 h-4 border flex items-center justify-center transition-all
                ${isSelected
                  ? 'bg-black border-black'
                  : 'border-gray-300 group-hover:border-black'
                }
              `}
            >
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </div>

            {/* Collection name */}
            <span
              className={`
                text-xs tracking-wide transition-colors
                ${isSelected ? 'text-black font-medium' : 'text-gray-600 group-hover:text-black'}
              `}
            >
              {collection.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}