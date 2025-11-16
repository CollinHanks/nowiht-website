"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// MOCK LOOKBOOK DATA - REPLACE WITH SUPABASE
const LOOKBOOKS = [
  {
    id: 1,
    title: "Winter 2025 Collection",
    season: "Winter 2025",
    description: "Timeless elegance meets modern comfort. Our Winter collection celebrates organic materials and enduring design.",
    coverImage: "/images/lookbook/winter-2025-cover.jpg",
    images: [
      {
        id: 1,
        url: "/images/lookbook/winter-2025-1.jpg",
        caption: "Organic Wool Coat in Charcoal",
      },
      {
        id: 2,
        url: "/images/lookbook/winter-2025-2.jpg",
        caption: "Merino Turtleneck & Tailored Trousers",
      },
      {
        id: 3,
        url: "/images/lookbook/winter-2025-3.jpg",
        caption: "Cashmere Blend Cardigan",
      },
      {
        id: 4,
        url: "/images/lookbook/winter-2025-4.jpg",
        caption: "Winter Layering Essentials",
      },
    ],
    releaseDate: "2025-10-01",
    featured: true,
  },
  {
    id: 2,
    title: "Autumn 2025 Essentials",
    season: "Autumn 2025",
    description: "Transitional pieces designed for versatility. Earth tones and natural textures define this collection.",
    coverImage: "/images/lookbook/autumn-2025-cover.jpg",
    images: [
      {
        id: 5,
        url: "/images/lookbook/autumn-2025-1.jpg",
        caption: "Organic Cotton Shirt in Sage",
      },
      {
        id: 6,
        url: "/images/lookbook/autumn-2025-2.jpg",
        caption: "Relaxed Fit Chinos",
      },
      {
        id: 7,
        url: "/images/lookbook/autumn-2025-3.jpg",
        caption: "Lightweight Linen Blazer",
      },
    ],
    releaseDate: "2025-08-15",
    featured: false,
  },
  {
    id: 3,
    title: "Summer 2025 Minimalism",
    season: "Summer 2025",
    description: "Less is more. Clean lines and breathable fabrics for the warmer months.",
    coverImage: "/images/lookbook/summer-2025-cover.jpg",
    images: [
      {
        id: 8,
        url: "/images/lookbook/summer-2025-1.jpg",
        caption: "Linen Shirt in Natural White",
      },
      {
        id: 9,
        url: "/images/lookbook/summer-2025-2.jpg",
        caption: "Wide Leg Linen Trousers",
      },
      {
        id: 10,
        url: "/images/lookbook/summer-2025-3.jpg",
        caption: "Organic Cotton Tee",
      },
      {
        id: 11,
        url: "/images/lookbook/summer-2025-4.jpg",
        caption: "Summer Essentials",
      },
    ],
    releaseDate: "2025-05-01",
    featured: false,
  },
];

const SEASONS = ["All", "Winter 2025", "Autumn 2025", "Summer 2025"];

export default function LookbookPage() {
  const [mounted, setMounted] = useState(false);
  const [lookbooks] = useState(LOOKBOOKS);
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [currentLookbook, setCurrentLookbook] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    // TODO: Fetch from Supabase
  }, []);

  const filteredLookbooks = lookbooks.filter((lookbook) => {
    return selectedSeason === "All" || lookbook.season === selectedSeason;
  });

  const openLightbox = (lookbook: any, image: any, index: number) => {
    setCurrentLookbook(lookbook);
    setCurrentImage(image);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
    setCurrentLookbook(null);
    document.body.style.overflow = "unset";
  };

  const nextImage = () => {
    if (!currentLookbook) return;
    const nextIndex = (currentImageIndex + 1) % currentLookbook.images.length;
    setCurrentImageIndex(nextIndex);
    setCurrentImage(currentLookbook.images[nextIndex]);
  };

  const previousImage = () => {
    if (!currentLookbook) return;
    const prevIndex = currentImageIndex === 0 ? currentLookbook.images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setCurrentImage(currentLookbook.images[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") previousImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, currentImageIndex, currentLookbook]);

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
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="py-24 px-6 border-b">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">Lookbook</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight">
                Editorial Collections
              </h1>
              <p className="text-xl text-gray-600 font-light leading-relaxed">
                Explore our seasonal campaigns and discover the stories behind each collection.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-6 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3">
              {SEASONS.map((season) => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    selectedSeason === season
                      ? "bg-black text-white"
                      : "bg-white border border-gray-300 hover:border-black"
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Lookbooks Grid */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {filteredLookbooks.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 font-light">No lookbooks found.</p>
              </div>
            ) : (
              <div className="space-y-24">
                {filteredLookbooks.map((lookbook, i) => (
                  <motion.div
                    key={lookbook.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                  >
                    {/* Lookbook Header */}
                    <div className="mb-12">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-xs tracking-[0.3em] uppercase text-gray-400">
                          {lookbook.season}
                        </span>
                        {lookbook.featured && (
                          <span className="bg-black text-white px-2 py-1 text-xs tracking-wider">
                            NEW
                          </span>
                        )}
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(lookbook.releaseDate).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 leading-tight">
                        {lookbook.title}
                      </h2>
                      <p className="text-lg text-gray-600 font-light leading-relaxed max-w-3xl">
                        {lookbook.description}
                      </p>
                    </div>

                    {/* Image Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {lookbook.images.map((image, imageIndex) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: imageIndex * 0.1 }}
                          onClick={() => openLightbox(lookbook, image, imageIndex)}
                          className={`group cursor-pointer overflow-hidden ${
                            imageIndex === 0 && lookbook.images.length > 3
                              ? "lg:col-span-2 lg:row-span-2"
                              : ""
                          }`}
                        >
                          <div className="relative aspect-[3/4] bg-gray-100">
                            <Image
                              src={image.url}
                              alt={image.caption}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                          </div>
                          <div className="mt-3">
                            <p className="text-sm text-gray-700 font-light">{image.caption}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-gray-50 border-t">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-6">Shop the Collections</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
              Discover the pieces featured in our editorial campaigns and bring them into your wardrobe.
            </p>
            <a
              href="/collections"
              className="inline-block bg-black text-white px-8 py-4 hover:bg-gray-800 transition-all font-medium tracking-wider"
            >
              EXPLORE COLLECTIONS
            </a>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && currentImage && currentLookbook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 text-white text-sm z-10">
              {currentImageIndex + 1} / {currentLookbook.images.length}
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-6 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            {/* Image */}
            <motion.div
              key={currentImage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={currentImage.url}
                  alt={currentImage.caption}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-white font-light">{currentImage.caption}</p>
                <p className="text-gray-400 text-sm mt-1">{currentLookbook.season}</p>
              </div>
            </motion.div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-6 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}