"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Globe
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function ShippingInformationPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "overview";

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 150) {
          current = section.getAttribute("id") || "overview";
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { id: "overview", title: "Overview", icon: Truck },
    { id: "rates", title: "Shipping Rates", icon: DollarSign },
    { id: "delivery", title: "Delivery Times", icon: Clock },
    { id: "international", title: "International Shipping", icon: Globe },
    { id: "tracking", title: "Order Tracking", icon: Package },
    { id: "restrictions", title: "Shipping Restrictions", icon: AlertCircle },
    { id: "customs", title: "Customs & Duties", icon: MapPin },
    { id: "faq", title: "Shipping FAQ", icon: CheckCircle2 },
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
              <span className="text-black font-medium">Shipping Information</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="w-5 h-5" />
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
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Quick Contact */}
                <div className="mt-8 p-4 bg-gray-50 border border-gray-200">
                  <p className="text-sm font-medium mb-2">Need Help?</p>
                  <p className="text-xs text-gray-600 mb-3">
                    Contact our shipping support team
                  </p>
                  <Link
                    href="/contact"
                    className="block w-full px-4 py-2 bg-black text-white text-center text-xs font-medium hover:bg-gray-800 transition-colors"
                  >
                    CONTACT US
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
                  Shipping Information
                </h1>
                <p className="text-lg text-gray-600">
                  Everything you need to know about NOWIHT shipping, delivery times, and rates.
                </p>
              </div>

              {/* Overview */}
              <section id="overview" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Shipping Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 p-6 text-center">
                    <Truck className="w-8 h-8 mx-auto mb-3 text-green-700" />
                    <h3 className="font-semibold mb-2">Free Shipping</h3>
                    <p className="text-sm text-gray-700">On US orders over $100</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-6 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-3 text-blue-700" />
                    <h3 className="font-semibold mb-2">Fast Delivery</h3>
                    <p className="text-sm text-gray-700">2-4 days (US), 5-8 days (UK)</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-6 text-center">
                    <Globe className="w-8 h-8 mx-auto mb-3 text-purple-700" />
                    <h3 className="font-semibold mb-2">US, UK & EU</h3>
                    <p className="text-sm text-gray-700">Ships internationally</p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  At NOWIHT, we partner with trusted carriers to ensure your order arrives safely and on time.
                  All orders are carefully packaged in our signature sustainable packaging.
                </p>

                <div className="bg-gray-50 border-l-4 border-black p-4">
                  <p className="text-sm font-medium mb-2">Order Processing Time</p>
                  <p className="text-sm text-gray-700">
                    Orders placed before 2 PM EST Monday-Friday are processed the same day.
                    Orders placed after 2 PM or on weekends are processed the next business day.
                  </p>
                </div>
              </section>

              {/* Shipping Rates */}
              <section id="rates" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Shipping Rates</h2>
                
                {/* United States */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🇺🇸 United States
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                            Shipping Method
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                            Delivery Time
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                            Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium">Standard Shipping</div>
                            <div className="text-xs text-gray-600">USPS / UPS Ground</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            2-4 business days
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-semibold">$10.00</div>
                            <div className="text-xs text-green-600">FREE over $100</div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium">Express Shipping</div>
                            <div className="text-xs text-gray-600">UPS 2-Day Air</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            1-2 business days
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold">
                            $15.00
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* United Kingdom */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🇬🇧 United Kingdom
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                            Shipping Method
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                            Delivery Time
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                            Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium">Standard International</div>
                            <div className="text-xs text-gray-600">Royal Mail / DHL</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            5-8 business days
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-semibold">$25.00</div>
                            <div className="text-xs text-green-600">FREE over $150</div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium">Express International</div>
                            <div className="text-xs text-gray-600">DHL Express</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            2-4 business days
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold">
                            $45.00
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Europe */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🇪🇺 Europe (EU Countries)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                            Shipping Method
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                            Delivery Time
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                            Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium">Standard International</div>
                            <div className="text-xs text-gray-600">DHL / FedEx</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            6-10 business days
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-semibold">$30.00</div>
                            <div className="text-xs text-green-600">FREE over $200</div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium">Express International</div>
                            <div className="text-xs text-gray-600">DHL Express</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            3-5 business days
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold">
                            $50.00
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Includes: Germany, France, Italy, Spain, Netherlands, Belgium, and all EU member states
                  </p>
                </div>

                <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Free Shipping Promotion
                  </p>
                  <p className="text-sm text-blue-800">
                    Enjoy free standard shipping on all orders over $100 within the continental United States.
                  </p>
                </div>
              </section>

              {/* Delivery Times */}
              <section id="delivery" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Estimated Delivery Times</h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Delivery times are estimates and begin from the date of shipment, not the order date.
                  Delays may occur due to weather, carrier issues, or high-volume periods.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      🇺🇸 United States
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="font-medium">Standard</span>
                        <span className="text-gray-900">2-4 days</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="font-medium">Express</span>
                        <span className="text-gray-900">1-2 days</span>
                      </li>
                      <li className="pt-2">
                        <div className="bg-green-50 px-3 py-2 rounded text-xs text-green-800">
                          <strong>Free shipping</strong> on orders over $100
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      🇬🇧 United Kingdom
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="font-medium">Standard</span>
                        <span className="text-gray-900">5-8 days</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="font-medium">Express</span>
                        <span className="text-gray-900">2-4 days</span>
                      </li>
                      <li className="pt-2">
                        <div className="bg-blue-50 px-3 py-2 rounded text-xs text-blue-800">
                          <strong>Free shipping</strong> on orders over $150
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      🇪🇺 Europe (EU)
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="font-medium">Standard</span>
                        <span className="text-gray-900">6-10 days</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="font-medium">Express</span>
                        <span className="text-gray-900">3-5 days</span>
                      </li>
                      <li className="pt-2">
                        <div className="bg-purple-50 px-3 py-2 rounded text-xs text-purple-800">
                          <strong>Free shipping</strong> on orders over $200
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-600 p-4">
                  <p className="text-sm font-medium text-yellow-900 mb-1">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Holiday Shipping Notice
                  </p>
                  <p className="text-sm text-yellow-800">
                    During peak seasons (Black Friday, Cyber Monday, Christmas), please allow additional
                    2-3 business days for delivery.
                  </p>
                </div>
              </section>

              {/* International Shipping */}
              <section id="international" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">International Shipping</h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  We ship to the United Kingdom and European Union countries. International shipping
                  rates are calculated at checkout based on your location and package weight.
                </p>

                <div className="bg-gray-50 border border-gray-200 p-6 mb-6">
                  <h3 className="font-semibold mb-4">Countries We Ship To:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">United Kingdom</h4>
                      <div className="text-sm text-gray-600">
                        <p>🇬🇧 England, Scotland, Wales, Northern Ireland</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Europe (EU)</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>🇩🇪 Germany</div>
                        <div>🇫🇷 France</div>
                        <div>🇮🇹 Italy</div>
                        <div>🇪🇸 Spain</div>
                        <div>🇳🇱 Netherlands</div>
                        <div>🇧🇪 Belgium</div>
                        <div>🇦🇹 Austria</div>
                        <div>🇵🇹 Portugal</div>
                        <div>🇸🇪 Sweden</div>
                        <div>🇩🇰 Denmark</div>
                        <div>🇫🇮 Finland</div>
                        <div>🇮🇪 Ireland</div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">+ All other EU member states</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4">
                  <p className="text-sm font-medium text-red-900 mb-2">
                    Important: International customers are responsible for all customs duties,
                    taxes, and import fees.
                  </p>
                  <p className="text-sm text-red-800">
                    These charges vary by country and are not included in your order total.
                  </p>
                </div>
              </section>

              {/* Order Tracking */}
              <section id="tracking" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Order Tracking</h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Once your order ships, you'll receive a confirmation email with a tracking number.
                  You can track your package in real-time using our tracking page or directly through
                  the carrier's website.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border border-gray-200 p-6">
                    <h3 className="font-semibold mb-3">How to Track Your Order</h3>
                    <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                      <li>Check your email for shipping confirmation</li>
                      <li>Click the tracking link provided</li>
                      <li>View real-time delivery updates</li>
                      <li>Sign up for carrier notifications (optional)</li>
                    </ol>
                  </div>

                  <div className="border border-gray-200 p-6 bg-gray-50">
                    <h3 className="font-semibold mb-3">Track Your Order</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Enter your order number or tracking number
                    </p>
                    <Link
                      href="/track-order"
                      className="block w-full px-6 py-3 bg-black text-white text-center font-medium tracking-wider hover:bg-gray-800 transition-all"
                    >
                      TRACK ORDER
                    </Link>
                  </div>
                </div>
              </section>

              {/* Shipping Restrictions */}
              <section id="restrictions" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Shipping Restrictions</h2>
                
                <div className="bg-yellow-50 border border-yellow-200 p-6 mb-6">
                  <h3 className="font-semibold mb-3 text-yellow-900">
                    We Do Not Ship To:
                  </h3>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    <li>• P.O. Boxes (for express shipping)</li>
                    <li>• Military APO/FPO addresses</li>
                    <li>• US Territories (Puerto Rico, Guam, USVI)</li>
                    <li>• Countries under trade restrictions</li>
                  </ul>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  If you have questions about shipping to your location, please{" "}
                  <Link href="/contact" className="underline hover:text-black">
                    contact our customer service team
                  </Link>.
                </p>
              </section>

              {/* Customs & Duties */}
              <section id="customs" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Customs & Import Duties</h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  For international orders, you may be subject to import duties, taxes, and customs
                  clearance fees charged by your country. These charges are not included in your order
                  total and are the customer's responsibility.
                </p>

                <div className="bg-gray-50 border border-gray-200 p-6">
                  <h3 className="font-semibold mb-3">What You Need to Know:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Customs fees vary by country and order value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>You'll be contacted by the carrier for payment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Packages may be held until fees are paid</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Contact your local customs office for rates</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Shipping FAQ */}
              <section id="faq" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Shipping FAQ</h2>
                
                <div className="space-y-4">
                  <details className="border border-gray-200 p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                      <span>Can I change my shipping address after placing an order?</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-700">
                      You can change your shipping address within 24 hours of placing your order. Contact
                      customer service immediately. Once shipped, we cannot modify the address.
                    </p>
                  </details>

                  <details className="border border-gray-200 p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                      <span>What if my package is lost or damaged?</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-700">
                      Contact us immediately if your package is lost or arrives damaged. We'll work with
                      the carrier to resolve the issue and send a replacement or provide a refund.
                    </p>
                  </details>

                  <details className="border border-gray-200 p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                      <span>Do you ship to hotels or vacation addresses?</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-700">
                      Yes, but please include your name and check-in/check-out dates in the delivery
                      instructions. Confirm the hotel accepts packages for guests.
                    </p>
                  </details>

                  <details className="border border-gray-200 p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                      <span>Can I expedite my order after it's been placed?</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-700">
                      Shipping upgrades may be possible if the order hasn't shipped yet. Contact customer
                      service as soon as possible. Additional fees may apply.
                    </p>
                  </details>

                  <details className="border border-gray-200 p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                      <span>What packaging do you use?</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-700">
                      All orders are shipped in recyclable, sustainable packaging. We use eco-friendly
                      materials and minimal plastic to reduce our environmental impact.
                    </p>
                  </details>
                </div>
              </section>

              {/* Footer Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/returns"
                    className="flex-1 px-6 py-3 border-2 border-black text-black text-center font-medium tracking-wider hover:bg-black hover:text-white transition-all"
                  >
                    RETURN POLICY
                  </Link>
                  <Link
                    href="/contact"
                    className="flex-1 px-6 py-3 bg-black text-white text-center font-medium tracking-wider hover:bg-gray-800 transition-all"
                  >
                    CONTACT SUPPORT
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