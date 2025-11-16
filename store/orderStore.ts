import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderItem, ShippingInfo, PaymentInfo, OrderItemSnapshot } from "@/types";

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;

  // Actions
  createOrder: (
    items: OrderItem[],
    shipping: ShippingInfo,
    payment: PaymentInfo,
    totals: {
      subtotal: number;
      shipping: number;
      tax: number;
      discount: number;
      total: number;
    }
  ) => Order;

  getOrderById: (orderId: string) => Order | undefined;
  getRecentOrders: (limit?: number) => Order[];
  getAllOrders: () => Order[];
  clearOrders: () => void; // For testing
}

// Generate order ID
const generateOrderId = (): string => {
  return "NOW" + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 5).toUpperCase();
};

// Calculate estimated delivery (7 business days from now)
const getEstimatedDelivery = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString();
};

// Convert OrderItem to OrderItemSnapshot
const convertToOrderItemSnapshot = (
  item: OrderItem,
  orderId: string
): OrderItemSnapshot => {
  return {
    id: `${orderId}-${item.productId}`,
    orderId,
    productId: item.productId,
    productName: item.productName,
    productImage: item.productImage,
    productSku: undefined, // OrderItem has productSlug, not productSku
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity,
    createdAt: new Date().toISOString(),
  };
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,

      createOrder: (items, shipping, payment, totals) => {
        const orderId = generateOrderId();

        // Convert OrderItems to OrderItemSnapshots
        const orderItems: OrderItemSnapshot[] = items.map((item) =>
          convertToOrderItemSnapshot(item, orderId)
        );

        const newOrder: Order = {
          id: orderId,
          orderNumber: orderId, // Using same ID for now

          // Customer Info
          customerEmail: shipping.email,
          customerName: `${shipping.firstName} ${shipping.lastName}`,
          customerPhone: shipping.phone,

          // Shipping
          shippingAddress: {
            address: shipping.address,
            apartment: shipping.apartment,
            city: shipping.city,
            state: shipping.state,
            zipCode: shipping.zipCode,
            country: shipping.country,
          },

          // Pricing
          subtotal: totals.subtotal,
          shippingCost: totals.shipping,
          tax: totals.tax,
          discount: totals.discount,
          total: totals.total,

          // Status & Payment
          status: "pending",
          paymentMethod: payment.method,
          paymentStatus: "pending",

          // Items
          items: orderItems,

          // Timestamps
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedDelivery: getEstimatedDelivery(),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          currentOrder: newOrder,
        }));

        return newOrder;
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      getRecentOrders: (limit = 5) => {
        return get().orders.slice(0, limit);
      },

      getAllOrders: () => {
        return get().orders;
      },

      clearOrders: () => {
        set({ orders: [], currentOrder: null });
      },
    }),
    {
      name: "order-storage",
    }
  )
);