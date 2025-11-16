/**
 * ProductService - API Route-Based CRUD Operations
 * 
 * FIXED: Added search with filters and searchCount methods
 */

import type { Product } from '@/types';

// Helper functions
const generateSKU = (category: string): string => {
  const prefix = category.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${prefix}-${timestamp}${random}`;
};

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ═══════════════════════════════════════════════════════════════
// 📦 CRUD OPERATIONS
// ═══════════════════════════════════════════════════════════════

export const ProductService = {
  /**
   * GET ALL PRODUCTS
   * API: GET /api/admin/products
   */
  getAll: async (options?: {
    category?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> => {
    try {
      let url = '/api/admin/products?';

      if (options?.category) {
        url += `category=${options.category}&`;
      }
      if (options?.status) {
        url += `status=${options.status}&`;
      }
      if (options?.limit) {
        url += `limit=${options.limit}&`;
      }
      if (options?.offset) {
        url += `offset=${options.offset}&`;
      }

      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  /**
   * GET PRODUCT BY ID
   */
  getById: async (id: string): Promise<Product | null> => {
    try {
      const products = await ProductService.getAll();
      return products.find((p) => p.id === id) || null;
    } catch (error) {
      console.error('Error fetching product by id:', error);
      return null;
    }
  },

  /**
   * GET PRODUCT BY SLUG
   */
  getBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const products = await ProductService.getAll();
      return products.find((p) => p.slug === slug) || null;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
  },

  /**
   * CREATE PRODUCT
   * API: POST /api/admin/products
   */
  create: async (productData: Partial<Product>): Promise<Product> => {
    try {
      // Prepare product data
      const productToCreate = {
        name: productData.name || '',
        slug: productData.slug || generateSlug(productData.name || ''),
        sku: productData.sku || generateSKU(productData.category || 'product'),
        description: productData.description || '',
        price: productData.price || 0,
        compare_at_price: productData.compareAtPrice,
        category: productData.category || '',
        images: productData.images || [],
        sizes: productData.sizes || ['XS', 'S', 'M', 'L', 'XL'],
        colors: productData.colors || [],
        stock: productData.stock || 0,
        in_stock: productData.inStock !== undefined ? productData.inStock : true,
        material: productData.material || '',
        care: productData.care || [],
        features: productData.features || [],
        is_new: productData.isNew || false,
        is_best_seller: productData.isBestSeller || false,
        is_on_sale: productData.isOnSale || false,
        status: productData.status || 'draft',
        seo_title: productData.seoTitle,
        seo_description: productData.seoDescription,
        tags: productData.tags || [],
        collection: productData.collection,
        brand: 'NOWIHT',
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToCreate),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product');
      }

      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * UPDATE PRODUCT
   * API: PUT /api/admin/products?id=xxx
   */
  update: async (
    id: string,
    productData: Partial<Product>
  ): Promise<Product | null> => {
    try {
      // Convert camelCase to snake_case for Supabase
      const updateData: any = {};

      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.slug !== undefined) updateData.slug = productData.slug;
      if (productData.sku !== undefined) updateData.sku = productData.sku;
      if (productData.description !== undefined)
        updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.compareAtPrice !== undefined)
        updateData.compare_at_price = productData.compareAtPrice;
      if (productData.category !== undefined)
        updateData.category = productData.category;
      if (productData.images !== undefined)
        updateData.images = productData.images;
      if (productData.sizes !== undefined) updateData.sizes = productData.sizes;
      if (productData.colors !== undefined)
        updateData.colors = productData.colors;
      if (productData.stock !== undefined) updateData.stock = productData.stock;
      if (productData.inStock !== undefined)
        updateData.in_stock = productData.inStock;
      if (productData.material !== undefined)
        updateData.material = productData.material;
      if (productData.care !== undefined) updateData.care = productData.care;
      if (productData.features !== undefined)
        updateData.features = productData.features;
      if (productData.isNew !== undefined)
        updateData.is_new = productData.isNew;
      if (productData.isBestSeller !== undefined)
        updateData.is_best_seller = productData.isBestSeller;
      if (productData.isOnSale !== undefined)
        updateData.is_on_sale = productData.isOnSale;
      if (productData.status !== undefined)
        updateData.status = productData.status;
      if (productData.seoTitle !== undefined)
        updateData.seo_title = productData.seoTitle;
      if (productData.seoDescription !== undefined)
        updateData.seo_description = productData.seoDescription;
      if (productData.tags !== undefined) updateData.tags = productData.tags;
      if (productData.collection !== undefined)
        updateData.collection = productData.collection;

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
      return data.product;
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
            p.colors?.some((color) => filters.colors!.includes(color.name))
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