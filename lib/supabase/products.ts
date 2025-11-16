// lib/supabase/products.ts
// Product CRUD operations for NOWIHT E-Commerce

import { supabase, supabaseAdmin } from './client';
import type { Product } from '@/types';

// ═══════════════════════════════════════════════════════════════
// 🔥 ULTRA-HELPER: Parse JSONB/ARRAY fields (PostgreSQL compatibility)
// ═══════════════════════════════════════════════════════════════

/**
 * Parse colors array - handles multiple PostgreSQL formats:
 * - JSONB array: [{name:"Black",hex:"#000"}]
 * - String array: ['{"name":"Black","hex":"#000"}']
 * - JSON string: "[{\"name\":\"Black\",\"hex\":\"#000\"}]"
 */
function parseColors(colors: any): Array<{ name: string; hex: string }> {
  if (!colors) return [];

  try {
    // Already array of objects?
    if (Array.isArray(colors) && colors.length > 0) {
      if (typeof colors[0] === 'object' && colors[0].name) {
        return colors; // ✅ Already correct format
      }

      // Array of strings? Parse each
      if (typeof colors[0] === 'string') {
        return colors.map((c: string) => {
          try {
            return JSON.parse(c);
          } catch {
            return { name: c, hex: '#000000' }; // Fallback
          }
        });
      }
    }

    // JSON string?
    if (typeof colors === 'string') {
      const parsed = JSON.parse(colors);
      return parseColors(parsed); // Recursive
    }

    return [];
  } catch (error) {
    console.error('Error parsing colors:', error, colors);
    return [];
  }
}

/**
 * Parse generic array field (sizes, features, care, tags, etc.)
 */
function parseArray(field: any): string[] {
  if (!field) return [];

  try {
    // Already array?
    if (Array.isArray(field)) return field;

    // JSON string?
    if (typeof field === 'string') {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * Main product parser - handles ALL PostgreSQL edge cases
 */
function parseProduct(product: any): Product {
  if (!product) return product;

  return {
    ...product,
    // ✅ ULTRA parse for colors (most critical)
    colors: parseColors(product.colors),

    // ✅ Parse simple arrays
    sizes: parseArray(product.sizes),
    features: parseArray(product.features),
    care: parseArray(product.care),
    images: parseArray(product.images),
    tags: parseArray(product.tags),
  };
}

// ═══════════════════════════════════════════════════════════════
// READ OPERATIONS (Public)
// ═══════════════════════════════════════════════════════════════

/**
 * Get all published products
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // ✅ Parse each product's fields
    return (data || []).map(parseProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    console.log('🔍 Fetching product:', slug); // Debug log

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    if (!data) {
      console.warn('⚠️ No product found for slug:', slug);
      return null;
    }

    console.log('✅ Raw product data:', data);
    console.log('🎨 Raw colors:', data.colors);

    // ✅ Parse fields
    const parsed = parseProduct(data);
    console.log('✅ Parsed product:', parsed);
    console.log('🎨 Parsed colors:', parsed.colors);

    return parsed;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // ✅ Parse each product's fields
    return (data || []).map(parseProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // ✅ Parse each product's fields
    return (data || []).map(parseProduct);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

/**
 * Get featured products (new, bestseller, on sale)
 */
export async function getFeaturedProducts(): Promise<{
  newArrivals: Product[];
  bestSellers: Product[];
  onSale: Product[];
}> {
  try {
    const [newArrivals, bestSellers, onSale] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .eq('is_new', true)
        .order('created_at', { ascending: false })
        .limit(8)
        .then((res) => (res.data || []).map(parseProduct)),

      supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .eq('is_best_seller', true)
        .order('sold_count', { ascending: false })
        .limit(8)
        .then((res) => (res.data || []).map(parseProduct)),

      supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .eq('is_on_sale', true)
        .order('created_at', { ascending: false })
        .limit(8)
        .then((res) => (res.data || []).map(parseProduct)),
    ]);

    return { newArrivals, bestSellers, onSale };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return { newArrivals: [], bestSellers: [], onSale: [] };
  }
}

// ═══════════════════════════════════════════════════════════════
// WRITE OPERATIONS (Admin only - requires service role)
// ═══════════════════════════════════════════════════════════════

/**
 * 🔥 FIXED: Update category product count
 */
async function updateCategoryCount(categorySlug: string) {
  if (!supabaseAdmin) return;

  try {
    // Count products in this category
    const { count, error: countError } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category', categorySlug)
      .eq('status', 'published');

    if (countError) throw countError;

    // Update category product_count
    const { error: updateError } = await supabaseAdmin
      .from('categories')
      .update({ product_count: count || 0 })
      .eq('slug', categorySlug);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error updating category count:', error);
  }
}

/**
 * Create a new product (Admin only)
 */
export async function createProduct(product: Partial<Product>): Promise<{
  success: boolean;
  data?: Product;
  error?: string;
}> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Admin client not initialized' };
  }

  try {
    const productData = {
      ...product,
      in_stock: (product.stock || 0) > 0,
    };

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;

    if (data.category) {
      await updateCategoryCount(data.category);
    }

    return { success: true, data: parseProduct(data) };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update a product (Admin only)
 */
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<{
  success: boolean;
  data?: Product;
  error?: string;
}> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Admin client not initialized' };
  }

  try {
    const { data: currentProduct } = await supabaseAdmin
      .from('products')
      .select('category')
      .eq('id', id)
      .single();

    const productData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if ('stock' in updates) {
      productData.in_stock = (updates.stock || 0) > 0;
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (currentProduct && updates.category && currentProduct.category !== updates.category) {
      await updateCategoryCount(currentProduct.category);
      await updateCategoryCount(updates.category);
    } else if (data.category) {
      await updateCategoryCount(data.category);
    }

    return { success: true, data: parseProduct(data) };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a product (Admin only)
 */
export async function deleteProduct(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Admin client not initialized' };
  }

  try {
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('category')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

    if (error) throw error;

    if (product?.category) {
      await updateCategoryCount(product.category);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all products including drafts (Admin only)
 */
export async function getAllProductsAdmin(): Promise<Product[]> {
  if (!supabaseAdmin) {
    console.error('Admin client not initialized');
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(parseProduct);
  } catch (error) {
    console.error('Error fetching all products (admin):', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════

/**
 * Get all categories
 */
export async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get product count by category
 */
export async function getProductCountByCategory(categorySlug: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category', categorySlug)
      .eq('status', 'published');

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error counting products:', error);
    return 0;
  }
}