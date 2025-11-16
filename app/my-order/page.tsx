"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Search, RotateCcw, ShoppingCart, User, MessageSquare } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MyOrderPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const services = [
    {
      icon: Package,
      title: "Track Your Order",
      description: "Real-time tracking and delivery updates for your shipment",
      href: "/my-order/track",
      color: "bg-black",
    },
    {
      icon: ShoppingCart,
      title: "View Cart",
      description: "Review and modify items in your shopping cart",
      href: "/cart",
      color: "bg-gray-900",
    },
    {
      icon: User,
      title: "My Account",
      description: "Manage your profile, addresses, and preferences",
      href: "/account",
      color: "bg-gray-800",
    },
    {
      icon: RotateCcw,
      title: "Return & Refund",
      description: "Submit return requests and track refund status",
      href: "/my-order/return",
      color: "bg-gray-700",
    },
    {
      icon: Search,
      title: "Check Your Order",
      description: "View order history and detailed order information",
      href: "/my-order/check",
      color: "bg-gray-600",
    },
    {
      icon: MessageSquare,
      title: "Order Support",
      description: "Get help with your order from our support team",
      href: "/my-order/support",
      color: "bg-gray-500",
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-6">Customer Service</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight">
                My Order
              </h1>
              <p className="text-xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
                Everything you need to track, manage, and get support for your orders
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={service.href}>
                    <div className="group h-full bg-white border border-gray-200 hover:border-black transition-all duration-300 p-8">
                      <div className={`w-16 h-16 ${service.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-light mb-3 group-hover:tracking-wide transition-all">{service.title}</h3>
                      <p className="text-gray-600 font-light leading-relaxed mb-6">{service.description}</p>
                      <span className="inline-flex items-center gap-2 text-sm tracking-wider group-hover:gap-3 transition-all">
                        ACCESS NOW
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Help */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-8">Need Quick Help?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-2">Email Support</h3>
                <a href="mailto:support@nowiht.com" className="text-gray-600 hover:text-black transition-colors">
                  support@nowiht.com
                </a>
              </div>
              <div>
                <h3 className="font-medium mb-2">Returns</h3>
                <a href="mailto:return@nowiht.com" className="text-gray-600 hover:text-black transition-colors">
                  return@nowiht.com
                </a>
              </div>
              <div>
                <h3 className="font-medium mb-2">Order Status</h3>
                <Link href="/my-order/track" className="text-gray-600 hover:text-black transition-colors">
                  Track Your Order
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