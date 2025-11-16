// lib/services/MediaService.ts
import { supabase } from '@/lib/supabase/client';

// 🎯 CONFIGURATION - Bucket and folder settings
const STORAGE_BUCKET = 'product-images';
const STORAGE_FOLDER = 'products'; // Products folder in bucket
const TABLE_NAME = 'media';

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  original_name: string;
  size: number;
  mime_type: string;
  width?: number;
  height?: number;
  alt_text?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
  // Additional metadata (not in main table)
  metadata?: MediaMetadata;
}

export interface MediaMetadata {
  id?: string;
  media_id: string;
  alt_text?: string;
  seo_filename?: string;
  title?: string;
  caption?: string;
  description?: string;
  tags?: string[];
  category?: string;
  collection?: string;
  focal_point?: { x: number; y: number };
  copyright?: string;
  photographer?: string;
  ai_alt_text?: string;
  ai_tags?: string[];
  ai_confidence?: number;
}

export interface MediaFilter {
  search?: string;
  category?: string;
  tags?: string[];
  collection?: string;
  date_from?: string;
  date_to?: string;
  has_alt_text?: boolean;
  needs_seo?: boolean;
}

export interface BulkOperation {
  media_ids: string[];
  action: 'add_tags' | 'remove_tags' | 'set_category' | 'set_collection' | 'generate_ai';
  value?: string[] | string;
}

class MediaServiceClass {
  private cache: Map<string, MediaItem> = new Map();
  private metadataCache: Map<string, MediaMetadata> = new Map();

  // ============= MEDIA OPERATIONS =============

  async uploadMedia(file: File, metadata?: Partial<MediaMetadata>): Promise<MediaItem> {
    console.log('📤 Starting upload for:', file.name, 'Size:', file.size, 'Type:', file.type);

    try {
      // Validate file
      const validation = this.validateImage(file);
      if (!validation.valid) {
        console.error('❌ Validation failed:', validation.error);
        throw new Error(validation.error);
      }

      // Generate unique filename with products/ prefix
      const timestamp = Date.now();
      const sanitizedName = file.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9.-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // ✅ CRITICAL FIX: Add products/ prefix to filename
      const filename = `${STORAGE_FOLDER}/${timestamp}-${sanitizedName}`;

      console.log('📁 Uploading to path:', filename);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('❌ Upload error details:', {
          message: uploadError.message,
          name: uploadError.name,
          fullError: uploadError
        });
        throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`);
      }

      console.log('✅ Upload successful:', uploadData);

      // Get public URL - with correct path
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filename);

      const publicUrl = urlData.publicUrl;

      console.log('🔗 Public URL:', publicUrl);

      // Get image dimensions if it's an image
      let dimensions: { width?: number; height?: number } = {};
      if (file.type.startsWith('image/')) {
        try {
          dimensions = await this.getImageDimensions(file);
          console.log('📐 Image dimensions:', dimensions);
        } catch (dimError) {
          console.warn('⚠️ Could not get image dimensions:', dimError);
        }
      }

      // Create media record - matching exact database schema
      const mediaItem: any = {
        id: crypto.randomUUID(),
        url: publicUrl,
        filename: filename, // Store full path including products/
        original_name: file.name, // ✅ REQUIRED field
        size: Math.floor(file.size), // ✅ Integer for database
        mime_type: file.type,
        width: dimensions.width || undefined,
        height: dimensions.height || undefined,
        alt_text: metadata?.alt_text || undefined,
        tags: metadata?.tags || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('💾 Saving to database:', mediaItem);

      // Save to database
      const { data: dbData, error: dbError } = await supabase
        .from(TABLE_NAME)
        .insert([mediaItem])
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database error:', {
          message: dbError.message,
          code: dbError.code,
          details: dbError.details,
          hint: dbError.hint,
          error: dbError
        });

        // Try to delete uploaded file if database save fails
        try {
          await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filename]);
          console.log('🗑️ Cleaned up uploaded file after DB error');
        } catch (cleanupError) {
          console.error('⚠️ Could not cleanup file:', cleanupError);
        }

        throw new Error(`Database save failed: ${dbError.message || 'Unknown error'}`);
      }

      console.log('✅ Database save successful:', dbData);

      // Cache the item
      this.cache.set(dbData.id, dbData);

      console.log('✨ Upload complete:', dbData);
      return dbData;

    } catch (error) {
      console.error('🚨 Upload media error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        file: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      });

      // Re-throw with more context
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Upload failed: ${String(error)}`);
      }
    }
  }

  // NEW: Upload multiple files
  async uploadMultiple(files: File[]): Promise<MediaItem[]> {
    console.log(`📤 Starting batch upload for ${files.length} files`);
    const results: MediaItem[] = [];
    const errors: Array<{ file: string, error: any }> = [];

    for (const file of files) {
      try {
        const item = await this.uploadMedia(file);
        results.push(item);
        console.log(`✅ Uploaded: ${file.name}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${file.name}:`, error);
        errors.push({
          file: file.name,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    console.log(`📊 Batch upload complete: ${results.length} success, ${errors.length} failed`);
    if (errors.length > 0) {
      console.error('Failed uploads:', errors);
    }

    return results;
  }

  // NEW: Validate image file
  validateImage(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type: ${file.type}. Only JPEG, PNG, WebP, and GIF are allowed.`
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit.`
      };
    }

    return { valid: true };
  }

  async getMedia(id: string): Promise<MediaItem | null> {
    try {
      // Check cache first
      if (this.cache.has(id)) {
        return this.cache.get(id)!;
      }

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Get media error:', error);
        throw error;
      }

      // Fetch metadata
      const metadata = await this.getMetadata(id);
      if (metadata) {
        data.metadata = metadata;
      }

      this.cache.set(id, data);
      return data;
    } catch (error) {
      console.error('Get media error:', error);
      return null;
    }
  }

  // ALIAS: listImages → listMedia
  async listImages(filter?: MediaFilter): Promise<MediaItem[]> {
    return this.listMedia(filter);
  }

  // ALIAS: listFolders → listMedia (for backward compatibility)
  async listFolders(): Promise<MediaItem[]> {
    return this.listMedia();
  }

  // ✅ FIXED: List media from BOTH database AND storage
  async listMedia(filter?: MediaFilter): Promise<MediaItem[]> {
    try {
      console.log('📋 Listing media from database AND storage...');

      const allItems: MediaItem[] = [];
      const seenFilenames = new Set<string>();

      // 1. Get items from database first
      let query = supabase.from(TABLE_NAME).select('*');

      // Apply filters
      if (filter?.search) {
        query = query.textSearch('filename', filter.search);
      }
      if (filter?.date_from) {
        query = query.gte('created_at', filter.date_from);
      }
      if (filter?.date_to) {
        query = query.lte('created_at', filter.date_to);
      }

      const { data: dbData, error: dbError } = await query.order('created_at', { ascending: false });

      // Add database items to results
      if (!dbError && dbData && dbData.length > 0) {
        console.log(`✅ Found ${dbData.length} items in database`);
        dbData.forEach((item: MediaItem) => {
          allItems.push(item);
          seenFilenames.add(item.filename);
        });
      } else if (dbError) {
        console.warn('⚠️ Database query error:', dbError);
      }

      // 2. ALWAYS check storage for additional files
      console.log('📦 Checking storage for additional files...');

      const { data: storageFiles, error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(STORAGE_FOLDER, {
          limit: 100,
          offset: 0
        });

      if (!storageError && storageFiles && storageFiles.length > 0) {
        console.log(`📦 Found ${storageFiles.length} files in storage`);

        let addedFromStorage = 0;

        // Add storage files that aren't already in database
        for (const file of storageFiles) {
          // Skip placeholder files
          if (file.name.includes('.emptyFolder') || !file.name) continue;

          const fullPath = `${STORAGE_FOLDER}/${file.name}`;

          // Skip if already have this from database
          if (seenFilenames.has(fullPath)) {
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(fullPath);

          // Create MediaItem from storage file
          const item: MediaItem = {
            id: file.id || crypto.randomUUID(),
            url: publicUrl,
            filename: fullPath,
            original_name: file.name,
            size: file.metadata?.size || 0,
            mime_type: file.metadata?.mimetype || 'image/jpeg',
            width: undefined,
            height: undefined,
            alt_text: undefined,
            tags: undefined,
            created_at: file.created_at || new Date().toISOString(),
            updated_at: file.updated_at || file.created_at || new Date().toISOString()
          };

          allItems.push(item);
          addedFromStorage++;
        }

        if (addedFromStorage > 0) {
          console.log(`➕ Added ${addedFromStorage} files from storage (not in database)`);
        }
      } else if (storageError) {
        console.error('⚠️ Storage list error:', storageError);
      }

      console.log(`📊 Total items: ${allItems.length}`);

      // Apply search filter on combined results
      if (filter?.search && allItems.length > 0) {
        const searchTerm = filter.search.toLowerCase();
        return allItems.filter(item =>
          item.filename.toLowerCase().includes(searchTerm) ||
          item.original_name.toLowerCase().includes(searchTerm)
        );
      }

      return allItems;
    } catch (error) {
      console.error('List media error:', error);
      return [];
    }
  }

  // ALIAS: deleteImage → deleteMedia
  async deleteImage(id: string): Promise<boolean> {
    return this.deleteMedia(id);
  }

  async deleteMedia(id: string): Promise<boolean> {
    try {
      // Get media item first
      const media = await this.getMedia(id);
      if (!media) {
        // If not in database, try to delete by filename (for storage-only items)
        if (id.includes('/')) {
          const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([id]);

          if (!error) {
            console.log('✅ Deleted from storage:', id);
            return true;
          }
        }
        console.warn('Media not found:', id);
        return false;
      }

      console.log('🗑️ Deleting media:', media.filename);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([media.filename]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        throw dbError;
      }

      // Delete metadata
      await this.deleteMetadata(id);

      // Clear from cache
      this.cache.delete(id);
      this.metadataCache.delete(id);

      console.log('✅ Media deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete media error:', error);
      return false;
    }
  }

  // NEW: Delete multiple items
  async deleteMultiple(ids: string[]): Promise<number> {
    console.log(`🗑️ Deleting ${ids.length} items`);
    let deleted = 0;

    for (const id of ids) {
      const success = await this.deleteMedia(id);
      if (success) deleted++;
    }

    console.log(`✅ Deleted ${deleted} of ${ids.length} items`);
    return deleted;
  }

  // ============= METADATA OPERATIONS =============

  async getMetadata(mediaId: string): Promise<MediaMetadata | null> {
    try {
      // Check cache first
      if (this.metadataCache.has(mediaId)) {
        return this.metadataCache.get(mediaId)!;
      }

      const response = await fetch(`/api/media/metadata?media_id=${mediaId}`);
      if (!response.ok) {
        console.warn('Metadata not found for:', mediaId);
        return null;
      }

      const data = await response.json();
      this.metadataCache.set(mediaId, data);
      return data;
    } catch (error) {
      console.error('Get metadata error:', error);
      return null;
    }
  }

  async getBulkMetadata(mediaIds: string[]): Promise<MediaMetadata[]> {
    try {
      const response = await fetch(
        `/api/media/metadata?media_ids=${mediaIds.join(',')}`
      );
      if (!response.ok) return [];

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get bulk metadata error:', error);
      return [];
    }
  }

  async updateMetadata(
    mediaId: string,
    metadata: Partial<MediaMetadata>
  ): Promise<MediaMetadata> {
    try {
      const response = await fetch('/api/media/metadata', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_id: mediaId, ...metadata })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update metadata: ${error}`);
      }

      const data = await response.json();

      // Update cache
      this.metadataCache.set(mediaId, data);

      // Update media item cache if exists
      if (this.cache.has(mediaId)) {
        const mediaItem = this.cache.get(mediaId)!;
        mediaItem.metadata = data;
      }

      return data;
    } catch (error) {
      console.error('Update metadata error:', error);
      throw error;
    }
  }

  async bulkUpdateMetadata(
    mediaIds: string[],
    updates: Partial<MediaMetadata>
  ): Promise<number> {
    try {
      const response = await fetch('/api/media/metadata', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_ids: mediaIds, updates })
      });

      if (!response.ok) {
        throw new Error('Failed to bulk update metadata');
      }

      const data = await response.json();

      // Clear cache for updated items
      mediaIds.forEach((id: string) => {
        this.metadataCache.delete(id);
      });

      return data.updated;
    } catch (error) {
      console.error('Bulk update metadata error:', error);
      throw error;
    }
  }

  async deleteMetadata(mediaId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/media/metadata?media_id=${mediaId}`, {
        method: 'DELETE'
      });

      if (!response.ok) return false;

      // Clear from cache
      this.metadataCache.delete(mediaId);

      // Update media item cache
      if (this.cache.has(mediaId)) {
        const mediaItem = this.cache.get(mediaId)!;
        delete mediaItem.metadata;
      }

      return true;
    } catch (error) {
      console.error('Delete metadata error:', error);
      return false;
    }
  }

  // ============= BULK OPERATIONS =============

  async performBulkOperation(operation: BulkOperation): Promise<boolean> {
    try {
      const { media_ids, action, value } = operation;
      console.log(`🔄 Performing bulk operation: ${action} on ${media_ids.length} items`);

      switch (action) {
        case 'add_tags': {
          // Fetch existing metadata
          const metadata = await this.getBulkMetadata(media_ids);

          // Update each item
          for (const meta of metadata) {
            const existingTags = meta.tags || [];
            const newTags = Array.from(new Set([...existingTags, ...(value as string[])]));
            await this.updateMetadata(meta.media_id, { tags: newTags });
          }

          // Handle items without metadata
          const existingIds = metadata.map((m: MediaMetadata) => m.media_id);
          const missingIds = media_ids.filter((id: string) => !existingIds.includes(id));
          for (const id of missingIds) {
            await this.updateMetadata(id, { tags: value as string[] });
          }
          break;
        }

        case 'remove_tags': {
          const metadata = await this.getBulkMetadata(media_ids);

          for (const meta of metadata) {
            const existingTags = meta.tags || [];
            const newTags = existingTags.filter((tag: string) => !(value as string[]).includes(tag));
            await this.updateMetadata(meta.media_id, { tags: newTags });
          }
          break;
        }

        case 'set_category': {
          await this.bulkUpdateMetadata(media_ids, { category: value as string });
          break;
        }

        case 'set_collection': {
          await this.bulkUpdateMetadata(media_ids, { collection: value as string });
          break;
        }

        case 'generate_ai': {
          // This would trigger AI generation for selected items
          for (const id of media_ids) {
            await this.generateAIMetadata(id);
          }
          break;
        }

        default:
          throw new Error(`Unknown action: ${action}`);
      }

      console.log('✅ Bulk operation completed');
      return true;
    } catch (error) {
      console.error('Bulk operation error:', error);
      return false;
    }
  }

  // ============= AI OPERATIONS =============

  async generateAIMetadata(mediaId: string): Promise<MediaMetadata | null> {
    try {
      const media = await this.getMedia(mediaId);
      if (!media) return null;

      console.log('🤖 Generating AI metadata for:', mediaId);

      const response = await fetch('/api/media/metadata/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_id: mediaId,
          media_url: media.url
        })
      });

      if (!response.ok) {
        console.error('AI generation failed:', await response.text());
        return null;
      }

      const data = await response.json();

      // Cache the updated metadata
      this.metadataCache.set(mediaId, data);

      console.log('✅ AI metadata generated');
      return data;
    } catch (error) {
      console.error('Generate AI metadata error:', error);
      return null;
    }
  }

  // ============= SEARCH & ANALYTICS =============

  async searchMedia(query: string): Promise<MediaItem[]> {
    try {
      console.log('🔍 Searching media:', query);

      // Search in metadata
      const response = await fetch(
        `/api/media/metadata?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) return [];

      const metadata = await response.json();
      const mediaIds = metadata.map((m: MediaMetadata) => m.media_id);

      // Fetch media items
      const items: MediaItem[] = [];
      for (const id of mediaIds) {
        const item = await this.getMedia(id);
        if (item) items.push(item);
      }

      console.log(`✅ Found ${items.length} items`);
      return items;
    } catch (error) {
      console.error('Search media error:', error);
      return [];
    }
  }

  async getMediaAnalytics(): Promise<{
    total: number;
    withAltText: number;
    withSeoFilename: number;
    byCategory: Record<string, number>;
    topTags: Array<{ tag: string; count: number }>;
    needsSeo: number;
  }> {
    try {
      console.log('📊 Generating media analytics...');

      const allMedia = await this.listMedia();
      const total = allMedia.length;
      const withAltText = allMedia.filter((m: MediaItem) => m.alt_text).length;
      const withSeoFilename = allMedia.filter((m: MediaItem) => m.metadata?.seo_filename).length;

      // Category breakdown
      const byCategory: Record<string, number> = {};
      allMedia.forEach((item: MediaItem) => {
        if (item.metadata?.category) {
          byCategory[item.metadata.category] =
            (byCategory[item.metadata.category] || 0) + 1;
        }
      });

      // Top tags
      const tagCounts: Record<string, number> = {};
      allMedia.forEach((item: MediaItem) => {
        const tags = item.tags || item.metadata?.tags;
        if (tags) {
          tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });

      const topTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const needsSeo = total - Math.min(withAltText, withSeoFilename);

      const analytics = {
        total,
        withAltText,
        withSeoFilename,
        byCategory,
        topTags,
        needsSeo
      };

      console.log('📊 Analytics:', analytics);
      return analytics;
    } catch (error) {
      console.error('Get media analytics error:', error);
      return {
        total: 0,
        withAltText: 0,
        withSeoFilename: 0,
        byCategory: {},
        topTags: [],
        needsSeo: 0
      };
    }
  }

  // ============= UTILITY FUNCTIONS =============

  private generateSeoFilename(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
  }

  private async getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url); // Clean up
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url); // Clean up
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  // Clear all caches
  clearCache(): void {
    console.log('🧹 Clearing all caches');
    this.cache.clear();
    this.metadataCache.clear();
  }

  // Get bucket name (for debugging)
  getBucketName(): string {
    return STORAGE_BUCKET;
  }

  // Get storage folder (for debugging)
  getStorageFolder(): string {
    return STORAGE_FOLDER;
  }

  // Test connection to Supabase Storage
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔌 Testing Supabase Storage connection...');
      console.log(`📦 Bucket: ${STORAGE_BUCKET}`);
      console.log(`📁 Folder: ${STORAGE_FOLDER}`);

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(STORAGE_FOLDER, {
          limit: 1
        });

      if (error) {
        console.error('❌ Connection test failed:', error);
        return false;
      }

      console.log('✅ Connection successful');
      console.log('📊 Test result:', data);
      return true;
    } catch (error) {
      console.error('❌ Connection test error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const MediaService = new MediaServiceClass();