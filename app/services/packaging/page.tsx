import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Luxury Packaging | Sustainable Unboxing Experience",
  description: "Every NOWIHT order arrives in our signature sustainable packaging. Experience luxury that cares for our planet.",
  openGraph: {
    title: "Luxury Packaging Experience | NOWIHT",
    description: "Premium sustainable packaging with care",
  },
};

export default function LuxuryPackagingPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        {/* HERO */}
        <section className="min-h-[70vh] flex items-center justify-center px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 md:mb-8">
              <div className="w-px h-16 md:h-20 bg-black mx-auto mb-6"></div>
            </div>

            <span className="text-[10px] md:text-xs tracking-[0.4em] text-gray-500 uppercase mb-6 block">
              Sustainable Luxury
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 leading-[1.1]">
              The Unboxing<br />Experience
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Each order arrives in signature sustainable packaging,
              designed to create a memorable moment.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white hover:bg-gray-900 transition-all duration-300 text-xs tracking-[0.2em] uppercase group"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* WHAT'S INSIDE - MINIMAL GRID */}
        <section className="py-20 md:py-32 bg-black text-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
                Inside Every Package
              </h2>
              <div className="w-16 h-px bg-white/30 mx-auto mt-8"></div>
            </div>

            <div className="grid md:grid-cols-4 gap-12 md:gap-8">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-light mb-6 text-white/20">01</div>
                <h3 className="text-lg md:text-xl font-light mb-3 tracking-wide">Premium Box</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Reusable, made from 100% recycled materials
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl md:text-6xl font-light mb-6 text-white/20">02</div>
                <h3 className="text-lg md:text-xl font-light mb-3 tracking-wide">Eco Tissue</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Biodegradable, plastic-free wrapping
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl md:text-6xl font-light mb-6 text-white/20">03</div>
                <h3 className="text-lg md:text-xl font-light mb-3 tracking-wide">Organic Ribbon</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Cotton ribbon with embossed logo
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl md:text-6xl font-light mb-6 text-white/20">04</div>
                <h3 className="text-lg md:text-xl font-light mb-3 tracking-wide">Care Card</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Personalized care instructions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUSTAINABILITY - CLEAN LAYOUT */}
        <section className="py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="mb-20">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-3">
                Our Promise
              </h2>
              <div className="w-16 h-px bg-black mt-8"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-20">
              {/* 100% Recyclable */}
              <div>
                <span className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4 block">
                  100% Recyclable
                </span>
                <p className="text-base text-gray-700 mb-8 leading-relaxed font-light">
                  Every component can be recycled or composted. We've eliminated
                  all single-use plastics from packaging to delivery.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">FSC-certified cardboard</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Biodegradable tissue paper</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Compostable packaging tape</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Organic cotton ribbons</span>
                  </div>
                </div>
              </div>

              {/* Carbon-Neutral */}
              <div>
                <span className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4 block">
                  Carbon-Neutral Shipping
                </span>
                <p className="text-base text-gray-700 mb-8 leading-relaxed font-light">
                  We offset 100% of shipping emissions through verified carbon
                  reduction projects. Every delivery is tracked and compensated.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Reforestation partnerships</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Renewable energy investments</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Local delivery prioritized</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Consolidated shipments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REUSE - TYPOGRAPHY HEAVY */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight">
                Reuse Your Box
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-16">
              <div>
                <div className="aspect-square bg-white border border-gray-200 mb-6 flex items-center justify-center">
                  <span className="text-6xl font-light text-gray-200">01</span>
                </div>
                <h3 className="text-lg font-light mb-2 tracking-wide">Storage</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Organize accessories, shoes, or seasonal items
                </p>
              </div>

              <div>
                <div className="aspect-square bg-white border border-gray-200 mb-6 flex items-center justify-center">
                  <span className="text-6xl font-light text-gray-200">02</span>
                </div>
                <h3 className="text-lg font-light mb-2 tracking-wide">Gift</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Reuse for birthdays, holidays, special occasions
                </p>
              </div>

              <div>
                <div className="aspect-square bg-white border border-gray-200 mb-6 flex items-center justify-center">
                  <span className="text-6xl font-light text-gray-200">03</span>
                </div>
                <h3 className="text-lg font-light mb-2 tracking-wide">Recycle</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Place in recycling knowing it's 100% recyclable
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GIFT WRAPPING */}
        <section className="py-20 md:py-32 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <div className="mb-8">
              <div className="w-px h-12 bg-white/20 mx-auto"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
              Complimentary<br />Gift Wrapping
            </h2>
            <p className="text-base md:text-lg text-gray-300 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Sending a gift? We'll wrap it beautifully at no extra cost.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left mb-12">
              <div className="flex items-baseline gap-4 text-sm">
                <span className="text-white/40 w-8">—</span>
                <span className="font-light">Premium gift box with ribbon</span>
              </div>
              <div className="flex items-baseline gap-4 text-sm">
                <span className="text-white/40 w-8">—</span>
                <span className="font-light">Handwritten gift message</span>
              </div>
              <div className="flex items-baseline gap-4 text-sm">
                <span className="text-white/40 w-8">—</span>
                <span className="font-light">No prices shown</span>
              </div>
              <div className="flex items-baseline gap-4 text-sm">
                <span className="text-white/40 w-8">—</span>
                <span className="font-light">Direct shipping available</span>
              </div>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black hover:bg-gray-100 transition-all duration-300 text-xs tracking-[0.2em] uppercase group"
            >
              <span>Shop Gifts</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* STATS - BOLD NUMBERS */}
        <section className="py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <p className="text-6xl md:text-7xl font-light mb-4">100%</p>
                <p className="text-sm tracking-wide uppercase text-gray-600">Plastic-Free</p>
              </div>
              <div>
                <p className="text-6xl md:text-7xl font-light mb-4">0</p>
                <p className="text-sm tracking-wide uppercase text-gray-600">Carbon Footprint</p>
              </div>
              <div>
                <p className="text-6xl md:text-7xl font-light mb-4">∞</p>
                <p className="text-sm tracking-wide uppercase text-gray-600">Reusable</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-8">
              Experience It<br />Yourself
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-12 font-light leading-relaxed">
              Discover why our unboxing experience is unforgettable.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white hover:bg-gray-900 transition-all duration-300 text-xs tracking-[0.2em] uppercase group"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}