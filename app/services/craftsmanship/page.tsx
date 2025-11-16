import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Award, Heart, Eye } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Handcrafted Excellence | Artisan Quality",
  description: "Every NOWIHT piece is handcrafted by skilled artisans with 12+ years of experience. Discover ethical manufacturing and timeless quality.",
  openGraph: {
    title: "Artisan Craftsmanship | NOWIHT",
    description: "Handcrafted with precision and care",
  },
};

export default function CraftsmanshipPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        {/* HERO SECTION */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-gray-50 to-stone-100">
            {/* Artisan Tools SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
              <g className="text-black" opacity="0.3">
                {/* Needle & Thread */}
                <line x1="200" y1="100" x2="240" y2="350" strokeWidth="6" stroke="currentColor" strokeLinecap="round" />
                <circle cx="200" cy="100" r="15" fill="currentColor" />
                <path d="M240 350 Q320 280 360 400" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="10,10" opacity="0.6" />

                {/* Scissors */}
                <circle cx="120" cy="450" r="30" fill="none" stroke="currentColor" strokeWidth="5" />
                <circle cx="190" cy="450" r="30" fill="none" stroke="currentColor" strokeWidth="5" />
                <line x1="155" y1="450" x2="155" y2="380" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />

                {/* Fabric Pattern */}
                <rect x="450" y="180" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10,10" opacity="0.5" />
              </g>

              {/* Red Stitching Accent */}
              <g className="text-red-600" opacity="0.4">
                <path d="M100 550 L115 550 L120 545 L125 550 L140 550 L145 545 L150 550 L165 550"
                  stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M500 120 L515 120 L520 115 L525 120 L540 120 L545 115 L550 120 L565 120"
                  stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <span className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-4 block">
              Made by Masters
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-6">
              Artisan Craftsmanship
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Each piece is handcrafted with precision by skilled artisans who have dedicated
              over 12 years to perfecting their craft.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white hover:bg-gray-900 transition-all duration-300 text-sm tracking-wider group"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* THE ARTISANS */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
                Meet the Makers
              </h2>
              <p className="text-gray-600">The hands behind every piece</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Stat 1 */}
              <div className="text-center p-8 bg-gray-50">
                <p className="text-5xl md:text-6xl font-light mb-4">12+</p>
                <p className="text-lg font-medium mb-2">Years Experience</p>
                <p className="text-sm text-gray-600">
                  Every artisan has over a decade of specialized training
                </p>
              </div>

              {/* Stat 2 */}
              <div className="text-center p-8 bg-gray-50">
                <p className="text-5xl md:text-6xl font-light mb-4">100%</p>
                <p className="text-lg font-medium mb-2">Fair Wages</p>
                <p className="text-sm text-gray-600">
                  Above industry standard, with healthcare and benefits
                </p>
              </div>

              {/* Stat 3 */}
              <div className="text-center p-8 bg-gray-50">
                <p className="text-5xl md:text-6xl font-light mb-4">50+</p>
                <p className="text-lg font-medium mb-2">Artisans</p>
                <p className="text-sm text-gray-600">
                  A dedicated team committed to quality craftsmanship
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE PROCESS */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-12 text-center">
              How We Create
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-black rounded-full flex-shrink-0">
                      <span className="text-xl font-light">1</span>
                    </div>
                    <h3 className="text-2xl font-light">Fabric Selection</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We source only premium organic cotton and sustainable materials from
                    certified suppliers. Each fabric is carefully inspected for quality,
                    texture, and durability before it reaches our artisans.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>GOTS-certified organic cotton</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Sustainable bamboo and linen blends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Natural, eco-friendly dyes</span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 md:order-2 aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
                  <span className="text-6xl opacity-20">🧵</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
                  <span className="text-6xl opacity-20">✂️</span>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-black rounded-full flex-shrink-0">
                      <span className="text-xl font-light">2</span>
                    </div>
                    <h3 className="text-2xl font-light">Precision Cutting</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Master pattern makers cut each piece by hand, ensuring perfect alignment
                    and minimal waste. This traditional technique has been refined over generations.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Zero-waste pattern design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Hand-cut for perfect fit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Scraps recycled or composted</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-black rounded-full flex-shrink-0">
                      <span className="text-xl font-light">3</span>
                    </div>
                    <h3 className="text-2xl font-light">Expert Stitching</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Skilled seamstresses bring each design to life with precise, durable stitching.
                    Every seam is reinforced to ensure longevity and comfort.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>French seams for durability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Flat-lock stitching for comfort</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Hand-finished details</span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 md:order-2 aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
                  <span className="text-6xl opacity-20">🪡</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
                  <span className="text-6xl opacity-20">👀</span>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-black rounded-full flex-shrink-0">
                      <span className="text-xl font-light">4</span>
                    </div>
                    <h3 className="text-2xl font-light">Quality Control</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Before leaving our workshop, each garment undergoes rigorous inspection.
                    Only pieces meeting our exacting standards bear the NOWIHT name.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Multi-point inspection process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Fit and finish verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Final press and packaging</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-12 text-center">
              Our Commitments
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <Users className="w-10 h-10 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Fair Labor</h3>
                <p className="text-sm text-gray-600">
                  Living wages, safe conditions, and respect for all workers
                </p>
              </div>

              <div className="text-center p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <Award className="w-10 h-10 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Quality First</h3>
                <p className="text-sm text-gray-600">
                  No shortcuts, no compromises on craftsmanship
                </p>
              </div>

              <div className="text-center p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <Heart className="w-10 h-10 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Made with Love</h3>
                <p className="text-sm text-gray-600">
                  Every stitch carries the passion of our artisans
                </p>
              </div>

              <div className="text-center p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <Eye className="w-10 h-10 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Full Transparency</h3>
                <p className="text-sm text-gray-600">
                  Know exactly where and how your clothes are made
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <div className="mb-8">
              <span className="text-6xl opacity-50">"</span>
            </div>
            <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 italic">
              I can feel the care that went into making my NOWIHT pieces. The quality is
              exceptional, and knowing they were made ethically makes wearing them even better.
            </p>
            <div>
              <p className="font-medium text-lg">Jennifer K.</p>
              <p className="text-sm text-gray-400">NOWIHT Customer since 2023</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-6">
              Experience the Difference
            </h2>
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              When you choose NOWIHT, you're not just buying clothes—you're supporting
              skilled artisans, sustainable practices, and timeless quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-white hover:bg-gray-900 transition-all duration-300 text-sm tracking-wider group"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-black hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-wider"
              >
                <span>OUR STORY</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}