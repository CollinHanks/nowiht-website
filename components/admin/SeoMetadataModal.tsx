// components/admin/SeoMetadataModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Tag } from 'lucide-react';

interface SeoMetadataModalProps {
  file: {
    id: string;
    url: string;
    filename: string; // CHANGED: name → filename
    metadata?: any;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function SeoMetadataModal({ file, isOpen, onClose, onSave }: SeoMetadataModalProps) {
  const [saving, setSaving] = useState(false);
  const [metadata, setMetadata] = useState({
    alt_text: '',
    seo_filename: '',
    title: '',
    tags: [] as string[],
    category: ''
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (file?.metadata) {
      setMetadata({
        alt_text: file.metadata.alt_text || '',
        seo_filename: file.metadata.seo_filename || generateSeoName(file.filename), // CHANGED: name → filename
        title: file.metadata.title || '',
        tags: file.metadata.tags || [],
        category: file.metadata.category || ''
      });
    } else {
      setMetadata({
        alt_text: '',
        seo_filename: generateSeoName(file?.filename || ''), // CHANGED: name → filename
        title: '',
        tags: [],
        category: ''
      });
    }
  }, [file]);

  const generateSeoName = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/media/metadata?media_id=${file.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata)
      });
      if (response.ok) {
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">SEO Settings</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Image Preview */}
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img src={file.url} alt="" className="w-full h-full object-contain" />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium mb-1">Alt Text *</label>
            <textarea
              value={metadata.alt_text}
              onChange={(e) => setMetadata(prev => ({ ...prev, alt_text: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              rows={2}
              placeholder="Describe this image for SEO and accessibility..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 125 characters or less. Current: {metadata.alt_text.length}
            </p>
          </div>

          {/* SEO Filename */}
          <div>
            <label className="block text-sm font-medium mb-1">SEO Filename *</label>
            <input
              type="text"
              value={metadata.seo_filename}
              onChange={(e) => setMetadata(prev => ({ ...prev, seo_filename: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="url-friendly-filename"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use lowercase, hyphens only (no spaces or special characters)
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Add tag and press Enter..."
              />
              <button onClick={addTag} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Tag className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => setMetadata(prev => ({
                      ...prev,
                      tags: prev.tags.filter(t => t !== tag)
                    }))}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={metadata.category}
              onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select category...</option>
              <option value="products">Products</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="editorial">Editorial</option>
              <option value="lookbook">Lookbook</option>
              <option value="banner">Banner</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !metadata.alt_text || !metadata.seo_filename}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}