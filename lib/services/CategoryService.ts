/**
 * CategoryService
 * 
 * Handles all category-related operations with Supabase
 * Interface uses camelCase, DB uses snake_case
 * ✅ FIXED: image_url field mapping
 */

import { supabase } from "@/lib/supabase/client";

// Frontend interface (camelCase)
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;                      // Frontend uses "image"
  parentId?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: "active" | "inactive";
  sortOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

// Map DB (snake_case) to Frontend (camelCase)
function mapFromDB(data: any): Category {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    image: data.image_url,           // ✅ FIXED: DB uses image_url!
    parentId: data.parent_id,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    status: data.status || data.is_active ? 'active' : 'inactive',  // ✅ Handle both status/is_active
    sortOrder: data.sort_order,
    productCount: data.product_count || 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Map Frontend (camelCase) to DB (snake_case)
function mapToDB(data: Partial<Category>): any {
  const result: any = {};

  if (data.name !== undefined) result.name = data.name;
  if (data.slug !== undefined) result.slug = data.slug;
  if (data.description !== undefined) result.description = data.description;
  if (data.image !== undefined) result.image_url = data.image;  // ✅ FIXED: Map to image_url
  if (data.parentId !== undefined) result.parent_id = data.parentId;
  if (data.seoTitle !== undefined) result.seo_title = data.seoTitle;
  if (data.seoDescription !== undefined) result.seo_description = data.seoDescription;
  if (data.status !== undefined) result.is_active = data.status === 'active';  // ✅ Map status to is_active
  if (data.sortOrder !== undefined) result.sort_order = data.sortOrder;
  if (data.productCount !== undefined) result.product_count = data.productCount;

  return result;
}

export const CategoryService = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)           // ✅ Only active categories
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("❌ Supabase error:", error);
        return [];
      }

      console.log("✅ Categories loaded:", data?.length || 0);
      return (data || []).map(mapFromDB);
    } catch (error) {
      console.error("❌ Error loading categories:", error);
      return [];
    }
  },

  /**
   * Get category by ID
   */
  getById: async (id: string): Promise<Category | null> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Supabase error:", error);
        return null;
      }

      return data ? mapFromDB(data) : null;
    } catch (error) {
      console.error("❌ Error loading category:", error);
      return null;
    }
  },

  /**
   * Get category by slug
   */
  getBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("❌ Supabase error:", error);
        return null;
      }

      return data ? mapFromDB(data) : null;
    } catch (error) {
      console.error("❌ Error loading category:", error);
      return null;
    }
  },

  /**
   * Get parent categories
   */
  getParents: async (): Promise<Category[]> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .is("parent_id", null)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("❌ Supabase error:", error);
        return [];
      }

      return (data || []).map(mapFromDB);
    } catch (error) {
      console.error("❌ Error loading parent categories:", error);
      return [];
    }
  },

  /**
   * Get subcategories
   */
  getChildren: async (parentId: string): Promise<Category[]> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", parentId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("❌ Supabase error:", error);
        return [];
      }

      return (data || []).map(mapFromDB);
    } catch (error) {
      console.error("❌ Error loading subcategories:", error);
      return [];
    }
  },

  /**
   * Search categories by name or slug
   */
  search: async (query: string): Promise<Category[]> => {
    try {
      if (!query || query.trim() === "") {
        return await CategoryService.getAll();
      }

      const searchTerm = `%${query.toLowerCase()}%`;

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .or(`name.ilike.${searchTerm},slug.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("❌ Supabase error:", error);
        return [];
      }

      return (data || []).map(mapFromDB);
    } catch (error) {
      console.error("❌ Error searching categories:", error);
      return [];
    }
  },

  /**
   * Create category
   */
  create: async (data: Omit<Category, "id" | "createdAt" | "updatedAt" | "productCount">): Promise<Category | null> => {
    try {
      const newCategory = {
        name: data.name,
        slug: data.slug || generateSlug(data.name),
        description: data.description,
        image_url: data.image,           // ✅ FIXED
        parent_id: data.parentId || null,
        seo_title: data.seoTitle,
        seo_description: data.seoDescription,
        is_active: data.status === 'active',  // ✅ FIXED
        sort_order: data.sortOrder,
        product_count: 0,
      };

      const { data: created, error } = await supabase
        .from("categories")
        .insert(newCategory)
        .select()
        .single();

      if (error) {
        console.error("❌ Supabase error:", error);
        return null;
      }

      return created ? mapFromDB(created) : null;
    } catch (error) {
      console.error("❌ Error creating category:", error);
      return null;
    }
  },

  /**
   * Update category
   */
  update: async (id: string, data: Partial<Category>): Promise<Category | null> => {
    try {
      // Auto-generate slug if name changed
      if (data.name && !data.slug) {
        data.slug = generateSlug(data.name);
      }

      const updates = mapToDB(data);

      const { data: updated, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("❌ Supabase error:", error);
        return null;
      }

      return updated ? mapFromDB(updated) : null;
    } catch (error) {
      console.error("❌ Error updating category:", error);
      return null;
    }
  },

  /**
   * Delete category
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      // Check for children
      const children = await CategoryService.getChildren(id);
      if (children.length > 0) {
        throw new Error("Cannot delete category with subcategories");
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ Supabase error:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Error deleting category:", error);
      throw error;
    }
  },

  /**
   * Update product count
   */
  updateProductCount: async (categoryId: string, count: number): Promise<void> => {
    await CategoryService.update(categoryId, { productCount: count });
  },

  /**
   * Reorder categories
   */
  reorder: async (categoryIds: string[]): Promise<void> => {
    try {
      for (let i = 0; i < categoryIds.length; i++) {
        await supabase
          .from("categories")
          .update({ sort_order: i })
          .eq("id", categoryIds[i]);
      }
    } catch (error) {
      console.error("❌ Error reordering categories:", error);
    }
  },
};

// Helper: Generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}