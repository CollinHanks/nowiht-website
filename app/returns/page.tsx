"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  DollarSign,
  Calendar,
  Package,
  AlertCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function ReturnRefundPolicyPage() {
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
    { id: "overview", title: "Return Policy Overview", icon: RotateCcw },
    { id: "eligibility", title: "Return Eligibility", icon: CheckCircle2 },
    { id: "process", title: "How to Return", icon: Package },
    { id: "refunds", title: "Refund Process", icon: DollarSign },
    { id: "exchanges", title: "Exchanges", icon: RefreshCw },
    { id: "non-returnable", title: "Non-Returnable Items", icon: XCircle },
    { id: "timeframe", title: "Return Timeframe", icon: Calendar },
    { id: "international", title: "International Returns", icon: Clock },
    { id: "faq", title: "Return FAQ", icon: AlertCircle },
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
              <span className="text-black font-medium">Return & Refund Policy</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center gap-2 mb-6">
                  <RotateCcw className="w-5 h-5" />
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

                {/* Quick Action */}
                <div className="mt-8 p-4 bg-green-50 border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Need to Return?</p>
                  <p className="text-xs text-green-800 mb-3">
                    Start your return request online
                  </p>
                  <Link
                    href="/account/orders"
                    className="block w-full px-4 py-2 bg-green-700 text-white text-center text-xs font-medium hover:bg-green-800 transition-colors"
                  >
                    START RETURN
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 mb-6">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                  <span className="text-sm font-medium text-green-900">30-Day Return Policy</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
                  Return & Refund Policy
                </h1>
                <p className="text-lg text-gray-600">
                  We want you to love your NOWIHT purchase. If you're not completely satisfied,
                  we're here to help with hassle-free returns and exchanges.
                </p>
              </div>

              {/* Overview */}
              <section id="overview" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Return Policy Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 p-6 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-3 text-green-700" />
                    <h3 className="font-semibold mb-2">30 Days</h3>
                    <p className="text-sm text-gray-700">Free returns within 30 days</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-6 text-center">
                    <Package className="w-8 h-8 mx-auto mb-3 text-blue-700" />
                    <h3 className="font-semibold mb-2">Easy Process</h3>
                    <p className="text-sm text-gray-700">Simple online returns</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-6 text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-3 text-purple-700" />
                    <h3 className="font-semibold mb-2">Full Refund</h3>
                    <p className="text-sm text-gray-700">Money back guarantee</p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  At NOWIHT, we stand behind the quality of our products. If you're not completely
                  satisfied with your purchase, you can return eligible items within 30 days of
                  delivery for a full refund or exchange.
                </p>

                <div className="bg-gray-50 border-l-4 border-black p-4">
                  <p className="text-sm font-medium mb-2">Key Points:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ 30-day return window from delivery date</li>
                    <li>✓ Items must be unworn, unwashed, and with original tags</li>
                    <li>✓ Free return shipping on all US orders</li>
                    <li>✓ Refunds processed within 5-7 business days</li>
                  </ul>
                </div>
              </section>

              {/* Return Eligibility */}
              <section id="eligibility" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Return Eligibility</h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  To be eligible for a return, items must meet the following conditions:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-green-200 bg-green-50 p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-green-900">
                      <CheckCircle2 className="w-5 h-5" />
                      Returnable Items
                    </h3>
                    <ul className="space-y-2 text-sm text-green-900">
                      <li className="flex items-start gap-2">
                        <span className="min-w-[20px]">✓</span>
                        <span>Unworn and unwashed items</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="min-w-[20px]">✓</span>
                        <span>Original tags still attached</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="min-w-[20px]">✓</span>
                        <span>In original packaging</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="min-w-[20px]">✓</span>
                        <span>Proof of purchase included</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="min-w-[20px]">✓</span>
                        <span>Within 30 days of delivery</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-red-200 bg-red-50 p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-900">
                      <XCircle className="w-5 h-5" />
                      Not Returnable
                    </h3>
                    <ul className="space-y-2 text-sm text-red-900">
                      <li className="flex items-start gap-2">
                        <span className="min-w-[20px]">✗</span>
                        <span>Worn or washed items</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="min-w-[20px]">✗</span>
                        <span>Items without tags</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="min-w-[20px]">✗</span>
                        <span>Final sale items</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="min-w-[20px]">✗</span>
                        <span>Gift cards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="min-w-[20px]">✗</span>
                        <span>Items past 30 days</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How to Return */}
              <section id="process" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">How to Return Your Order</h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Follow these simple steps to return your NOWIHT purchase:
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 p-6 border border-gray-200 hover:border-black transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Initiate Your Return</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Log into your account and go to Order History. Select the order and click
                        "Return Items." Choose the items you wish to return and the reason.
                      </p>
                      <Link
                        href="/account/orders"
                        className="text-sm underline hover:text-black"
                      >
                        Go to Order History →
                      </Link>
                    </div>
                  </div>

                  <div className="flex gap-4 p-6 border border-gray-200 hover:border-black transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Print Your Return Label</h3>
                      <p className="text-sm text-gray-700">
                        You'll receive a prepaid return shipping label via email. Print the label
                        and attach it to your package. US returns ship free!
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-6 border border-gray-200 hover:border-black transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Pack Your Items Securely</h3>
                      <p className="text-sm text-gray-700">
                        Place items in original packaging if possible. Ensure all tags are attached
                        and items are in original condition. Include packing slip or order confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-6 border border-gray-200 hover:border-black transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Ship Your Return</h3>
                      <p className="text-sm text-gray-700">
                        Drop off your package at any USPS, UPS, or FedEx location (depending on your
                        return label). Keep your tracking number for reference.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-6 border border-gray-200 hover:border-black transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Receive Your Refund</h3>
                      <p className="text-sm text-gray-700">
                        Once we receive and inspect your return, we'll process your refund within
                        5-7 business days. You'll receive an email confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Refund Process */}
              <section id="refunds" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Refund Process & Timeline</h2>
                
                <div className="bg-blue-50 border border-blue-200 p-6 mb-6">
                  <h3 className="font-semibold mb-4">Refund Timeline:</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">1-3 business days:</p>
                        <p>Return package in transit to our warehouse</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">2-3 business days:</p>
                        <p>Inspection and processing of return</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">5-7 business days:</p>
                        <p>Refund appears in your account (varies by bank)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-green-600 pl-4">
                    <h4 className="font-semibold mb-1">Refund Method</h4>
                    <p className="text-sm text-gray-700">
                      Refunds are issued to the original payment method. Credit/debit card refunds
                      may take 5-10 business days to appear, depending on your bank.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-4">
                    <h4 className="font-semibold mb-1">Partial Refunds</h4>
                    <p className="text-sm text-gray-700">
                      If you used a discount code, the refund will be for the amount you actually paid.
                      Original shipping costs are non-refundable unless the return is due to our error.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-600 pl-4">
                    <h4 className="font-semibold mb-1">Store Credit Option</h4>
                    <p className="text-sm text-gray-700">
                      Choose store credit for an instant 10% bonus! Store credit is issued immediately
                      upon return inspection and never expires.
                    </p>
                  </div>
                </div>
              </section>

              {/* Exchanges */}
              <section id="exchanges" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Exchanges</h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Need a different size or color? We're happy to help with exchanges!
                </p>

                <div className="bg-green-50 border border-green-200 p-6 mb-6">
                  <h3 className="font-semibold mb-3 text-green-900">How Exchanges Work:</h3>
                  <ol className="space-y-2 text-sm text-green-900 list-decimal list-inside">
                    <li>Select "Exchange" instead of "Return" when initiating your return</li>
                    <li>Choose your preferred size, color, or alternative item</li>
                    <li>We'll ship your exchange as soon as we receive your original item</li>
                    <li>No additional shipping charges for exchanges</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
                  <p className="text-sm font-medium text-yellow-900 mb-1">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Out of Stock Items
                  </p>
                  <p className="text-sm text-yellow-800">
                    If your exchange item is out of stock, we'll refund the original purchase price
                    and notify you when the item is back in stock.
                  </p>
                </div>
              </section>

              {/* Non-Returnable Items */}
              <section id="non-returnable" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Non-Returnable Items</h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  The following items cannot be returned or exchanged:
                </p>

                <div className="bg-red-50 border border-red-200 p-6">
                  <ul className="space-y-3 text-sm text-red-900">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Final Sale Items</p>
                        <p className="text-xs text-red-800">Items marked as "Final Sale" at checkout</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Gift Cards</p>
                        <p className="text-xs text-red-800">Digital or physical gift cards</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Worn or Washed Items</p>
                        <p className="text-xs text-red-800">Items showing signs of wear or washing</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Items Without Tags</p>
                        <p className="text-xs text-red-800">Original tags must be attached</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Customized Items</p>
                        <p className="text-xs text-red-800">Personalized or made-to-order items</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Return Timeframe */}
              <section id="timeframe" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Return Timeframe</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 p-6">
                    <Calendar className="w-8 h-8 mb-3 text-gray-700" />
                    <h3 className="font-semibold mb-3">Standard Returns</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      You have <strong>30 days from the delivery date</strong> to initiate a return.
                      The return must be postmarked within this timeframe.
                    </p>
                    <p className="text-xs text-gray-600">
                      Check your order confirmation email for your delivery date.
                    </p>
                  </div>

                  <div className="border border-gray-200 p-6">
                    <Clock className="w-8 h-8 mb-3 text-gray-700" />
                    <h3 className="font-semibold mb-3">Holiday Extensions</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Purchases made between <strong>November 1 - December 24</strong> can be
                      returned until <strong>January 31</strong> of the following year.
                    </p>
                    <p className="text-xs text-gray-600">
                      Perfect for holiday gifts!
                    </p>
                  </div>
                </div>
              </section>

              {/* International Returns */}
              <section id="international" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">International Returns</h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  We accept returns from international customers within 30 days of delivery.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 p-6 mb-6">
                  <h3 className="font-semibold mb-3 text-yellow-900">Important Notes:</h3>
                  <ul className="space-y-2 text-sm text-yellow-900">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Customer is responsible for return shipping costs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Original shipping costs are non-refundable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Customs duties/taxes are not refundable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Use a trackable shipping method</span>
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-gray-700">
                  Return to: NOWIHT Returns, 123 Fashion Avenue, Los Angeles, CA 90001, USA
                </p>
              </section>

              {/* Return FAQ */}
              <section id="faq" className="scroll-mt-24 mb-12">
                <h2 className="text-2xl font-semibold mb-6">Return FAQ</h2>
                
                <div className="space-y-4">
                  <details className="border border-gray-200 p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                      <span>What if I lost my return label?</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-700">
                      No problem! Log into your account and generate a new return label from your
                      order history. You can also contact customer service for assistance.
                    </p>
                  </details>

                  <details className="border border-gray-200 p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                      <span>Can I return items purchased with a gift card?</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-700">
                      Yes. If you paid with a gift card, your refund will be issued as store credit
                      or returned to the original gift card.
                    </p>
                  </details>

                  <details className="border border-gray-200 p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                      <span>What happens if my return is damaged in transit?</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-700">
                      Please pack returns securely. If items are damaged due to inadequate packaging,
                      we may not be able to issue a full refund. We recommend insuring high-value returns.
                    </p>
                  </details>

                  <details className="border border-gray-200 p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                      <span>Can I return a gift?</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-700">
                      Yes! Gift recipients can return items for store credit or exchange. The original
                      purchaser will not be notified of the return.
                    </p>
                  </details>

                  <details className="border border-gray-200 p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                      <span>What if my item is defective?</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-700">
                      Contact us immediately if you receive a defective item. We'll provide a prepaid
                      return label and rush ship a replacement at no charge.
                    </p>
                  </details>
                </div>
              </section>

              {/* Footer Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/account/orders"
                    className="flex-1 px-6 py-3 bg-black text-white text-center font-medium tracking-wider hover:bg-gray-800 transition-all"
                  >
                    START A RETURN
                  </Link>
                  <Link
                    href="/contact"
                    className="flex-1 px-6 py-3 border-2 border-black text-black text-center font-medium tracking-wider hover:bg-black hover:text-white transition-all"
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