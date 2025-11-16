"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* CINEMATIC HERO WITH LIFESTYLE IMAGE */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/about/nowiht-about-us-banner-streetwear-lifestyle.jpg"
              alt="NOWIHT Lifestyle - Urban Athleisure"
              fill
              priority
              className="object-cover"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-20 text-center px-6 max-w-6xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-white/80 tracking-[0.4em] text-xs md:text-sm uppercase mb-8 font-light"
            >
              Since 2020
            </motion.p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-light tracking-tight leading-[1.1] mb-10">
              Style, Born from<br />
              Nothingness
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
              Where clarity meets craft, and intention shapes luxury
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0"></div>
          </motion.div>
        </section>

        {/* BRAND MANIFESTO */}
        <section className="py-20 md:py-32 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8 md:space-y-12"
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.3] tracking-tight text-black">
                Founded in 2020, NOWIHT is a high-end fashion house built on a simple belief: true style emerges from clarity, intention, and craft.
              </p>
              <div className="w-16 h-px bg-black"></div>
              <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
                What began in a year when the world slowed down has grown into a brand defined by quiet luxury, sustainability at the core, and a commitment to pieces that endure beyond a season.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ORIGIN STORY - SPLIT WITH IMAGE */}
        <section className="grid lg:grid-cols-2 min-h-[80vh] lg:min-h-screen">
          <div className="relative h-[60vh] lg:h-auto bg-zinc-100">
            <Image
              src="/images/about/nowiht-abouut-us-streetwer-lifestyle-3.png"
              alt="NOWIHT Origin - Premium Athleisure"
              fill
              className="object-cover"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent"></div>
          </div>

          <div className="flex items-center px-6 lg:px-16 py-16 lg:py-20 bg-white">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">Our Origin</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8 leading-tight">
                From Textiles to Timelessness
              </h2>
              <div className="space-y-6 text-base md:text-lg text-gray-700 leading-relaxed font-light">
                <p>
                  NOWIHT was born from deep roots in textiles and a restless desire to create garments that feel as considered as they look. In our earliest days, we refined the language of comfort—starting with pajama sets—then expanded into a complete wardrobe for modern life.
                </p>
                <p>
                  Today, we design luxury polos, blouses, shirts, sweatshirts, hoodies, pajama sets, cardigans, pullovers, knitwear, swimwear, and underwear for women and men. Each piece speaks to a refined aesthetic that transcends trend cycles.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* WHAT WE STAND FOR */}
        <section className="py-20 md:py-32 px-4 md:px-6 bg-black text-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 md:mb-20 max-w-3xl"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight">
                What We Stand For
              </h2>
              <p className="text-lg md:text-xl text-white/60 font-light">
                Four principles that define every decision, every stitch, every choice
              </p>
            </motion.div>

            <div className="space-y-px">
              {[
                {
                  number: "01",
                  title: "Timeless Design Over Trends",
                  desc: "We design with longevity in mind—timeless silhouettes, precise fit, and elevated finishing. Luxury, to us, is quality you can feel and values you can trust.",
                },
                {
                  number: "02",
                  title: "Organic at the Core",
                  desc: "We prioritize organic-certified cotton and responsible fibers. From yarns and fabrics to labels, hangtags, and packaging, we choose 100% organic or recyclable inputs wherever possible.",
                },
                {
                  number: "03",
                  title: "Responsibility Woven In",
                  desc: "Our packaging is organic and eco-conscious—created to be recyclable and, in certain formats, to return to nature as seedlings or compost when properly processed. Sustainability is not a campaign; it's our operating system.",
                },
                {
                  number: "04",
                  title: "Refined for All Ages",
                  desc: "We design for a refined, youthful mindset—from early adulthood through 60—people who value form, function, and responsibility in equal measure.",
                },
              ].map((principle, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm p-8 md:p-12 lg:p-16 hover:bg-white/10 transition-all duration-500 border-l-2 border-white/20"
                >
                  <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                    <p className="text-5xl md:text-7xl font-light text-white/20 leading-none">{principle.number}</p>
                    <div>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-light mb-4 tracking-tight">{principle.title}</h3>
                      <p className="text-white/60 leading-relaxed font-light text-sm md:text-base">{principle.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CRAFT, FIT & FEEL */}
        <section className="py-20 md:py-32 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8 md:space-y-12"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight">
                Craft, Fit, and Feel
              </h2>
              <div className="space-y-6 md:space-y-8 text-lg md:text-xl text-gray-700 font-light leading-relaxed">
                <p>
                  Every NOWIHT piece is built on the discipline of pattern cutting, the drape of premium fabrics, and a finish that rewards attention. We obsess over how a collar sits, how a knit moves, and how a seam feels against the skin.
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl text-black font-light italic">
                  This is quiet confidence—nothing loud, everything intentional.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* THE COLLECTION TODAY */}
        <section className="py-20 md:py-32 px-4 md:px-6 bg-zinc-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-light mb-6"
              >
                The Collection Today
              </motion.h2>
              <p className="text-lg md:text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
                For women and men, our range spans essential categories—each built on organic-certified cotton for breathability and structure, with textures and knits that elevate everyday dressing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { category: "Polos & Shirts", detail: "Crisp collars, refined drape" },
                { category: "Blouses", detail: "Feminine tailoring, organic cotton" },
                { category: "Sweatshirts & Hoodies", detail: "Elevated comfort, premium knits" },
                { category: "Knitwear", detail: "Cardigans, pullovers, texture" },
                { category: "Pajama Sets", detail: "Where we began—comfort refined" },
                { category: "Swimwear", detail: "Bikinis, swimsuits, responsible fibers" },
                { category: "Underwear", detail: "Essentials with intention" },
                { category: "Accessories", detail: "Complementing your wardrobe" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <div className="border-l-2 border-black pl-6 py-4 hover:pl-8 transition-all duration-300">
                    <h3 className="text-lg md:text-xl font-medium mb-2 group-hover:tracking-wide transition-all">{item.category}</h3>
                    <p className="text-gray-600 text-sm font-light">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12 md:mt-16">
              <Link
                href="/shop"
                className="inline-block px-10 md:px-12 py-4 md:py-5 bg-black text-white hover:bg-zinc-800 transition-all duration-300 text-xs md:text-sm tracking-widest font-medium"
              >
                EXPLORE FULL COLLECTION
              </Link>
            </div>
          </div>
        </section>

        {/* WHO WE DESIGN FOR - WITH IMAGE */}
        <section className="grid lg:grid-cols-2 min-h-[80vh] lg:min-h-screen">
          <div className="flex items-center px-6 lg:px-16 py-16 lg:py-20 bg-white order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8 leading-tight">
                Who We Design For
              </h2>
              <div className="space-y-6 text-base md:text-lg text-gray-700 leading-relaxed font-light">
                <p>
                  You appreciate craft. You want elegance without excess. You look for materials that align with your values.
                </p>
                <p>
                  Whether you're dressing for the city, the studio, or the coast, NOWIHT delivers essentials and statements with equal restraint. You value fewer, better pieces—style with a smaller footprint.
                </p>
                <p className="text-black font-normal">
                  From early adulthood through 60, you embody a refined mindset where form, function, and responsibility are inseparable.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="relative h-[60vh] lg:h-auto bg-zinc-100 order-1 lg:order-2">
            <Image
              src="/images/about/nowiht-abouut-us-streetwer-lifestyle-2.png"
              alt="NOWIHT Street Style - Urban Lifestyle"
              fill
              className="object-cover"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-black/5 to-transparent"></div>
          </div>
        </section>

        {/* SUSTAINABILITY COMMITMENT */}
        <section className="py-20 md:py-32 px-4 md:px-6 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8 md:space-y-12"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-8 md:mb-12">
                Responsibility Woven In
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 leading-relaxed italic">
                "Sustainability is not a campaign; it's our operating system."
              </p>
              <div className="space-y-6 md:space-y-8 text-base md:text-lg text-white/70 font-light leading-relaxed max-w-3xl mx-auto">
                <p>
                  Organic-certified cotton and responsible blends chosen for durability and comfort. Purposeful collections over impulsive drops; designed for wear, re-wear, and long life.
                </p>
                <p>
                  Packaging and print collateral favor recyclable or compostable paths; label and card stocks are organic or recycled. By choosing NOWIHT, you choose fewer, better pieces—style with a smaller footprint.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* THE ROAD AHEAD */}
        <section className="py-20 md:py-32 px-4 md:px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8 md:space-y-12"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 md:mb-8">
                The Road Ahead
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 font-light leading-relaxed">
                Our vision is to help redefine luxury for a new era—where style, sustainability, and substance are inseparable.
              </p>
              <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                We will continue to invest in better materials, transparent processes, and collections that prove: clarity is the ultimate sophistication.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-20 md:py-32 px-4 md:px-6 bg-black text-white overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8 md:space-y-10"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight mb-6 md:mb-8">
                Style, Born from Nothingness
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
                Join a movement where every piece is intentional, every choice matters, and true luxury is found in what lasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center pt-6 md:pt-8">
                <Link
                  href="/shop"
                  className="group px-10 md:px-12 py-4 md:py-5 bg-white text-black hover:bg-white/90 transition-all duration-300 text-xs md:text-sm tracking-widest font-medium"
                >
                  <span className="flex items-center justify-center gap-3">
                    DISCOVER COLLECTION
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
                <Link
                  href="/ecologic/sustainability-vision"
                  className="group px-10 md:px-12 py-4 md:py-5 border border-white/30 hover:bg-white hover:text-black transition-all duration-300 text-xs md:text-sm tracking-widest font-medium"
                >
                  OUR COMMITMENT
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:40px_40px]"></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}