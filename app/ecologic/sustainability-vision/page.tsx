import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sustainability Vision 2027 - Regenerative Fashion Roadmap",
  description: "NOWIHT's 2027 sustainability vision: 100% organic materials, circular economy, zero waste, and regenerative practices that restore ecosystems.",
  keywords: ["sustainability vision", "circular fashion", "regenerative agriculture", "2027 sustainability goals", "fashion industry future"],
};

export default function SustainabilityVisionPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-800 to-emerald-900">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">ECOLOGIC</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">Sustainability Vision</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Our roadmap to regenerative fashion that heals the planet</p>
          </div>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-6">
          <p className="text-2xl font-light text-gray-800 mb-8">By 2027, NOWIHT will operate as a fully regenerative business—meaning our impact on the planet will be net positive. We won't just do less harm; we'll actively restore ecosystems, enrich communities, and prove fashion can be a force for healing.</p>
          <p className="text-lg text-gray-600 mb-6">This isn't greenwashing or vague aspirations. Every goal has measurable targets, quarterly milestones, and public accountability. We're building the fashion industry our planet deserves.</p>
        </section>

        <section className="py-16 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-light mb-8">2027 Core Commitments</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div><div className="text-5xl font-light mb-2">100%</div><p className="text-sm text-gray-400">Organic & Biodegradable Materials</p></div>
              <div><div className="text-5xl font-light mb-2">0kg</div><p className="text-sm text-gray-400">Waste to Landfill</p></div>
              <div><div className="text-5xl font-light mb-2">Net+</div><p className="text-sm text-gray-400">Positive Environmental Impact</p></div>
            </div>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">The Five Pillars of Our Vision</h2>
          </div>

          <div className="space-y-20">
            {/* Pillar 1 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm tracking-[0.3em] text-green-600 uppercase block mb-4">Pillar 1</span>
                <h3 className="text-3xl font-light mb-6">Circular Material Economy</h3>
                <p className="text-gray-600 mb-6">Linear "take-make-waste" models end in 2027. Every material we use will either be renewable (grown), recycled (from previous garments), or regeneratively sourced (improves ecosystems).</p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-3"><span className="text-green-600">→</span><span>100% organic cotton from regenerative farms</span></li>
                  <li className="flex gap-3"><span className="text-green-600">→</span><span>Take-back program: old NOWIHT pieces recycled into new fiber</span></li>
                  <li className="flex gap-3"><span className="text-green-600">→</span><span>Compostable packaging breaks down in 90 days</span></li>
                  <li className="flex gap-3"><span className="text-green-600">→</span><span>Zero virgin synthetic fibers</span></li>
                </ul>
              </div>
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">♻️</div>
                  <p className="text-gray-700 font-medium">Circular Economy</p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center order-2 md:order-1">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-gray-700 font-medium">Regenerative Systems</p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="text-sm tracking-[0.3em] text-blue-600 uppercase block mb-4">Pillar 2</span>
                <h3 className="text-3xl font-light mb-6">Regenerative Agriculture</h3>
                <p className="text-gray-600 mb-6">Cotton farming that restores soil health, increases biodiversity, and sequesters carbon. We partner with farms transitioning from conventional to regenerative practices, providing technical support and premium pricing.</p>
                <p className="text-gray-600 mb-6">By 2027, 100% of our cotton will come from farms using cover cropping, no-till methods, crop rotation, and integrated livestock—practices that turn farms into carbon sinks rather than sources.</p>
                <div className="bg-blue-50 p-6 border-l-4 border-blue-600">
                  <p className="text-sm text-gray-700">Our cotton farmers sequester an average of 1.2 tons of CO2 per hectare annually—offsetting emissions from textile production.</p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm tracking-[0.3em] text-purple-600 uppercase block mb-4">Pillar 3</span>
                <h3 className="text-3xl font-light mb-6">Social Equity</h3>
                <p className="text-gray-600 mb-6">Sustainability without justice isn't sustainability. By 2027, every person in our supply chain—from farmers to factory workers—earns a living wage with benefits, safe conditions, and opportunities for advancement.</p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-3"><span className="text-purple-600">→</span><span>Living wages 40% above industry average</span></li>
                  <li className="flex gap-3"><span className="text-purple-600">→</span><span>50% women in leadership positions</span></li>
                  <li className="flex gap-3"><span className="text-purple-600">→</span><span>$1M annual community development fund</span></li>
                  <li className="flex gap-3"><span className="text-purple-600">→</span><span>Full supply chain transparency via blockchain</span></li>
                </ul>
              </div>
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🤝</div>
                  <p className="text-gray-700 font-medium">Social Equity</p>
                </div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center order-2 md:order-1">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🔬</div>
                  <p className="text-gray-700 font-medium">Innovation Lab</p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="text-sm tracking-[0.3em] text-amber-600 uppercase block mb-4">Pillar 4</span>
                <h3 className="text-3xl font-light mb-6">Material Innovation</h3>
                <p className="text-gray-600 mb-6">We invest 15% of annual revenue into R&D for next-generation sustainable materials. Our innovation lab works with universities, startups, and biomaterial scientists to pioneer alternatives to conventional textiles.</p>
                <p className="text-gray-600 mb-6">Current projects: mycelium leather, seaweed fiber, bacterial cellulose, and recycled cotton blends that match virgin fiber quality. By 2027, at least 20% of our collection will feature breakthrough materials.</p>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm tracking-[0.3em] text-teal-600 uppercase block mb-4">Pillar 5</span>
                <h3 className="text-3xl font-light mb-6">Transparency & Education</h3>
                <p className="text-gray-600 mb-6">We publish everything: carbon data, supplier lists, wage breakdowns, audit reports, and even our failures. Our annual sustainability report meets GRI Standards and is independently verified.</p>
                <p className="text-gray-600 mb-6">Beyond reporting, we educate customers about sustainable fashion through our blog, workshops, and garment care guides that extend product life. When you buy NOWIHT, you join a community learning to consume more mindfully.</p>
              </div>
              <div className="aspect-square bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-700 font-medium">Full Transparency</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4">2024-2027 Timeline</h2>
              <p className="text-gray-600 text-lg">Quarterly milestones toward our vision</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-24 h-24 bg-green-600 text-white rounded-full flex flex-col items-center justify-center font-light">
                  <div className="text-sm">Q4</div>
                  <div className="text-2xl">2024</div>
                </div>
                <div className="flex-1 bg-white p-6 border border-gray-200">
                  <h3 className="text-xl font-medium mb-2">Foundation Complete</h3>
                  <p className="text-gray-600 text-sm">78% organic materials ✓ | Renewable energy 68% ✓ | Living wage policy ✓</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-24 h-24 bg-green-600 text-white rounded-full flex flex-col items-center justify-center font-light">
                  <div className="text-sm">Q2</div>
                  <div className="text-2xl">2025</div>
                </div>
                <div className="flex-1 bg-white p-6 border border-gray-200">
                  <h3 className="text-xl font-medium mb-2">Material Transition</h3>
                  <p className="text-gray-600 text-sm">90% organic cotton | Launch take-back program | Natural dyes scale-up</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-24 h-24 bg-green-600 text-white rounded-full flex flex-col items-center justify-center font-light">
                  <div className="text-sm">Q4</div>
                  <div className="text-2xl">2025</div>
                </div>
                <div className="flex-1 bg-white p-6 border border-gray-200">
                  <h3 className="text-xl font-medium mb-2">Circular Systems Online</h3>
                  <p className="text-gray-600 text-sm">95% biodegradable packaging | Recycling infrastructure | Blockchain traceability</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-24 h-24 bg-green-600 text-white rounded-full flex flex-col items-center justify-center font-light">
                  <div className="text-sm">Q2</div>
                  <div className="text-2xl">2026</div>
                </div>
                <div className="flex-1 bg-white p-6 border border-gray-200">
                  <h3 className="text-xl font-medium mb-2">Zero Waste Milestone</h3>
                  <p className="text-gray-600 text-sm">Zero landfill waste | 100% renewable energy | Carbon neutral operations</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-24 h-24 bg-green-600 text-white rounded-full flex flex-col items-center justify-center font-light">
                  <div className="text-sm">Q4</div>
                  <div className="text-2xl">2027</div>
                </div>
                <div className="flex-1 bg-white p-6 border-l-4 border-green-600">
                  <h3 className="text-xl font-medium mb-2">Vision Achieved</h3>
                  <p className="text-gray-600 text-sm mb-3">100% organic/biodegradable materials | Net positive impact | Full regenerative operations</p>
                  <p className="text-xs text-green-600 font-medium">GOAL: First fully regenerative fashion brand</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-6">Join the Movement</h2>
            <p className="text-lg text-gray-300 mb-8">This vision is only possible with customers who choose quality over quantity, purpose over trends, and planet over profit. Every purchase is a vote for the fashion industry we want to see.</p>
            <p className="text-gray-400 mb-10">By 2027, together, we'll prove that regenerative fashion isn't just possible—it's profitable, beautiful, and necessary.</p>
            <Link href="/shop" className="inline-flex items-center gap-3 px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all group">
              <span>SHOP THE VISION</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-light text-center mb-10">Explore Our Commitments</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/ecologic/eco-friendly-materials" className="group p-6 bg-white border hover:border-green-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-green-600">Eco-Friendly Materials</h4>
                <p className="text-sm text-gray-600">100% organic by 2027</p>
              </Link>
              <Link href="/ecologic/zero-waste-production" className="group p-6 bg-white border hover:border-green-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-green-600">Zero-Waste Production</h4>
                <p className="text-sm text-gray-600">No landfill waste by 2026</p>
              </Link>
              <Link href="/ecologic/carbon-footprint" className="group p-6 bg-white border hover:border-green-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-green-600">Carbon Neutrality</h4>
                <p className="text-sm text-gray-600">Net zero by 2028</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}