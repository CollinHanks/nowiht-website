'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { FILTER_CONSTANTS } from '@/lib/filterConstants';

/**
 * NOWIHT - Material Filter
 * 
 * Filter products by material/fabric
 * Features:
 * - Checkbox list
 * - Multiple selection
 * - Hover effects
 */

export default function MaterialFilter() {
  const { selectedMaterials, toggleMaterial } = useFilterStore();

  return (
    <div className="space-y-2">
      {FILTER_CONSTANTS.MATERIALS.map((material) => {
        const isSelected = selectedMaterials.includes(material.value);

        return (
          <motion.button
            key={material.value}
            onClick={() => toggleMaterial(material.value)}
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

            {/* Material name */}
            <span
              className={`
                text-xs tracking-wide transition-colors
                ${isSelected ? 'text-black font-medium' : 'text-gray-600 group-hover:text-black'}
              `}
            >
              {material.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}