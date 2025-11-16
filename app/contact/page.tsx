"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FAQItem from "@/components/faq/FAQItem";
import { CONTACT_FAQS, CONTACT_INFO } from "@/lib/contactData";

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Thank you for contacting us! We'll respond within 24 hours.");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

      <main className="bg-white pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-light tracking-wide mb-4 md:mb-6">
              Contact Us
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you. Feel free to reach us via email or phone for immediate assistance.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6 md:mb-8">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-black text-white font-medium tracking-wider hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse">Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>SEND</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6 md:mb-8">
                    Get In Touch
                  </h2>
                  <p className="text-base text-gray-600 mb-8 leading-relaxed">
                    We're here to help with any questions about our products, orders, or general inquiries.
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-50 flex-shrink-0">
                      <Mail className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">E-mail</h3>
                      <div className="space-y-1.5 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">General Inquiries:</span>{" "}
                          <a href={`mailto:${CONTACT_INFO.emails.general}`} className="hover:text-black transition-colors">
                            {CONTACT_INFO.emails.general}
                          </a>
                        </p>
                        <p>
                          <span className="font-medium">Order Tracking:</span>{" "}
                          <a href={`mailto:${CONTACT_INFO.emails.orders}`} className="hover:text-black transition-colors">
                            {CONTACT_INFO.emails.orders}
                          </a>
                        </p>
                        <p>
                          <span className="font-medium">Returns:</span>{" "}
                          <a href={`mailto:${CONTACT_INFO.emails.returns}`} className="hover:text-black transition-colors">
                            {CONTACT_INFO.emails.returns}
                          </a>
                        </p>
                        <p>
                          <span className="font-medium">Complaints & Suggestions:</span>{" "}
                          <a href={`mailto:${CONTACT_INFO.emails.feedback}`} className="hover:text-black transition-colors">
                            {CONTACT_INFO.emails.feedback}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-50 flex-shrink-0">
                      <Phone className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">Phone & WhatsApp</h3>
                      <div className="space-y-1.5 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Number:</span>{" "}
                          <a href={`tel:${CONTACT_INFO.phone.number}`} className="hover:text-black transition-colors">
                            {CONTACT_INFO.phone.number}
                          </a>
                        </p>
                        <p>
                          <span className="font-medium">WhatsApp:</span> Available on the same number for quick communication.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Offices */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-50 flex-shrink-0">
                      <MapPin className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-3">Head Offices</h3>
                      <div className="space-y-4 text-sm text-gray-600">
                        <div>
                          <p className="font-medium text-black mb-1">USA Office:</p>
                          <p>{CONTACT_INFO.offices.usa.address}</p>
                          <p>{CONTACT_INFO.offices.usa.city}</p>
                          <p>{CONTACT_INFO.offices.usa.country}</p>
                        </div>
                        <div>
                          <p className="font-medium text-black mb-1">Turkey Office:</p>
                          <p>{CONTACT_INFO.offices.turkey.address}</p>
                          <p>Postal Code: {CONTACT_INFO.offices.turkey.postalCode}</p>
                          <p>{CONTACT_INFO.offices.turkey.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-12">
              <MessageSquare className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-black" />
              <h2 className="text-2xl md:text-4xl font-light tracking-wide mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Quick answers to common questions about contacting us
              </p>
            </div>

            <div className="bg-white border border-gray-200">
              {CONTACT_FAQS.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  defaultOpen={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}