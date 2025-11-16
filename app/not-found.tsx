// app/not-found.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, ShoppingBag, Search, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CATEGORIES } from "@/lib/constants";

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full px-6 lg:px-12 py-20">
          <div className="max-w-6xl mx-auto">
            {/* 404 Number - Large & Animated */}
            <div 
              className={`text-center mb-12 transition-all duration-1000 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h1 
                className="text-[180px] md:text-[240px] lg:text-[320px] font-light leading-none tracking-tighter text-black/5 select-none animate-float"
                style={{
                  WebkitTextStroke: "2px rgba(0,0,0,0.1)",
                }}
              >
                404
              </h1>
            </div>

            {/* Content */}
            <div 
              className={`text-center max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-6">
                Lost in Luxury
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed tracking-wide mb-12 font-light">
                The page you're looking for has wandered off the runway. Don't worry—there's plenty more to explore in our collection.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  href="/"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-black text-white text-sm font-medium tracking-widest hover:bg-gray-900 transition-all"
                >
                  <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>GO HOME</span>
                </Link>
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-4 border-2 border-black text-black text-sm font-medium tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>SHOP NOW</span>
                </Link>
              </div>
            </div>

            {/* Popular Categories */}
            <div 
              className={`transition-all duration-1000 delay-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="border-t border-black/5 pt-16">
                <h3 className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 mb-8">
                  Popular Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {CATEGORIES.slice(0, 4).map((category) => (
                    <Link
                      key={category.slug}
                      href={`/shop/${category.slug}`}
                      className="group relative overflow-hidden bg-gray-50 hover:bg-black transition-all duration-300"
                    >
                      <div className="aspect-square flex items-center justify-center p-8">
                        <div className="text-center">
                          <h4 className="text-lg md:text-xl font-medium tracking-wide group-hover:text-white transition-colors">
                            {category.name}
                          </h4>
                          <ArrowRight className="w-4 h-4 mx-auto mt-3 opacity-0 group-hover:opacity-100 text-white transform translate-x-0 group-hover:translate-x-2 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Suggestion */}
            <div 
              className={`text-center mt-16 transition-all duration-1000 delay-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-sm text-gray-500 mb-4">
                Looking for something specific?
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm text-black border-b border-black hover:border-gray-400 hover:text-gray-600 transition-colors pb-1"
              >
                <Search className="w-4 h-4" />
                <span>Search our collection</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}