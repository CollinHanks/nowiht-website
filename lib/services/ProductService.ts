// lib/services/ProductService.ts
// ═══════════════════════════════════════════════════════════════
// 🛍️ NOWIHT - Product Service (API-based)
// ═══════════════════════════════════════════════════════════════

import type { Product } from '@/types';

// ============================================
// HELPER: Parse colors from database
// ============================================
function parseProductColors(product: any): Product {
  // ✅ NULL CHECK - CRITICAL FIX
  if (!product) {
    return product;
  }

  try {
    // If colors is an array of strings (from database)
    if (Array.isArray(product.colors)) {
      product.colors = product.colors.map((color: any) => {
        // If it's already an object, return it
        if (typeof color === 'object' && color.name && color.hex) {
          return color;
        }

        // If it's a JSON string, parse it
        if (typeof color === 'string') {
          try {
            return JSON.parse(color);
          } catch (e) {
            console.error('Failed to parse color:', color);
            // Return a default color object
            return { name: color, hex: '#000000' };
          }
        }

        return color;
      });
    }

    return product;
  } catch (error) {
    console.error('Error parsing product colors:', error);
    return product;
  }
}

export const ProductService = {
  /**
   * GET ALL PRODUCTS
   * API: GET /api/products
   */
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await fetch('/api/products', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      // ✅ Parse colors for each product
      return data.products.map(parseProductColors);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  /**
   * GET PRODUCT BY ID
   * API: GET /api/products?id=xxx
   */
  getById: async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Product not found');
      }

      const data = await response.json();

      // ✅ Parse colors
      return parseProductColors(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  /**
   * GET PRODUCT BY SLUG
   * API: GET /api/products?slug=xxx
   */
  getBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const response = await fetch(`/api/products?slug=${slug}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Product not found');
      }

      const data = await response.json();

      // ✅ Parse colors
      return parseProductColors(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  /**
   * GET PRODUCTS BY CATEGORY
   * API: GET /api/products?category=xxx
   */
  getByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await fetch(`/api/products?category=${category}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      // ✅ Parse colors for each product
      return data.products.map(parseProductColors);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  /**
   * GET FEATURED PRODUCTS
   * API: GET /api/products?featured=true
   */
  getFeatured: async (): Promise<Product[]> => {
    try {
      const response = await fetch('/api/products?featured=true', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }

      const data = await response.json();

      // ✅ Parse colors for each product
      return data.products.map(parseProductColors);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  /**
   * CREATE PRODUCT
   * API: POST /api/admin/products
   */
  create: async (productData: Partial<Product>): Promise<Product> => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product');
      }

      const data = await response.json();

      // ✅ Parse colors
      return parseProductColors(data.product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * UPDATE PRODUCT
   * API: PUT /api/admin/products?id=xxx
   */
  update: async (id: string, updateData: Partial<Product>): Promise<Product | null> => {
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }

      const data = await response.json();

      // ✅ Parse colors
      return parseProductColors(data.product);
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },

  /**
   * DELETE PRODUCT
   * API: DELETE /api/admin/products?id=xxx
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  /**
   * BULK CREATE (For Excel Import)
   */
  bulkCreate: async (productsData: Partial<Product>[]): Promise<Product[]> => {
    try {
      const createdProducts: Product[] = [];

      for (const data of productsData) {
        try {
          const product = await ProductService.create(data);
          createdProducts.push(product);
        } catch (error) {
          console.error('Error creating product in bulk:', error);
          // Continue with next product even if one fails
        }
      }

      return createdProducts;
    } catch (error) {
      console.error('Error in bulk create:', error);
      return [];
    }
  },

  /**
   * SEARCH PRODUCTS
   * ✅ FIXED: Now accepts optional filters parameter
   */
  search: async (
    query: string,
    filters?: {
      categories?: string[];
      minPrice?: number;
      maxPrice?: number;
      colors?: string[];
      sizes?: string[];
      inStock?: boolean;
      status?: string;
      limit?: number;
      offset?: number;
      sortBy?: string;
    }
  ): Promise<Product[]> => {
    try {
      const products = await ProductService.getAll();
      const lowerQuery = query.toLowerCase();

      // Filter by search query
      let filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery) ||
          p.sku?.toLowerCase().includes(lowerQuery) ||
          p.category?.toLowerCase().includes(lowerQuery) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );

      // Apply additional filters if provided
      if (filters) {
        if (filters.categories && filters.categories.length > 0) {
          filtered = filtered.filter((p) =>
            filters.categories!.includes(p.category)
          );
        }

        if (filters.minPrice !== undefined) {
          filtered = filtered.filter((p) => p.price >= filters.minPrice!);
        }

        if (filters.maxPrice !== undefined) {
          filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
        }

        if (filters.colors && filters.colors.length > 0) {
          filtered = filtered.filter((p) =>
            p.colors?.some((color) => {
              // Handle both string and object format
              const colorName = typeof color === 'string' ? color : color.name;
              return filters.colors!.includes(colorName);
            })
          );
        }

        if (filters.sizes && filters.sizes.length > 0) {
          filtered = filtered.filter((p) =>
            p.sizes?.some((size) => filters.sizes!.includes(size))
          );
        }

        if (filters.inStock !== undefined) {
          filtered = filtered.filter((p) => p.inStock === filters.inStock);
        }

        if (filters.status) {
          filtered = filtered.filter((p) => p.status === filters.status);
        }

        // Sorting
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price_asc':
              filtered.sort((a, b) => a.price - b.price);
              break;
            case 'price_desc':
              filtered.sort((a, b) => b.price - a.price);
              break;
            case 'name_asc':
              filtered.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'name_desc':
              filtered.sort((a, b) => b.name.localeCompare(a.name));
              break;
            case 'newest':
              filtered.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
              break;
          }
        }

        // Pagination
        if (filters.offset !== undefined) {
          filtered = filtered.slice(filters.offset);
        }

        if (filters.limit !== undefined) {
          filtered = filtered.slice(0, filters.limit);
        }
      }

      return filtered;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  /**
   * SEARCH COUNT
   * ✅ NEW: Count total search results (for pagination)
   */
  searchCount: async (
    query: string,
    filters?: {
      categories?: string[];
      minPrice?: number;
      maxPrice?: number;
      colors?: string[];
      sizes?: string[];
      inStock?: boolean;
      status?: string;
    }
  ): Promise<number> => {
    try {
      // Use search method without pagination to get total count
      const results = await ProductService.search(query, {
        ...filters,
        limit: undefined,
        offset: undefined,
      });

      return results.length;
    } catch (error) {
      console.error('Error counting search results:', error);
      return 0;
    }
  },

  /**
   * FILTER PRODUCTS
   */
  filter: async (filters: {
    category?: string;
    status?: string;
    inStock?: boolean;
    isNew?: boolean;
    isOnSale?: boolean;
  }): Promise<Product[]> => {
    try {
      let products = await ProductService.getAll();

      if (filters.category) {
        products = products.filter((p) => p.category === filters.category);
      }

      if (filters.status) {
        products = products.filter((p) => p.status === filters.status);
      }

      if (filters.inStock !== undefined) {
        products = products.filter((p) => p.inStock === filters.inStock);
      }

      if (filters.isNew !== undefined) {
        products = products.filter((p) => p.isNew === filters.isNew);
      }

      if (filters.isOnSale !== undefined) {
        products = products.filter((p) => p.isOnSale === filters.isOnSale);
      }

      return products;
    } catch (error) {
      console.error('Error filtering products:', error);
      return [];
    }
  },

  /**
   * GET PRODUCTS COUNT
   */
  getCount: async (): Promise<number> => {
    try {
      const products = await ProductService.getAll();
      return products.length;
    } catch (error) {
      console.error('Error getting product count:', error);
      return 0;
    }
  },

  /**
   * EXPORT ALL PRODUCTS
   */
  exportAll: async (): Promise<Product[]> => {
    return await ProductService.getAll();
  },

  /**
   * IMPORT ALL PRODUCTS (Not recommended - use bulkCreate)
   */
  importAll: async (products: Product[]): Promise<void> => {
    console.warn('importAll is deprecated. Use bulkCreate instead.');
  },

  /**
   * CLEAR ALL PRODUCTS (Development only - NOT IMPLEMENTED)
   */
  clearAll: async (): Promise<void> => {
    console.error('clearAll is not available with API backend');
  },
};