import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

export interface FilterState {
  // Price
  minPrice: number;
  maxPrice: number;
  priceRange: [number, number];

  // Attributes
  selectedColors: string[];
  selectedSizes: string[];
  selectedBrands: string[];
  selectedCategories: string[];
  selectedCollections: string[]; // NEW
  selectedMaterials: string[]; // NEW

  // Status
  inStockOnly: boolean;
  onSaleOnly: boolean;

  // Sort
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'name-asc' | 'name-desc';

  // Actions
  setPriceRange: (range: [number, number]) => void;
  toggleColor: (color: string) => void;
  toggleSize: (size: string) => void;
  toggleBrand: (brand: string) => void;
  toggleCategory: (category: string) => void;
  toggleCollection: (collection: string) => void; // NEW
  toggleMaterial: (material: string) => void; // NEW
  setInStockOnly: (value: boolean) => void;
  setOnSaleOnly: (value: boolean) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  clearAllFilters: () => void;
  clearFilter: (filterType: 'color' | 'size' | 'brand' | 'category' | 'collection' | 'material') => void;
  getActiveFilterCount: () => number;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

const initialState = {
  minPrice: DEFAULT_MIN_PRICE,
  maxPrice: DEFAULT_MAX_PRICE,
  priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE] as [number, number],
  selectedColors: [],
  selectedSizes: [],
  selectedBrands: [],
  selectedCategories: [],
  selectedCollections: [], // NEW
  selectedMaterials: [], // NEW
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'newest' as const,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPriceRange: (range) => set({ priceRange: range }),

      toggleColor: (color) =>
        set((state) => ({
          selectedColors: state.selectedColors.includes(color)
            ? state.selectedColors.filter((c) => c !== color)
            : [...state.selectedColors, color],
        })),

      toggleSize: (size) =>
        set((state) => ({
          selectedSizes: state.selectedSizes.includes(size)
            ? state.selectedSizes.filter((s) => s !== size)
            : [...state.selectedSizes, size],
        })),

      toggleBrand: (brand) =>
        set((state) => ({
          selectedBrands: state.selectedBrands.includes(brand)
            ? state.selectedBrands.filter((b) => b !== brand)
            : [...state.selectedBrands, brand],
        })),

      toggleCategory: (category) =>
        set((state) => ({
          selectedCategories: state.selectedCategories.includes(category)
            ? state.selectedCategories.filter((c) => c !== category)
            : [...state.selectedCategories, category],
        })),

      // NEW: Collection toggle
      toggleCollection: (collection) =>
        set((state) => ({
          selectedCollections: state.selectedCollections.includes(collection)
            ? state.selectedCollections.filter((c) => c !== collection)
            : [...state.selectedCollections, collection],
        })),

      // NEW: Material toggle
      toggleMaterial: (material) =>
        set((state) => ({
          selectedMaterials: state.selectedMaterials.includes(material)
            ? state.selectedMaterials.filter((m) => m !== material)
            : [...state.selectedMaterials, material],
        })),

      setInStockOnly: (value) => set({ inStockOnly: value }),
      setOnSaleOnly: (value) => set({ onSaleOnly: value }),
      setSortBy: (sort) => set({ sortBy: sort }),

      clearFilter: (filterType) => {
        switch (filterType) {
          case 'color':
            set({ selectedColors: [] });
            break;
          case 'size':
            set({ selectedSizes: [] });
            break;
          case 'brand':
            set({ selectedBrands: [] });
            break;
          case 'category':
            set({ selectedCategories: [] });
            break;
          case 'collection':
            set({ selectedCollections: [] });
            break;
          case 'material':
            set({ selectedMaterials: [] });
            break;
        }
      },

      clearAllFilters: () => set(initialState),

      getActiveFilterCount: () => {
        const state = get();
        let count = 0;

        if (
          state.priceRange[0] !== DEFAULT_MIN_PRICE ||
          state.priceRange[1] !== DEFAULT_MAX_PRICE
        ) {
          count++;
        }

        count += state.selectedColors.length;
        count += state.selectedSizes.length;
        count += state.selectedBrands.length;
        count += state.selectedCategories.length;
        count += state.selectedCollections.length; // NEW
        count += state.selectedMaterials.length; // NEW

        if (state.inStockOnly) count++;
        if (state.onSaleOnly) count++;

        return count;
      },
    }),
    {
      name: 'nowiht-filters',
      partialize: (state) => ({
        selectedColors: state.selectedColors,
        selectedSizes: state.selectedSizes,
        selectedBrands: state.selectedBrands,
        selectedCollections: state.selectedCollections,
        selectedMaterials: state.selectedMaterials,
      }),
    }
  )
);

// Filter utility - UPDATED for collections and materials
export const filterProducts = (products: Product[], filters: FilterState): Product[] => {
  return products.filter((product) => {
    // Price range
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Colors
    if (filters.selectedColors.length > 0) {
      const productColorNames = product.colors.map((c) => c.name.toLowerCase());
      const hasMatchingColor = filters.selectedColors.some((filterColor) =>
        productColorNames.includes(filterColor.toLowerCase())
      );
      if (!hasMatchingColor) {
        return false;
      }
    }

    // Sizes
    if (filters.selectedSizes.length > 0) {
      if (!product.sizes || !product.sizes.some((s) => filters.selectedSizes.includes(s))) {
        return false;
      }
    }

    // Brands
    if (filters.selectedBrands.length > 0) {
      if (!product.brand || !filters.selectedBrands.includes(product.brand)) {
        return false;
      }
    }

    // Categories
    if (filters.selectedCategories.length > 0) {
      if (!product.category || !filters.selectedCategories.includes(product.category)) {
        return false;
      }
    }

    // Collections - NEW
    if (filters.selectedCollections.length > 0) {
      if (!product.collection || !filters.selectedCollections.includes(product.collection)) {
        return false;
      }
    }

    // Materials - NEW
    if (filters.selectedMaterials.length > 0) {
      if (!product.material) {
        return false;
      }
      // Check if product material contains any of the selected materials
      const hasMatchingMaterial = filters.selectedMaterials.some((filterMaterial) =>
        product.material.toLowerCase().includes(filterMaterial.toLowerCase())
      );
      if (!hasMatchingMaterial) {
        return false;
      }
    }

    // Stock
    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    // Sale
    if (filters.onSaleOnly && !product.isOnSale) {
      return false;
    }

    return true;
  });
};

// Sort utility
export const sortProducts = (products: Product[], sortBy: FilterState['sortBy']): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);

    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case 'popular':
      return sorted.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));

    case 'newest':
    default:
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
  }
};