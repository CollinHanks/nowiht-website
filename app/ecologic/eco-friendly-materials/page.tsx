import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eco-Friendly Materials - Organic Cotton & Sustainable Fabrics",
  description: "Discover NOWIHT's commitment to organic cotton, biodegradable packaging, and sustainable materials. Learn about our 2027 goal for 100% eco-friendly production.",
  keywords: ["organic cotton clothing", "biodegradable packaging", "sustainable fabrics", "eco-friendly materials", "organic textiles", "GOTS certified cotton"],
};

export default function EcoFriendlyMaterialsPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">ECOLOGIC</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">Eco-Friendly Materials</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">From seed to garment, every material choice reflects our commitment to the planet</p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-20 max-w-4xl mx-auto px-6">
          <p className="text-2xl font-light text-gray-800 mb-8">At NOWIHT, we believe that truly sustainable fashion starts with the raw materials. Every fiber, thread, and packaging element is carefully selected to minimize environmental impact while maximizing quality and comfort.</p>
          <p className="text-lg text-gray-600 mb-6">Our journey toward 100% organic and biodegradable materials by 2027 is well underway. Currently at 78% organic material usage, we're accelerating our R&D efforts to ensure every component of our products can safely return to the earth.</p>
        </section>

        {/* Stats */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-5xl font-light mb-2">78%</div><p className="text-sm text-gray-400">Organic Materials</p></div>
            <div><div className="text-5xl font-light mb-2">100%</div><p className="text-sm text-gray-400">GOTS Certified Cotton</p></div>
            <div><div className="text-5xl font-light mb-2">0</div><p className="text-sm text-gray-400">Synthetic Fibers</p></div>
            <div><div className="text-5xl font-light mb-2">2027</div><p className="text-sm text-gray-400">Full Organic Target</p></div>
          </div>
        </section>

        {/* Organic Cotton */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">Primary Material</span>
              <h2 className="text-3xl md:text-4xl font-light mb-6">100% Organic Cotton</h2>
              <p className="text-gray-600 mb-6">Every garment begins with certified organic cotton, grown without synthetic pesticides, herbicides, or GMO seeds. Our cotton partners practice regenerative agriculture, enriching soil health and biodiversity.</p>
              <p className="text-gray-600 mb-6">We source from family-owned farms in Turkey, Egypt, and India where farmers use traditional crop rotation, natural pest control, and rainwater harvesting. This approach uses 91% less water than conventional cotton farming.</p>
              <div className="bg-green-50 p-6 border-l-4 border-green-600">
                <h4 className="font-medium mb-2">GOTS Certification</h4>
                <p className="text-sm text-gray-700">Global Organic Textile Standard ensures our entire supply chain—from field to finished product—meets the highest organic and social criteria.</p>
              </div>
            </div>
            <div className="aspect-[4/5] bg-gradient-to-br from-green-100 to-emerald-100"></div>
          </div>

          {/* Natural Dyes */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="aspect-[4/5] bg-gradient-to-br from-amber-100 to-orange-100"></div>
            <div>
              <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">Color Innovation</span>
              <h2 className="text-3xl md:text-4xl font-light mb-6">Plant-Based Dyes</h2>
              <p className="text-gray-600 mb-6">We're pioneering the use of natural dyes extracted from plants, minerals, and food waste. Our black comes from oak galls and iron, earthy tones from madder root and turmeric, and blues from indigo.</p>
              <p className="text-gray-600 mb-6">By 2026, 60% of our collection will use exclusively natural dyes. The remaining colors utilize low-impact dyes that meet OEKO-TEX standards, ensuring no harmful chemicals touch your skin or the environment.</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3"><span className="text-green-600">✓</span><span>Zero heavy metals or toxic chemicals</span></li>
                <li className="flex gap-3"><span className="text-green-600">✓</span><span>Wastewater safe for irrigation</span></li>
                <li className="flex gap-3"><span className="text-green-600">✓</span><span>Biodegradable color compounds</span></li>
              </ul>
            </div>
          </div>

          {/* Threads */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">Construction</span>
              <h2 className="text-3xl md:text-4xl font-light mb-6">Recycled & Organic Threads</h2>
              <p className="text-gray-600 mb-6">Our sewing threads are 100% recycled polyester that meets GRS (Global Recycled Standard) certification. Each spool prevents plastic waste from entering landfills while maintaining superior strength.</p>
              <p className="text-gray-600 mb-6">We're actively developing organic cotton thread alternatives and testing innovative options like recycled fishing net fibers. Quality and durability remain non-negotiable—your garments must last for years, not seasons.</p>
            </div>
            <div className="aspect-[4/5] bg-gradient-to-br from-blue-100 to-cyan-100"></div>
          </div>
        </section>

        {/* Packaging Revolution */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-4">Biodegradable Packaging</h2>
              <p className="text-gray-600 text-lg">When you're done with it, it becomes food for plants</p>
            </div>
            <div className="bg-white p-10 border border-gray-200">
              <h3 className="text-2xl font-light mb-6">Compostable Shipping Bags</h3>
              <p className="text-gray-600 mb-6">Our signature packaging bags are made from cornstarch and cassava root—100% plant-based materials that decompose in home compost within 90-180 days. When buried in soil, they break down into water, CO2, and biomass that enriches the earth.</p>
              <p className="text-gray-600 mb-6">Unlike "biodegradable plastic" that leaves microplastic residue, our bags completely disappear, leaving behind nutrients. They're even certified for marine biodegradation, so if they accidentally enter waterways, they won't harm aquatic life.</p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 bg-green-50">
                  <div className="text-3xl font-light mb-2">90</div>
                  <p className="text-sm text-gray-600">Days to compost at home</p>
                </div>
                <div className="text-center p-4 bg-green-50">
                  <div className="text-3xl font-light mb-2">0</div>
                  <p className="text-sm text-gray-600">Microplastics left behind</p>
                </div>
                <div className="text-center p-4 bg-green-50">
                  <div className="text-3xl font-light mb-2">100%</div>
                  <p className="text-sm text-gray-600">Plant-based ingredients</p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white p-10 border border-gray-200">
              <h3 className="text-2xl font-light mb-6">Recycled Paper & Natural Inks</h3>
              <p className="text-gray-600 mb-4">All hang tags, care labels, and packaging inserts use FSC-certified recycled paper printed with soy-based inks. No plastic poly bags, no synthetic ribbons, no glossy coatings that prevent recycling.</p>
              <p className="text-gray-600">Even our garment labels are woven from organic cotton rather than synthetic polyester. Every detail matters when your goal is complete circularity.</p>
            </div>
          </div>
        </section>

        {/* R&D Section */}
        <section className="py-20 max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4">Innovation Pipeline</h2>
            <p className="text-gray-600 text-lg">Materials we're developing for future collections</p>
          </div>
          <div className="space-y-8">
            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-medium mb-2">Mushroom Leather Alternative</h3>
              <p className="text-gray-600">Mycelium-based material for accessories and trim. Grows in 2 weeks, biodegrades in months, feels like premium leather.</p>
            </div>
            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-medium mb-2">Seaweed Fiber Blends</h3>
              <p className="text-gray-600">Cellulose from sustainably harvested seaweed creates silky, moisture-wicking fabric with natural antimicrobial properties.</p>
            </div>
            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-medium mb-2">Recycled Cotton from Garments</h3>
              <p className="text-gray-600">Closed-loop system turning old NOWIHT pieces back into new fiber. Launching 2026 with our take-back program.</p>
            </div>
            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-medium mb-2">Bacterial Cellulose</h3>
              <p className="text-gray-600">Lab-grown fabric from fermented bacteria. Zero land use, zero pesticides, grown in weeks instead of months.</p>
            </div>
          </div>
        </section>

        {/* 2027 Vision */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="text-sm tracking-[0.3em] text-gray-400 uppercase block mb-4">2027 Goal</span>
            <h2 className="text-4xl md:text-5xl font-light mb-6">100% Organic & Biodegradable</h2>
            <p className="text-lg text-gray-300 mb-8">By 2027, every single component—fiber, thread, button, zipper, label, packaging—will either be organic or fully biodegradable. If you bury a NOWIHT garment, it will return to the earth as nutrients, not pollution.</p>
            <p className="text-gray-400 mb-10">We're investing 15% of annual revenue into materials R&D to make this vision reality. The future of fashion is circular, regenerative, and beautiful.</p>
            <Link href="/shop" className="inline-flex items-center gap-3 px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all group">
              <span>SHOP SUSTAINABLE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Related */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-light text-center mb-10">Continue Exploring</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/ecologic/zero-waste-production" className="group p-6 bg-white border hover:border-green-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-green-600">Zero-Waste Production</h4>
                <p className="text-sm text-gray-600">How we're eliminating waste at every production stage</p>
              </Link>
              <Link href="/ecologic/ethical-manufacturing" className="group p-6 bg-white border hover:border-green-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-green-600">Ethical Manufacturing</h4>
                <p className="text-sm text-gray-600">Fair wages and safe conditions for every artisan</p>
              </Link>
              <Link href="/ecologic/carbon-footprint" className="group p-6 bg-white border hover:border-green-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-green-600">Carbon Footprint</h4>
                <p className="text-sm text-gray-600">Measuring and reducing our climate impact</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}