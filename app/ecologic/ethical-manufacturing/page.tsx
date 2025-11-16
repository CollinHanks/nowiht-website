import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ethical Manufacturing - Fair Wages & Safe Working Conditions",
  description: "NOWIHT's commitment to ethical production: fair wages 30% above industry standard, safe factories, transparent supply chain, and worker empowerment programs.",
  keywords: ["ethical fashion manufacturing", "fair trade clothing", "safe working conditions", "transparent supply chain", "fair wages fashion"],
};

export default function EthicalManufacturingPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">ECOLOGIC</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">Ethical Manufacturing</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Where every stitch represents dignity, safety, and fair compensation</p>
          </div>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-6">
          <p className="text-2xl font-light text-gray-800 mb-8">Ethical manufacturing isn't a buzzword at NOWIHT—it's our foundation. We believe the people who create our garments deserve respect, safety, fair wages, and opportunities for growth. No compromises.</p>
          <p className="text-lg text-gray-600">Our manufacturing partners undergo rigorous vetting, regular audits, and continuous improvement programs. We maintain long-term relationships built on mutual trust, not exploitation of cheap labor.</p>
        </section>

        <section className="py-16 bg-black text-white">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-5xl font-light mb-2">+30%</div><p className="text-sm text-gray-400">Above Industry Wage</p></div>
            <div><div className="text-5xl font-light mb-2">100%</div><p className="text-sm text-gray-400">Audited Factories</p></div>
            <div><div className="text-5xl font-light mb-2">8</div><p className="text-sm text-gray-400">Hours Max Workday</p></div>
            <div><div className="text-5xl font-light mb-2">0</div><p className="text-sm text-gray-400">Child Labor Tolerance</p></div>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">Fair Compensation</span>
              <h2 className="text-3xl md:text-4xl font-light mb-6">Living Wages, Not Minimum Wages</h2>
              <p className="text-gray-600 mb-6">We pay 30% above industry standard because minimum wage isn't enough to live with dignity. Our wage calculations factor in local cost of living, family size, healthcare needs, and savings potential.</p>
              <p className="text-gray-600 mb-6">Every worker receives a detailed pay statement, annual raises tied to skill development, performance bonuses, and profit-sharing. We want our artisans to thrive, not just survive.</p>
              <div className="bg-indigo-50 p-6 border-l-4 border-indigo-600">
                <h4 className="font-medium mb-2">Beyond Salary</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Paid maternity/paternity leave (6 months)</li>
                  <li>• Health insurance for entire family</li>
                  <li>• Annual bonus equal to 1 month salary</li>
                  <li>• Pension contribution (10% of salary)</li>
                  <li>• Educational stipend for workers' children</li>
                </ul>
              </div>
            </div>
            <div className="aspect-[4/5] bg-gradient-to-br from-indigo-100 to-purple-100"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="aspect-[4/5] bg-gradient-to-br from-pink-100 to-rose-100"></div>
            <div>
              <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">Safety First</span>
              <h2 className="text-3xl md:text-4xl font-light mb-6">World-Class Working Conditions</h2>
              <p className="text-gray-600 mb-6">Our factories meet ISO 45001 occupational health and safety standards. Proper lighting, ventilation, ergonomic workstations, fire safety systems, and regular safety training are non-negotiable.</p>
              <p className="text-gray-600 mb-6">Every facility has an on-site health clinic, emergency response team, and mental health support services. We track accident rates, near-misses, and worker feedback to continuously improve safety protocols.</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3"><span className="text-indigo-600">✓</span><span>Annual third-party safety audits</span></li>
                <li className="flex gap-3"><span className="text-indigo-600">✓</span><span>Emergency evacuation drills quarterly</span></li>
                <li className="flex gap-3"><span className="text-indigo-600">✓</span><span>Personal protective equipment provided</span></li>
                <li className="flex gap-3"><span className="text-indigo-600">✓</span><span>Zero tolerance for harassment</span></li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">Empowerment</span>
              <h2 className="text-3xl md:text-4xl font-light mb-6">Worker Rights & Voice</h2>
              <p className="text-gray-600 mb-6">Workers have the right to organize, form unions, and collectively bargain. We encourage open dialogue through worker committees that meet monthly with management to address concerns and suggest improvements.</p>
              <p className="text-gray-600 mb-6">Anonymous grievance systems, elected worker representatives, and regular surveys ensure every voice is heard. Our factories have promoted 45% of supervisors from within—proof that career growth is possible.</p>
              <div className="bg-purple-50 p-6 border-l-4 border-purple-600">
                <p className="text-sm text-gray-700 italic mb-3">"I started as a sewing machine operator 5 years ago. Now I'm production floor manager, training new artisans. NOWIHT gave me skills, respect, and a future I never imagined."</p>
                <p className="text-sm font-medium">— Elif M., Production Manager</p>
              </div>
            </div>
            <div className="aspect-[4/5] bg-gradient-to-br from-violet-100 to-purple-100"></div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-4">Supply Chain Transparency</h2>
              <p className="text-gray-600 text-lg">Know exactly where and how your clothes are made</p>
            </div>
            <div className="bg-white p-10 border border-gray-200 mb-8">
              <h3 className="text-2xl font-light mb-6">Full Traceability</h3>
              <p className="text-gray-600 mb-6">Every NOWIHT garment includes a QR code linking to its complete journey: cotton farm location, spinning mill, weaving facility, dyehouse, cut-and-sew factory, and quality control center.</p>
              <p className="text-gray-600 mb-6">You'll see photos of the facilities, meet the artisan teams, learn about working conditions, and view recent audit reports. No secrets, no hidden corners, just radical transparency.</p>
            </div>
            <div className="bg-white p-10 border border-gray-200">
              <h3 className="text-2xl font-light mb-6">Independent Audits</h3>
              <p className="text-gray-600 mb-4">Our factories undergo unannounced audits by Fair Wear Foundation, SA8000 certification bodies, and local labor rights NGOs. Audit reports—including areas for improvement—are published on our website.</p>
              <p className="text-gray-600">We don't claim perfection. When issues arise, we address them immediately, invest in corrective actions, and report progress publicly. Accountability matters more than flawless PR.</p>
            </div>
          </div>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4">Certifications & Standards</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-gray-200">
              <h3 className="text-xl font-medium mb-3">Fair Trade Certified</h3>
              <p className="text-gray-600 text-sm">International Fair Trade standards for worker welfare, environmental practices, and community development.</p>
            </div>
            <div className="p-6 border border-gray-200">
              <h3 className="text-xl font-medium mb-3">SA8000 Social Accountability</h3>
              <p className="text-gray-600 text-sm">Comprehensive social accountability covering child labor, forced labor, health & safety, and worker rights.</p>
            </div>
            <div className="p-6 border border-gray-200">
              <h3 className="text-xl font-medium mb-3">B Corp Certified</h3>
              <p className="text-gray-600 text-sm">Verified social and environmental performance, transparency, and legal accountability to all stakeholders.</p>
            </div>
            <div className="p-6 border border-gray-200">
              <h3 className="text-xl font-medium mb-3">Fair Wear Foundation</h3>
              <p className="text-gray-600 text-sm">Independent verification of fair labor practices throughout the garment supply chain.</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="text-sm tracking-[0.3em] text-gray-400 uppercase block mb-4">Our Promise</span>
            <h2 className="text-4xl md:text-5xl font-light mb-6">People Before Profit</h2>
            <p className="text-lg text-gray-300 mb-8">We could cut costs by exploiting workers. We could ignore safety standards. We could hide our supply chain. But we won't. Ever.</p>
            <p className="text-gray-400 mb-10">Ethical manufacturing costs more, but it's the only way to build fashion that honors human dignity. When you choose NOWIHT, you're voting for a better industry.</p>
            <Link href="/shop" className="inline-flex items-center gap-3 px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all group">
              <span>SHOP ETHICALLY</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-light text-center mb-10">Learn More</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/ecologic/community-impact" className="group p-6 bg-white border hover:border-indigo-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-indigo-600">Community Impact</h4>
                <p className="text-sm text-gray-600">How we empower artisan communities</p>
              </Link>
              <Link href="/ecologic/eco-friendly-materials" className="group p-6 bg-white border hover:border-indigo-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-indigo-600">Eco-Friendly Materials</h4>
                <p className="text-sm text-gray-600">Organic cotton and sustainable fabrics</p>
              </Link>
              <Link href="/ecologic/sustainability-vision" className="group p-6 bg-white border hover:border-indigo-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-indigo-600">2027 Vision</h4>
                <p className="text-sm text-gray-600">Our roadmap to regenerative fashion</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}