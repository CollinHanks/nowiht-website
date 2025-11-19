"use client";

// app/admin/page.tsx
// NOWIHT Admin Dashboard - FINAL FIXED VERSION
// 🔥 TypeScript errors fixed + camelCase Order fields

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  Plus,
  Upload,
  Eye,
  RefreshCw,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { useAdminStore } from "@/store/adminStore";
import { ProductService } from "@/lib/services/ProductService";
import { OrderService } from "@/lib/services/OrderService";
import { formatPrice } from "@/lib/utils";
import type { Product, Order } from "@/types";

// Components
import StatsCard from "@/components/admin/StatsCard";
import SalesChart from "@/components/admin/SalesChart";
import RecentOrders from "@/components/admin/RecentOrders";
import LowStockAlert from "@/components/admin/LowStockAlert";
import TopProducts from "@/components/admin/TopProducts";

interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const { isSidebarOpen } = useAdminStore();

  const [stats, setStats] = useState<StatCard[]>([
    {
      title: "Total Revenue",
      value: "$0",
      change: "+0%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Total Products",
      value: "0",
      change: "+0",
      isPositive: true,
      icon: Package,
    },
    {
      title: "Total Orders",
      value: "0",
      change: "+0%",
      isPositive: true,
      icon: ShoppingCart,
    },
    {
      title: "Conversion Rate",
      value: "0%",
      change: "+0%",
      isPositive: true,
      icon: TrendingUp,
    },
  ]);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 [DASHBOARD] Loading data...');

      // Load products and orders with error handling
      const [productsResult, ordersResult] = await Promise.allSettled([
        ProductService.getAll().catch(err => {
          console.error('❌ ProductService error:', err);
          return [];
        }),
        OrderService.getAll().catch(err => {
          console.error('❌ OrderService error:', err);
          return [];
        }),
      ]);

      const allProducts = productsResult.status === 'fulfilled' ? productsResult.value : [];
      const allOrders = ordersResult.status === 'fulfilled' ? ordersResult.value : [];

      console.log('✅ Products loaded:', allProducts.length);
      console.log('✅ Orders loaded:', allOrders.length);

      setProducts(allProducts);
      setOrders(allOrders);

      // Calculate stats
      const totalProducts = allProducts.length;
      const publishedProducts = allProducts.filter(p => p.status === 'published').length;
      const draftProducts = allProducts.filter(p => p.status === 'draft').length;
      const outOfStockProducts = allProducts.filter(p => (p.stock || 0) === 0).length;

      // 🔥 FIXED: payment_status → paymentStatus (camelCase)
      // Revenue from paid orders
      const paidOrders = allOrders.filter(
        o => o.paymentStatus === 'paid' && o.status !== 'cancelled' && o.status !== 'refunded'
      );
      const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.total || 0), 0);

      // Total orders (excluding cancelled)
      const validOrders = allOrders.filter(
        o => o.status !== 'cancelled' && o.status !== 'refunded'
      );
      const totalOrders = validOrders.length;

      // Pending orders count
      const pendingOrders = allOrders.filter(o => o.status === 'pending').length;

      setStats([
        {
          title: "Total Revenue",
          value: formatPrice(totalRevenue),
          change: `${paidOrders.length} paid orders`,
          isPositive: true,
          icon: DollarSign,
        },
        {
          title: "Total Products",
          value: totalProducts.toString(),
          change: `${publishedProducts} published, ${draftProducts} draft`,
          isPositive: true,
          icon: Package,
        },
        {
          title: "Total Orders",
          value: totalOrders.toString(),
          change: `${pendingOrders} pending`,
          isPositive: true,
          icon: ShoppingCart,
        },
        {
          title: "Out of Stock",
          value: outOfStockProducts.toString(),
          change: `${totalProducts - outOfStockProducts} in stock`,
          isPositive: outOfStockProducts === 0,
          icon: TrendingUp,
        },
      ]);

      console.log('✅ Dashboard loaded successfully');
    } catch (error: any) {
      console.error("🚨 Dashboard error:", error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main
        className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back! Here's your store overview.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              <Link href="/admin/products/import">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </Link>
              <Link href="/admin/products/add">
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Failed to Load Dashboard
                </h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <div className="text-xs text-red-600 mb-4">
                  <p>Common causes:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Supabase RLS policies not configured</li>
                    <li>Admin account not in database</li>
                    <li>Network connection issue</li>
                  </ul>
                </div>
                <button
                  onClick={loadData}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={parseFloat(stat.change.replace(/[^0-9.-]/g, '')) || 0}
                  changeType={stat.isPositive ? "increase" : "decrease"}
                  icon={stat.icon}
                />
              ))}
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Sales Overview
                    </h2>
                    <p className="text-sm text-gray-600">Revenue trends over time</p>
                  </div>

                  {/* Period Toggle */}
                  <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setChartPeriod("daily")}
                      className={`px-4 py-2 text-xs font-medium transition-colors ${chartPeriod === "daily"
                          ? "bg-black text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setChartPeriod("weekly")}
                      className={`px-4 py-2 text-xs font-medium border-x border-gray-300 transition-colors ${chartPeriod === "weekly"
                          ? "bg-black text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setChartPeriod("monthly")}
                      className={`px-4 py-2 text-xs font-medium transition-colors ${chartPeriod === "monthly"
                          ? "bg-black text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <SalesChart period={chartPeriod} orders={orders} />
              </div>
            </div>

            {/* Recent Orders & Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrders orders={orders} />
              <LowStockAlert products={products} />
            </div>

            {/* Top Products & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Products */}
              <div className="lg:col-span-2">
                <TopProducts products={products} />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>

                <div className="space-y-3">
                  <Link href="/admin/products/add">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <Plus className="w-5 h-5" />
                      <span className="text-sm font-medium">Add New Product</span>
                    </button>
                  </Link>

                  <Link href="/admin/products/import">
                    <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Import Products
                      </span>
                    </button>
                  </Link>

                  <Link href="/admin/categories">
                    <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Package className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Manage Categories
                      </span>
                    </button>
                  </Link>

                  <Link href="/admin/products">
                    <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        View All Products
                      </span>
                    </button>
                  </Link>
                </div>

                {/* Stats Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Published</span>
                      <span className="font-semibold text-gray-900">
                        {products.filter(p => p.status === 'published').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Draft</span>
                      <span className="font-semibold text-gray-900">
                        {products.filter(p => p.status === 'draft').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Out of Stock</span>
                      <span className="font-semibold text-red-600">
                        {products.filter(p => (p.stock || 0) === 0).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Orders</span>
                      <span className="font-semibold text-blue-600">
                        {orders.filter(o => o.status !== 'cancelled').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}