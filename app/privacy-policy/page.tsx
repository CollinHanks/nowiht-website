"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Shield, Lock, Eye, Database, Globe } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function PrivacyPolicyPage() {
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
    { id: "introduction", title: "Introduction", icon: Shield },
    { id: "information", title: "Information We Collect", icon: Database },
    { id: "usage", title: "How We Use Your Information", icon: Eye },
    { id: "sharing", title: "Information Sharing", icon: Globe },
    { id: "cookies", title: "Cookies & Tracking", icon: Lock },
    { id: "security", title: "Data Security", icon: Shield },
    { id: "rights", title: "Your Rights" },
    { id: "children", title: "Children's Privacy" },
    { id: "international", title: "International Transfers" },
    { id: "retention", title: "Data Retention" },
    { id: "third-party", title: "Third-Party Links" },
    { id: "changes", title: "Policy Changes" },
    { id: "contact", title: "Contact Us" },
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
              <span className="text-black font-medium">Privacy Policy</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Contents</h2>
                </div>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2",
                          activeSection === section.id
                            ? "bg-black text-white font-medium"
                            : "text-gray-600 hover:text-black hover:bg-gray-50"
                        )}
                      >
                        {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span className="truncate">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 mb-6">
                  <Lock className="w-4 h-4 text-green-700" />
                  <span className="text-sm font-medium text-green-900">GDPR Compliant</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
                  Privacy Policy
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
                    At NOWIHT, we take your privacy seriously. This Privacy Policy explains how we collect,
                    use, disclose, and safeguard your information when you visit our website or make a purchase.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We are committed to protecting your personal information and your right to privacy. If you
                    have any questions or concerns about our policy or our practices, please contact us.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                    <p className="text-sm font-medium text-blue-900">
                      By using our website, you consent to our Privacy Policy and agree to its terms.
                    </p>
                  </div>
                </section>

                {/* Information We Collect */}
                <section id="information" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect information that you provide directly to us, information we obtain automatically
                    when you use our services, and information from third-party sources.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Personal Information You Provide</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="font-medium min-w-[120px]">Account Data:</span>
                          <span>Name, email address, password, phone number</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium min-w-[120px]">Purchase Data:</span>
                          <span>Billing address, shipping address, payment information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium min-w-[120px]">Profile Data:</span>
                          <span>Size preferences, style preferences, wishlist items</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium min-w-[120px]">Communication:</span>
                          <span>Customer service inquiries, product reviews, survey responses</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Automatically Collected Information</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="font-medium min-w-[120px]">Device Data:</span>
                          <span>IP address, browser type, operating system, device identifiers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium min-w-[120px]">Usage Data:</span>
                          <span>Pages viewed, time spent, clicks, search queries, referral URLs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium min-w-[120px]">Location Data:</span>
                          <span>General geographic location based on IP address</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* How We Use Your Information */}
                <section id="usage" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use the information we collect for various purposes, including:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border border-gray-200 p-4">
                      <h4 className="font-semibold mb-2">Order Processing</h4>
                      <p className="text-sm text-gray-700">
                        Process and fulfill your orders, manage payments, and provide customer support
                      </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4">
                      <h4 className="font-semibold mb-2">Communication</h4>
                      <p className="text-sm text-gray-700">
                        Send order confirmations, shipping updates, and respond to inquiries
                      </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4">
                      <h4 className="font-semibold mb-2">Marketing</h4>
                      <p className="text-sm text-gray-700">
                        Send promotional emails, newsletters, and personalized recommendations (with consent)
                      </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4">
                      <h4 className="font-semibold mb-2">Analytics</h4>
                      <p className="text-sm text-gray-700">
                        Analyze website usage, improve our services, and optimize user experience
                      </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4">
                      <h4 className="font-semibold mb-2">Security</h4>
                      <p className="text-sm text-gray-700">
                        Detect and prevent fraud, protect against malicious activity
                      </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4">
                      <h4 className="font-semibold mb-2">Legal Compliance</h4>
                      <p className="text-sm text-gray-700">
                        Comply with legal obligations and enforce our terms and policies
                      </p>
                    </div>
                  </div>
                </section>

                {/* Information Sharing */}
                <section id="sharing" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We do not sell your personal information. We may share your information with:
                  </p>
                  <div className="space-y-4">
                    <div className="border-l-4 border-gray-300 pl-4">
                      <h4 className="font-semibold mb-1">Service Providers</h4>
                      <p className="text-sm text-gray-700">
                        Payment processors, shipping carriers, email service providers, analytics platforms
                      </p>
                    </div>
                    <div className="border-l-4 border-gray-300 pl-4">
                      <h4 className="font-semibold mb-1">Business Transfers</h4>
                      <p className="text-sm text-gray-700">
                        In connection with mergers, acquisitions, or sale of assets
                      </p>
                    </div>
                    <div className="border-l-4 border-gray-300 pl-4">
                      <h4 className="font-semibold mb-1">Legal Requirements</h4>
                      <p className="text-sm text-gray-700">
                        When required by law or to protect our rights and safety
                      </p>
                    </div>
                    <div className="border-l-4 border-gray-300 pl-4">
                      <h4 className="font-semibold mb-1">With Your Consent</h4>
                      <p className="text-sm text-gray-700">
                        When you explicitly agree to share your information
                      </p>
                    </div>
                  </div>
                </section>

                {/* Cookies & Tracking */}
                <section id="cookies" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">5. Cookies & Tracking Technologies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use cookies and similar tracking technologies to enhance your browsing experience,
                    analyze site traffic, and understand user preferences.
                  </p>
                  <div className="bg-gray-50 border border-gray-200 p-6 mb-4">
                    <h4 className="font-semibold mb-3">Types of Cookies We Use:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                      <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
                      <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                      <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    You can control cookie preferences through your browser settings. Note that disabling
                    cookies may affect website functionality.
                  </p>
                </section>

                {/* Data Security */}
                <section id="security" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We implement industry-standard security measures to protect your personal information
                    from unauthorized access, disclosure, alteration, or destruction.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200">
                      <Lock className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">SSL Encryption</h4>
                        <p className="text-sm text-green-800">All data transmitted is encrypted</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200">
                      <Shield className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Secure Servers</h4>
                        <p className="text-sm text-green-800">Data stored on protected servers</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    While we strive to protect your information, no method of transmission over the internet
                    is 100% secure. We cannot guarantee absolute security.
                  </p>
                </section>

                {/* Your Rights */}
                <section id="rights" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">7. Your Privacy Rights</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <div className="bg-blue-50 border border-blue-200 p-6">
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="font-medium min-w-[100px]">Access:</span>
                        <span>Request a copy of the personal information we hold about you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium min-w-[100px]">Correction:</span>
                        <span>Request correction of inaccurate or incomplete information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium min-w-[100px]">Deletion:</span>
                        <span>Request deletion of your personal information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium min-w-[100px]">Portability:</span>
                        <span>Request a copy of your data in a portable format</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium min-w-[100px]">Opt-out:</span>
                        <span>Unsubscribe from marketing communications at any time</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    To exercise these rights, please contact us at{" "}
                    <a href="mailto:privacy@nowiht.com" className="underline hover:text-black">
                      privacy@nowiht.com
                    </a>
                  </p>
                </section>

                {/* Children's Privacy */}
                <section id="children" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our website is not intended for children under 18 years of age. We do not knowingly
                    collect personal information from children.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    If you believe we have collected information from a child, please contact us immediately
                    so we can delete the information.
                  </p>
                </section>

                {/* International Transfers */}
                <section id="international" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Your information may be transferred to and processed in countries other than your own.
                    These countries may have different data protection laws.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We ensure appropriate safeguards are in place to protect your information in accordance
                    with this Privacy Policy.
                  </p>
                </section>

                {/* Data Retention */}
                <section id="retention" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">10. Data Retention</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We retain your personal information only for as long as necessary to fulfill the purposes
                    outlined in this Privacy Policy, unless a longer retention period is required by law.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    When we no longer need your information, we will securely delete or anonymize it.
                  </p>
                </section>

                {/* Third-Party Links */}
                <section id="third-party" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">11. Third-Party Links</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our website may contain links to third-party websites. We are not responsible for the
                    privacy practices of these external sites.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We encourage you to review the privacy policies of any third-party sites you visit.
                  </p>
                </section>

                {/* Changes to Policy */}
                <section id="changes" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">12. Changes to This Policy</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may update this Privacy Policy from time to time. We will notify you of significant
                    changes by posting a notice on our website or sending you an email.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Your continued use of our services after changes are posted constitutes acceptance of
                    the updated policy.
                  </p>
                </section>

                {/* Contact */}
                <section id="contact" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have questions or concerns about this Privacy Policy, please contact us:
                  </p>
                  <div className="bg-gray-50 border border-gray-200 p-6">
                    <p className="font-medium mb-3">NOWIHT Privacy Team</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>Email: privacy@nowiht.com</p>
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
                    href="/terms"
                    className="flex-1 px-6 py-3 border-2 border-black text-black text-center font-medium tracking-wider hover:bg-black hover:text-white transition-all"
                  >
                    VIEW TERMS & CONDITIONS
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