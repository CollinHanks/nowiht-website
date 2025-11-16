import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Carbon Footprint - Climate Action & Carbon Neutrality",
  description: "NOWIHT's carbon footprint measurement, reduction strategy, and path to carbon neutrality. Transparent climate action with renewable energy and offset programs.",
  keywords: ["carbon footprint fashion", "carbon neutral clothing", "climate action fashion", "renewable energy manufacturing", "sustainable supply chain"],
};

export default function CarbonFootprintPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">ECOLOGIC</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">Our Carbon Footprint</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Measuring, reducing, and offsetting our climate impact with science-based targets</p>
          </div>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-6">
          <p className="text-2xl font-light text-gray-800 mb-8">Climate change is the defining challenge of our generation. At NOWIHT, we're taking responsibility for our carbon emissions across the entire value chain—from cotton fields to customer doorsteps.</p>
          <p className="text-lg text-gray-600 mb-6">We measure our carbon footprint annually using the Greenhouse Gas Protocol, set science-based reduction targets, and invest in verified carbon removal projects. Transparency and accountability guide every decision.</p>
        </section>

        <section className="py-16 bg-black text-white">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-5xl font-light mb-2">2.1kg</div><p className="text-sm text-gray-400">CO2e per Garment</p></div>
            <div><div className="text-5xl font-light mb-2">-42%</div><p className="text-sm text-gray-400">Reduction Since 2020</p></div>
            <div><div className="text-5xl font-light mb-2">68%</div><p className="text-sm text-gray-400">Renewable Energy</p></div>
            <div><div className="text-5xl font-light mb-2">2028</div><p className="text-sm text-gray-400">Carbon Neutral Target</p></div>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">Where Our Emissions Come From</h2>
            <p className="text-gray-600 text-lg">Breaking down our carbon footprint by source</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <div className="text-5xl font-light mb-4 text-blue-900">38%</div>
              <h3 className="text-xl font-medium mb-3">Raw Materials</h3>
              <p className="text-gray-700 text-sm mb-4">Cotton farming, fiber processing, dyeing, and textile production</p>
              <p className="text-xs text-gray-600">Reduction strategy: Organic cotton (91% less water/energy), natural dyes, local sourcing</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="text-5xl font-light mb-4 text-green-900">31%</div>
              <h3 className="text-xl font-medium mb-3">Manufacturing</h3>
              <p className="text-gray-700 text-sm mb-4">Cutting, sewing, finishing, quality control, and packaging</p>
              <p className="text-xs text-gray-600">Reduction strategy: Solar-powered factories, energy-efficient equipment, waste heat recovery</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <div className="text-5xl font-light mb-4 text-purple-900">24%</div>
              <h3 className="text-xl font-medium mb-3">Transportation</h3>
              <p className="text-gray-700 text-sm mb-4">Shipping materials, finished goods, and customer deliveries</p>
              <p className="text-xs text-gray-600">Reduction strategy: Sea freight over air, electric delivery vehicles, consolidated shipments</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <div className="text-4xl font-light mb-4 text-amber-900">5%</div>
              <h3 className="text-xl font-medium mb-3">Retail & Operations</h3>
              <p className="text-gray-700 text-sm mb-4">Office energy, warehousing, packaging</p>
              <p className="text-xs text-gray-600">100% renewable electricity, LED lighting, smart HVAC</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
              <div className="text-4xl font-light mb-4 text-red-900">2%</div>
              <h3 className="text-xl font-medium mb-3">End-of-Life</h3>
              <p className="text-gray-700 text-sm mb-4">Garment disposal, recycling, decomposition</p>
              <p className="text-xs text-gray-600">Take-back program, biodegradable materials</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4">Our Reduction Strategy</h2>
              <p className="text-gray-600 text-lg">Science-based targets aligned with 1.5°C warming limit</p>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 border-l-4 border-blue-600">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-light">Renewable Energy Transition</h3>
                  <span className="text-3xl font-light text-blue-600">68%</span>
                </div>
                <p className="text-gray-600 mb-4">Our partner factories now run on 68% renewable energy—mostly solar panels installed on factory roofs. Target: 100% by 2026.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 2.4 MW solar capacity installed across 4 facilities</li>
                  <li>• Power Purchase Agreements for wind energy (Turkey, India)</li>
                  <li>• Energy storage systems for 24/7 clean power</li>
                  <li>• Grid electricity offset with Renewable Energy Certificates</li>
                </ul>
              </div>

              <div className="bg-white p-8 border-l-4 border-green-600">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-light">Circular Material Flows</h3>
                  <span className="text-3xl font-light text-green-600">-35%</span>
                </div>
                <p className="text-gray-600 mb-4">Switching to organic cotton, natural dyes, and biodegradable packaging has cut material emissions by 35% per garment since 2020.</p>
                <p className="text-gray-600 text-sm">By 2027, all materials will be either renewable, recycled, or regeneratively grown—eliminating virgin synthetic fibers entirely.</p>
              </div>

              <div className="bg-white p-8 border-l-4 border-purple-600">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-light">Smart Logistics</h3>
                  <span className="text-3xl font-light text-purple-600">-28%</span>
                </div>
                <p className="text-gray-600 mb-4">We've optimized shipping routes, eliminated air freight for non-urgent orders, and partnered with carbon-neutral delivery services.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 100% sea freight for international shipments (vs. air)</li>
                  <li>• Electric vehicle fleet for last-mile delivery (major cities)</li>
                  <li>• Packaging optimization reduces box sizes by 40%</li>
                  <li>• Regional warehouses minimize transport distances</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4">Carbon Offset Program</h2>
            <p className="text-gray-600 text-lg">Investing in verified carbon removal while we work toward zero emissions</p>
          </div>

          <p className="text-gray-700 mb-8">We offset 100% of our remaining emissions through Gold Standard certified projects. But we're clear: offsets are temporary. Our priority is eliminating emissions at the source, not buying our way out.</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 p-6 border border-green-200">
              <h3 className="text-xl font-medium mb-3">Reforestation Projects</h3>
              <p className="text-gray-700 text-sm mb-3">Native forest restoration in Turkey and India. Trees sequester CO2 while rebuilding ecosystems and supporting local communities.</p>
              <p className="text-xs text-gray-600">Partner: Eden Reforestation Projects</p>
            </div>
            <div className="bg-blue-50 p-6 border border-blue-200">
              <h3 className="text-xl font-medium mb-3">Renewable Energy Access</h3>
              <p className="text-gray-700 text-sm mb-3">Funding solar installations for off-grid communities, displacing kerosene lamps and diesel generators.</p>
              <p className="text-xs text-gray-600">Partner: Solar Sister Initiative</p>
            </div>
            <div className="bg-cyan-50 p-6 border border-cyan-200">
              <h3 className="text-xl font-medium mb-3">Clean Cookstoves</h3>
              <p className="text-gray-700 text-sm mb-3">Distributing efficient cookstoves that reduce firewood consumption by 60%, cutting emissions and improving health.</p>
              <p className="text-xs text-gray-600">Partner: Gold Standard Foundation</p>
            </div>
            <div className="bg-purple-50 p-6 border border-purple-200">
              <h3 className="text-xl font-medium mb-3">Ocean Plastic Removal</h3>
              <p className="text-gray-700 text-sm mb-3">Supporting ocean cleanup efforts. While not direct carbon removal, preventing plastic pollution is critical for ocean health.</p>
              <p className="text-xs text-gray-600">Partner: The Ocean Cleanup</p>
            </div>
          </div>

          <div className="mt-12 bg-gray-100 p-8 border border-gray-300">
            <h3 className="text-xl font-medium mb-3">Transparency Commitment</h3>
            <p className="text-gray-700 mb-4">Every offset credit is publicly verifiable. We publish certificates, retirement receipts, and project impact reports in our annual sustainability report.</p>
            <Link href="/about" className="text-blue-600 hover:underline text-sm font-medium">View Latest Sustainability Report →</Link>
          </div>
        </section>

        <section className="py-20 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="text-sm tracking-[0.3em] text-gray-400 uppercase block mb-4">2028 Goal</span>
            <h2 className="text-4xl md:text-5xl font-light mb-6">Carbon Neutral Across Value Chain</h2>
            <p className="text-lg text-gray-300 mb-8">By 2028, we will achieve carbon neutrality through 90% emission reductions and 10% high-quality offsets. By 2035, net-zero without offsets.</p>
            <p className="text-gray-400 mb-10">Climate action isn't optional—it's urgent. Every garment you choose from NOWIHT supports the transition to a regenerative fashion industry.</p>
            <Link href="/shop" className="inline-flex items-center gap-3 px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all group">
              <span>SHOP CLIMATE-CONSCIOUS</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-light text-center mb-10">Related Topics</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/ecologic/sustainability-vision" className="group p-6 bg-white border hover:border-blue-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-blue-600">Sustainability Vision</h4>
                <p className="text-sm text-gray-600">Our 2027 roadmap to regenerative fashion</p>
              </Link>
              <Link href="/ecologic/eco-friendly-materials" className="group p-6 bg-white border hover:border-blue-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-blue-600">Eco-Friendly Materials</h4>
                <p className="text-sm text-gray-600">Low-carbon organic materials</p>
              </Link>
              <Link href="/ecologic/zero-waste-production" className="group p-6 bg-white border hover:border-blue-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-blue-600">Zero-Waste Production</h4>
                <p className="text-sm text-gray-600">Eliminating waste at every stage</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}