import Link from "next/link";
import { Gift, Mail, CreditCard, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Cards - Give the Gift of Sustainable Fashion",
  description: "Purchase NOWIHT digital gift cards. Perfect for birthdays, holidays, and special occasions. Delivered instantly via email.",
  keywords: ["gift cards", "fashion gift card", "digital gift card", "sustainable fashion gift", "e-gift card"],
};

export default function GiftCardsPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center bg-gradient-to-br from-rose-900 via-pink-800 to-red-900">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">GIFT CARDS</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">Give the Gift of Choice</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">Share sustainable luxury with NOWIHT digital gift cards—delivered instantly, valid forever</p>
            <Link href="#buy-now" className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black hover:bg-gray-200 transition-all">
              <Gift className="w-5 h-5" />
              <span className="font-medium tracking-wider">BUY GIFT CARD</span>
            </Link>
          </div>
        </section>

        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">Perfect for Every Occasion</h2>
            <p className="text-gray-600 text-lg">Birthdays, holidays, thank you gifts, or just because</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-gray-200">
              <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-3">Instant Delivery</h3>
              <p className="text-gray-600">Delivered to recipient's email within minutes of purchase. Perfect for last-minute gifts!</p>
            </div>
            <div className="text-center p-8 border border-gray-200">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-3">No Expiry Date</h3>
              <p className="text-gray-600">NOWIHT gift cards never expire. Your recipient can shop whenever they're ready.</p>
            </div>
            <div className="text-center p-8 border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-3">Easy to Redeem</h3>
              <p className="text-gray-600">Simple one-click redemption at checkout. Works on all products, including sale items.</p>
            </div>
          </div>
        </section>

        <section id="buy-now" className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4">Choose an Amount</h2>
              <p className="text-gray-600">Select a gift card value</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {["$25", "$50", "$100", "$150", "$200", "$250", "$300", "Custom"].map((amount, i) => (
                <button key={i} className="p-6 border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all text-center font-medium text-xl">
                  {amount}
                </button>
              ))}
            </div>
            <div className="bg-white p-8 md:p-12 border border-gray-200">
              <h3 className="text-2xl font-light mb-6">Gift Card Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Email *</label>
                  <input type="email" placeholder="recipient@example.com" className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Name</label>
                  <input type="text" placeholder="Jane Doe" className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Personal Message (optional)</label>
                  <textarea rows={4} placeholder="Add a personal touch..." className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <input type="text" placeholder="From: John Smith" className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Date (optional)</label>
                  <input type="date" className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black" />
                  <p className="text-xs text-gray-500 mt-1">Leave blank for immediate delivery</p>
                </div>
                <button className="w-full py-4 bg-black text-white hover:bg-gray-800 transition-all font-medium tracking-wider">
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-light mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "How does the recipient receive the gift card?", a: "Gift cards are delivered via email instantly (or on your chosen delivery date). The email includes a unique code and instructions for redemption." },
              { q: "Can gift cards be used on sale items?", a: "Yes! Gift cards can be applied to any product on our website, including sale and clearance items." },
              { q: "Do gift cards expire?", a: "No. NOWIHT gift cards have no expiration date and can be used anytime." },
              { q: "Can I purchase a physical gift card?", a: "Currently we only offer digital gift cards delivered via email. This reduces environmental impact and provides instant delivery." },
              { q: "What if the order total exceeds the gift card balance?", a: "Recipients can combine gift cards with other payment methods at checkout to cover the difference." },
              { q: "Can I check my gift card balance?", a: "Yes, recipients can check their balance by entering the gift card code on our Balance Check page." },
            ].map((faq, i) => (
              <div key={i} className="border-l-4 border-pink-600 pl-6 py-4">
                <h3 className="font-medium mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 bg-black text-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-light mb-6">Corporate Gifting</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">Looking to purchase gift cards in bulk for employee rewards, client appreciation, or corporate events? We offer special rates and personalized service for orders of 50+ gift cards.</p>
                <Link href="/contact" className="inline-flex items-center gap-3 px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all">
                  <span>CONTACT SALES TEAM</span>
                </Link>
              </div>
              <div className="bg-white/5 p-8 border border-white/10">
                <h3 className="text-xl font-medium mb-4">Bulk Benefits Include:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <span>Volume discounts for orders 50+</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <span>Custom branded gift card designs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <span>Flexible payment terms</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}