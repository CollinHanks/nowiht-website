import Link from "next/link";
import { ArrowRight, Heart, Users, Leaf, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers - Join Our Team at NOWIHT",
  description: "Join NOWIHT's mission to revolutionize sustainable fashion. Explore career opportunities, company culture, benefits, and open positions in our growing team.",
  keywords: ["fashion careers", "sustainable fashion jobs", "NOWIHT careers", "fashion industry jobs", "ethical fashion employment"],
};

export default function CareersPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">CAREERS</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">Join Our Team</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">Build the future of sustainable fashion with passionate people who care about the planet</p>
            <Link href="#open-positions" className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black hover:bg-gray-200 transition-all group">
              <span className="font-medium tracking-wider">VIEW OPEN POSITIONS</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Company Mission */}
        <section className="py-20 max-w-4xl mx-auto px-6">
          <p className="text-2xl font-light text-gray-800 mb-8">At NOWIHT, we're not just making clothes—we're building a movement. Every day, our team works to prove that fashion can be beautiful, profitable, and regenerative. If you're passionate about sustainability, craftsmanship, and innovation, you belong here.</p>
          <p className="text-lg text-gray-600">Founded by CEO Ali Kürşat LEVENT and Head of Designer Zehra Aybüge LEVENT, NOWIHT has grown from a vision into a thriving sustainable fashion brand. We're a diverse team of designers, engineers, artisans, marketers, and dreamers united by one goal: creating fashion that heals the planet.</p>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-4">Our Core Values</h2>
              <p className="text-gray-600 text-lg">The principles that guide everything we do</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 border border-gray-200">
                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Sustainability First</h3>
                <p className="text-gray-600 text-sm">Every decision we make considers environmental impact. We're building a regenerative business model that gives back more than it takes.</p>
              </div>
              <div className="bg-white p-8 border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">People Over Profit</h3>
                <p className="text-gray-600 text-sm">Fair wages, safe conditions, and opportunities for growth aren't optional—they're fundamental to who we are.</p>
              </div>
              <div className="bg-white p-8 border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Innovation & Excellence</h3>
                <p className="text-gray-600 text-sm">We push boundaries, embrace new technologies, and never settle for "good enough." Excellence is our standard.</p>
              </div>
              <div className="bg-white p-8 border border-gray-200">
                <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Craft & Care</h3>
                <p className="text-gray-600 text-sm">We honor traditional craftsmanship while embracing modern design. Every detail matters, every stitch tells a story.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">Why Work at NOWIHT?</h2>
            <p className="text-gray-600 text-lg">Competitive benefits that support your life and career</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Competitive Salary", desc: "Market-leading compensation packages with annual reviews and performance bonuses" },
              { title: "Health & Wellness", desc: "Comprehensive health insurance, mental health support, and gym membership" },
              { title: "Flexible Work", desc: "Hybrid remote options, flexible hours, and generous vacation policy (25+ days)" },
              { title: "Learning Budget", desc: "€2,000 annual stipend for courses, conferences, books, and skill development" },
              { title: "Sustainable Commute", desc: "Public transport passes, bike-to-work program, and EV charging stations" },
              { title: "Product Discounts", desc: "60% employee discount on all NOWIHT products plus early access to new collections" },
              { title: "Parental Leave", desc: "6 months paid maternity/paternity leave with gradual return-to-work support" },
              { title: "Team Events", desc: "Quarterly retreats, monthly socials, and annual sustainability trip" },
              { title: "Equity Options", desc: "Share in our success with employee stock options for all team members" },
            ].map((benefit, i) => (
              <div key={i} className="p-6 border-l-4 border-black bg-gray-50">
                <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-4">Open Positions</h2>
              <p className="text-gray-400 text-lg">Join our growing team and make an impact</p>
            </div>
            <div className="space-y-6">
              {[
                { title: "Senior Sustainable Materials Designer", dept: "Design", location: "Istanbul, TR", type: "Full-time" },
                { title: "E-Commerce Product Manager", dept: "Product", location: "Remote (EU)", type: "Full-time" },
                { title: "Supply Chain Sustainability Lead", dept: "Operations", location: "Istanbul, TR", type: "Full-time" },
                { title: "Content Creator & Photographer", dept: "Marketing", location: "Istanbul, TR", type: "Full-time" },
                { title: "Full-Stack Developer (Next.js)", dept: "Engineering", location: "Remote", type: "Full-time" },
                { title: "Customer Experience Specialist", dept: "Support", location: "Remote (EU)", type: "Full-time" },
              ].map((job, i) => (
                <div key={i} className="bg-white/5 p-8 border border-white/10 hover:border-white/30 transition-all group cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-medium mb-2 group-hover:text-gray-300 transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                        <span>{job.dept}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <Link href="/contact" className="inline-flex items-center gap-2 text-sm group-hover:gap-3 transition-all">
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <p className="text-gray-400 mb-6">Don't see the right role? We're always looking for exceptional talent.</p>
              <Link href="/contact" className="inline-flex items-center gap-3 px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all group">
                <span>SEND OPEN APPLICATION</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Hiring Process */}
        <section className="py-20 max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">Our Hiring Process</h2>
            <p className="text-gray-600 text-lg">What to expect when you apply</p>
          </div>
          <div className="space-y-8">
            {[
              { step: "1", title: "Application Review", desc: "We review your application within 5 business days. We read every application personally." },
              { step: "2", title: "Initial Call", desc: "30-minute video call with our People team to discuss your background and career goals." },
              { step: "3", title: "Technical/Portfolio Review", desc: "For design and technical roles: share your work. For other roles: case study or assignment." },
              { step: "4", title: "Team Interview", desc: "Meet potential teammates and hiring manager. Ask questions, discuss culture fit, explore the role deeply." },
              { step: "5", title: "Final Decision", desc: "We'll notify you within 3 days. If successful, receive offer letter and welcome package!" },
            ].map((phase, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center font-medium text-lg">{phase.step}</div>
                <div>
                  <h3 className="text-xl font-medium mb-2">{phase.title}</h3>
                  <p className="text-gray-600">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}