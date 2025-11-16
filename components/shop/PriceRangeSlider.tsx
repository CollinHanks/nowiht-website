'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFilterStore } from '@/store/filterStore';
import { FILTER_CONSTANTS } from '@/lib/filterConstants';

/**
 * NOWIHT - Price Range Slider
 * 
 * Dual-handle range slider for price filtering
 * Features:
 * - Min/Max price selection
 * - Visual feedback
 * - Real-time updates
 * - Formatted price display
 */

export default function PriceRangeSlider() {
  const { priceRange, setPriceRange } = useFilterStore();
  const [localRange, setLocalRange] = useState(priceRange);

  // Sync with store
  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newRange: [number, number] = [value, localRange[1]];
    setLocalRange(newRange);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newRange: [number, number] = [localRange[0], value];
    setLocalRange(newRange);
  };

  const handleMouseUp = () => {
    setPriceRange(localRange);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const percentage = [
    ((localRange[0] - FILTER_CONSTANTS.PRICE.MIN) /
      (FILTER_CONSTANTS.PRICE.MAX - FILTER_CONSTANTS.PRICE.MIN)) *
      100,
    ((localRange[1] - FILTER_CONSTANTS.PRICE.MIN) /
      (FILTER_CONSTANTS.PRICE.MAX - FILTER_CONSTANTS.PRICE.MIN)) *
      100,
  ];

  return (
    <div className="space-y-4">
      {/* Price Display */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{formatPrice(localRange[0])}</span>
        <span className="text-gray-400">—</span>
        <span className="font-medium">{formatPrice(localRange[1])}</span>
      </div>

      {/* Slider Container */}
      <div className="relative pt-2 pb-6">
        {/* Track Background */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 -translate-y-1/2" />

        {/* Active Track */}
        <motion.div
          className="absolute top-1/2 h-px bg-black -translate-y-1/2"
          style={{
            left: `${percentage[0]}%`,
            right: `${100 - percentage[1]}%`,
          }}
          animate={{
            left: `${percentage[0]}%`,
            right: `${100 - percentage[1]}%`,
          }}
          transition={{ duration: 0.1 }}
        />

        {/* Min Slider */}
        <input
          type="range"
          min={FILTER_CONSTANTS.PRICE.MIN}
          max={FILTER_CONSTANTS.PRICE.MAX}
          step={FILTER_CONSTANTS.PRICE.STEP}
          value={localRange[0]}
          onChange={handleMinChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-10
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:bg-black
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-white
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:pointer-events-auto
                     [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:bg-black
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-white
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:pointer-events-auto"
        />

        {/* Max Slider */}
        <input
          type="range"
          min={FILTER_CONSTANTS.PRICE.MIN}
          max={FILTER_CONSTANTS.PRICE.MAX}
          step={FILTER_CONSTANTS.PRICE.STEP}
          value={localRange[1]}
          onChange={handleMaxChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-20
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:bg-black
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-white
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:pointer-events-auto
                     [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:bg-black
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-white
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:pointer-events-auto"
        />
      </div>
    </div>
  );
}