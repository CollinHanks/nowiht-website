"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { useAdminStore } from "@/store/adminStore";
import { OrderService } from "@/lib/services/OrderService";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-gray-50 text-gray-700 border-gray-200",
  return_requested: "bg-orange-50 text-orange-700 border-orange-200",
};

const STATUS_ICONS: Record<OrderStatus, any> = {
  pending: AlertCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: XCircle,
  return_requested: RotateCcw,
};

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 16: Unwrap params Promise using React.use()
  const { id } = use(params);

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const { isSidebarOpen } = useAdminStore();

  useEffect(() => {
    setMounted(true);
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await OrderService.getById(id);
      setOrder(data);
      setNewStatus(data?.status || "");
      setTrackingNumber(data?.trackingNumber || "");
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order || !newStatus || newStatus === order.status) return;

    setUpdating(true);
    try {
      await OrderService.updateStatus(order.id, newStatus);
      await loadOrder();
      alert("Order status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!order || !trackingNumber) return;

    setUpdating(true);
    try {
      await OrderService.updateTracking(order.id, trackingNumber);
      await loadOrder();
      alert("Tracking number added successfully");
    } catch (error) {
      console.error("Error updating tracking:", error);
      alert("Failed to add tracking number");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    const confirmed = confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );
    if (!confirmed) return;

    setUpdating(true);
    try {
      await OrderService.updateStatus(order.id, "cancelled");
      await loadOrder();
      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order");
    } finally {
      setUpdating(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black mb-4" />
          <p className="text-sm text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Link href="/admin/orders">
            <Button variant="primary">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[order.status];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main
        className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"
          }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/orders">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {order.orderNumber}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${STATUS_COLORS[order.status]
                  }`}
              >
                <StatusIcon className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order Items ({order.items?.length || 0})
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {item.productName}
                          </h3>
                          {item.productSku && (
                            <p className="text-xs text-gray-500 mt-1">
                              SKU: {item.productSku}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            {item.size && (
                              <span className="text-xs text-gray-600">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-xs text-gray-600">
                                Color: {item.color}
                              </span>
                            )}
                            <span className="text-xs text-gray-600">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(item.total)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatPrice(item.price)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Customer Information
                    </h2>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact */}
                  <div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                      Contact
                    </div>
                    <div className="text-sm text-gray-900 mb-1">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {order.customerEmail}
                    </div>
                    {order.customerPhone && (
                      <div className="text-sm text-gray-600">
                        {order.customerPhone}
                      </div>
                    )}
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                      <MapPin className="w-3 h-3" />
                      Shipping Address
                    </div>
                    <div className="text-sm text-gray-900">
                      {order.shippingAddress.address}
                      {order.shippingAddress.apartment &&
                        `, ${order.shippingAddress.apartment}`}
                    </div>
                    <div className="text-sm text-gray-900">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </div>
                    <div className="text-sm text-gray-900">
                      {order.shippingAddress.country}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Right Column (1/3) */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {formatPrice(order.shippingCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">
                      {formatPrice(order.tax)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-red-600">
                        -{formatPrice(order.discount)}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                    <CreditCard className="w-3 h-3" />
                    Payment
                  </div>
                  <div className="text-sm text-gray-900">
                    {order.paymentMethod || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Status:{" "}
                    <span
                      className={`font-medium ${order.paymentStatus === "paid"
                        ? "text-green-600"
                        : order.paymentStatus === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Update Status
                </h2>

                {/* Status Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                    <option value="return_requested">Return Requested</option>
                  </select>
                </div>

                <Button
                  variant="primary"
                  onClick={handleUpdateStatus}
                  disabled={updating || newStatus === order.status}
                  className="w-full mb-3"
                >
                  {updating ? "Updating..." : "Update Status"}
                </Button>

                {/* Tracking Number */}
                {(order.status === "shipped" || order.status === "processing") && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mb-3"
                    />
                    <Button
                      variant="outline"
                      onClick={handleUpdateTracking}
                      disabled={updating || !trackingNumber}
                      className="w-full"
                    >
                      {updating ? "Saving..." : "Save Tracking"}
                    </Button>
                  </div>
                )}

                {/* Cancel Order */}
                {order.status !== "cancelled" &&
                  order.status !== "delivered" &&
                  order.status !== "refunded" && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={handleCancelOrder}
                        disabled={updating}
                        className="w-full text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Cancel Order
                      </Button>
                    </div>
                  )}
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Order Notes
                  </h2>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}