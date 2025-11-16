// app/faq/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Minus, Mail } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // SHIPPING CATEGORY
  {
    category: "Shipping",
    question: "What are the shipping costs?",
    answer: "We offer free standard shipping on all orders over $150. For orders under $150, standard shipping is $10. Express shipping (2-3 business days) is available for $25, and next-day delivery is $40 within eligible areas.",
  },
  {
    category: "Shipping",
    question: "How long does delivery take?",
    answer: "Standard delivery takes 5-7 business days within the US, 7-10 business days for UK/EU. Express shipping takes 2-3 business days, and next-day delivery is available in select metropolitan areas. You will receive tracking information once your order ships.",
  },
  {
    category: "Shipping",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 100 countries worldwide. International shipping costs and delivery times vary by destination. Customs duties and taxes may apply and are the responsibility of the customer. Please allow 10-21 business days for international deliveries.",
  },
  {
    category: "Shipping",
    question: "Can I track my order?",
    answer: "Absolutely! Once your order ships, you will receive a tracking number via email. You can also track your order status by logging into your account and visiting the 'Order History' section. Real-time tracking updates are provided by our shipping partners.",
  },
  {
    category: "Shipping",
    question: "What if my package is lost or damaged?",
    answer: "All shipments are fully insured. If your package is lost or arrives damaged, please contact us within 48 hours with photos and your order number. We will arrange for a replacement or full refund immediately.",
  },

  // RETURNS & REFUNDS CATEGORY
  {
    category: "Returns & Refunds",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy from the date of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached. Once we receive your return, refunds are processed within 5-7 business days to your original payment method.",
  },
  {
    category: "Returns & Refunds",
    question: "How do I start a return?",
    answer: "Log into your account, go to 'Order History,' select the order you wish to return, and click 'Initiate Return.' Choose your items and reason for return. You will receive a prepaid return label via email within 24 hours. For US customers, returns are free of charge.",
  },
  {
    category: "Returns & Refunds",
    question: "Are sale items returnable?",
    answer: "Yes, sale items can be returned within 30 days under our standard return policy. However, final sale items marked as 'Final Sale' at checkout cannot be returned or exchanged. Please review product descriptions carefully before purchasing.",
  },
  {
    category: "Returns & Refunds",
    question: "Can I exchange an item?",
    answer: "We currently do not offer direct exchanges. To exchange an item, please return it for a refund and place a new order for your desired size or color. This ensures you receive your new item as quickly as possible.",
  },
  {
    category: "Returns & Refunds",
    question: "When will I receive my refund?",
    answer: "Refunds are processed within 5-7 business days after we receive and inspect your return. The refund will be credited to your original payment method. Please allow an additional 3-5 business days for the credit to appear in your account, depending on your bank.",
  },

  // ORDERS CATEGORY
  {
    category: "Orders",
    question: "Can I modify or cancel my order?",
    answer: "Orders can be modified or cancelled within 1 hour of placement. After this window, orders are processed immediately for fast shipping and cannot be changed. Please contact us at support@nowiht.com if you need assistance within the 1-hour window.",
  },
  {
    category: "Orders",
    question: "Do you offer gift wrapping?",
    answer: "Yes! We offer complimentary luxury gift wrapping at checkout. Your items will be wrapped in our signature black tissue paper with a NOWIHT ribbon and includes a handwritten gift message card if requested.",
  },
  {
    category: "Orders",
    question: "Can I use multiple promo codes?",
    answer: "Only one promo code can be applied per order. Promo codes cannot be combined with other offers or discounts. If you have multiple codes, we recommend using the one that provides the greatest discount for your purchase.",
  },
  {
    category: "Orders",
    question: "What if an item is out of stock?",
    answer: "If an item is out of stock, you can join the waitlist by clicking 'Notify Me' on the product page. You will receive an email when the item is back in stock. Out of stock items typically restock within 2-4 weeks, but some limited editions may not return.",
  },
  {
    category: "Orders",
    question: "Do you offer pre-orders?",
    answer: "Yes, select new collection items are available for pre-order. Pre-order items are marked clearly on the product page with an estimated ship date. Your card will be charged at the time of order placement, and the item will ship on or before the stated date.",
  },

  // PAYMENT CATEGORY
  {
    category: "Payment",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. We also offer Klarna and Afterpay for flexible installment payments on orders over $50.",
  },
  {
    category: "Payment",
    question: "Is my payment information secure?",
    answer: "Absolutely. We use industry-standard SSL encryption and PCI-DSS compliant payment processing. We do not store your full credit card information on our servers. All transactions are processed securely through trusted payment gateways.",
  },
  {
    category: "Payment",
    question: "Do you offer payment plans?",
    answer: "Yes! We partner with Klarna and Afterpay to offer interest-free installment payments. You can split your purchase into 4 equal payments over 6 weeks with no hidden fees. Simply select Klarna or Afterpay at checkout to see if you qualify.",
  },
  {
    category: "Payment",
    question: "Can I pay with store credit or gift cards?",
    answer: "Yes, NOWIHT gift cards and store credit can be applied during checkout. Enter your gift card code in the payment section. Gift cards can be combined with other payment methods if your balance does not cover the full purchase amount.",
  },
  {
    category: "Payment",
    question: "When will I be charged for my order?",
    answer: "Your payment method will be charged immediately when you place your order. For pre-orders, you are charged at the time of order placement, not when the item ships. If an order is cancelled, refunds are processed within 5-7 business days.",
  },

  // ACCOUNT CATEGORY
  {
    category: "Account",
    question: "Do I need an account to place an order?",
    answer: "No, you can checkout as a guest. However, creating an account allows you to track orders, save items to your wishlist, store multiple shipping addresses, and access exclusive member benefits and early sale access.",
  },
  {
    category: "Account",
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' on the login page and enter your email address. You will receive a password reset link within a few minutes. If you do not see the email, please check your spam folder or contact support@nowiht.com for assistance.",
  },
  {
    category: "Account",
    question: "Can I save multiple shipping addresses?",
    answer: "Yes! In your account settings, you can save unlimited shipping addresses. This makes checkout faster and easier. You can set a default address and choose different addresses for specific orders during checkout.",
  },
  {
    category: "Account",
    question: "How do I update my account information?",
    answer: "Log into your account and click 'Profile Settings.' Here you can update your name, email, phone number, password, and shipping addresses. Changes are saved automatically and will apply to all future orders.",
  },
  {
    category: "Account",
    question: "How do I unsubscribe from emails?",
    answer: "You can unsubscribe from marketing emails by clicking the 'Unsubscribe' link at the bottom of any promotional email. Alternatively, log into your account, go to 'Email Preferences,' and customize which emails you receive. You will still receive transactional emails about your orders.",
  },
];

const categories = ["All", "Shipping", "Returns & Refunds", "Orders", "Payment", "Account"];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Filter FAQs based on category and search
  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter((faq) => faq.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-black/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-base md:text-lg text-gray-600 font-light tracking-wide">
                Find answers to common questions about orders, shipping, returns, and more.
              </p>
            </div>
          </div>
        </section>

        {/* Search + Filters Section */}
        <section className="py-8 md:py-10 border-b border-black/5 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 text-sm tracking-wide focus:outline-none focus:border-black transition-colors bg-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 text-sm font-medium tracking-wide transition-all ${
                    activeCategory === category
                      ? "bg-black text-white"
                      : "bg-white text-black border border-gray-200 hover:border-black"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-gray-500 tracking-wide">
                  No questions found matching your search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="mt-6 text-sm text-black underline hover:no-underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 overflow-hidden bg-white">
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors group text-left"
                    >
                      <span className="text-sm md:text-base font-medium tracking-wide pr-6">
                        {faq.question}
                      </span>
                      {openIndex === index ? (
                        <Minus className="w-5 h-5 flex-shrink-0 text-gray-600 group-hover:text-black transition-colors" />
                      ) : (
                        <Plus className="w-5 h-5 flex-shrink-0 text-gray-600 group-hover:text-black transition-colors" />
                      )}
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      <div className="px-6 md:px-8 pb-6 pt-2 border-t border-gray-100">
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed tracking-wide">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <section className="py-20 md:py-28 border-t border-black/5 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="max-w-2xl mx-auto text-center">
              <Mail className="w-12 h-12 mx-auto mb-6 text-gray-400" />
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                Still Have Questions?
              </h2>
              <p className="text-base md:text-lg text-gray-600 tracking-wide mb-10 font-light">
                Our customer service team is here to help you with any additional inquiries.
              </p>
              <Link
                href="/contact"
                className="inline-block px-12 py-4 bg-black text-white text-sm font-medium tracking-widest hover:bg-gray-900 transition-colors"
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