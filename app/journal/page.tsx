"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// MOCK DATA - REPLACE WITH SUPABASE
const MOCK_POSTS = [
  {
    id: 1,
    slug: "sustainable-fashion-future",
    title: "The Future of Sustainable Fashion: Our 2027 Vision",
    excerpt: "Exploring how NOWIHT is pioneering organic materials and circular design to reshape the fashion industry for generations to come.",
    content: "", // Full content in single post page
    coverImage: "/images/blog/covers/sustainable-fashion.jpg",
    category: "Sustainability",
    author: {
      name: "NOWIHT",
      role: "Editorial Team",
      avatar: "/images/nowiht-logo-black-amblem.png",
    },
    publishedAt: "2025-11-01T10:00:00Z",
    readTime: "8 min read",
    featured: true,
    tags: ["Sustainability", "Innovation", "Future"],
  },
  {
    id: 2,
    slug: "organic-cotton-journey",
    title: "From Seed to Stitch: The Organic Cotton Journey",
    excerpt: "Discover the meticulous process behind our premium organic cotton—from certified farms to your wardrobe.",
    content: "",
    coverImage: "/images/blog/covers/organic-cotton.jpg",
    category: "Materials",
    author: {
      name: "NOWIHT",
      role: "Editorial Team",
      avatar: "/images/nowiht-logo-black-amblem.png",
    },
    publishedAt: "2025-10-28T14:30:00Z",
    readTime: "6 min read",
    featured: false,
    tags: ["Organic", "Materials", "Process"],
  },
  {
    id: 3,
    slug: "timeless-design-philosophy",
    title: "Timeless Design: Beyond Seasonal Trends",
    excerpt: "Why we design for decades, not seasons. The philosophy behind NOWIHT's enduring aesthetic.",
    content: "",
    coverImage: "/images/blog/covers/timeless-design.jpg",
    category: "Design",
    author: {
      name: "NOWIHT",
      role: "Editorial Team",
      avatar: "/images/nowiht-logo-black-amblem.png",
    },
    publishedAt: "2025-10-20T09:00:00Z",
    readTime: "5 min read",
    featured: false,
    tags: ["Design", "Philosophy", "Style"],
  },
];

const CATEGORIES = ["All", "Sustainability", "Materials", "Design", "Lifestyle", "Behind the Scenes"];

export default function JournalPage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    // TODO: Fetch from Supabase
    // const fetchPosts = async () => {
    //   const { data } = await supabase.from('posts').select('*').order('published_at', { ascending: false });
    //   setPosts(data);
    // };
    // fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured);

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
              <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">The Journal</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight">
                Stories, Insights,<br />& Inspiration
              </h1>
              <p className="text-xl text-gray-600 font-light leading-relaxed">
                Exploring sustainable fashion, timeless design, and the future of conscious luxury.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="py-8 px-6 border-b bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Categories */}
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-black text-white"
                        : "bg-white border border-gray-300 hover:border-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && selectedCategory === "All" && !searchQuery && (
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link href={`/journal/${featuredPost.slug}`}>
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center group">
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      <Image
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs tracking-wider">
                        FEATURED
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-xs tracking-wider uppercase text-gray-500">
                          {featuredPost.category}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 leading-tight group-hover:tracking-wide transition-all">
                        {featuredPost.title}
                      </h2>
                      <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black flex items-center justify-center p-1">
                            <Image
                              src={featuredPost.author.avatar}
                              alt={featuredPost.author.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{featuredPost.author.name}</p>
                            <p className="text-xs text-gray-500">{featuredPost.author.role}</p>
                          </div>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                        <span>Read Article</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {regularPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 font-light">No articles found. Try a different search or category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {regularPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={`/journal/${post.slug}`}>
                      <article className="group">
                        {/* Image */}
                        <div className="relative aspect-[3/2] bg-gray-100 mb-4 overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs tracking-wider uppercase text-gray-500">
                            {post.category}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-light mb-3 leading-tight group-hover:tracking-wide transition-all">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 font-light leading-relaxed mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        {/* Read Time */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 px-6 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Never Miss a Story
            </h2>
            <p className="text-lg text-white/70 mb-8 font-light">
              Subscribe to receive our latest insights, interviews, and updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
              />
              <button className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-all font-medium">
                SUBSCRIBE
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}