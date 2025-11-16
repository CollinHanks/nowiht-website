import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Personal Styling | Complimentary Style Consultations",
  description: "Book a complimentary consultation with our expert stylists. Get personalized fashion advice and curated looks tailored to your unique style.",
  openGraph: {
    title: "Personal Styling Services | NOWIHT",
    description: "Expert style consultations for the modern woman",
  },
};

export default function PersonalStylingPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        {/* HERO SECTION */}
        <section className="min-h-[70vh] flex items-center justify-center px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 md:mb-8">
              <div className="w-px h-16 md:h-20 bg-black mx-auto mb-6"></div>
            </div>

            <span className="text-[10px] md:text-xs tracking-[0.4em] text-gray-500 uppercase mb-6 block">
              Complimentary Service
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 leading-[1.1]">
              Personal<br />Styling
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Expert guidance, personalized for you. Complimentary consultations
              tailored to your unique style and lifestyle.
            </p>

            <Link
              href="#services"
              className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white hover:bg-gray-900 transition-all duration-300 text-xs tracking-[0.2em] uppercase group"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* THREE STEPS - ULTRA MINIMAL */}
        <section className="py-20 md:py-32 bg-black text-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
                The Process
              </h2>
              <div className="w-16 h-px bg-white/30 mx-auto mt-8"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-16 md:gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-light mb-8 text-white/20">01</div>
                <h3 className="text-xl md:text-2xl font-light mb-4 tracking-wide">Book</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">
                  Choose your preferred time. Virtual or in-person,
                  30 minutes dedicated to you.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-light mb-8 text-white/20">02</div>
                <h3 className="text-xl md:text-2xl font-light mb-4 tracking-wide">Consult</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">
                  Share your style preferences, lifestyle needs,
                  and fashion aspirations.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-light mb-8 text-white/20">03</div>
                <h3 className="text-xl md:text-2xl font-light mb-4 tracking-wide">Transform</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">
                  Receive curated recommendations and
                  expert styling guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES - TYPOGRAPHY HEAVY */}
        <section id="services" className="py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="mb-20">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-3">
                Services
              </h2>
              <div className="w-16 h-px bg-black mt-8"></div>
            </div>

            <div className="space-y-20 md:space-y-24">
              {/* Virtual */}
              <div className="grid md:grid-cols-2 gap-12 items-start border-b border-gray-200 pb-20">
                <div>
                  <span className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4 block">
                    01
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light mb-6 tracking-tight">
                    Virtual Consultation
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 font-light">
                    Connect remotely via video call. Perfect for busy schedules
                    and international clients seeking expert guidance.
                  </p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">30-minute video session</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Wardrobe analysis</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Personalized lookbook</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Shopping recommendations</span>
                  </div>
                </div>
              </div>

              {/* In-Person */}
              <div className="grid md:grid-cols-2 gap-12 items-start border-b border-gray-200 pb-20">
                <div>
                  <span className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4 block">
                    02
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light mb-6 tracking-tight">
                    In-Person Session
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 font-light">
                    Visit our space for a hands-on styling experience with
                    direct access to our complete collection.
                  </p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">60-minute private session</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Try curated pieces</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Complete outfit styling</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Complimentary refreshments</span>
                  </div>
                </div>
              </div>

              {/* Ongoing */}
              <div className="grid md:grid-cols-2 gap-12 items-start border-b border-gray-200 pb-20">
                <div>
                  <span className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4 block">
                    03
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light mb-6 tracking-tight">
                    Ongoing Support
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 font-light">
                    Continuous style advice via email or chat. Your stylist
                    is always available.
                  </p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Email support anytime</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Seasonal style updates</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">New arrival recommendations</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Exclusive early access</span>
                  </div>
                </div>
              </div>

              {/* Special Occasions */}
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                  <span className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4 block">
                    04
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light mb-6 tracking-tight">
                    Special Occasions
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 font-light">
                    Event-specific styling for weddings, galas, and
                    important moments.
                  </p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Event-specific guidance</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Accessories coordination</span>
                  </div>
                  <div className="flex items-baseline gap-4 border-b border-gray-100 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Last-minute consultations</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-3">
                    <span className="text-gray-400 w-8">—</span>
                    <span className="font-light">Personal shopping assistance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL - MINIMAL */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <div className="mb-12">
              <div className="w-px h-12 bg-black/20 mx-auto"></div>
            </div>
            <p className="text-xl md:text-2xl font-light leading-relaxed mb-12 italic text-gray-800">
              "The styling consultation transformed how I approach my wardrobe.
              Expert guidance that truly understands my needs."
            </p>
            <div>
              <p className="font-medium text-sm tracking-wide uppercase">Sarah M.</p>
              <p className="text-xs text-gray-500 mt-1">New York</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-8">
              Begin Your<br />Transformation
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-12 font-light leading-relaxed">
              Book your complimentary consultation. No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book-stylist"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-black text-white hover:bg-gray-900 transition-all duration-300 text-xs tracking-[0.2em] uppercase group"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 border border-black hover:bg-black hover:text-white transition-all duration-300 text-xs tracking-[0.2em] uppercase"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}