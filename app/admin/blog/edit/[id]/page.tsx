"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Image as ImageIcon,
  Calendar,
  Tag as TagIcon,
  FileText,
  Globe,
} from "lucide-react";

export default function BlogEditorPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published",
    publishedAt: "",
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      ogImage: "",
    },
  });
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    setMounted(true);
    // TODO: If editing, fetch post data from Supabase
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
      seo: {
        ...formData.seo,
        metaTitle: title,
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload to Supabase Storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSave = async (status: "draft" | "published") => {
    setSaving(true);
    
    const postData = {
      ...formData,
      status,
      publishedAt: status === "published" ? new Date().toISOString() : null,
    };

    // TODO: Save to Supabase
    console.log("Saving post:", postData);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    
    // Redirect to admin dashboard
    router.push("/admin/blog");
  };

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blog"
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-light">
                  {formData.title || "New Article"}
                </h1>
                <p className="text-sm text-gray-600">
                  {formData.status === "draft" ? "Draft" : "Published"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/journal/${formData.slug || "preview"}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </Link>
              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {saving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white border p-6">
              <label className="block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article title..."
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-2xl font-light"
                required
              />
            </div>

            {/* Slug */}
            <div className="bg-white border p-6">
              <label className="block text-sm font-medium mb-2">
                URL Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">/journal/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white border p-6">
              <label className="block text-sm font-medium mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Brief description (140-160 characters recommended)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.excerpt.length} characters
              </p>
            </div>

            {/* Cover Image */}
            <div className="bg-white border p-6">
              <label className="block text-sm font-medium mb-4">
                Cover Image *
              </label>
              
              {imagePreview ? (
                <div className="relative aspect-video bg-gray-100 mb-4">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setImagePreview("");
                      setFormData({ ...formData, coverImage: "" });
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 hover:border-black transition-colors p-12 text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="cover-image-upload"
                  />
                  <label htmlFor="cover-image-upload" className="cursor-pointer block">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG up to 10MB (16:9 recommended)
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-white border p-6">
              <label className="block text-sm font-medium mb-4">
                Article Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your article content here... (HTML supported)"
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Supports HTML formatting. Use rich text editor in future versions.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white border p-6">
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                required
              >
                <option value="">Select category</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Materials">Materials</option>
                <option value="Design">Design</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Behind the Scenes">Behind the Scenes</option>
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white border p-6">
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-all text-sm"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white border p-6">
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                SEO & GEO Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo.metaTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, metaTitle: e.target.value },
                      })
                    }
                    placeholder="SEO title (60 chars recommended)"
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seo.metaTitle.length}/60
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seo.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, metaDescription: e.target.value },
                      })
                    }
                    placeholder="SEO description (160 chars recommended)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seo.metaDescription.length}/160
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.seo.keywords}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, keywords: e.target.value },
                      })
                    }
                    placeholder="sustainable fashion, organic cotton..."
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Publish Date */}
            <div className="bg-white border p-6">
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Calendar className="w-4 h-4" />
                Publish Date
              </label>
              <input
                type="datetime-local"
                value={formData.publishedAt}
                onChange={(e) =>
                  setFormData({ ...formData, publishedAt: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Leave empty to publish immediately
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}