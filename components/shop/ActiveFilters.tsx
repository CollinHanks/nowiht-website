'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { FILTER_CONSTANTS } from '@/lib/filterConstants';

/**
 * NOWIHT - Active Filters
 * 
 * Display active filters as chips with remove option
 * Features:
 * - Filter chips
 * - Individual remove
 * - Clear all button
 * - Smooth animations
 * - Active count
 */

export default function ActiveFilters() {
  const {
    priceRange,
    selectedColors,
    selectedSizes,
    selectedBrands,
    selectedCategories,
    inStockOnly,
    onSaleOnly,
    toggleColor,
    toggleSize,
    toggleBrand,
    toggleCategory,
    setInStockOnly,
    setOnSaleOnly,
    setPriceRange,
    clearAllFilters,
    getActiveFilterCount,
  } = useFilterStore();

  const activeCount = getActiveFilterCount();

  if (activeCount === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isPriceFiltered =
    priceRange[0] !== FILTER_CONSTANTS.PRICE.MIN ||
    priceRange[1] !== FILTER_CONSTANTS.PRICE.MAX;

  return (
    <div className="space-y-3">
      {/* Active count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {activeCount} {activeCount === 1 ? 'filter' : 'filters'} applied
        </span>
        <button
          onClick={clearAllFilters}
          className="text-sm text-black hover:text-red-600 underline underline-offset-4 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {/* Price chip */}
          {isPriceFiltered && (
            <FilterChip
              key="price"
              label={`${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
              onRemove={() =>
                setPriceRange([FILTER_CONSTANTS.PRICE.MIN, FILTER_CONSTANTS.PRICE.MAX])
              }
            />
          )}

          {/* Color chips */}
          {selectedColors.map((color) => {
            const colorObj = FILTER_CONSTANTS.COLORS.find((c) => c.value === color);
            return (
              <FilterChip
                key={`color-${color}`}
                label={colorObj?.name || color}
                onRemove={() => toggleColor(color)}
              />
            );
          })}

          {/* Size chips */}
          {selectedSizes.map((size) => (
            <FilterChip
              key={`size-${size}`}
              label={`Size ${size}`}
              onRemove={() => toggleSize(size)}
            />
          ))}

          {/* Brand chips */}
          {selectedBrands.map((brand) => (
            <FilterChip key={`brand-${brand}`} label={brand} onRemove={() => toggleBrand(brand)} />
          ))}

          {/* Category chips */}
          {selectedCategories.map((category) => (
            <FilterChip
              key={`category-${category}`}
              label={category}
              onRemove={() => toggleCategory(category)}
            />
          ))}

          {/* In Stock chip */}
          {inStockOnly && (
            <FilterChip key="inStock" label="In Stock" onRemove={() => setInStockOnly(false)} />
          )}

          {/* On Sale chip */}
          {onSaleOnly && (
            <FilterChip key="onSale" label="On Sale" onRemove={() => setOnSaleOnly(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Filter chip component
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onRemove}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs tracking-wide
                 hover:bg-red-600 transition-colors group"
    >
      <span>{label}</span>
      <X className="w-3 h-3 group-hover:rotate-90 transition-transform" strokeWidth={2} />
    </motion.button>
  );
}