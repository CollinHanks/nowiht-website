import { supabase } from "@/lib/supabase/client";

/**
 * SettingsService
 * 
 * Manages store settings, shipping zones/methods, and tax rates
 * 
 * FEATURES:
 * - Key-value settings management
 * - Type-safe getters for common settings
 * - Shipping zones & methods CRUD
 * - Tax rates management
 */

export interface Setting {
  id: string;
  key: string;
  value: any; // JSONB value
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[]; // Array of country codes
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingMethod {
  id: string;
  zoneId: string;
  name: string;
  description?: string;
  rateType: 'flat' | 'weight' | 'price';
  rate: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  estimatedDays?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaxRate {
  id: string;
  name: string;
  country: string;
  state?: string;
  rate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class SettingsService {
  // ═══════════════════════════════════════════════════════════════
  // GENERAL SETTINGS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get setting by key
   */
  static async get(key: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", key)
        .single();

      if (error) throw error;
      return data?.value;
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      return null;
    }
  }

  /**
   * Get all settings by category
   */
  static async getByCategory(category: string): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("key, value")
        .eq("category", category);

      if (error) throw error;

      const settings: Record<string, any> = {};
      data?.forEach((item) => {
        settings[item.key] = item.value;
      });

      return settings;
    } catch (error) {
      console.error(`Error getting settings for category ${category}:`, error);
      return {};
    }
  }

  /**
   * Get all settings
   */
  static async getAll(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("key, value");

      if (error) throw error;

      const settings: Record<string, any> = {};
      data?.forEach((item) => {
        settings[item.key] = item.value;
      });

      return settings;
    } catch (error) {
      console.error("Error getting all settings:", error);
      return {};
    }
  }

  /**
   * Update setting
   */
  static async update(key: string, value: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("settings")
        .update({ value })
        .eq("key", key);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      return false;
    }
  }

  /**
   * Update multiple settings
   */
  static async updateMultiple(settings: Record<string, any>): Promise<boolean> {
    try {
      const updates = Object.entries(settings).map(([key, value]) =>
        supabase.from("settings").update({ value }).eq("key", key)
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error("Error updating multiple settings:", error);
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TYPE-SAFE GETTERS (Common Settings)
  // ═══════════════════════════════════════════════════════════════

  static async getStoreName(): Promise<string> {
    return (await this.get("store_name")) || "NOWIHT";
  }

  static async getStoreEmail(): Promise<string> {
    return (await this.get("store_email")) || "hello@nowiht.com";
  }

  static async getCurrency(): Promise<string> {
    return (await this.get("currency")) || "USD";
  }

  static async getCurrencySymbol(): Promise<string> {
    return (await this.get("currency_symbol")) || "$";
  }

  static async getDefaultTaxRate(): Promise<number> {
    return (await this.get("default_tax_rate")) || 10;
  }

  static async getFreeShippingThreshold(): Promise<number> {
    return (await this.get("free_shipping_threshold")) || 100;
  }

  static async getDefaultShippingCost(): Promise<number> {
    return (await this.get("default_shipping_cost")) || 10;
  }

  // ═══════════════════════════════════════════════════════════════
  // SHIPPING ZONES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all shipping zones
   */
  static async getShippingZones(): Promise<ShippingZone[]> {
    try {
      const { data, error } = await supabase
        .from("shipping_zones")
        .select("*")
        .order("name");

      if (error) throw error;

      return data.map(this.formatShippingZone);
    } catch (error) {
      console.error("Error getting shipping zones:", error);
      return [];
    }
  }

  /**
   * Get shipping zone by ID
   */
  static async getShippingZoneById(id: string): Promise<ShippingZone | null> {
    try {
      const { data, error } = await supabase
        .from("shipping_zones")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return this.formatShippingZone(data);
    } catch (error) {
      console.error("Error getting shipping zone:", error);
      return null;
    }
  }

  /**
   * Create shipping zone
   */
  static async createShippingZone(
    zone: Omit<ShippingZone, "id" | "createdAt" | "updatedAt">
  ): Promise<ShippingZone | null> {
    try {
      const { data, error } = await supabase
        .from("shipping_zones")
        .insert({
          name: zone.name,
          countries: zone.countries,
          is_active: zone.isActive,
        })
        .select()
        .single();

      if (error) throw error;
      return this.formatShippingZone(data);
    } catch (error) {
      console.error("Error creating shipping zone:", error);
      return null;
    }
  }

  /**
   * Update shipping zone
   */
  static async updateShippingZone(
    id: string,
    updates: Partial<ShippingZone>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("shipping_zones")
        .update({
          name: updates.name,
          countries: updates.countries,
          is_active: updates.isActive,
        })
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating shipping zone:", error);
      return false;
    }
  }

  /**
   * Delete shipping zone
   */
  static async deleteShippingZone(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("shipping_zones")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting shipping zone:", error);
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SHIPPING METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all shipping methods
   */
  static async getShippingMethods(zoneId?: string): Promise<ShippingMethod[]> {
    try {
      let query = supabase.from("shipping_methods").select("*");

      if (zoneId) {
        query = query.eq("zone_id", zoneId);
      }

      const { data, error } = await query.order("name");

      if (error) throw error;

      return data.map(this.formatShippingMethod);
    } catch (error) {
      console.error("Error getting shipping methods:", error);
      return [];
    }
  }

  /**
   * Create shipping method
   */
  static async createShippingMethod(
    method: Omit<ShippingMethod, "id" | "createdAt" | "updatedAt">
  ): Promise<ShippingMethod | null> {
    try {
      const { data, error } = await supabase
        .from("shipping_methods")
        .insert({
          zone_id: method.zoneId,
          name: method.name,
          description: method.description,
          rate_type: method.rateType,
          rate: method.rate,
          min_order_value: method.minOrderValue,
          max_order_value: method.maxOrderValue,
          estimated_days: method.estimatedDays,
          is_active: method.isActive,
        })
        .select()
        .single();

      if (error) throw error;
      return this.formatShippingMethod(data);
    } catch (error) {
      console.error("Error creating shipping method:", error);
      return null;
    }
  }

  /**
   * Update shipping method
   */
  static async updateShippingMethod(
    id: string,
    updates: Partial<ShippingMethod>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("shipping_methods")
        .update({
          name: updates.name,
          description: updates.description,
          rate_type: updates.rateType,
          rate: updates.rate,
          min_order_value: updates.minOrderValue,
          max_order_value: updates.maxOrderValue,
          estimated_days: updates.estimatedDays,
          is_active: updates.isActive,
        })
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating shipping method:", error);
      return false;
    }
  }

  /**
   * Delete shipping method
   */
  static async deleteShippingMethod(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("shipping_methods")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting shipping method:", error);
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TAX RATES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all tax rates
   */
  static async getTaxRates(): Promise<TaxRate[]> {
    try {
      const { data, error } = await supabase
        .from("tax_rates")
        .select("*")
        .order("country")
        .order("state");

      if (error) throw error;

      return data.map(this.formatTaxRate);
    } catch (error) {
      console.error("Error getting tax rates:", error);
      return [];
    }
  }

  /**
   * Get tax rate by country/state
   */
  static async getTaxRate(
    country: string,
    state?: string
  ): Promise<number | null> {
    try {
      let query = supabase
        .from("tax_rates")
        .select("rate")
        .eq("country", country)
        .eq("is_active", true);

      if (state) {
        query = query.eq("state", state);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      return data?.rate || null;
    } catch (error) {
      console.error("Error getting tax rate:", error);
      return null;
    }
  }

  /**
   * Create tax rate
   */
  static async createTaxRate(
    taxRate: Omit<TaxRate, "id" | "createdAt" | "updatedAt">
  ): Promise<TaxRate | null> {
    try {
      const { data, error } = await supabase
        .from("tax_rates")
        .insert({
          name: taxRate.name,
          country: taxRate.country,
          state: taxRate.state,
          rate: taxRate.rate,
          is_active: taxRate.isActive,
        })
        .select()
        .single();

      if (error) throw error;
      return this.formatTaxRate(data);
    } catch (error) {
      console.error("Error creating tax rate:", error);
      return null;
    }
  }

  /**
   * Update tax rate
   */
  static async updateTaxRate(
    id: string,
    updates: Partial<TaxRate>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("tax_rates")
        .update({
          name: updates.name,
          country: updates.country,
          state: updates.state,
          rate: updates.rate,
          is_active: updates.isActive,
        })
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating tax rate:", error);
      return false;
    }
  }

  /**
   * Delete tax rate
   */
  static async deleteTaxRate(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("tax_rates").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting tax rate:", error);
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // FORMATTERS (snake_case → camelCase)
  // ═══════════════════════════════════════════════════════════════

  private static formatShippingZone(data: any): ShippingZone {
    return {
      id: data.id,
      name: data.name,
      countries: data.countries,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private static formatShippingMethod(data: any): ShippingMethod {
    return {
      id: data.id,
      zoneId: data.zone_id,
      name: data.name,
      description: data.description,
      rateType: data.rate_type,
      rate: data.rate,
      minOrderValue: data.min_order_value,
      maxOrderValue: data.max_order_value,
      estimatedDays: data.estimated_days,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private static formatTaxRate(data: any): TaxRate {
    return {
      id: data.id,
      name: data.name,
      country: data.country,
      state: data.state,
      rate: data.rate,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}