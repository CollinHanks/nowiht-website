// lib/supabase/storage.ts
// Image storage operations for NOWIHT E-Commerce
// FIXED: Filename sanitization to handle special characters

import { supabase, supabaseAdmin } from './client';

const BUCKET_NAME = 'product-images';

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Sanitize filename to remove special characters
 * Supabase Storage doesn't accept: spaces, special chars, etc.
 */
function sanitizeFilename(filename: string): string {
  // Get file extension
  const lastDotIndex = filename.lastIndexOf('.');
  const name = lastDotIndex !== -1 ? filename.slice(0, lastDotIndex) : filename;
  const ext = lastDotIndex !== -1 ? filename.slice(lastDotIndex) : '';

  // Sanitize name:
  // 1. Replace spaces with hyphens
  // 2. Remove special characters (keep only alphanumeric, hyphens, underscores)
  // 3. Replace multiple consecutive hyphens with single hyphen
  // 4. Remove leading/trailing hyphens
  // 5. Lowercase
  const sanitized = name
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/[^\w\-]/g, '')        // remove special chars
    .replace(/\-+/g, '-')           // multiple hyphens → single
    .replace(/^-+|-+$/g, '')        // trim hyphens
    .toLowerCase()                  // lowercase
    .slice(0, 100);                 // max 100 chars for name

  return sanitized + ext.toLowerCase();
}

// ═══════════════════════════════════════════════════════════════
// UPLOAD OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Upload a product image
 * @param file - File object to upload
 * @param path - Optional custom path (default: products/{timestamp}-{sanitized-filename})
 * @returns Public URL of the uploaded image
 */
export async function uploadProductImage(
  file: File,
  path?: string
): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Admin client not initialized' };
  }

  try {
    // Sanitize filename to remove special characters
    const sanitizedName = sanitizeFilename(file.name);

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = path || `products/${timestamp}-${sanitizedName}`;

    console.log(`🔄 Sanitized: "${file.name}" → "${sanitizedName}"`);

    // Upload file
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload multiple product images
 */
export async function uploadMultipleImages(
  files: File[]
): Promise<{
  success: boolean;
  urls?: string[];
  error?: string;
}> {
  try {
    const uploadPromises = files.map((file) => uploadProductImage(file));
    const results = await Promise.all(uploadPromises);

    const failedUploads = results.filter((r) => !r.success);
    if (failedUploads.length > 0) {
      throw new Error(`Failed to upload ${failedUploads.length} images`);
    }

    const urls = results.map((r) => r.url!);
    return { success: true, urls };
  } catch (error: any) {
    console.error('Error uploading multiple images:', error);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Delete a product image
 * @param url - Full public URL or path of the image
 */
export async function deleteProductImage(
  url: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Admin client not initialized' };
  }

  try {
    // Extract path from URL
    const path = extractPathFromUrl(url);
    if (!path) {
      throw new Error('Invalid image URL');
    }

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete multiple product images
 */
export async function deleteMultipleImages(
  urls: string[]
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const paths = urls
      .map((url) => extractPathFromUrl(url))
      .filter((path): path is string => path !== null);

    if (paths.length === 0) {
      throw new Error('No valid image paths found');
    }

    const { error } = await supabaseAdmin!.storage
      .from(BUCKET_NAME)
      .remove(paths);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting multiple images:', error);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Extract storage path from public URL
 * Example: https://xxx.supabase.co/storage/v1/object/public/product-images/products/image.jpg
 * Returns: products/image.jpg
 */
function extractPathFromUrl(url: string): string | null {
  try {
    // Handle both full URLs and paths
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');

      // Find the bucket name in the path
      const bucketIndex = pathParts.indexOf(BUCKET_NAME);
      if (bucketIndex === -1) return null;

      // Get path after bucket name
      return pathParts.slice(bucketIndex + 1).join('/');
    } else {
      // Already a path
      return url;
    }
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return null;
  }
}

/**
 * Get image metadata (size, dimensions, etc.)
 */
export async function getImageMetadata(url: string): Promise<{
  success: boolean;
  metadata?: {
    size: number;
    width?: number;
    height?: number;
    format?: string;
  };
  error?: string;
}> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) throw new Error('Failed to fetch image metadata');

    const size = parseInt(response.headers.get('content-length') || '0');
    const format = response.headers.get('content-type')?.split('/')[1];

    return {
      success: true,
      metadata: { size, format },
    };
  } catch (error: any) {
    console.error('Error getting image metadata:', error);
    return { success: false, error: error.message };
  }
}

/**
 * List all images in a folder
 */
export async function listImages(
  folder: string = 'products'
): Promise<{
  success: boolean;
  files?: Array<{ name: string; url: string }>;
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin!.storage
      .from(BUCKET_NAME)
      .list(folder);

    if (error) throw error;

    const files = data.map((file) => ({
      name: file.name,
      url: supabaseAdmin!.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${folder}/${file.name}`).data.publicUrl,
    }));

    return { success: true, files };
  } catch (error: any) {
    console.error('Error listing images:', error);
    return { success: false, error: error.message };
  }
}