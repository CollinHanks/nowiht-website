import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates - Latest from NOWIHT",
  description: "Stay updated with NOWIHT's latest news, sustainability initiatives, product launches, and industry insights.",
  keywords: ["sustainable fashion news", "NOWIHT updates", "fashion industry news", "sustainability announcements"],
};

export default function NewsPage() {
  const news = [
    { date: "Nov 2024", category: "Product Launch", title: "Winter 2025 Collection: Regenerative Wool Tracksuits", excerpt: "Introducing our first regenerative wool collection, sourced from farms practicing holistic land management.", featured: true },
    { date: "Oct 2024", category: "Milestone", title: "NOWIHT Achieves B Corp Certification", excerpt: "We're officially a certified B Corporation, joining a global movement of businesses committed to people and planet." },
    { date: "Sep 2024", category: "Sustainability", title: "2024 Impact Report: 78% Organic Materials Achieved", excerpt: "Our annual sustainability report shows significant progress toward 2027 goals." },
    { date: "Aug 2024", category: "Partnership", title: "New Partnership with Regenerative Cotton Farmers in Turkey", excerpt: "Expanding our regenerative agriculture network with 15 new family farms." },
    { date: "Jul 2024", category: "Technology", title: "Launching Blockchain Supply Chain Traceability", excerpt: "Every garment now includes QR code for complete transparency from farm to closet." },
    { date: "Jun 2024", category: "Community", title: "$2M Milestone: Community Investment Fund", excerpt: "We've invested over $2M in artisan communities since our founding." },
  ];

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">NEWSROOM</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">News & Updates</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Stay informed about our latest sustainability initiatives, product launches, and company milestones</p>
          </div>
        </section>

        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="space-y-12">
            {news.map((item, i) => (
              <article key={i} className={`${item.featured ? 'border-2 border-black p-8' : 'border-l-4 border-gray-300 pl-8'}`}>
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <span className="text-gray-500">{item.date}</span>
                  <span className="px-3 py-1 bg-black text-white text-xs uppercase tracking-wider">{item.category}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-light mb-4">{item.title}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{item.excerpt}</p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all group">
                  <span>Read More</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16 bg-black text-white text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-light mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-8">Subscribe to our newsletter for monthly updates on sustainability progress and new collections</p>
            <Link href="/" className="inline-flex items-center gap-3 px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all">
              <span>SUBSCRIBE TO NEWSLETTER</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}