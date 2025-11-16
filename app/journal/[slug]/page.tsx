"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Tag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// MOCK DATA - REPLACE WITH SUPABASE
const MOCK_POST = {
  id: 1,
  slug: "sustainable-fashion-future",
  title: "The Future of Sustainable Fashion: Our 2027 Vision",
  excerpt: "Exploring how NOWIHT is pioneering organic materials and circular design to reshape the fashion industry for generations to come.",
  content: `
    <p>The fashion industry stands at a crossroads. As we approach 2027, the choices we make today will determine whether we build a regenerative future or continue down an unsustainable path.</p>

    <p>At NOWIHT, we've committed to reaching 100% organic materials by 2027—not as a marketing slogan, but as a measurable, actionable goal embedded in every decision we make.</p>

    <h2>The Current State</h2>
    <p>Currently, 78% of our collection uses organic-certified cotton and responsible fibers. While this places us ahead of industry standards, we recognize it's only the beginning.</p>

    <p>Our R&D team invests 15% of annual revenue into materials innovation, testing everything from mushroom leather to seaweed fibers, bacterial cellulose to closed-loop recycling systems.</p>

    <h2>The 2027 Roadmap</h2>
    <p>Our path to 100% organic involves three key pillars:</p>

    <h3>1. Material Innovation</h3>
    <p>We're not waiting for sustainable materials to become mainstream—we're creating them. Our partnerships with organic farms, textile researchers, and material scientists are yielding breakthrough fabrics that perform better than conventional alternatives.</p>

    <h3>2. Circular Design</h3>
    <p>Every product we design considers its end-of-life. Can it be composted? Recycled? Upcycled? If the answer is no, we redesign until the answer is yes.</p>

    <h3>3. Transparent Supply Chains</h3>
    <p>By 2027, every NOWIHT customer will be able to trace their garment from the cotton field to their doorstep. Complete transparency, complete accountability.</p>

    <h2>Beyond Materials</h2>
    <p>True sustainability extends beyond materials. Our zero-waste production goal means reimagining every aspect of manufacturing—from pattern cutting that minimizes fabric waste to packaging that biodegrades in 90 days.</p>

    <p>We're proving that luxury and sustainability aren't opposites—they're essential partners in creating fashion that honors both the wearer and the planet.</p>

    <h2>Join the Movement</h2>
    <p>This vision isn't ours alone. It belongs to every customer who chooses fewer, better pieces. Every artisan who takes pride in ethical production. Every innovator pushing the boundaries of sustainable materials.</p>

    <p>The future of fashion isn't about trend cycles—it's about creating pieces meant to last a lifetime, made with materials that can safely return to the earth when their journey ends.</p>

    <p>This is our 2027 vision. This is NOWIHT.</p>
  `,
  coverImage: "/images/blog/covers/sustainable-fashion.jpg",
  category: "Sustainability",
  author: {
    name: "NOWIHT",
    role: "Editorial Team",
    avatar: "/images/nowiht-logo-black-amblem.png",
    bio: "NOWIHT's editorial team brings together voices from across our organization—designers, sustainability experts, and material innovators—sharing insights on the future of conscious luxury fashion.",
  },
  publishedAt: "2025-11-01T10:00:00Z",
  updatedAt: "2025-11-01T10:00:00Z",
  readTime: "8 min read",
  tags: ["Sustainability", "Innovation", "Future", "Organic Materials"],
  seo: {
    metaTitle: "The Future of Sustainable Fashion: Our 2027 Vision | NOWIHT Journal",
    metaDescription: "Exploring how NOWIHT is pioneering organic materials and circular design to reshape the fashion industry. Our roadmap to 100% organic by 2027.",
    keywords: ["sustainable fashion", "organic materials", "circular design", "eco-friendly clothing", "2027 vision"],
    ogImage: "/images/blog/og/sustainable-fashion-og.jpg",
  },
};

const RELATED_POSTS = [
  {
    slug: "organic-cotton-journey",
    title: "From Seed to Stitch: The Organic Cotton Journey",
    coverImage: "/images/blog/covers/organic-cotton.jpg",
    category: "Materials",
  },
  {
    slug: "timeless-design-philosophy",
    title: "Timeless Design: Beyond Seasonal Trends",
    coverImage: "/images/blog/covers/timeless-design.jpg",
    category: "Design",
  },
];

export default function SinglePostPage() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [post, setPost] = useState(MOCK_POST);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    // TODO: Fetch from Supabase
    // const fetchPost = async () => {
    //   const { data } = await supabase.from('posts').select('*').eq('slug', params.slug).single();
    //   setPost(data);
    // };
    // fetchPost();
  }, [params]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    };
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

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
        {/* Breadcrumb */}
        <div className="border-b">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <Link href="/journal" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Journal</span>
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Category */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs tracking-wider uppercase text-gray-500">
                  {post.category}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
                {post.excerpt}
              </p>

              {/* Author & Share */}
              <div className="flex items-center justify-between py-6 border-y">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black flex items-center justify-center p-2">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-gray-600">{post.author.role}</p>
                  </div>
                </div>

                {/* Share Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-lg p-2 z-10">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                        <span className="text-sm">Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        <span className="text-sm">X (Twitter)</span>
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-sm">LinkedIn</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Featured Image */}
          <div className="max-w-6xl mx-auto my-12">
            <div className="relative aspect-[16/9] bg-gray-100">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-lg prose-gray max-w-none
                prose-headings:font-light prose-headings:tracking-tight
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-black prose-a:underline hover:prose-a:no-underline
                prose-strong:font-medium prose-strong:text-black
                prose-img:rounded-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-5 h-5 text-gray-400" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/journal?tag=${tag.toLowerCase()}`}
                    className="px-3 py-1 bg-gray-100 hover:bg-black hover:text-white transition-all text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-12 p-8 bg-gray-50 border">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-black flex items-center justify-center p-2 flex-shrink-0">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium text-lg mb-1">{post.author.name}</p>
                  <p className="text-sm text-gray-600 mb-3">{post.author.role}</p>
                  <p className="text-gray-700 font-light leading-relaxed">{post.author.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {RELATED_POSTS.length > 0 && (
          <section className="py-16 px-6 bg-gray-50 border-t">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-light mb-10">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {RELATED_POSTS.map((related) => (
                  <Link key={related.slug} href={`/journal/${related.slug}`}>
                    <article className="group">
                      <div className="relative aspect-[16/9] bg-gray-100 mb-4 overflow-hidden">
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <span className="text-xs tracking-wider uppercase text-gray-500 mb-2 block">
                        {related.category}
                      </span>
                      <h3 className="text-xl md:text-2xl font-light group-hover:tracking-wide transition-all">
                        {related.title}
                      </h3>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* SEO: Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.seo.ogImage,
            "datePublished": post.publishedAt,
            "dateModified": post.updatedAt,
            "author": {
              "@type": "Organization",
              "name": post.author.name,
            },
            "publisher": {
              "@type": "Organization",
              "name": "NOWIHT",
              "logo": {
                "@type": "ImageObject",
                "url": "https://nowiht.com/images/nowiht-logo-black-amblem.png",
              },
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": shareUrl,
            },
          }),
        }}
      />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:title" content={post.seo.metaTitle} />
      <meta property="og:description" content={post.seo.metaDescription} />
      <meta property="og:image" content={post.seo.ogImage} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={shareUrl} />
      <meta property="article:published_time" content={post.publishedAt} />
      <meta property="article:author" content={post.author.name} />

      {/* X (Twitter) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@the_nowiht" />
      <meta name="twitter:title" content={post.seo.metaTitle} />
      <meta name="twitter:description" content={post.seo.metaDescription} />
      <meta name="twitter:image" content={post.seo.ogImage} />

      <Footer />
    </>
  );
}