import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zero-Waste Production - Circular Design & Upcycling",
  description: "NOWIHT's zero-waste production strategy: pattern optimization, textile scrap upcycling, compostable materials, and our 2027 goal of zero landfill waste.",
  keywords: ["zero waste fashion", "circular design", "textile waste reduction", "upcycling fashion", "waste elimination"],
};

export default function ZeroWasteProductionPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">ECOLOGIC</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">Zero-Waste Production</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Redesigning fashion to eliminate waste at every stage—from design to end-of-life</p>
          </div>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-6">
          <p className="text-2xl font-light text-gray-800 mb-8">The fashion industry produces 92 million tons of textile waste annually. At NOWIHT, we're proving there's another way: zero-waste production through circular design, material innovation, and relentless optimization.</p>
          <p className="text-lg text-gray-600 mb-6">By 2027, not a single thread, button, or packaging scrap from our operations will end up in landfills. Everything will be reused, recycled, composted, or regenerated into new products.</p>
        </section>

        <section className="py-16 bg-black text-white">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-5xl font-light mb-2">94%</div><p className="text-sm text-gray-400">Waste Reduction Since 2020</p></div>
            <div><div className="text-5xl font-light mb-2">0.2kg</div><p className="text-sm text-gray-400">Waste per Garment</p></div>
            <div><div className="text-5xl font-light mb-2">100%</div><p className="text-sm text-gray-400">Textile Scraps Upcycled</p></div>
            <div><div className="text-5xl font-light mb-2">2027</div><p className="text-sm text-gray-400">Zero Landfill Target</p></div>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">Our Zero-Waste Strategy</h2>
            <p className="text-gray-600 text-lg">Five interconnected approaches to waste elimination</p>
          </div>

          <div className="space-y-16">
            {/* Strategy 1 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">Design Phase</span>
                <h3 className="text-3xl font-light mb-6">Zero-Waste Pattern Making</h3>
                <p className="text-gray-600 mb-6">Traditional garment patterns waste 15-20% of fabric. Our designers use zero-waste pattern techniques that utilize 100% of textile yardage. Each cut piece interlocks like a puzzle—no unusable scraps.</p>
                <p className="text-gray-600 mb-6">Our pattern library is fully digital, reducing paper waste. Prototypes use recycled toile fabric, and final samples become archive pieces or staff uniforms—never trash.</p>
                <div className="bg-gray-50 p-6 border-l-4 border-gray-800">
                  <h4 className="font-medium mb-2">Impact:</h4>
                  <p className="text-sm text-gray-700">Zero-waste patterns save 3.2 tons of fabric annually across our production—equivalent to 8,000 t-shirts worth of material.</p>
                </div>
              </div>
              <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-slate-100"></div>
            </div>

            {/* Strategy 2 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="aspect-[4/5] bg-gradient-to-br from-green-100 to-emerald-100"></div>
              <div>
                <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">Production Phase</span>
                <h3 className="text-3xl font-light mb-6">Scrap Transformation</h3>
                <p className="text-gray-600 mb-6">Inevitable fabric scraps (selvages, test cuts, quality rejects) never see a landfill. We've built an upcycling system that transforms waste into value:</p>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex gap-3"><span className="text-green-600">•</span><span>Large scraps → Accessories (bags, headbands, scrunchies)</span></li>
                  <li className="flex gap-3"><span className="text-green-600">•</span><span>Medium pieces → Stuffing for packaging pillows</span></li>
                  <li className="flex gap-3"><span className="text-green-600">•</span><span>Small remnants → Fiber recovery (shredded into new yarn)</span></li>
                  <li className="flex gap-3"><span className="text-green-600">•</span><span>Organic cotton scraps → Industrial composting</span></li>
                </ul>
                <p className="text-gray-600 text-sm">Our "Scrap Collection" uses 100% production waste to create limited-edition accessories. Customers love the unique, one-of-a-kind pieces—and waste becomes revenue.</p>
              </div>
            </div>

            {/* Strategy 3 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">End-of-Life Phase</span>
                <h3 className="text-3xl font-light mb-6">Take-Back & Recycling Program</h3>
                <p className="text-gray-600 mb-6">Launching Q2 2025: Customers return worn-out NOWIHT garments for store credit. We sort items into three streams:</p>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-600">
                    <h4 className="font-medium mb-1">Still Wearable</h4>
                    <p className="text-sm text-gray-700">Cleaned, repaired, resold as "Pre-Loved Collection" at 40% discount</p>
                  </div>
                  <div className="p-4 bg-purple-50 border-l-4 border-purple-600">
                    <h4 className="font-medium mb-1">Beyond Repair</h4>
                    <p className="text-sm text-gray-700">Sent to mechanical recycling partner. Cotton fiber extracted and respun into new yarn</p>
                  </div>
                  <div className="p-4 bg-green-50 border-l-4 border-green-600">
                    <h4 className="font-medium mb-1">Biodegradable Items</h4>
                    <p className="text-sm text-gray-700">Industrial composting facilities. Returns to soil as nutrients within 6 months</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Target: 30% of sold garments returned by 2027, closing the loop on our production cycle.</p>
              </div>
              <div className="aspect-[4/5] bg-gradient-to-br from-purple-100 to-pink-100"></div>
            </div>

            {/* Strategy 4 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="aspect-[4/5] bg-gradient-to-br from-amber-100 to-orange-100"></div>
              <div>
                <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">Packaging Innovation</span>
                <h3 className="text-3xl font-light mb-6">Compostable Everything</h3>
                <p className="text-gray-600 mb-6">Our packaging generates zero landfill waste because it's designed to disappear safely:</p>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex gap-3"><span className="text-amber-600">✓</span><span>Shipping bags: Cornstarch-based, home compostable (90 days)</span></li>
                  <li className="flex gap-3"><span className="text-amber-600">✓</span><span>Hang tags: Seed paper—plant it, grows wildflowers</span></li>
                  <li className="flex gap-3"><span className="text-amber-600">✓</span><span>Care labels: Woven organic cotton, removable, compostable</span></li>
                  <li className="flex gap-3"><span className="text-amber-600">✓</span><span>Protective wrap: Recycled paper, soy-based ink</span></li>
                  <li className="flex gap-3"><span className="text-amber-600">✓</span><span>Tape: Natural rubber adhesive, paper backing</span></li>
                </ul>
                <p className="text-gray-600 text-sm">Customer instructions included: "Throw this bag in your compost bin!" Turns waste into a gardening opportunity.</p>
              </div>
            </div>

            {/* Strategy 5 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">Factory Operations</span>
                <h3 className="text-3xl font-light mb-6">Closed-Loop Manufacturing</h3>
                <p className="text-gray-600 mb-6">Our partner factories operate with zero-waste principles: all water recycled and reused, energy from renewable sources, and material flow optimized to eliminate excess.</p>
                <p className="text-gray-600 mb-6">Cutting room offcuts fed directly to fiber recycling machines on-site. Thread ends collected and respun. Even sewing machine oil is bio-based and biodegradable.</p>
                <div className="bg-gray-100 p-6 border-l-4 border-gray-800">
                  <p className="text-sm text-gray-700 mb-3">"Implementing zero-waste systems wasn't just environmentally right—it saved us money. Less waste means more efficient material use. NOWIHT supported us through the transition."</p>
                  <p className="text-sm font-medium">— Factory Manager, Turkey Production Facility</p>
                </div>
              </div>
              <div className="aspect-[4/5] bg-gradient-to-br from-teal-100 to-cyan-100"></div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4">Current Waste Breakdown</h2>
              <p className="text-gray-600 text-lg">Where our minimal waste comes from (and where it goes)</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-gray-200">
                <div className="text-4xl font-light mb-3 text-gray-800">0.14kg</div>
                <h3 className="font-medium mb-2">Textile Scraps</h3>
                <p className="text-sm text-gray-600 mb-3">Per garment after zero-waste patterns</p>
                <p className="text-xs text-green-600 font-medium">→ 100% upcycled into accessories</p>
              </div>
              <div className="bg-white p-6 border border-gray-200">
                <div className="text-4xl font-light mb-3 text-gray-800">0.04kg</div>
                <h3 className="font-medium mb-2">Thread & Trim Waste</h3>
                <p className="text-sm text-gray-600 mb-3">Thread ends, button scraps</p>
                <p className="text-xs text-green-600 font-medium">→ Fiber recovery & composting</p>
              </div>
              <div className="bg-white p-6 border border-gray-200">
                <div className="text-4xl font-light mb-3 text-gray-800">0.02kg</div>
                <h3 className="font-medium mb-2">Packaging Waste</h3>
                <p className="text-sm text-gray-600 mb-3">Test samples, protective materials</p>
                <p className="text-xs text-green-600 font-medium">→ Home/industrial composting</p>
              </div>
            </div>

            <div className="mt-12 bg-white p-10 border-l-4 border-green-600">
              <h3 className="text-2xl font-light mb-4">Total: 0.2kg waste per garment</h3>
              <p className="text-gray-600 mb-4">Industry average: 2.1kg per garment. We're at 90% reduction—on track for 100% by 2027.</p>
              <p className="text-sm text-gray-700">That final 0.2kg? Currently composted or recycled. By 2027, eliminated entirely through advanced pattern optimization and circular material systems.</p>
            </div>
          </div>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4">Customer Role in Zero-Waste</h2>
            <p className="text-gray-600 text-lg">How you can close the loop with us</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 border border-gray-200">
              <h3 className="text-xl font-medium mb-3">Care for Longevity</h3>
              <p className="text-gray-600 mb-3">Wash cold, line dry, repair small tears. Our garments are designed to last 10+ years with proper care—reducing the need for replacement.</p>
              <Link href="/customer-care/size-guide" className="text-sm text-gray-800 hover:underline font-medium">View Care Guide →</Link>
            </div>

            <div className="bg-white p-8 border border-gray-200">
              <h3 className="text-xl font-medium mb-3">Return for Recycling</h3>
              <p className="text-gray-600 mb-3">When your NOWIHT piece reaches end-of-life, send it back. We'll give you store credit and ensure it's recycled or composted properly.</p>
              <p className="text-sm text-green-600 font-medium">Launching Q2 2025 • Join waitlist at checkout</p>
            </div>

            <div className="bg-white p-8 border border-gray-200">
              <h3 className="text-xl font-medium mb-3">Compost Packaging</h3>
              <p className="text-gray-600 mb-3">Don't trash our bags—compost them! If you don't have home compost, check for municipal programs or give it to a gardening friend.</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="text-sm tracking-[0.3em] text-gray-400 uppercase block mb-4">2027 Target</span>
            <h2 className="text-4xl md:text-5xl font-light mb-6">Absolute Zero to Landfill</h2>
            <p className="text-lg text-gray-300 mb-8">By 2027, NOWIHT operations will generate zero landfill waste. Every material will have a second life—upcycled, recycled, or composted. Waste becomes a design flaw of the past.</p>
            <p className="text-gray-400 mb-10">This isn't a distant dream. We're 94% there. Join us for the final mile.</p>
            <Link href="/shop" className="inline-flex items-center gap-3 px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all group">
              <span>SHOP ZERO-WASTE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-light text-center mb-10">Complete the Circle</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/ecologic/eco-friendly-materials" className="group p-6 bg-white border hover:border-gray-800 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-gray-800">Eco-Friendly Materials</h4>
                <p className="text-sm text-gray-600">Biodegradable inputs for zero-waste outputs</p>
              </Link>
              <Link href="/ecologic/sustainability-vision" className="group p-6 bg-white border hover:border-gray-800 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-gray-800">2027 Vision</h4>
                <p className="text-sm text-gray-600">Our circular economy roadmap</p>
              </Link>
              <Link href="/ecologic/community-impact" className="group p-6 bg-white border hover:border-gray-800 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-gray-800">Community Impact</h4>
                <p className="text-sm text-gray-600">Zero-waste benefits workers too</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}