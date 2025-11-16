// lib/services/InventoryService.ts
import { supabase } from '@/lib/supabase/client';

export interface StockHistory {
  id: string;
  product_id: string;
  previous_quantity: number;
  new_quantity: number;
  change_amount: number;
  change_type: 'purchase' | 'return' | 'adjustment' | 'restock';
  order_id?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface StockAlert {
  id: string;
  product_id: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'restock_needed';
  quantity_at_alert: number;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  notes?: string;
  created_at: string;
  product?: any; // Product details when joined
}

export interface BulkStockUpdate {
  product_id: string;
  new_quantity: number;
  notes?: string;
}

export interface StockStatus {
  total_products: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
  total_value: number;
  alerts_count: number;
}

class InventoryServiceClass {
  // ============= STOCK MANAGEMENT =============

  async getStockStatus(): Promise<StockStatus> {
    try {
      // Get all products with stock info
      const { data: products, error } = await supabase
        .from('products')
        .select('stock_quantity, stock_alert_level, price, track_inventory');

      if (error) throw error;

      const status: StockStatus = {
        total_products: 0,
        in_stock: 0,
        low_stock: 0,
        out_of_stock: 0,
        total_value: 0,
        alerts_count: 0
      };

      if (products) {
        status.total_products = products.length;

        products.forEach(p => {
          if (!p.track_inventory) {
            status.in_stock++;
          } else if (p.stock_quantity === 0) {
            status.out_of_stock++;
          } else if (p.stock_quantity <= p.stock_alert_level) {
            status.low_stock++;
          } else {
            status.in_stock++;
          }

          status.total_value += (p.stock_quantity || 0) * (p.price || 0);
        });
      }

      // Get active alerts count
      const { data: alerts } = await supabase
        .from('stock_alerts')
        .select('id')
        .eq('is_resolved', false);

      status.alerts_count = alerts?.length || 0;

      return status;
    } catch (error) {
      console.error('Get stock status error:', error);
      return {
        total_products: 0,
        in_stock: 0,
        low_stock: 0,
        out_of_stock: 0,
        total_value: 0,
        alerts_count: 0
      };
    }
  }

  async updateStock(
    productId: string,
    quantity: number,
    type: 'set' | 'adjust' = 'set',
    notes?: string
  ): Promise<boolean> {
    try {
      if (type === 'set') {
        // Set absolute quantity
        const { error } = await supabase
          .from('products')
          .update({ stock_quantity: quantity })
          .eq('id', productId);

        if (error) throw error;
      } else {
        // Adjust by amount (+ or -)
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', productId)
          .single();

        if (product) {
          const newQuantity = Math.max(0, (product.stock_quantity || 0) + quantity);

          const { error } = await supabase
            .from('products')
            .update({ stock_quantity: newQuantity })
            .eq('id', productId);

          if (error) throw error;
        }
      }

      // Add note to history if provided
      if (notes) {
        await this.addStockNote(productId, notes);
      }

      console.log(`✅ Stock updated for product ${productId}`);
      return true;
    } catch (error) {
      console.error('Update stock error:', error);
      return false;
    }
  }

  async bulkUpdateStock(updates: BulkStockUpdate[]): Promise<number> {
    let updated = 0;

    for (const update of updates) {
      const success = await this.updateStock(
        update.product_id,
        update.new_quantity,
        'set',
        update.notes
      );

      if (success) updated++;
    }

    console.log(`✅ Bulk update complete: ${updated}/${updates.length} products updated`);
    return updated;
  }

  // ============= STOCK ALERTS =============

  async getActiveAlerts(): Promise<StockAlert[]> {
    try {
      const { data, error } = await supabase
        .from('stock_alerts')
        .select(`
          *,
          product:product_id (
            id,
            name,
            sku,
            stock_quantity,
            stock_alert_level,
            price
          )
        `)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get alerts error:', error);
      return [];
    }
  }

  async resolveAlert(alertId: string, notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('stock_alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          notes
        })
        .eq('id', alertId);

      if (error) throw error;

      console.log(`✅ Alert ${alertId} resolved`);
      return true;
    } catch (error) {
      console.error('Resolve alert error:', error);
      return false;
    }
  }

  async createAlert(
    productId: string,
    alertType: 'low_stock' | 'out_of_stock' | 'restock_needed',
    notes?: string
  ): Promise<StockAlert | null> {
    try {
      // Get current stock quantity
      const { data: product } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();

      if (!product) return null;

      const { data, error } = await supabase
        .from('stock_alerts')
        .insert([{
          product_id: productId,
          alert_type: alertType,
          quantity_at_alert: product.stock_quantity,
          notes
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create alert error:', error);
      return null;
    }
  }

  // ============= STOCK HISTORY =============

  async getStockHistory(productId?: string, limit: number = 50): Promise<StockHistory[]> {
    try {
      let query = supabase
        .from('stock_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get stock history error:', error);
      return [];
    }
  }

  async addStockNote(productId: string, notes: string): Promise<boolean> {
    try {
      // Get current stock
      const { data: product } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();

      if (!product) return false;

      const { error } = await supabase
        .from('stock_history')
        .insert([{
          product_id: productId,
          previous_quantity: product.stock_quantity,
          new_quantity: product.stock_quantity,
          change_amount: 0,
          change_type: 'adjustment',
          notes
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Add stock note error:', error);
      return false;
    }
  }

  // ============= LOW STOCK PRODUCTS =============

  async getLowStockProducts(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('low_stock_products')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get low stock products error:', error);
      return [];
    }
  }

  async getProductsNeedingRestock(threshold?: number): Promise<any[]> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('track_inventory', true);

      if (threshold) {
        query = query.lte('stock_quantity', threshold);
      } else {
        // Use stock_alert_level as threshold
        query = query.filter('stock_quantity', 'lte', 'stock_alert_level');
      }

      const { data, error } = await query
        .order('stock_quantity', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get restock products error:', error);
      return [];
    }
  }

  // ============= STOCK VALIDATION =============

  async checkStockAvailability(productId: string, quantity: number): Promise<{
    available: boolean;
    current_stock: number;
    message?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity, track_inventory, allow_backorder, name')
        .eq('id', productId)
        .single();

      if (error || !data) {
        return {
          available: false,
          current_stock: 0,
          message: 'Product not found'
        };
      }

      // If not tracking inventory, always available
      if (!data.track_inventory) {
        return {
          available: true,
          current_stock: -1 // Unlimited
        };
      }

      // Check stock
      const hasStock = data.stock_quantity >= quantity;
      const canBackorder = data.allow_backorder;

      return {
        available: hasStock || canBackorder,
        current_stock: data.stock_quantity,
        message: !hasStock && canBackorder
          ? `Only ${data.stock_quantity} in stock. Rest will be backordered.`
          : !hasStock
            ? `Insufficient stock. Only ${data.stock_quantity} available.`
            : undefined
      };
    } catch (error) {
      console.error('Check stock availability error:', error);
      return {
        available: false,
        current_stock: 0,
        message: 'Error checking stock'
      };
    }
  }

  async validateCartStock(cartItems: Array<{ product_id: string, quantity: number }>): Promise<{
    valid: boolean;
    errors: Array<{ product_id: string, message: string }>;
  }> {
    const errors: Array<{ product_id: string, message: string }> = [];

    for (const item of cartItems) {
      const check = await this.checkStockAvailability(item.product_id, item.quantity);

      if (!check.available) {
        errors.push({
          product_id: item.product_id,
          message: check.message || 'Insufficient stock'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ============= RESTOCK OPERATIONS =============

  async restockProduct(productId: string, quantity: number, notes?: string): Promise<boolean> {
    try {
      const { data: product } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();

      if (!product) return false;

      const newQuantity = (product.stock_quantity || 0) + quantity;

      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', productId);

      if (error) throw error;

      // Log restock in history
      await supabase
        .from('stock_history')
        .insert([{
          product_id: productId,
          previous_quantity: product.stock_quantity,
          new_quantity: newQuantity,
          change_amount: quantity,
          change_type: 'restock',
          notes: notes || `Restocked ${quantity} units`
        }]);

      // Resolve any out-of-stock alerts
      await supabase
        .from('stock_alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          notes: 'Resolved by restock'
        })
        .eq('product_id', productId)
        .eq('alert_type', 'out_of_stock')
        .eq('is_resolved', false);

      console.log(`✅ Restocked ${quantity} units for product ${productId}`);
      return true;
    } catch (error) {
      console.error('Restock error:', error);
      return false;
    }
  }

  async bulkRestock(restocks: Array<{ product_id: string, quantity: number, notes?: string }>): Promise<number> {
    let restocked = 0;

    for (const item of restocks) {
      const success = await this.restockProduct(
        item.product_id,
        item.quantity,
        item.notes
      );

      if (success) restocked++;
    }

    console.log(`✅ Bulk restock complete: ${restocked}/${restocks.length} products restocked`);
    return restocked;
  }
}

// Export singleton instance
export const InventoryService = new InventoryServiceClass();