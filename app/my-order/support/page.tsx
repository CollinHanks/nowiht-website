"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, CheckCircle, Mail, ArrowRight, ArrowLeft, HelpCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function OrderSupportPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    orderNumber: "",
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
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

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. International orders typically arrive within 7-14 business days.",
    },
    {
      question: "Can I change or cancel my order?",
      answer: "You can modify or cancel your order within 2 hours of placement. After this window, please contact our support team for assistance.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer 30-day returns on unworn, unwashed items with original tags attached. Visit our Return & Refund page to submit a return request.",
    },
    {
      question: "How do I track my order?",
      answer: "You'll receive a tracking number via email once your order ships. You can also track your order anytime using our Track Order page.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination.",
    },
  ];

  const supportOptions = [
    {
      title: "Track Your Order",
      description: "Real-time delivery updates",
      href: "/my-order/track",
    },
    {
      title: "Return & Refund",
      description: "Submit a return request",
      href: "/my-order/return",
    },
    {
      title: "Order History",
      description: "View past orders",
      href: "/my-order/check",
    },
    {
      title: "FAQ",
      description: "Common questions",
      href: "/faq",
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Link href="/my-order" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to My Order</span>
            </Link>
          </div>
        </div>

        {!submitted ? (
          <>
            {/* Hero */}
            <section className="py-24 px-6">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">Customer Support</p>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight tracking-tight">
                    How Can We Help?
                  </h1>
                  <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                    Our support team is here to assist you with any questions or concerns
                  </p>
                </motion.div>
              </div>
            </section>

            {/* Quick Links */}
            <section className="pb-20 px-6">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-4 gap-4">
                  {supportOptions.map((option, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link href={option.href}>
                        <div className="group border border-gray-200 p-6 hover:border-black transition-all duration-300 h-full">
                          <h3 className="text-lg font-medium mb-2 group-hover:tracking-wide transition-all">{option.title}</h3>
                          <p className="text-sm text-gray-600 font-light mb-4">{option.description}</p>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Support Form */}
            <section className="pb-32 px-6">
              <div className="max-w-3xl mx-auto">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-light mb-4">Submit a Request</h2>
                  <p className="text-gray-600 font-light">We typically respond within 24 hours</p>
                </div>

                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-3 tracking-wide">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-6 py-4 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-3 tracking-wide">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full px-6 py-4 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium mb-3 tracking-wide">
                      Order Number <span className="text-gray-400 font-light">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="NW123456789"
                      className="w-full px-6 py-4 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-3 tracking-wide">
                      Issue Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-6 py-4 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="order-status">Order Status</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="payment">Payment Issues</option>
                      <option value="product">Product Questions</option>
                      <option value="technical">Technical Issues</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-3 tracking-wide">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief description"
                      className="w-full px-6 py-4 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-3 tracking-wide">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide as much detail as possible..."
                      rows={6}
                      className="w-full px-6 py-4 border border-gray-200 focus:border-black focus:outline-none transition-colors resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-5 hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-300 text-sm tracking-[0.2em] font-medium flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? (
                      <span>SUBMITTING...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>SUBMIT REQUEST</span>
                      </>
                    )}
                  </button>
                </motion.form>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6 bg-zinc-50">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-light mb-12 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <motion.details
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-white border border-gray-200 p-8 hover:border-black transition-colors"
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <span className="text-lg font-light">{faq.question}</span>
                        <HelpCircle className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                      </summary>
                      <p className="mt-6 text-gray-600 leading-relaxed font-light">{faq.answer}</p>
                    </motion.details>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <p className="text-gray-600 mb-4 font-light">Can't find what you're looking for?</p>
                  <Link href="/faq" className="inline-flex items-center gap-2 text-black hover:underline font-medium">
                    <span>View All FAQs</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Success Message */
          <section className="py-32 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="py-16"
              >
                <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-light mb-6">Request Received</h2>
                <p className="text-lg text-gray-600 mb-12 font-light">
                  Thank you for contacting us. We'll respond to <strong>{formData.email}</strong> within 24 hours.
                </p>
                <div className="space-y-4 mb-12">
                  <p className="text-sm text-gray-500">
                    Reference: <strong>SUP-{Date.now().toString().slice(-8)}</strong>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="flex-1 border border-gray-200 py-4 hover:border-black transition-all text-sm tracking-wider font-medium"
                  >
                    NEW REQUEST
                  </button>
                  <Link
                    href="/my-order"
                    className="flex-1 bg-black text-white py-4 hover:bg-gray-800 transition-all text-center text-sm tracking-wider font-medium"
                  >
                    MY ORDER
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Contact Section - EMAIL ONLY */}
        <section className="py-24 px-6 border-t">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-6">Direct Email Support</h2>
            <p className="text-gray-600 mb-12 font-light max-w-2xl mx-auto">
              For urgent matters, you can reach our support team directly via email
            </p>
            <div className="max-w-md mx-auto">
              <div className="bg-zinc-50 border border-gray-200 p-8">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-medium mb-3">Email Us</h3>
                <a
                  href="mailto:support@nowiht.com"
                  className="text-lg text-black hover:underline font-medium"
                >
                  support@nowiht.com
                </a>
                <p className="text-sm text-gray-500 mt-4 font-light">Response time: Within 24 hours</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}