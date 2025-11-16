// app/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ShoppingBag,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { OrderService } from "@/lib/services/OrderService";
import type { Order } from "@/types";

export default function AccountDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    savedItems: 8, // From wishlist (TODO: integrate with wishlist)
    loyaltyPoints: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account");
    }
  }, [status, router]);

  // Fetch orders and calculate stats
  useEffect(() => {
    if (session?.user?.email) {
      fetchOrdersAndStats();
    }
  }, [session]);

  const fetchOrdersAndStats = async () => {
    try {
      setIsLoading(true);

      // Fetch recent orders (limit 3 for dashboard)
      const allOrders = await OrderService.getAll({ limit: 3 });
      setOrders(allOrders);

      // Calculate stats from all orders
      const statsData = await OrderService.getStats();
      const loyaltyPoints = Math.floor(statsData.totalRevenue * 10); // 10 points per $1

      setStats({
        totalOrders: statsData.totalOrders,
        totalSpent: statsData.totalRevenue,
        savedItems: 8, // TODO: Get from wishlist
        loyaltyPoints,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log("🚪 Logging out...");
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-black mx-auto mb-4" />
            <p className="text-gray-600">Loading your account...</p>
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
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-2">
                My Account
              </h1>
              <p className="text-sm text-gray-600 tracking-wide">
                Welcome back, {session.user.name}
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  {/* User Info */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-light mb-4">
                      {session.user.name?.charAt(0) || "U"}
                    </div>
                    <h3 className="font-medium text-lg mb-1">{session.user.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{session.user.email}</p>
                    <p className="text-xs text-gray-500">Member since January 2024</p>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="space-y-1">
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-4 py-3 bg-white text-black rounded-lg font-medium"
                    >
                      <Package className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:text-black rounded-lg transition-colors"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>Orders</span>
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:text-black rounded-lg transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      href="/account/settings"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:text-black rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ShoppingBag className="w-8 h-8 text-gray-400 mb-3" />
                    <div className="text-2xl font-semibold mb-1">{stats.totalOrders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-gray-400 mb-3" />
                    <div className="text-2xl font-semibold mb-1">
                      ${stats.totalSpent.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <Heart className="w-8 h-8 text-gray-400 mb-3" />
                    <div className="text-2xl font-semibold mb-1">{stats.savedItems}</div>
                    <div className="text-sm text-gray-600">Saved Items</div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <Award className="w-8 h-8 text-gray-400 mb-3" />
                    <div className="text-2xl font-semibold mb-1">{stats.loyaltyPoints}</div>
                    <div className="text-sm text-gray-600">Points</div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-light tracking-tight">
                      Recent Orders
                    </h2>
                    <Link
                      href="/account/orders"
                      className="text-sm text-black hover:text-gray-600 transition-colors flex items-center gap-1"
                    >
                      <span>View all</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-2">No orders yet</p>
                      <p className="text-sm text-gray-400 mb-6">
                        Start shopping to see your orders here
                      </p>
                      <Link
                        href="/shop"
                        className="inline-block px-8 py-3 bg-black text-white text-sm font-medium tracking-widest hover:bg-gray-900 transition-colors"
                      >
                        START SHOPPING
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Link
                          key={order.id}
                          href={`/account/orders/${order.orderNumber}`}
                          className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-black transition-colors group"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                            <Package className="w-10 h-10 text-gray-300 absolute inset-0 m-auto" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium mb-1">{order.orderNumber}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "shipped"
                                      ? "bg-blue-100 text-blue-700"
                                      : order.status === "processing"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : order.status === "cancelled"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-gray-100 text-gray-700"
                                  }`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-sm text-gray-600">
                                {order.items?.length || 0}{" "}
                                {order.items?.length === 1 ? "item" : "items"}
                              </span>
                              <span className="font-semibold">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Link
                    href="/account/settings"
                    className="group bg-gray-50 p-8 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MapPin className="w-10 h-10 text-gray-400 mb-4 group-hover:text-black transition-colors" />
                    <h3 className="text-lg font-medium mb-2">Manage Addresses</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add, edit, or remove your shipping and billing addresses
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>Manage addresses</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link
                    href="/wishlist"
                    className="group bg-gray-50 p-8 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Heart className="w-10 h-10 text-gray-400 mb-4 group-hover:text-black transition-colors" />
                    <h3 className="text-lg font-medium mb-2">View Wishlist</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {stats.savedItems} items saved for later
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>View wishlist</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>

                {/* Loyalty Program */}
                <div className="bg-black text-white p-8 rounded-lg">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-medium mb-2">NOWIHT Rewards</h3>
                      <p className="text-sm text-gray-400">
                        You have{" "}
                        <span className="font-semibold text-white">
                          {stats.loyaltyPoints} points
                        </span>
                      </p>
                    </div>
                    <Award className="w-12 h-12 text-gray-600" />
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress to next reward</span>
                      <span>
                        {stats.loyaltyPoints} / {Math.ceil(stats.loyaltyPoints / 5000) * 5000}{" "}
                        points
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white rounded-full h-2 transition-all duration-500"
                        style={{
                          width: `${Math.min((stats.loyaltyPoints % 5000) / 50, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Earn {5000 - (stats.loyaltyPoints % 5000)} more points to unlock a $50 reward
                    voucher!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}