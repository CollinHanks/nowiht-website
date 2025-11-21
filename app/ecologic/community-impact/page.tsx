import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community & Impact - Sustainable Fashion Movement",
  description: "Discover how NOWIHT creates positive social impact through ethical fashion. Learn about our community initiatives, fair trade practices, and commitment to empowering women artisans worldwide.",
  keywords: [
    "sustainable fashion community",
    "social impact fashion",
    "ethical clothing brands",
    "women empowerment fashion",
    "fair trade clothing",
    "community impact initiatives",
    "sustainable fashion movement",
  ],
  openGraph: {
    title: "Community & Impact - NOWIHT Sustainable Fashion",
    description: "Creating positive change through ethical fashion and community empowerment.",
    url: "https://nowiht.com/ecologic/community-impact",
    type: "article",
  },
};

export default function CommunityImpactPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900"></div>
          <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">
              ECOLOGIC
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-6 tracking-wide leading-tight">
              Community & Impact
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Building a sustainable future together through ethical practices and community empowerment
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed mb-8">
                At NOWIHT, we believe fashion is more than fabric—it's a force for positive change. Our commitment extends beyond creating beautiful, sustainable clothing to fostering thriving communities and empowering the people who bring our vision to life.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                Since our founding, we've built partnerships with artisan communities, supported fair wages, and invested in education programs that create lasting impact. Every piece you wear represents not just sustainable materials, but the dignity, skill, and dreams of the people who crafted it.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Our approach to social responsibility isn't an afterthought—it's woven into every decision we make, from sourcing to production to packaging. We're building a fashion industry that values people as much as profit, and communities as much as commerce.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Banner */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-light mb-2">500+</div>
                <p className="text-sm text-gray-400">Artisans Employed</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-light mb-2">12</div>
                <p className="text-sm text-gray-400">Partner Communities</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-light mb-2">100%</div>
                <p className="text-sm text-gray-400">Fair Wage Commitment</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-light mb-2">$2M+</div>
                <p className="text-sm text-gray-400">Community Investment</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact Areas */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide mb-4">
                Our Impact Pillars
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Creating meaningful change across multiple dimensions of social and environmental responsibility
              </p>
            </div>

            <div className="space-y-16 md:space-y-20">
              {/* Pillar 1: Women Empowerment */}
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="order-2 md:order-1">
                  <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">
                    Empowerment
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light mb-6">
                    Women Artisan Programs
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Over 85% of our artisans are women, many of whom are the primary breadwinners for their families. We provide not just fair wages 30% above industry standards, but also comprehensive skills training, childcare support, and leadership development programs.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Our partnership with local NGOs ensures these women have access to financial literacy education, healthcare, and opportunities for career advancement. We've seen countless stories of transformation—from single mothers achieving financial independence to young women becoming master craftspeople and training the next generation.
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>30% higher wages than industry standard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Free on-site childcare facilities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Annual skills development workshops</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Healthcare and maternity benefits</span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 md:order-2 aspect-[4/5] bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20"></div>
                </div>
              </div>

              {/* Pillar 2: Education Initiatives */}
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20"></div>
                </div>
                <div>
                  <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">
                    Education
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light mb-6">
                    Skills & Knowledge Transfer
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    We invest heavily in education, running technical training programs that teach modern sustainable fashion techniques while preserving traditional craftsmanship. Our workshops cover everything from organic fabric handling to circular design principles.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Beyond technical skills, we offer business literacy courses that help artisans understand pricing, negotiations, and entrepreneurship. Many of our graduates have gone on to start their own sustainable fashion micro-enterprises, multiplying our impact.
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>200+ hours of annual training per artisan</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Scholarships for advanced certification programs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Master artisan mentorship opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pillar 3: Local Economic Development */}
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="order-2 md:order-1">
                  <span className="text-sm tracking-[0.3em] text-gray-500 uppercase block mb-4">
                    Economic Growth
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light mb-6">
                    Building Thriving Communities
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Our commitment goes beyond individual workers to entire communities. We prioritize partnerships with rural and economically disadvantaged areas, bringing sustainable employment opportunities that help reverse urban migration and preserve cultural heritage.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Every production facility we partner with becomes an anchor employer, creating ripple effects throughout the local economy. From restaurants to childcare services to transportation, our presence helps build diverse, resilient community ecosystems.
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>100% local hiring in production communities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Infrastructure investment in partner regions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Support for community development projects</span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 md:order-2 aspect-[4/5] bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-orange-900/20"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
                Transparency & Accountability
              </h2>
              <p className="text-gray-600 text-lg">
                We believe in open, honest communication about our impact—both achievements and challenges
              </p>
            </div>

            <div className="bg-white p-8 md:p-12 border border-gray-200">
              <h3 className="text-xl md:text-2xl font-light mb-6">Our Commitments</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-lg mb-2">Annual Impact Reports</h4>
                  <p className="text-gray-600">
                    We publish comprehensive impact reports each year, detailing our social and environmental metrics, progress toward goals, and areas for improvement. No greenwashing—just honest data.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-2">Supply Chain Traceability</h4>
                  <p className="text-gray-600">
                    Every product includes information about where and by whom it was made. You can trace your garment's journey from cotton field to your closet through our blockchain-verified supply chain system.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-2">Third-Party Audits</h4>
                  <p className="text-gray-600">
                    Our facilities undergo regular independent audits by Fair Trade International and SA8000 certification bodies. We share these audit results publicly and address any issues proactively.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-2">Living Wage Commitment</h4>
                  <p className="text-gray-600">
                    We don't just pay minimum wage—we ensure all workers earn a living wage calculated based on local cost of living, updated annually. This commitment applies to every person in our supply chain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Goals */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
                2025-2027 Goals
              </h2>
              <p className="text-gray-600 text-lg">
                Our roadmap for expanding impact and deepening community partnerships
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-medium">
                  2025
                </div>
                <div>
                  <h3 className="text-xl font-light mb-2">Expand Artisan Network</h3>
                  <p className="text-gray-600">
                    Partner with 8 new artisan communities across Turkey and establish two new training centers focused on advanced sustainable textile techniques.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-medium">
                  2026
                </div>
                <div>
                  <h3 className="text-xl font-light mb-2">Education Fund Launch</h3>
                  <p className="text-gray-600">
                    Establish a $500,000 scholarship endowment for children of textile workers, providing sustained support for higher education and vocational training.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-medium">
                  2027
                </div>
                <div>
                  <h3 className="text-xl font-light mb-2">Full Supply Chain Transparency</h3>
                  <p className="text-gray-600">
                    Achieve 100% supply chain traceability with real-time worker welfare data accessible to customers through QR codes on every garment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-6">
              Join Our Movement
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Every purchase supports fair wages, empowers communities, and proves that fashion can be a force for good. Together, we're building an industry that values people.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all duration-300 tracking-wider group"
            >
              <span>SHOP WITH PURPOSE</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h3 className="text-2xl font-light text-center mb-10">Explore Our Sustainability Journey</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/ecologic/eco-friendly-materials" className="group p-6 bg-white border border-gray-200 hover:border-green-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-green-600">Eco-Friendly Materials</h4>
                <p className="text-sm text-gray-600">Organic cotton, biodegradable packaging & sustainable sourcing</p>
              </Link>
              <Link href="/ecologic/ethical-manufacturing" className="group p-6 bg-white border border-gray-200 hover:border-green-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-green-600">Ethical Manufacturing</h4>
                <p className="text-sm text-gray-600">Fair wages, safe conditions & transparent practices</p>
              </Link>
              <Link href="/ecologic/zero-waste-production" className="group p-6 bg-white border border-gray-200 hover:border-green-600 transition-all">
                <h4 className="font-medium mb-2 group-hover:text-green-600">Zero-Waste Production</h4>
                <p className="text-sm text-gray-600">Circular design, upcycling & waste elimination by 2027</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}