"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Package, Truck, Home, CheckCircle2, Clock, MapPin, ExternalLink } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TrackOrderPage() {
  const [mounted, setMounted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsTracking(true);
    
    // Simulate API call - REPLACE WITH REAL API
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock validation
    if (trackingNumber.length < 8) {
      setError("Please enter a valid order number");
      setIsTracking(false);
      return;
    }

    setTrackingData({
      orderNumber: trackingNumber,
      orderDate: "November 28, 2025",
      estimatedDelivery: "December 8, 2025",
      currentStatus: "in_transit",
      carrier: {
        name: "DHL Express",
        trackingUrl: "https://www.dhl.com/tr-en/home/tracking.html",
      },
      recipient: {
        name: "Customer Name",
        address: "Istanbul, Turkey",
      },
      items: [
        { name: "Organic Cotton Polo - Black", size: "M", qty: 1 },
        { name: "Merino Wool Cardigan", size: "L", qty: 1 },
      ],
      timeline: [
        {
          status: "delivered",
          title: "Delivered",
          description: "Package delivered successfully",
          location: "Your doorstep",
          date: "Dec 8, 2025",
          time: "18:00",
          completed: false,
        },
        {
          status: "out_for_delivery",
          title: "Out for Delivery",
          description: "Package is with delivery courier",
          location: "Local delivery hub",
          date: "Dec 8, 2025",
          time: "08:30",
          completed: false,
        },
        {
          status: "in_transit",
          title: "In Transit",
          description: "Package is on its way",
          location: "Istanbul Distribution Center",
          date: "Dec 5, 2025",
          time: "11:45",
          completed: true,
          current: true,
        },
        {
          status: "shipped",
          title: "Shipped",
          description: "Package has left our facility",
          location: "NOWIHT Warehouse, Istanbul",
          date: "Dec 3, 2025",
          time: "09:00",
          completed: true,
        },
        {
          status: "processing",
          title: "Processing",
          description: "Order is being prepared",
          location: "NOWIHT Warehouse",
          date: "Dec 2, 2025",
          time: "14:15",
          completed: true,
        },
        {
          status: "confirmed",
          title: "Order Confirmed",
          description: "Your order has been received",
          location: "Online",
          date: "Dec 1, 2025",
          time: "10:30",
          completed: true,
        },
      ],
    });
    setIsTracking(false);
  };

  const getStatusIcon = (status: string, completed: boolean, current: boolean) => {
    if (current) return <Truck className="w-6 h-6" />;
    if (completed) return <CheckCircle2 className="w-6 h-6" />;
    
    switch (status) {
      case "delivered": return <Home className="w-6 h-6" />;
      case "out_for_delivery": return <Truck className="w-6 h-6" />;
      case "in_transit": return <Truck className="w-6 h-6" />;
      case "shipped": return <Package className="w-6 h-6" />;
      default: return <Package className="w-6 h-6" />;
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
        {/* Header Bar */}
        <div className="bg-black text-white">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/my-order" className="inline-flex items-center gap-2 text-sm hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>My Order</span>
            </Link>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">ORDER TRACKING</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!trackingData ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero + Form */}
              <section className="py-20 px-6">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight">
                      Track Your Order
                    </h1>
                    <p className="text-gray-600 font-light">
                      Enter your order details to view real-time tracking information
                    </p>
                  </div>

                  <form onSubmit={handleTrack} className="space-y-6">
                    <div>
                      <label htmlFor="tracking" className="block text-sm font-medium mb-2">
                        Order Number *
                      </label>
                      <input
                        type="text"
                        id="tracking"
                        value={trackingNumber}
                        onChange={(e) => {
                          setTrackingNumber(e.target.value);
                          setError("");
                        }}
                        placeholder="NW123456789"
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Found in your order confirmation email</p>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address *
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

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isTracking}
                      className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 font-medium tracking-wider flex items-center justify-center gap-2"
                    >
                      {isTracking ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>TRACKING...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          <span>TRACK ORDER</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Need help? <Link href="/my-order/support" className="text-black hover:underline">Contact Support</Link></p>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Tracking Results */}
              <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto">
                  {/* Summary Card */}
                  <div className="bg-black text-white p-8 mb-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Order Number</p>
                        <p className="text-xl font-light">{trackingData.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Order Date</p>
                        <p className="text-xl font-light">{trackingData.orderDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Est. Delivery</p>
                        <p className="text-xl font-light">{trackingData.estimatedDelivery}</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/50 mb-1">Shipped via</p>
                        <p className="font-medium">{trackingData.carrier.name}</p>
                      </div>
                      <a
                        href={trackingData.carrier.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
                      >
                        <span>Carrier Tracking</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Timeline */}
                    <div className="lg:col-span-2">
                      <h2 className="text-2xl font-light mb-6">Shipment Timeline</h2>
                      <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gray-200"></div>
                        
                        <div className="space-y-6">
                          {trackingData.timeline.map((event: any, i: number) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`relative flex gap-4 ${
                                !event.completed && !event.current ? "opacity-40" : ""
                              }`}
                            >
                              {/* Icon */}
                              <div
                                className={`relative z-10 flex-shrink-0 w-10 h-10 flex items-center justify-center ${
                                  event.current
                                    ? "bg-black text-white animate-pulse"
                                    : event.completed
                                    ? "bg-black text-white"
                                    : "bg-white border-2 border-gray-300 text-gray-400"
                                }`}
                              >
                                {getStatusIcon(event.status, event.completed, event.current)}
                              </div>

                              {/* Content */}
                              <div className="flex-1 pb-6">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-medium text-lg mb-1">
                                      {event.title}
                                      {event.current && (
                                        <span className="ml-2 text-xs bg-black text-white px-2 py-0.5">
                                          CURRENT
                                        </span>
                                      )}
                                    </h3>
                                    <p className="text-sm text-gray-600">{event.description}</p>
                                  </div>
                                  <div className="text-right text-sm text-gray-500 ml-4">
                                    <p className="flex items-center gap-1 justify-end">
                                      <Clock className="w-3 h-3" />
                                      {event.time}
                                    </p>
                                    <p>{event.date}</p>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Order Items */}
                      <div className="border border-gray-200 p-6">
                        <h3 className="font-medium mb-4">Order Items</h3>
                        <div className="space-y-3">
                          {trackingData.items.map((item: any, i: number) => (
                            <div key={i} className="text-sm">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-gray-600">Size: {item.size} • Qty: {item.qty}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="border border-gray-200 p-6">
                        <h3 className="font-medium mb-4">Delivery Address</h3>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-black mb-1">{trackingData.recipient.name}</p>
                          <p>{trackingData.recipient.address}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <button
                          onClick={() => setTrackingData(null)}
                          className="w-full border border-gray-300 py-3 hover:border-black transition-all text-sm font-medium"
                        >
                          TRACK ANOTHER ORDER
                        </button>
                        <Link
                          href="/my-order/support"
                          className="block w-full bg-black text-white py-3 text-center hover:bg-gray-800 transition-all text-sm font-medium"
                        >
                          CONTACT SUPPORT
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Footer */}
        <section className="py-16 px-6 bg-gray-50 border-t">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-light mb-8 text-center">Shipping Information</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-light mb-2">5-7</div>
                <p className="text-sm text-gray-600">Business Days<br />Standard Shipping</p>
              </div>
              <div>
                <div className="text-3xl font-light mb-2">2-3</div>
                <p className="text-sm text-gray-600">Business Days<br />Express Shipping</p>
              </div>
              <div>
                <div className="text-3xl font-light mb-2">7-14</div>
                <p className="text-sm text-gray-600">Business Days<br />International</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}