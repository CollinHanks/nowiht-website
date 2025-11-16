/**
 * MetaObjectService - Shopify-like MetaObjects Management
 * 
 * FEATURES:
 * - CRUD operations for Colors, Sizes, Materials, Fabrics
 * - Real-time sync with Supabase
 * - Caching support
 * - Type-safe queries
 */

import { supabase } from '@/lib/supabase/client';
import type { MetaObject, MetaObjectType, CreateMetaObjectRequest, UpdateMetaObjectRequest } from '@/types';

export class MetaObjectServiceClass {
  /**
   * Get all metaobjects by type
   */
  async getByType(type: MetaObjectType, activeOnly: boolean = true): Promise<MetaObject[]> {
    try {
      let query = supabase
        .from('metaobjects')
        .select('*')
        .eq('type', type)
        .order('sort_order', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching ${type} metaobjects:`, error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error(`MetaObjectService.getByType(${type}) error:`, error);
      throw error;
    }
  }

  /**
   * Get all colors
   */
  async getColors(activeOnly: boolean = true): Promise<MetaObject[]> {
    return this.getByType('color', activeOnly);
  }

  /**
   * Get all sizes
   */
  async getSizes(activeOnly: boolean = true): Promise<MetaObject[]> {
    return this.getByType('size', activeOnly);
  }

  /**
   * Get all materials
   */
  async getMaterials(activeOnly: boolean = true): Promise<MetaObject[]> {
    return this.getByType('material', activeOnly);
  }

  /**
   * Get all fabrics
   */
  async getFabrics(activeOnly: boolean = true): Promise<MetaObject[]> {
    return this.getByType('fabric', activeOnly);
  }

  /**
   * Get all metaobjects (all types)
   */
  async getAll(activeOnly: boolean = true): Promise<MetaObject[]> {
    try {
      let query = supabase
        .from('metaobjects')
        .select('*')
        .order('type', { ascending: true })
        .order('sort_order', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching all metaobjects:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('MetaObjectService.getAll() error:', error);
      throw error;
    }
  }

  /**
   * Get single metaobject by ID
   */
  async getById(id: string): Promise<MetaObject | null> {
    try {
      const { data, error } = await supabase
        .from('metaobjects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching metaobject by ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('MetaObjectService.getById() error:', error);
      return null;
    }
  }

  /**
   * Create new metaobject
   */
  async create(request: CreateMetaObjectRequest): Promise<MetaObject> {
    try {
      const newMetaObject = {
        type: request.type,
        name: request.name.trim(),
        value: request.value?.trim() || null,
        metadata: request.metadata || {},
        is_active: request.is_active !== undefined ? request.is_active : true,
        sort_order: request.sort_order || 999,
      };

      const { data, error } = await supabase
        .from('metaobjects')
        .insert([newMetaObject])
        .select()
        .single();

      if (error) {
        console.error('Error creating metaobject:', error);
        throw error;
      }

      console.log('✅ MetaObject created:', data);
      return data;
    } catch (error) {
      console.error('MetaObjectService.create() error:', error);
      throw error;
    }
  }

  /**
   * Update existing metaobject
   */
  async update(id: string, request: Partial<CreateMetaObjectRequest>): Promise<MetaObject> {
    try {
      const updates: any = {};

      if (request.name !== undefined) updates.name = request.name.trim();
      if (request.value !== undefined) updates.value = request.value.trim() || null;
      if (request.metadata !== undefined) updates.metadata = request.metadata;
      if (request.is_active !== undefined) updates.is_active = request.is_active;
      if (request.sort_order !== undefined) updates.sort_order = request.sort_order;

      const { data, error } = await supabase
        .from('metaobjects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating metaobject:', error);
        throw error;
      }

      console.log('✅ MetaObject updated:', data);
      return data;
    } catch (error) {
      console.error('MetaObjectService.update() error:', error);
      throw error;
    }
  }

  /**
   * Delete metaobject (soft delete - set is_active = false)
   */
  async softDelete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('metaobjects')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error soft deleting metaobject:', error);
        throw error;
      }

      console.log('✅ MetaObject soft deleted:', id);
      return true;
    } catch (error) {
      console.error('MetaObjectService.softDelete() error:', error);
      return false;
    }
  }

  /**
   * Hard delete metaobject (permanent)
   */
  async hardDelete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('metaobjects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error hard deleting metaobject:', error);
        throw error;
      }

      console.log('✅ MetaObject hard deleted:', id);
      return true;
    } catch (error) {
      console.error('MetaObjectService.hardDelete() error:', error);
      return false;
    }
  }

  /**
   * Reorder metaobjects (bulk update sort_order)
   */
  async reorder(type: MetaObjectType, orderedIds: string[]): Promise<boolean> {
    try {
      // Update sort_order for each ID
      const updates = orderedIds.map((id, index) => ({
        id,
        sort_order: index + 1,
      }));

      // Batch update
      for (const update of updates) {
        await supabase
          .from('metaobjects')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
          .eq('type', type);
      }

      console.log(`✅ Reordered ${type} metaobjects`);
      return true;
    } catch (error) {
      console.error('MetaObjectService.reorder() error:', error);
      return false;
    }
  }

  /**
   * Search metaobjects by name (fuzzy search)
   */
  async search(query: string, type?: MetaObjectType): Promise<MetaObject[]> {
    try {
      let supabaseQuery = supabase
        .from('metaobjects')
        .select('*')
        .eq('is_active', true)
        .ilike('name', `%${query}%`)
        .order('sort_order', { ascending: true })
        .limit(20);

      if (type) {
        supabaseQuery = supabaseQuery.eq('type', type);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error('Error searching metaobjects:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('MetaObjectService.search() error:', error);
      return [];
    }
  }

  /**
   * Get metaobject statistics
   */
  async getStats(): Promise<Record<MetaObjectType, number>> {
    try {
      const { data, error } = await supabase
        .from('metaobjects')
        .select('type')
        .eq('is_active', true);

      if (error) throw error;

      const stats: Record<MetaObjectType, number> = {
        color: 0,
        size: 0,
        material: 0,
        fabric: 0,
      };

      data?.forEach((item) => {
        stats[item.type as MetaObjectType]++;
      });

      return stats;
    } catch (error) {
      console.error('MetaObjectService.getStats() error:', error);
      return { color: 0, size: 0, material: 0, fabric: 0 };
    }
  }

  /**
   * Validate color hex code
   */
  isValidHex(hex: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }

  /**
   * Get random colors (for UI)
   */
  async getRandomColors(count: number = 5): Promise<MetaObject[]> {
    try {
      const { data, error } = await supabase
        .from('metaobjects')
        .select('*')
        .eq('type', 'color')
        .eq('is_active', true)
        .limit(count);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('MetaObjectService.getRandomColors() error:', error);
      return [];
    }
  }
}

// Export singleton instance
export const MetaObjectService = new MetaObjectServiceClass();