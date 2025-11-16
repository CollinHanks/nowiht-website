"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Package, Eye, Download, ArrowLeft, Calendar, CreditCard } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CheckOrderPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      setOrderData({
        orders: [
          {
            id: "NW123456789",
            date: "November 28, 2025",
            status: "Delivered",
            total: "₺3,450.00",
            trackingNumber: "DHL1234567890",
            items: [
              { name: "Organic Cotton Polo - Black", size: "M", qty: 1, price: "₺1,450.00" },
              { name: "Merino Wool Cardigan - Navy", size: "L", qty: 1, price: "₺1,800.00" },
              { name: "Cotton Socks - White", size: "One Size", qty: 2, price: "₺200.00" },
            ],
          },
          {
            id: "NW123456788",
            date: "November 15, 2025",
            status: "In Transit",
            total: "₺2,200.00",
            trackingNumber: "DHL0987654321",
            items: [
              { name: "Linen Shirt - White", size: "M", qty: 1, price: "₺1,200.00" },
              { name: "Organic Cotton Tee - Black", size: "M", qty: 2, price: "₺1,000.00" },
            ],
          },
          {
            id: "NW123456787",
            date: "October 22, 2025",
            status: "Delivered",
            total: "₺4,500.00",
            trackingNumber: "DHL1122334455",
            items: [
              { name: "Cashmere Pullover - Gray", size: "L", qty: 1, price: "₺2,800.00" },
              { name: "Organic Cotton Joggers - Black", size: "M", qty: 1, price: "₺950.00" },
              { name: "Merino Wool Beanie - Navy", size: "One Size", qty: 1, price: "₺450.00" },
              { name: "Cotton Underwear Set", size: "M", qty: 1, price: "₺300.00" },
            ],
          },
        ],
      });
      setIsSearching(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!mounted) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="pt-24 pb-8 px-6 border-b">
          <div className="max-w-7xl mx-auto">
            <Link href="/my-order" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to My Order
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight">
                Check Your Order
              </h1>
              <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                View your complete order history and access detailed order information
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search Form */}
        {!orderData && (
          <section className="py-12 px-6">
            <div className="max-w-2xl mx-auto">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSearch}
                className="bg-zinc-50 border border-gray-200 p-8 md:p-12"
              >
                <div className="space-y-6">
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium mb-2">
                      Order Number or Email *
                    </label>
                    <input
                      type="text"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g., NW123456789 or your.email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Confirmation Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 text-sm tracking-widest font-medium"
                  >
                    {isSearching ? "SEARCHING..." : "SEARCH ORDERS"}
                  </button>
                </div>
              </motion.form>

              <div className="mt-8 text-center text-sm text-gray-600">
                <p className="mb-2">Have an account?</p>
                <Link href="/account" className="text-black hover:underline">
                  Sign in to view all orders
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Order Results */}
        {orderData && (
          <section className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-light">Your Orders</h2>
                <button
                  onClick={() => setOrderData(null)}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Search Again
                </button>
              </div>

              <div className="space-y-6">
                {orderData.orders.map((order: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-gray-200 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-zinc-50 p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-medium">{order.id}</h3>
                            <span className={`px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {order.date}
                            </span>
                            <span className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              {order.items.length} items
                            </span>
                            <span className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              {order.total}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Link
                            href={`/my-order/track?number=${order.id}`}
                            className="px-6 py-2 border border-gray-300 hover:border-black transition-all text-sm tracking-wider flex items-center gap-2"
                          >
                            <Package className="w-4 h-4" />
                            TRACK
                          </Link>
                          <button className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-all text-sm tracking-wider flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            DETAILS
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items.map((item: any, j: number) => (
                          <div key={j} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                            <div className="w-20 h-20 bg-gray-100 flex-shrink-0"></div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{item.name}</h4>
                              <p className="text-sm text-gray-600">Size: {item.size} • Qty: {item.qty}</p>
                            </div>
                            <p className="font-medium">{item.price}</p>
                          </div>
                        ))}
                      </div>

                      {order.trackingNumber && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Tracking Number: <span className="font-medium text-black">{order.trackingNumber}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Order Actions */}
                    <div className="bg-zinc-50 p-6 border-t border-gray-200">
                      <div className="flex flex-wrap gap-3">
                        <button className="px-6 py-2 border border-gray-300 hover:border-black transition-all text-sm tracking-wider flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          INVOICE
                        </button>
                        <Link
                          href="/my-order/return"
                          className="px-6 py-2 border border-gray-300 hover:border-black transition-all text-sm tracking-wider"
                        >
                          REQUEST RETURN
                        </Link>
                        <Link
                          href="/my-order/support"
                          className="px-6 py-2 border border-gray-300 hover:border-black transition-all text-sm tracking-wider"
                        >
                          CONTACT SUPPORT
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Help Section */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center">Order Help</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="font-medium mb-2">Track Shipment</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get real-time updates on your delivery status
                </p>
                <Link href="/my-order/track" className="text-sm text-black hover:underline">
                  Track Order →
                </Link>
              </div>
              <div className="text-center">
                <Download className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="font-medium mb-2">Download Invoice</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Access your order invoice and receipt
                </p>
                <button className="text-sm text-black hover:underline">
                  Get Invoice →
                </button>
              </div>
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our support team for assistance
                </p>
                <Link href="/my-order/support" className="text-sm text-black hover:underline">
                  Get Support →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}