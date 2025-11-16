import { supabase } from "@/lib/supabase/client";
import type {
  Order,
  OrderDB,
  OrderItemDB,
  OrderItemSnapshot,
  CreateOrderRequest,
  OrderStatus,
  PaymentStatus,
} from "@/types";

/**
 * OrderService
 * 
 * Complete order management service
 * Handles order creation, retrieval, updates, and calculations
 * 
 * FEATURES:
 * - Auto-generate unique order numbers (NOWIHT-xxxx)
 * - Create orders with items
 * - Update order status & tracking
 * - Calculate totals (subtotal, tax, shipping, discount)
 * - Filter & search orders
 * 
 * FIXED: Added update() method for flexible order updates
 * FIXED: Removed commas after class methods (syntax error)
 */

export class OrderService {
  /**
   * Generate unique order number
   * Format: NOWIHT-1001, NOWIHT-1002, etc.
   */
  static async generateOrderNumber(): Promise<string> {
    try {
      // Get the latest order number
      const { data, error } = await supabase
        .from("orders")
        .select("order_number")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        return "NOWIHT-1001"; // First order
      }

      // Extract number from last order (e.g., "NOWIHT-1005" → 1005)
      const lastNumber = parseInt(data[0].order_number.split("-")[1]);
      const nextNumber = lastNumber + 1;

      return `NOWIHT-${nextNumber.toString().padStart(4, "0")}`;
    } catch (error) {
      console.error("Error generating order number:", error);
      // Fallback to timestamp-based number
      return `NOWIHT-${Date.now().toString().slice(-6)}`;
    }
  }

  /**
   * Calculate order totals
   * Tax: 10% (configurable)
   * Shipping: $10 flat rate (configurable)
   */
  static calculateTotals(
    subtotal: number,
    discount: number = 0
  ): {
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    total: number;
  } {
    const TAX_RATE = 0.1; // 10%
    const SHIPPING_COST = 10; // $10 flat rate
    const FREE_SHIPPING_THRESHOLD = 100; // Free shipping over $100

    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * TAX_RATE;
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = discountedSubtotal + tax + shippingCost;

    return {
      subtotal,
      tax: parseFloat(tax.toFixed(2)),
      shippingCost,
      discount,
      total: parseFloat(total.toFixed(2)),
    };
  }

  /**
   * Create new order
   */
  static async create(request: CreateOrderRequest): Promise<Order> {
    try {
      // 1. Generate order number
      const orderNumber = await this.generateOrderNumber();

      // 2. Fetch product details for items
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name, price, images, sku")
        .in(
          "id",
          request.items.map((item) => item.productId)
        );

      if (productsError) throw productsError;
      if (!products || products.length === 0) {
        throw new Error("Products not found");
      }

      // 3. Calculate subtotal and prepare order items
      let subtotal = 0;
      const orderItems: Array<Omit<OrderItemDB, "id" | "order_id" | "created_at">> = [];

      for (const item of request.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product_id: product.id,
          product_name: product.name,
          product_image: product.images?.[0] || "",
          product_sku: product.sku || "",
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: product.price,
          total: itemTotal,
        });
      }

      // 4. Calculate totals
      const totals = this.calculateTotals(subtotal);

      // 5. Create order in database
      const orderData: Omit<OrderDB, "id" | "created_at" | "updated_at"> = {
        order_number: orderNumber,
        customer_email: request.customerEmail,
        customer_name: request.customerName,
        customer_phone: request.customerPhone,
        shipping_address: request.shippingAddress,
        subtotal: totals.subtotal,
        shipping_cost: totals.shippingCost,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
        status: "pending",
        payment_method: request.paymentMethod,
        payment_status: "pending",
        notes: request.notes,
        tracking_number: undefined,
      };

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // 6. Insert order items
      const itemsWithOrderId = orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsWithOrderId);

      if (itemsError) throw itemsError;

      // 7. Return formatted order
      return this.formatOrder(order);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  /**
   * Get all orders (with optional filters)
   */
  static async getAll(filters?: {
    status?: OrderStatus;
    search?: string;
    limit?: number;
  }): Promise<Order[]> {
    try {
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.search) {
        query = query.or(
          `order_number.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`
        );
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(this.formatOrder);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  /**
   * Get order by ID (with items)
   */
  static async getById(id: string): Promise<Order | null> {
    try {
      // Fetch order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (orderError) throw orderError;
      if (!order) return null;

      // Fetch order items
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id);

      if (itemsError) throw itemsError;

      const formattedOrder = this.formatOrder(order);
      formattedOrder.items = items.map(this.formatOrderItem);

      return formattedOrder;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  }

  /**
   * Get order by order number
   */
  static async getByOrderNumber(orderNumber: string): Promise<Order | null> {
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .single();

      if (orderError) throw orderError;
      if (!order) return null;

      // Fetch order items
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);

      if (itemsError) throw itemsError;

      const formattedOrder = this.formatOrder(order);
      formattedOrder.items = items.map(this.formatOrderItem);

      return formattedOrder;
    } catch (error) {
      console.error("Error fetching order by number:", error);
      return null;
    }
  }

  /**
   * Update order (flexible - update any fields)
   * NEW: Added for flexible order updates
   */
  static async update(
    id: string,
    updates: Partial<{
      status: OrderStatus;
      paymentStatus: PaymentStatus;
      paymentMethod: string;
      trackingNumber: string;
      notes: string;
      shippingCost: number;
      tax: number;
      discount: number;
      total: number;
      cancelledAt: string;
      deliveredAt: string;
    }>
  ): Promise<Order | null> {
    try {
      // Map camelCase to snake_case for Supabase
      const dbUpdates: any = {};

      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;
      if (updates.paymentMethod !== undefined) dbUpdates.payment_method = updates.paymentMethod;
      if (updates.trackingNumber !== undefined) dbUpdates.tracking_number = updates.trackingNumber;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.shippingCost !== undefined) dbUpdates.shipping_cost = updates.shippingCost;
      if (updates.tax !== undefined) dbUpdates.tax = updates.tax;
      if (updates.discount !== undefined) dbUpdates.discount = updates.discount;
      if (updates.total !== undefined) dbUpdates.total = updates.total;
      if (updates.cancelledAt !== undefined) dbUpdates.cancelled_at = updates.cancelledAt;
      if (updates.deliveredAt !== undefined) dbUpdates.delivered_at = updates.deliveredAt;

      // Always update updated_at
      dbUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("orders")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return this.formatOrder(data);
    } catch (error) {
      console.error("Error updating order:", error);
      return null;
    }
  }

  /**
   * Update order status
   */
  static async updateStatus(
    id: string,
    status: OrderStatus
  ): Promise<Order | null> {
    try {
      const updates: any = { status };

      // Auto-set timestamps based on status
      if (status === "cancelled") {
        updates.cancelled_at = new Date().toISOString();
      } else if (status === "delivered") {
        updates.delivered_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return this.formatOrder(data);
    } catch (error) {
      console.error("Error updating order status:", error);
      return null;
    }
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus
  ): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ payment_status: paymentStatus })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return this.formatOrder(data);
    } catch (error) {
      console.error("Error updating payment status:", error);
      return null;
    }
  }

  /**
   * Add tracking number
   */
  static async updateTracking(
    id: string,
    trackingNumber: string
  ): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ tracking_number: trackingNumber, status: "shipped" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return this.formatOrder(data);
    } catch (error) {
      console.error("Error updating tracking:", error);
      return null;
    }
  }

  /**
   * Delete order (soft delete - change status to cancelled)
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      return false;
    }
  }

  /**
   * Get order statistics
   */
  static async getStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
  }> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("status, total");

      if (error) throw error;

      const stats = {
        totalOrders: data.length,
        totalRevenue: data.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: data.filter((o) => o.status === "pending").length,
        processingOrders: data.filter((o) => o.status === "processing").length,
        shippedOrders: data.filter((o) => o.status === "shipped").length,
        deliveredOrders: data.filter((o) => o.status === "delivered").length,
      };

      return stats;
    } catch (error) {
      console.error("Error fetching order stats:", error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
      };
    }
  }

  /**
   * Format order from database (snake_case → camelCase)
   */
  private static formatOrder(order: OrderDB): Order {
    return {
      id: order.id,
      orderNumber: order.order_number,
      customerEmail: order.customer_email,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      shippingAddress: order.shipping_address,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      status: order.status,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      notes: order.notes,
      trackingNumber: order.tracking_number,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      cancelledAt: (order as any).cancelled_at,
      deliveredAt: (order as any).delivered_at,
    };
  }

  /**
   * Format order item from database (snake_case → camelCase)
   */
  private static formatOrderItem(item: OrderItemDB): OrderItemSnapshot {
    return {
      id: item.id,
      orderId: item.order_id,
      productId: item.product_id,
      productName: item.product_name,
      productImage: item.product_image,
      productSku: item.product_sku,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
      createdAt: item.created_at,
    };
  }
}