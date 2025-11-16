"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RotateCcw, Upload, CheckCircle, AlertCircle, ArrowLeft, FileText, Package } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ReturnRefundPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    orderNumber: "",
    email: "",
    reason: "",
    itemDescription: "",
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
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
                <RotateCcw className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight">
                Return & Refund
              </h1>
              <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                Submit a return request and track your refund status. We're committed to making returns simple and hassle-free.
              </p>
            </motion.div>
          </div>
        </section>

        {!submitted ? (
          <>
            {/* Return Form */}
            <section className="py-12 px-6">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-zinc-50 border border-gray-200 p-8 md:p-12"
                >
                  <h2 className="text-2xl font-light mb-8">Return Request Form</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Number */}
                    <div>
                      <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">
                        Order Number *
                      </label>
                      <input
                        type="text"
                        id="orderNumber"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        placeholder="e.g., NW123456789"
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Return Reason */}
                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium mb-2">
                        Reason for Return *
                      </label>
                      <select
                        id="reason"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                        required
                      >
                        <option value="">Select a reason</option>
                        <option value="size">Wrong Size</option>
                        <option value="quality">Quality Issue</option>
                        <option value="not-as-described">Not as Described</option>
                        <option value="damaged">Damaged in Shipping</option>
                        <option value="changed-mind">Changed Mind</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Item Description */}
                    <div>
                      <label htmlFor="itemDescription" className="block text-sm font-medium mb-2">
                        Item(s) to Return *
                      </label>
                      <input
                        type="text"
                        id="itemDescription"
                        value={formData.itemDescription}
                        onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                        placeholder="e.g., Black Polo Shirt - Size M"
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Additional Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Additional Details
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please provide any additional details about your return..."
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Upload Photos (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 hover:border-black transition-colors p-8 text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="fileUpload"
                        />
                        <label htmlFor="fileUpload" className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-2">
                            Click to upload photos of the item
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 10MB each
                          </p>
                        </label>
                        {files.length > 0 && (
                          <div className="mt-4 text-left">
                            <p className="text-sm font-medium mb-2">Selected files:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {files.map((file, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  {file.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 text-sm tracking-widest font-medium"
                    >
                      {isSubmitting ? "SUBMITTING..." : "SUBMIT RETURN REQUEST"}
                    </button>
                  </form>
                </motion.div>
              </div>
            </section>

            {/* Return Policy */}
            <section className="py-20 px-6 bg-zinc-50">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-light mb-12 text-center">Return Policy</h2>
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-medium mb-4">30-Day Return Window</h3>
                      <p className="text-gray-700 leading-relaxed">
                        You have 30 days from the date of delivery to initiate a return. Items must be unworn, unwashed, and in their original condition with all tags attached.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-4">Eligibility</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Items must be in original, unused condition</li>
                        <li>• All tags and labels must be intact</li>
                        <li>• Items must be in original packaging</li>
                        <li>• Swimwear and underwear must have hygiene seals intact</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-4">Refund Process</h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Once we receive and inspect your return, we'll process your refund within 5-7 business days. Refunds will be issued to your original payment method.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        You'll receive an email confirmation once your refund has been processed. Please allow 5-10 business days for the refund to appear in your account.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-4">Return Shipping</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Return shipping costs are the responsibility of the customer unless the return is due to our error (wrong item, defective product, etc.). We recommend using a trackable shipping service.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-4">Exchanges</h3>
                      <p className="text-gray-700 leading-relaxed">
                        We currently don't offer direct exchanges. If you need a different size or color, please return the original item for a refund and place a new order.
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-medium mb-2">Non-Returnable Items</h4>
                          <p className="text-sm text-gray-700">
                            Sale items, gift cards, and items marked as "Final Sale" are not eligible for return or exchange.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Success Message */
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-green-50 border border-green-200 p-12"
              >
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                <h2 className="text-3xl font-light mb-4">Return Request Submitted</h2>
                <p className="text-lg text-gray-700 mb-8">
                  Your return request has been received. You'll receive a confirmation email at <strong>{formData.email}</strong> with further instructions within 24 hours.
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Reference Number: <strong>RET-{Date.now().toString().slice(-8)}</strong>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/my-order"
                      className="px-8 py-3 border border-gray-300 hover:border-black transition-all text-sm tracking-wider"
                    >
                      BACK TO MY ORDER
                    </Link>
                    <Link
                      href="/my-order/track"
                      className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all text-sm tracking-wider"
                    >
                      TRACK RETURN STATUS
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="py-20 px-6 border-t">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-light mb-6">Need Help with Your Return?</h3>
            <p className="text-gray-600 mb-8">
              Our returns team is here to assist you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="mailto:return@nowiht.com"
                className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all text-sm tracking-wider"
              >
                EMAIL RETURNS TEAM
              </a>
              <Link
                href="/my-order/support"
                className="px-8 py-3 border border-gray-300 hover:border-black transition-all text-sm tracking-wider"
              >
                CONTACT SUPPORT
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}