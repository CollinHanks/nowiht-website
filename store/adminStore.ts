/**
 * Admin Store - Zustand State Management for Admin Panel
 * 
 * Manages products, categories, filters, and UI state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';
import type { Category } from '@/lib/services/CategoryService';

// ═══════════════════════════════════════════════════════════════
// 📊 TYPES
// ═══════════════════════════════════════════════════════════════

interface ProductFilters {
  search: string;
  category: string;
  status: 'all' | 'draft' | 'published';
  stock: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  isNew: boolean | null;
  isOnSale: boolean | null;
}

interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

interface AdminState {
  // Products
  products: Product[];
  selectedProducts: string[];
  productFilters: ProductFilters;
  productPagination: PaginationState;

  // Categories
  categories: Category[];
  selectedCategory: string | null;

  // UI State
  isSidebarOpen: boolean;
  isLoading: boolean;
  bulkAction: 'none' | 'delete' | 'publish' | 'draft' | 'sale';

  // Actions - Products
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteProducts: (ids: string[]) => void;

  // Actions - Selection
  toggleSelectProduct: (id: string) => void;
  selectAllProducts: () => void;
  clearSelection: () => void;

  // Actions - Filters
  setProductFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;

  // Actions - Pagination
  setPagination: (pagination: Partial<PaginationState>) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Actions - Categories
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setSelectedCategory: (id: string | null) => void;

  // Actions - UI
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  setBulkAction: (action: AdminState['bulkAction']) => void;
}

// ═══════════════════════════════════════════════════════════════
// 🏪 STORE
// ═══════════════════════════════════════════════════════════════

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial State - Products
      products: [],
      selectedProducts: [],
      productFilters: {
        search: '',
        category: 'all',
        status: 'all',
        stock: 'all',
        isNew: null,
        isOnSale: null,
      },
      productPagination: {
        page: 1,
        perPage: 20,
        total: 0,
      },

      // Initial State - Categories
      categories: [],
      selectedCategory: null,

      // Initial State - UI
      isSidebarOpen: true,
      isLoading: false,
      bulkAction: 'none',

      // ═══════════════════════════════════════════════════════════
      // PRODUCT ACTIONS
      // ═══════════════════════════════════════════════════════════

      setProducts: (products) => set({
        products,
        productPagination: { ...get().productPagination, total: products.length },
      }),

      addProduct: (product) => set((state) => ({
        products: [product, ...state.products],
        productPagination: { ...state.productPagination, total: state.products.length + 1 },
      })),

      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        ),
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        selectedProducts: state.selectedProducts.filter((sid) => sid !== id),
        productPagination: { ...state.productPagination, total: state.products.length - 1 },
      })),

      deleteProducts: (ids) => set((state) => ({
        products: state.products.filter((p) => !ids.includes(p.id)),
        selectedProducts: [],
        productPagination: { ...state.productPagination, total: state.products.length - ids.length },
      })),

      // ═══════════════════════════════════════════════════════════
      // SELECTION ACTIONS
      // ═══════════════════════════════════════════════════════════

      toggleSelectProduct: (id) => set((state) => ({
        selectedProducts: state.selectedProducts.includes(id)
          ? state.selectedProducts.filter((sid) => sid !== id)
          : [...state.selectedProducts, id],
      })),

      selectAllProducts: () => set((state) => ({
        selectedProducts: state.products.map((p) => p.id),
      })),

      clearSelection: () => set({ selectedProducts: [] }),

      // ═══════════════════════════════════════════════════════════
      // FILTER ACTIONS
      // ═══════════════════════════════════════════════════════════

      setProductFilters: (filters) => set((state) => ({
        productFilters: { ...state.productFilters, ...filters },
        productPagination: { ...state.productPagination, page: 1 }, // Reset to first page
      })),

      resetFilters: () => set({
        productFilters: {
          search: '',
          category: 'all',
          status: 'all',
          stock: 'all',
          isNew: null,
          isOnSale: null,
        },
        productPagination: { ...get().productPagination, page: 1 },
      }),

      // ═══════════════════════════════════════════════════════════
      // PAGINATION ACTIONS
      // ═══════════════════════════════════════════════════════════

      setPagination: (pagination) => set((state) => ({
        productPagination: { ...state.productPagination, ...pagination },
      })),

      nextPage: () => set((state) => {
        const maxPage = Math.ceil(state.productPagination.total / state.productPagination.perPage);
        return {
          productPagination: {
            ...state.productPagination,
            page: Math.min(state.productPagination.page + 1, maxPage),
          },
        };
      }),

      prevPage: () => set((state) => ({
        productPagination: {
          ...state.productPagination,
          page: Math.max(state.productPagination.page - 1, 1),
        },
      })),

      // ═══════════════════════════════════════════════════════════
      // CATEGORY ACTIONS
      // ═══════════════════════════════════════════════════════════

      setCategories: (categories) => set({ categories }),

      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category],
      })),

      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        ),
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        selectedCategory: state.selectedCategory === id ? null : state.selectedCategory,
      })),

      setSelectedCategory: (id) => set({ selectedCategory: id }),

      // ═══════════════════════════════════════════════════════════
      // UI ACTIONS
      // ═══════════════════════════════════════════════════════════

      toggleSidebar: () => set((state) => ({
        isSidebarOpen: !state.isSidebarOpen,
      })),

      setLoading: (loading) => set({ isLoading: loading }),

      setBulkAction: (action) => set({ bulkAction: action }),
    }),
    {
      name: 'nowiht-admin-storage',
      partialize: (state) => ({
        // Only persist UI preferences, not data
        isSidebarOpen: state.isSidebarOpen,
        productPagination: state.productPagination,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// 🔍 SELECTORS (Computed values)
// ═══════════════════════════════════════════════════════════════

/**
 * Get filtered and paginated products
 */
export const useFilteredProducts = () => {
  const products = useAdminStore((state) => state.products);
  const filters = useAdminStore((state) => state.productFilters);
  const pagination = useAdminStore((state) => state.productPagination);

  let filtered = [...products];

  // Apply search
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.sku?.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (filters.category !== 'all') {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  // Apply status filter
  if (filters.status !== 'all') {
    filtered = filtered.filter((p) => p.status === filters.status);
  }

  // Apply stock filter
  if (filters.stock !== 'all') {
    if (filters.stock === 'in-stock') {
      filtered = filtered.filter((p) => p.stock && p.stock > 10);
    } else if (filters.stock === 'low-stock') {
      filtered = filtered.filter((p) => p.stock && p.stock > 0 && p.stock <= 10);
    } else if (filters.stock === 'out-of-stock') {
      filtered = filtered.filter((p) => !p.stock || p.stock === 0);
    }
  }

  // Apply isNew filter
  if (filters.isNew !== null) {
    filtered = filtered.filter((p) => p.isNew === filters.isNew);
  }

  // Apply isOnSale filter
  if (filters.isOnSale !== null) {
    filtered = filtered.filter((p) => p.isOnSale === filters.isOnSale);
  }

  // Apply pagination
  const start = (pagination.page - 1) * pagination.perPage;
  const end = start + pagination.perPage;
  const paginated = filtered.slice(start, end);

  return {
    products: paginated,
    total: filtered.length,
    page: pagination.page,
    perPage: pagination.perPage,
    totalPages: Math.ceil(filtered.length / pagination.perPage),
  };
};

/**
 * Get selected products data
 */
export const useSelectedProductsData = () => {
  const products = useAdminStore((state) => state.products);
  const selectedIds = useAdminStore((state) => state.selectedProducts);

  return products.filter((p) => selectedIds.includes(p.id));
};

/**
 * Get category with product count
 */
export const useCategoriesWithCount = () => {
  const categories = useAdminStore((state) => state.categories);
  const products = useAdminStore((state) => state.products);

  return categories.map((cat) => ({
    ...cat,
    productCount: products.filter((p) => p.category === cat.slug).length,
  }));
};