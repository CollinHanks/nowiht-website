"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Video, MapPin, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function BookStylistPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    consultationType: "virtual",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Booking submitted:", formData);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="bg-white min-h-screen flex items-center justify-center px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-green-100 rounded-full">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-light tracking-wide mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Thank you for booking a consultation. We'll send you a confirmation
              email within 24 hours with all the details.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black text-white hover:bg-gray-900 transition-all text-sm tracking-wider"
              >
                <span>BACK TO HOME</span>
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-black hover:bg-black hover:text-white transition-all text-sm tracking-wider"
              >
                <span>CONTINUE SHOPPING</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="bg-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* HEADER */}
          <div className="mb-8">
            <Link
              href="/services/styling"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Personal Styling</span>
            </Link>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide mb-4">
              Book Your Consultation
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Schedule a complimentary 30-minute consultation with our expert stylists.
              Choose between a video call or in-person session.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FORM */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="bg-gray-50 p-6">
                  <h2 className="text-lg font-medium mb-4">Personal Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                        placeholder="Jane Doe"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                          placeholder="jane@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone (Optional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Type */}
                <div className="bg-gray-50 p-6">
                  <h2 className="text-lg font-medium mb-4">Consultation Type *</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="consultationType"
                        value="virtual"
                        checked={formData.consultationType === "virtual"}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="border-2 border-gray-300 peer-checked:border-black peer-checked:bg-black peer-checked:text-white p-4 transition-all">
                        <Video className="w-6 h-6 mb-2" />
                        <p className="font-medium mb-1">Virtual</p>
                        <p className="text-xs opacity-70">30-min video call</p>
                      </div>
                    </label>

                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="consultationType"
                        value="in-person"
                        checked={formData.consultationType === "in-person"}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="border-2 border-gray-300 peer-checked:border-black peer-checked:bg-black peer-checked:text-white p-4 transition-all">
                        <MapPin className="w-6 h-6 mb-2" />
                        <p className="font-medium mb-1">In-Person</p>
                        <p className="text-xs opacity-70">60-min boutique visit</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-gray-50 p-6">
                  <h2 className="text-lg font-medium mb-4">Preferred Schedule</h2>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="preferredDate" className="block text-sm font-medium mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium mb-2">
                        Preferred Time *
                      </label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                      >
                        <option value="">Select a time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Tell us about your style goals (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
                      placeholder="What are you looking for? Any specific occasions or preferences?"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-black text-white hover:bg-gray-900 transition-all font-medium tracking-wider"
                  >
                    BOOK CONSULTATION
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By booking, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
                </p>
              </form>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
              {/* What to Expect */}
              <div className="bg-gray-50 p-6">
                <h3 className="text-lg font-medium mb-4">What to Expect</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Personalized style assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Wardrobe recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Styling tips & tricks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Curated product selection</span>
                  </li>
                </ul>
              </div>

              {/* Need Help */}
              <div className="bg-black text-white p-6">
                <h3 className="text-lg font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Have questions about our styling services?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:text-gray-300 transition-colors"
                >
                  <span>Contact Us</span>
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