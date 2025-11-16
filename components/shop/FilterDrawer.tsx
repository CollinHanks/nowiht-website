'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Filter as FilterIcon } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import PriceRangeSlider from './PriceRangeSlider';
import ColorFilterCompact from './ColorFilterCompact';
import SizeFilter from './SizeFilter';
import BrandFilter from './BrandFilter';
import CollectionsFilter from './CollectionsFilter';
import MaterialFilter from './MaterialFilter';
import ActiveFilters from './ActiveFilters';

/**
 * NOWIHT - Mobile Optimized Filter Drawer
 * 
 * Mobile: Full-screen, bottom slide-in, rounded top corners
 * Desktop: Left sidebar, traditional slide-in
 * Louis Vuitton luxury feel with better UX
 */

interface FilterDrawerProps {
  onClose: () => void;
}

export default function FilterDrawer({ onClose }: FilterDrawerProps) {
  const {
    inStockOnly,
    setInStockOnly,
    onSaleOnly,
    setOnSaleOnly,
    getActiveFilterCount,
    clearAllFilters
  } = useFilterStore();

  const [globalSearch, setGlobalSearch] = useState('');
  const [openSections, setOpenSections] = useState({
    price: true,
    color: true,
    size: true,
    brand: false,
    collections: false,
    material: false,
    status: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const activeCount = getActiveFilterCount();

  return (
    <>
      {/* Premium Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Epic Drawer - Mobile: Bottom slide, Desktop: Left slide */}
      <motion.div
        initial={{
          x: typeof window !== 'undefined' && window.innerWidth >= 640 ? '-100%' : 0,
          y: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 0
        }}
        animate={{ x: 0, y: 0 }}
        exit={{
          x: typeof window !== 'undefined' && window.innerWidth >= 640 ? '-100%' : 0,
          y: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 0
        }}
        transition={{
          type: 'spring',
          damping: 35,
          stiffness: 400,
        }}
        className="fixed sm:left-0 sm:top-0 
                   bottom-0 left-0 right-0
                   h-[90vh] sm:h-full 
                   w-full sm:w-[420px] 
                   bg-white z-50 flex flex-col shadow-2xl
                   rounded-t-3xl sm:rounded-none"
      >
        {/* 🆕 Mobile Handle Bar */}
        <div className="sm:hidden flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Ultra-Minimal Header */}
        <div className="relative bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-6 shrink-0">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center">
                <FilterIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-light tracking-tight text-black">Filters</h2>
                {activeCount > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeCount} active
                  </p>
                )}
              </div>
            </div>

            {/* Minimal Close */}
            <button
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors active:scale-95"
              aria-label="Close filters"
            >
              <X className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            </button>
          </div>

          {/* GLOBAL SEARCH - Professional */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search within filters..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3 bg-gray-50 border border-gray-200 
                         text-sm text-black placeholder:text-gray-400
                         focus:bg-white focus:border-black focus:outline-none 
                         transition-all rounded-lg"
            />
          </div>
        </div>

        {/* 🆕 Active Filters - Filter Chips */}
        {activeCount > 0 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50/50 border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied ({activeCount})
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-black hover:text-red-600 font-medium 
                           underline underline-offset-2 decoration-1 transition-colors
                           min-h-[44px] sm:min-h-0 flex items-center px-2"
              >
                Clear all
              </button>
            </div>
            <ActiveFilters />
          </div>
        )}

        {/* Scrollable Filters - Ultra Clean */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* Price Range */}
          <MinimalSection
            title="Price Range"
            isOpen={openSections.price}
            onToggle={() => toggleSection('price')}
          >
            <PriceRangeSlider />
          </MinimalSection>

          {/* Color */}
          <MinimalSection
            title="Color"
            isOpen={openSections.color}
            onToggle={() => toggleSection('color')}
          >
            <ColorFilterCompact />
          </MinimalSection>

          {/* Size */}
          <MinimalSection
            title="Size"
            isOpen={openSections.size}
            onToggle={() => toggleSection('size')}
          >
            <SizeFilter />
          </MinimalSection>

          {/* Collections */}
          <MinimalSection
            title="Collections"
            isOpen={openSections.collections}
            onToggle={() => toggleSection('collections')}
          >
            <CollectionsFilter />
          </MinimalSection>

          {/* Material */}
          <MinimalSection
            title="Material"
            isOpen={openSections.material}
            onToggle={() => toggleSection('material')}
          >
            <MaterialFilter />
          </MinimalSection>

          {/* Brand */}
          <MinimalSection
            title="Brand"
            isOpen={openSections.brand}
            onToggle={() => toggleSection('brand')}
          >
            <BrandFilter />
          </MinimalSection>

          {/* Status */}
          <MinimalSection
            title="Availability"
            isOpen={openSections.status}
            onToggle={() => toggleSection('status')}
          >
            <div className="space-y-3">
              <MinimalToggle
                label="In Stock Only"
                checked={inStockOnly}
                onChange={setInStockOnly}
              />
              <MinimalToggle
                label="On Sale"
                checked={onSaleOnly}
                onChange={setOnSaleOnly}
              />
            </div>
          </MinimalSection>

          {/* 🆕 Bottom Padding for Mobile Scroll */}
          <div className="h-20 sm:h-0" />
        </div>

        {/* Premium Footer - Single Action - 🆕 Larger tap targets */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-t border-gray-100 bg-white shrink-0 safe-area-inset-bottom">
          <button
            onClick={onClose}
            className="w-full py-4 bg-black text-white text-sm font-medium 
                       tracking-wide uppercase hover:bg-gray-900 
                       transition-all duration-300 
                       shadow-lg hover:shadow-xl
                       active:scale-[0.98]
                       min-h-[56px] rounded-lg"
          >
            Show {activeCount > 0 ? 'Filtered' : 'All'} Results
          </button>

          {activeCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="w-full mt-3 py-3 text-sm text-gray-600 hover:text-black 
                         font-medium transition-colors min-h-[48px]"
            >
              Reset Filters
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}

// Minimal Section Component - Zalando Style - 🆕 Larger tap targets
function MinimalSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 pb-5 sm:pb-6 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full mb-3 sm:mb-4 group min-h-[44px]"
      >
        <h3 className="text-sm sm:text-base font-medium text-black tracking-wide">
          {title}
        </h3>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center w-8 h-8"
        >
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="pt-2">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// Minimal Toggle - Premium Switch - 🆕 Larger tap target
function MinimalToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full py-3 group min-h-[48px]"
    >
      <span className={`text-sm transition-colors ${checked ? 'text-black font-medium' : 'text-gray-600'
        }`}>
        {label}
      </span>

      <div
        className={`relative w-12 h-7 rounded-full transition-colors ${checked
          ? 'bg-black'
          : 'bg-gray-200 group-hover:bg-gray-300'
          }`}
      >
        <motion.div
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
          animate={{
            left: checked ? '25px' : '4px',
          }}
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        />
      </div>
    </button>
  );
}