// components/admin/MediaMetadataEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Tag, Image, Sparkles, Copy, Check } from 'lucide-react';
import { MediaService, MediaMetadata } from '@/lib/services/MediaService';

interface MediaMetadataEditorProps {
  mediaId: string;
  mediaUrl: string;
  filename: string;
  onClose: () => void;
  onSave: (metadata: MediaMetadata) => void;
}

export default function MediaMetadataEditor({
  mediaId,
  mediaUrl,
  filename,
  onClose,
  onSave
}: MediaMetadataEditorProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [metadata, setMetadata] = useState<Partial<MediaMetadata>>({
    media_id: mediaId,
    alt_text: '',
    seo_filename: '',
    title: '',
    caption: '',
    description: '',
    tags: [],
    category: '',
    collection: '',
    copyright: '',
    photographer: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [focalPoint, setFocalPoint] = useState({ x: 50, y: 50 });
  const [previewSeoUrl, setPreviewSeoUrl] = useState('');

  // Predefined categories and collections
  const categories = [
    'products',
    'lifestyle',
    'editorial',
    'campaign',
    'lookbook',
    'backstage',
    'runway',
    'accessories'
  ];

  const collections = [
    'spring-summer-2025',
    'fall-winter-2025',
    'capsule-collection',
    'limited-edition',
    'permanent-collection'
  ];

  // Load existing metadata
  useEffect(() => {
    loadMetadata();
  }, [mediaId]);

  // Update SEO preview
  useEffect(() => {
    if (metadata.seo_filename) {
      setPreviewSeoUrl(`https://nowiht.com/media/${metadata.seo_filename}.webp`);
    }
  }, [metadata.seo_filename]);

  const loadMetadata = async () => {
    setLoading(true);
    try {
      const existingMetadata = await MediaService.getMetadata(mediaId);
      if (existingMetadata) {
        setMetadata(existingMetadata);
        if (existingMetadata.focal_point) {
          setFocalPoint(existingMetadata.focal_point);
        }
      } else {
        // Generate initial SEO filename from original filename
        const seoFilename = generateSeoFilename(filename);
        setMetadata(prev => ({ ...prev, seo_filename: seoFilename }));
      }
    } catch (error) {
      console.error('Failed to load metadata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedMetadata = {
        ...metadata,
        focal_point: focalPoint
      };

      const saved = await MediaService.updateMetadata(mediaId, updatedMetadata);
      onSave(saved);

      // Show success message
      showToast('Metadata saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save metadata:', error);
      showToast('Failed to save metadata', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAIGenerate = async () => {
    setAiGenerating(true);
    try {
      const aiMetadata = await MediaService.generateAIMetadata(mediaId);

      if (aiMetadata) {
        setMetadata(prev => ({
          ...prev,
          alt_text: aiMetadata.ai_alt_text || prev.alt_text,
          tags: [...new Set([...(prev.tags || []), ...(aiMetadata.ai_tags || [])])]
        }));

        showToast('AI suggestions generated!', 'success');
      }
    } catch (error) {
      console.error('Failed to generate AI metadata:', error);
      showToast('AI generation failed', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  const generateSeoFilename = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.tags?.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }));
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // This would integrate with your toast system
    console.log(`[${type.toUpperCase()}]: ${message}`);
  };

  const handleFocalPointClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setFocalPoint({ x, y });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Media Metadata</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Image Preview */}
            <div className="space-y-4">
              {/* Image with focal point selector */}
              <div className="relative">
                <div
                  className="relative cursor-crosshair overflow-hidden rounded-lg border border-gray-200"
                  onClick={handleFocalPointClick}
                >
                  <img
                    src={mediaUrl}
                    alt={metadata.alt_text || filename}
                    className="w-full h-auto"
                  />
                  {/* Focal point indicator */}
                  <div
                    className="absolute w-4 h-4 border-2 border-red-600 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      left: `${focalPoint.x}%`,
                      top: `${focalPoint.y}%`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Click to set focal point (for smart cropping): {focalPoint.x}% x {focalPoint.y}%
                </p>
              </div>

              {/* AI Generation */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Assistance
                </h3>
                <button
                  onClick={handleAIGenerate}
                  disabled={aiGenerating}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Alt Text & Tags
                    </>
                  )}
                </button>
                {metadata.ai_confidence && (
                  <p className="text-xs text-gray-500 mt-2">
                    AI Confidence: {(metadata.ai_confidence * 100).toFixed(0)}%
                  </p>
                )}
              </div>

              {/* SEO Preview */}
              {previewSeoUrl && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-2">SEO URL Preview</h3>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 overflow-x-auto">
                      {previewSeoUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(previewSeoUrl, 'url')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copied === 'url' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-4">
              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text *
                </label>
                <textarea
                  value={metadata.alt_text || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, alt_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  rows={3}
                  placeholder="Describe the image for accessibility and SEO..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {metadata.alt_text?.length || 0}/125 characters (recommended)
                </p>
              </div>

              {/* SEO Filename */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Filename *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={metadata.seo_filename || ''}
                    onChange={(e) => setMetadata(prev => ({ ...prev, seo_filename: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="seo-friendly-filename"
                  />
                  <button
                    onClick={() => {
                      const generated = generateSeoFilename(metadata.alt_text || filename);
                      setMetadata(prev => ({ ...prev, seo_filename: generated }));
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Auto
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={metadata.title || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Image title"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={metadata.caption || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Short caption"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={metadata.description || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  rows={2}
                  placeholder="Detailed description..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Add tag..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {metadata.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Category & Collection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={metadata.category || ''}
                    onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collection
                  </label>
                  <select
                    value={metadata.collection || ''}
                    onChange={(e) => setMetadata(prev => ({ ...prev, collection: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select collection</option>
                    {collections.map(col => (
                      <option key={col} value={col}>
                        {col.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Copyright & Photographer */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Copyright
                  </label>
                  <input
                    type="text"
                    value={metadata.copyright || ''}
                    onChange={(e) => setMetadata(prev => ({ ...prev, copyright: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="© NOWIHT 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photographer
                  </label>
                  <input
                    type="text"
                    value={metadata.photographer || ''}
                    onChange={(e) => setMetadata(prev => ({ ...prev, photographer: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            * Required for SEO optimization
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !metadata.alt_text || !metadata.seo_filename}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Metadata
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}