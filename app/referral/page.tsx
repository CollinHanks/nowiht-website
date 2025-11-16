import Link from "next/link";
import { Gift, Share2, DollarSign, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share & Earn - NOWIHT Referral Program",
  description: "Refer friends to NOWIHT and earn rewards. Get $25 for every friend who makes their first purchase. Sustainable fashion, shared benefits.",
  keywords: ["referral program", "fashion rewards", "earn money", "refer friends", "sustainable fashion rewards"],
};

export default function ReferralPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">REFERRAL PROGRAM</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">Share & Earn</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">Give $25, Get $25. Share sustainable fashion with friends and earn rewards together</p>
            <Link href="/register" className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black hover:bg-gray-200 transition-all">
              <span className="font-medium tracking-wider">START EARNING NOW</span>
            </Link>
          </div>
        </section>

        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Three simple steps to start earning</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-gray-200">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-3">1. Share Your Link</h3>
              <p className="text-gray-600">Get your unique referral link from your account dashboard and share it with friends via email, social media, or messaging.</p>
            </div>
            <div className="text-center p-8 border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-3">2. Friend Makes Purchase</h3>
              <p className="text-gray-600">Your friend gets $25 off their first order of $100 or more. They discover sustainable fashion at a discount.</p>
            </div>
            <div className="text-center p-8 border border-gray-200">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-3">3. You Get Rewarded</h3>
              <p className="text-gray-600">Receive $25 store credit within 24 hours. No limits—refer unlimited friends and keep earning!</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4">Program Benefits</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: DollarSign, title: "Unlimited Earnings", desc: "No cap on referrals. The more you share, the more you earn." },
                { icon: Gift, title: "Instant Rewards", desc: "$25 credit delivered to your account within 24 hours." },
                { icon: Users, title: "Help Friends Save", desc: "Your friends get $25 off their first sustainable fashion purchase." },
                { icon: Share2, title: "Easy Sharing", desc: "Share via email, WhatsApp, Instagram, or custom link." },
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4 items-start p-6 bg-white border border-gray-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-light mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Is there a limit to how many people I can refer?", a: "No limit! Refer unlimited friends and earn $25 for each successful referral." },
              { q: "When do I receive my reward?", a: "You'll receive $25 store credit within 24 hours after your friend's first purchase is confirmed." },
              { q: "Can I use my reward on sale items?", a: "Yes! Your store credit can be used on any product, including sale items." },
              { q: "What if my friend returns their purchase?", a: "If your friend returns their purchase, the referral credit will be voided." },
              { q: "Can I refer someone who already has an account?", a: "Referral rewards only apply to new customers making their first purchase." },
            ].map((faq, i) => (
              <div key={i} className="border-l-4 border-green-600 pl-6 py-4">
                <h3 className="font-medium mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 bg-black text-white text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl font-light mb-6">Ready to Start Earning?</h2>
            <p className="text-lg text-gray-300 mb-8">Create an account or log in to get your unique referral link</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="px-8 py-3.5 bg-white text-black hover:bg-gray-200 transition-all">
                CREATE ACCOUNT
              </Link>
              <Link href="/login" className="px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all">
                LOG IN
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}