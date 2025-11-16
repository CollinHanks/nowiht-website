"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function TermsConditionsPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "introduction";

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 150) {
          current = section.getAttribute("id") || "introduction";
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "account", title: "Account Registration" },
    { id: "products", title: "Products & Services" },
    { id: "pricing", title: "Pricing & Payment" },
    { id: "shipping", title: "Shipping & Delivery" },
    { id: "returns", title: "Returns & Refunds" },
    { id: "intellectual", title: "Intellectual Property" },
    { id: "user-conduct", title: "User Conduct" },
    { id: "limitation", title: "Limitation of Liability" },
    { id: "privacy", title: "Privacy & Data Protection" },
    { id: "modifications", title: "Modifications to Terms" },
    { id: "governing-law", title: "Governing Law" },
    { id: "contact", title: "Contact Information" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
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

      <main className="pt-20 md:pt-24 min-h-screen bg-white pb-16">
        {/* Breadcrumb */}
        <div className="border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-black transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-black font-medium">Terms & Conditions</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Contents</h2>
                </div>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm transition-colors",
                        activeSection === section.id
                          ? "bg-black text-white font-medium"
                          : "text-gray-600 hover:text-black hover:bg-gray-50"
                      )}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
                  Terms & Conditions
                </h1>
                <p className="text-gray-600">
                  Last updated: <span className="font-medium text-black">November 4, 2025</span>
                </p>
              </div>

              {/* Content Sections */}
              <div className="prose prose-lg max-w-none space-y-12">
                {/* Introduction */}
                <section id="introduction" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to NOWIHT. These Terms and Conditions ("Terms") govern your use of our website
                    and the purchase of products from NOWIHT. By accessing or using our website, you agree
                    to be bound by these Terms.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Please read these Terms carefully before using our services. If you do not agree with
                    any part of these Terms, you must not use our website or purchase our products.
                  </p>
                </section>

                {/* Acceptance of Terms */}
                <section id="acceptance" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">2. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By creating an account, placing an order, or otherwise using our services, you
                    acknowledge that you have read, understood, and agree to be bound by these Terms,
                    as well as our Privacy Policy.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You must be at least 18 years old to use our services. By using our website, you
                    represent and warrant that you are of legal age to form a binding contract.
                  </p>
                </section>

                {/* Account Registration */}
                <section id="account" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To access certain features of our website, you may be required to create an account.
                    You agree to provide accurate, current, and complete information during registration.
                  </p>
                  <div className="bg-gray-50 border-l-4 border-black p-4 my-4">
                    <p className="text-sm font-medium mb-2">Your Responsibilities:</p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Maintain the confidentiality of your account credentials</li>
                      <li>Notify us immediately of any unauthorized use</li>
                      <li>Update your information to keep it accurate and current</li>
                      <li>Accept responsibility for all activities under your account</li>
                    </ul>
                  </div>
                </section>

                {/* Products & Services */}
                <section id="products" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">4. Products & Services</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    All products displayed on our website are subject to availability. We reserve the
                    right to discontinue any product at any time without prior notice.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We make every effort to display the colors and images of our products accurately.
                    However, we cannot guarantee that your device's display will accurately reflect
                    the actual product colors.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Product descriptions, specifications, and other content on our website are provided
                    for general information purposes and may be subject to change without notice.
                  </p>
                </section>

                {/* Pricing & Payment */}
                <section id="pricing" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">5. Pricing & Payment</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    All prices are displayed in USD and are subject to change without notice. We reserve
                    the right to modify prices at any time prior to accepting an order.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Payment must be received in full before orders are processed. We accept major credit
                    cards, debit cards, and other payment methods as indicated at checkout.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You agree to provide current, complete, and accurate purchase and account information
                    for all purchases made on our website.
                  </p>
                </section>

                {/* Shipping & Delivery */}
                <section id="shipping" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">6. Shipping & Delivery</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We ship to addresses within the United States and select international locations.
                    Shipping costs and estimated delivery times are provided at checkout.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Delivery times are estimates and not guaranteed. We are not responsible for delays
                    caused by shipping carriers or circumstances beyond our control.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Risk of loss and title for items purchased pass to you upon delivery to the carrier.
                    For detailed shipping information, please see our{" "}
                    <Link href="/shipping" className="underline hover:text-black">
                      Shipping Policy
                    </Link>
                    .
                  </p>
                </section>

                {/* Returns & Refunds */}
                <section id="returns" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">7. Returns & Refunds</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We want you to be completely satisfied with your purchase. If you are not satisfied,
                    you may return eligible items within 30 days of receipt for a refund or exchange.
                  </p>
                  <div className="bg-gray-50 border border-gray-200 p-4 my-4">
                    <p className="text-sm font-medium mb-2">Return Conditions:</p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Items must be unworn, unwashed, and with original tags attached</li>
                      <li>Items must be in their original packaging</li>
                      <li>Proof of purchase is required</li>
                      <li>Final sale items cannot be returned</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    For complete return instructions, please visit our{" "}
                    <Link href="/returns" className="underline hover:text-black">
                      Return Policy
                    </Link>{" "}
                    page.
                  </p>
                </section>

                {/* Intellectual Property */}
                <section id="intellectual" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    All content on this website, including text, graphics, logos, images, and software,
                    is the property of NOWIHT and is protected by copyright, trademark, and other
                    intellectual property laws.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You may not reproduce, distribute, modify, or create derivative works from any
                    content on this website without our express written permission.
                  </p>
                </section>

                {/* User Conduct */}
                <section id="user-conduct" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">9. User Conduct</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You agree not to use our website for any unlawful purpose or in any way that could
                    damage, disable, or impair our services.
                  </p>
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 my-4">
                    <p className="text-sm font-medium mb-2 text-red-900">Prohibited Activities:</p>
                    <ul className="text-sm text-red-900 space-y-1 list-disc list-inside">
                      <li>Attempting to gain unauthorized access to our systems</li>
                      <li>Transmitting viruses or malicious code</li>
                      <li>Collecting information about other users</li>
                      <li>Impersonating another person or entity</li>
                      <li>Using the website for fraudulent purposes</li>
                    </ul>
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section id="limitation" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To the fullest extent permitted by law, NOWIHT shall not be liable for any indirect,
                    incidental, special, consequential, or punitive damages arising out of or relating
                    to your use of our website or products.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Our total liability to you for any damages shall not exceed the amount you paid for
                    the product(s) giving rise to the claim.
                  </p>
                </section>

                {/* Privacy & Data Protection */}
                <section id="privacy" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">11. Privacy & Data Protection</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Your privacy is important to us. Our collection and use of personal information is
                    governed by our{" "}
                    <Link href="/privacy-policy" className="underline hover:text-black">
                      Privacy Policy
                    </Link>
                    , which is incorporated into these Terms by reference.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By using our website, you consent to the collection, use, and disclosure of your
                    information as described in our Privacy Policy.
                  </p>
                </section>

                {/* Modifications to Terms */}
                <section id="modifications" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">12. Modifications to Terms</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We reserve the right to modify these Terms at any time. Changes will be effective
                    immediately upon posting to our website. Your continued use of our website after
                    changes are posted constitutes your acceptance of the modified Terms.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We encourage you to review these Terms periodically to stay informed of any updates.
                  </p>
                </section>

                {/* Governing Law */}
                <section id="governing-law" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These Terms shall be governed by and construed in accordance with the laws of the
                    State of California, United States, without regard to its conflict of law provisions.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Any disputes arising out of or relating to these Terms or your use of our website
                    shall be resolved exclusively in the state or federal courts located in California.
                  </p>
                </section>

                {/* Contact Information */}
                <section id="contact" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about these Terms, please contact us:
                  </p>
                  <div className="bg-gray-50 border border-gray-200 p-6">
                    <p className="font-medium mb-3">NOWIHT Customer Service</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>Email: legal@nowiht.com</p>
                      <p>Phone: +1 (805) 802-2931</p>
                      <p>Address: 123 Fashion Avenue, Los Angeles, CA 90001</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/privacy-policy"
                    className="flex-1 px-6 py-3 border-2 border-black text-black text-center font-medium tracking-wider hover:bg-black hover:text-white transition-all"
                  >
                    VIEW PRIVACY POLICY
                  </Link>
                  <Link
                    href="/contact"
                    className="flex-1 px-6 py-3 bg-black text-white text-center font-medium tracking-wider hover:bg-gray-800 transition-all"
                  >
                    CONTACT US
                  </Link>
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