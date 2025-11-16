'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import PriceRangeSlider from './PriceRangeSlider';
import ColorFilterCompact from './ColorFilterCompact';
import SizeFilter from './SizeFilter';
import BrandFilter from './BrandFilter';
import CollectionsFilter from './CollectionsFilter';
import MaterialFilter from './MaterialFilter';
import ActiveFilters from './ActiveFilters';

/**
 * NOWIHT - Filter Sidebar
 * 
 * Desktop: Sticky sidebar
 * Mobile: Drawer with backdrop
 */

interface FilterSidebarProps {
  onClose?: () => void; // For mobile drawer
}

export default function FilterSidebar({ onClose }: FilterSidebarProps) {
  const { inStockOnly, setInStockOnly, onSaleOnly, setOnSaleOnly, getActiveFilterCount } =
    useFilterStore();

  // Collapsible section states
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
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-medium tracking-wider uppercase">Filters</h2>
          {activeCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded-full"
            >
              {activeCount}
            </motion.span>
          )}
        </div>

        {/* Close button - Mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active Filters */}
      {activeCount > 0 && (
        <div className="px-6 py-4 border-b border-gray-200 shrink-0">
          <ActiveFilters />
        </div>
      )}

      {/* Scrollable Filters */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-0">
        {/* Price Range */}
        <FilterSection
          title="Price"
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
        >
          <PriceRangeSlider />
        </FilterSection>

        {/* Color */}
        <FilterSection
          title="Color"
          isOpen={openSections.color}
          onToggle={() => toggleSection('color')}
        >
          <ColorFilterCompact />
        </FilterSection>

        {/* Size */}
        <FilterSection
          title="Size"
          isOpen={openSections.size}
          onToggle={() => toggleSection('size')}
        >
          <SizeFilter />
        </FilterSection>

        {/* Collections */}
        <FilterSection
          title="Collections"
          isOpen={openSections.collections}
          onToggle={() => toggleSection('collections')}
        >
          <CollectionsFilter />
        </FilterSection>

        {/* Material */}
        <FilterSection
          title="Material"
          isOpen={openSections.material}
          onToggle={() => toggleSection('material')}
        >
          <MaterialFilter />
        </FilterSection>

        {/* Brand */}
        <FilterSection
          title="Brand"
          isOpen={openSections.brand}
          onToggle={() => toggleSection('brand')}
        >
          <BrandFilter />
        </FilterSection>

        {/* Status Toggles */}
        <FilterSection
          title="Availability"
          isOpen={openSections.status}
          onToggle={() => toggleSection('status')}
        >
          <div className="space-y-3">
            <ToggleButton
              label="In Stock Only"
              checked={inStockOnly}
              onChange={setInStockOnly}
            />
            <ToggleButton label="On Sale" checked={onSaleOnly} onChange={setOnSaleOnly} />
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

// Collapsible filter section
function FilterSection({
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
    <div className="border-b border-gray-200 py-4">
      <button onClick={onToggle} className="flex items-center justify-between w-full mb-3 group">
        <h3 className="text-xs font-medium tracking-widest uppercase">{title}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Toggle button
function ToggleButton({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-3 w-full group">
      <div
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-black' : 'bg-gray-200 group-hover:bg-gray-300'
          }`}
      >
        <motion.div
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
          animate={{
            left: checked ? '22px' : '2px',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>

      <span
        className={`text-xs tracking-wide transition-colors ${checked ? 'text-black font-medium' : 'text-gray-600 group-hover:text-black'
          }`}
      >
        {label}
      </span>
    </button>
  );
}