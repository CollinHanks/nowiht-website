// app/account/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Search,
  Package,
  Clock,
  CheckCircle,
  Truck,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { OrderService } from "@/lib/services/OrderService";
import type { Order, OrderStatus } from "@/types";

const statusConfig = {
  delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Delivered" },
  shipped: { color: "bg-blue-100 text-blue-700", icon: Truck, label: "Shipped" },
  processing: { color: "bg-yellow-100 text-yellow-700", icon: Package, label: "Processing" },
  pending: { color: "bg-gray-100 text-gray-700", icon: Clock, label: "Pending" },
  cancelled: { color: "bg-red-100 text-red-700", icon: X, label: "Cancelled" },
};

export default function OrderHistoryPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login?callbackUrl=/account/orders");
    }
  }, [authStatus, router]);

  // Fetch orders
  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session]);

  // Filter orders when search or status changes
  useEffect(() => {
    filterOrdersLocal();
  }, [searchQuery, filterStatus, orders]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const allOrders = await OrderService.getAll();
      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrdersLocal = () => {
    let filtered = [...orders];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  };

  // Loading state
  if (authStatus === "loading" || isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-black mx-auto mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Not authenticated (redirecting)
  if (!session) {
    return null;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <div className="pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            {/* Back Link */}
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Account</span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-2">
                Order History
              </h1>
              <p className="text-sm text-gray-600 tracking-wide">
                View and track all your orders
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-6 py-3 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors bg-white"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                {orders.length === 0 ? (
                  <>
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg text-gray-500 mb-2">No orders yet</p>
                    <p className="text-sm text-gray-400 mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block px-8 py-3 bg-black text-white text-sm font-medium tracking-widest hover:bg-gray-900 transition-colors"
                    >
                      START SHOPPING
                    </Link>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg text-gray-500 mb-2">No orders found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const statusKey = order.status as keyof typeof statusConfig;
                  const StatusIcon = statusConfig[statusKey]?.icon || Package;
                  const statusColor = statusConfig[statusKey]?.color || "bg-gray-100 text-gray-700";
                  const statusLabel = statusConfig[statusKey]?.label || order.status;

                  return (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
                        <div className="flex items-center gap-6">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Order Number</div>
                            <div className="font-medium">{order.orderNumber}</div>
                          </div>
                          <div className="hidden md:block">
                            <div className="text-sm text-gray-500 mb-1">Date</div>
                            <div className="font-medium">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                          <div className="hidden md:block">
                            <div className="text-sm text-gray-500 mb-1">Total</div>
                            <div className="font-medium">${order.total.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full ${statusColor}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="p-6">
                        <div className="mb-6">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Customer:</span> {order.customerName}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Email:</span> {order.customerEmail}
                          </p>
                          {order.trackingNumber && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Tracking:</span> {order.trackingNumber}
                            </p>
                          )}
                        </div>

                        {/* Order Totals */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">
                              {order.shippingCost === 0
                                ? "Free"
                                : `$${order.shippingCost.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={`/account/orders/${order.orderNumber}`}
                            className="px-6 py-3 bg-black text-white text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors"
                          >
                            VIEW DETAILS
                          </Link>
                          {order.trackingNumber && (
                            <Link
                              href={`/account/orders/${order.orderNumber}`}
                              className="px-6 py-3 border border-gray-300 text-sm font-medium tracking-wider hover:border-black transition-colors"
                            >
                              TRACK ORDER
                            </Link>
                          )}
                          {order.status === "delivered" && (
                            <button className="px-6 py-3 border border-gray-300 text-sm font-medium tracking-wider hover:border-black transition-colors">
                              REORDER
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Help Section */}
            <div className="mt-12 p-8 bg-gray-50 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Questions about your order? Our customer service team is here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-black text-white text-sm font-medium tracking-wider hover:bg-gray-900 transition-colors"
                >
                  CONTACT SUPPORT
                </Link>
                <Link
                  href="/returns"
                  className="px-8 py-3 border border-gray-300 text-sm font-medium tracking-wider hover:border-black transition-colors"
                >
                  RETURN POLICY
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}