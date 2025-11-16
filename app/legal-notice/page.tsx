"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Building2, Scale, FileText, Mail, Phone, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function LegalNoticePage() {
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
              <span className="text-black font-medium">Legal Notice</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 mb-6">
              <Scale className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Legal Information</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
              Legal Notice
            </h1>
            <p className="text-lg text-gray-600">
              Company information and legal disclaimers for NOWIHT.
            </p>
          </div>

          {/* Company Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Company Information
            </h2>
            
            <div className="bg-gray-50 border border-gray-200 p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Company Name
                  </h3>
                  <p className="text-lg font-medium">NOWIHT LLC</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Registered Office
                    </h3>
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                      <div>
                        <p>123 Fashion Avenue</p>
                        <p>Los Angeles, CA 90001</p>
                        <p>United States</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href="mailto:legal@nowiht.com" className="hover:text-black underline">
                          legal@nowiht.com
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a href="tel:+18058022931" className="hover:text-black">
                          +1 (805) 802-2931
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-300">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Business Registration
                    </h3>
                    <p className="text-gray-700">EIN: 12-3456789</p>
                    <p className="text-gray-700">State: California</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      VAT/Tax Information
                    </h3>
                    <p className="text-gray-700">US Tax ID: 98-7654321</p>
                    <p className="text-gray-700">UK VAT: GB123456789</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Website Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Website Information
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold mb-2">Website Owner & Operator</h3>
                <p className="text-sm text-gray-700">
                  This website (www.nowiht.com) is owned and operated by NOWIHT LLC, a limited
                  liability company registered in the State of California, United States.
                </p>
              </div>

              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold mb-2">Editorial Responsibility</h3>
                <p className="text-sm text-gray-700">
                  NOWIHT LLC is responsible for all content published on this website, including
                  product information, images, text, and multimedia content.
                </p>
              </div>

              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold mb-2">Website Design & Development</h3>
                <p className="text-sm text-gray-700">
                  Website design, development, and maintenance: NOWIHT Digital Team
                </p>
              </div>
            </div>
          </section>

          {/* Copyright Notice */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Copyright Notice</h2>
            
            <div className="bg-blue-50 border border-blue-200 p-6">
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                © 2025 NOWIHT LLC. All rights reserved.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                All content on this website, including but not limited to text, graphics, logos,
                icons, images, audio clips, digital downloads, data compilations, and software,
                is the property of NOWIHT LLC or its content suppliers and is protected by
                United States and international copyright laws.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                The compilation of all content on this site is the exclusive property of NOWIHT LLC
                and is protected by U.S. and international copyright laws. Any reproduction,
                modification, distribution, transmission, republication, display, or performance
                of the content on this site is strictly prohibited without prior written consent
                from NOWIHT LLC.
              </p>
            </div>
          </section>

          {/* Trademark Notice */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Trademark Notice</h2>
            
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                NOWIHT, the NOWIHT logo, and all related names, logos, product and service names,
                designs, and slogans are trademarks of NOWIHT LLC or its affiliates. You may not
                use such marks without the prior written permission of NOWIHT LLC.
              </p>
              <p>
                All other names, logos, product and service names, designs, and slogans on this
                website are the trademarks of their respective owners.
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Disclaimer</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6">
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  <strong>No Warranties:</strong> This website and its content are provided "as is"
                  without any representations or warranties, express or implied. NOWIHT LLC makes no
                  representations or warranties in relation to this website or the information and
                  materials provided on this website.
                </p>
                <p>
                  <strong>Accuracy:</strong> While we strive to ensure that the information on this
                  website is accurate and up-to-date, we make no guarantees about the completeness,
                  reliability, or accuracy of this information.
                </p>
                <p>
                  <strong>Limitation of Liability:</strong> NOWIHT LLC will not be liable for any
                  direct, indirect, special, incidental, or consequential damages arising out of or
                  in connection with your use of this website.
                </p>
              </div>
            </div>
          </section>

          {/* External Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">External Links</h2>
            
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              This website may contain links to external websites that are not operated by NOWIHT LLC.
              We have no control over the content and practices of these sites and cannot accept
              responsibility or liability for their respective privacy policies or content.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              The inclusion of any links does not necessarily imply a recommendation or endorse the
              views expressed within them.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Dispute Resolution</h2>
            
            <div className="space-y-4 text-sm text-gray-700">
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-semibold mb-2">Governing Law</h3>
                <p>
                  These legal terms shall be governed by and construed in accordance with the laws
                  of the State of California, United States, without regard to its conflict of law
                  provisions.
                </p>
              </div>

              <div className="border-l-4 border-black pl-4">
                <h3 className="font-semibold mb-2">Jurisdiction</h3>
                <p>
                  Any disputes arising out of or relating to this website or these terms shall be
                  subject to the exclusive jurisdiction of the courts located in Los Angeles County,
                  California.
                </p>
              </div>

              <div className="border-l-4 border-black pl-4">
                <h3 className="font-semibold mb-2">Alternative Dispute Resolution</h3>
                <p>
                  Before initiating any legal proceedings, parties agree to attempt to resolve
                  disputes through good faith negotiations. If negotiations fail, parties may pursue
                  mediation or arbitration.
                </p>
              </div>
            </div>
          </section>

          {/* Contact for Legal Matters */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Contact for Legal Matters</h2>
            
            <div className="bg-gray-50 border border-gray-200 p-6">
              <p className="text-sm text-gray-700 mb-4">
                For any legal inquiries, copyright concerns, or to request permission to use our
                content, please contact our legal department:
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">Email:</span>
                  <a href="mailto:legal@nowiht.com" className="underline hover:text-black">
                    legal@nowiht.com
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Mail:</span>
                    <p>NOWIHT Legal Department</p>
                    <p>123 Fashion Avenue</p>
                    <p>Los Angeles, CA 90001, USA</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Last updated: <span className="font-medium text-black">November 4, 2025</span>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Link
                href="/terms"
                className="text-center py-3 border border-gray-300 hover:border-black transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="text-center py-3 border border-gray-300 hover:border-black transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/shipping"
                className="text-center py-3 border border-gray-300 hover:border-black transition-colors"
              >
                Shipping Info
              </Link>
              <Link
                href="/contact"
                className="text-center py-3 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}