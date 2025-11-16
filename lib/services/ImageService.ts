/**
 * ImageService - Ultra-Modern Image Upload & Management
 * 
 * CRITICAL FIX: Sequential upload to prevent Response body lock errors
 * ENHANCED: 5 retry attempts + 2min timeout for development stability
 * 
 * FEATURES:
 * - Sequential file upload (birer birer)
 * - 5 retry attempts per file (increased from 3)
 * - 2 minute timeout per file (increased from 1)
 * - Better error messages
 * - Progress tracking support
 * - 50MB file size limit
 */

export interface UploadedImage {
  id: string;
  url: string;
  file: File;
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  order: number;
}

export const ImageService = {
  /**
   * Upload single image with retry logic
   */
  uploadSingle: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadedImage> => {
    return new Promise(async (resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'));
        return;
      }

      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        reject(new Error(`Image size must be less than 50MB (got ${sizeMB}MB)`));
        return;
      }

      try {
        // Get image dimensions
        const dimensions = await ImageService.getDimensions(
          URL.createObjectURL(file)
        );

        // Upload via API with timeout and retry
        const MAX_RETRIES = 5; // Increased from 3 to 5 for development stability
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            console.log(`🔄 Upload attempt ${attempt}/${MAX_RETRIES} for ${file.name}`);

            // Create FormData for single file
            const formData = new FormData();
            formData.append('files', file);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout per file (increased from 1 min)

            const response = await fetch('/api/admin/upload', {
              method: 'POST',
              body: formData,
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const contentType = response.headers.get('content-type');

              // Check if response is JSON or HTML (error page)
              if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                throw new Error(error.error || `Upload failed with status ${response.status}`);
              } else {
                // Got HTML error page instead of JSON
                throw new Error('Server error - please try again or restart dev server');
              }
            }

            const data = await response.json();

            if (!data.urls || data.urls.length === 0) {
              throw new Error('No URL returned from upload');
            }

            // Create UploadedImage object
            const uploadedImage: UploadedImage = {
              id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              url: data.urls[0],
              file,
              name: file.name,
              size: file.size,
              type: file.type,
              width: dimensions.width,
              height: dimensions.height,
              order: 0,
            };

            console.log(`✅ Upload successful: ${file.name}`);
            resolve(uploadedImage);
            return; // Success! Exit retry loop
          } catch (fetchError: any) {
            lastError = fetchError;

            // Only show error on final attempt, otherwise show warning
            if (attempt === MAX_RETRIES) {
              console.error(`❌ Final attempt failed for ${file.name}:`, fetchError.message);
            } else {
              console.warn(`⚠️ Attempt ${attempt} failed for ${file.name}, retrying...`);
            }

            if (fetchError.name === 'AbortError') {
              lastError = new Error('Upload timeout - file might be too large or connection is slow');
            }

            // Retry with exponential backoff
            if (attempt < MAX_RETRIES) {
              const delay = 500 * attempt; // 500ms, 1s, 1.5s, 2s, 2.5s
              console.log(`⏳ Retrying in ${delay}ms... (${attempt + 1}/${MAX_RETRIES})`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
          }
        }

        // All retries failed
        reject(lastError || new Error('Upload failed after multiple attempts'));
      } catch (error: any) {
        console.error('Error uploading single image:', error);
        reject(error);
      }
    });
  },

  /**
   * 🔥 CRITICAL FIX: Upload multiple images SEQUENTIALLY (birer birer)
   * This prevents "Response body disturbed or locked" errors
   */
  uploadMultiple: async (
    files: File[],
    onProgress?: (current: number, total: number) => void
  ): Promise<UploadedImage[]> => {
    try {
      console.log('📤 ImageService.uploadMultiple called with', files.length, 'files');
      console.log('🔄 Using SEQUENTIAL upload (one at a time) to prevent server crashes');

      // Validate all files first
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image`);
        }
        if (file.size > 50 * 1024 * 1024) {
          const sizeMB = (file.size / 1024 / 1024).toFixed(2);
          throw new Error(`${file.name} is too large (max 50MB, got ${sizeMB}MB)`);
        }
      }

      // 🔥 CRITICAL: Upload files SEQUENTIALLY (not in parallel)
      const uploadedImages: UploadedImage[] = [];
      const failedFiles: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`\n📤 [${i + 1}/${files.length}] Uploading: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

        // Update progress
        if (onProgress) {
          onProgress(i + 1, files.length);
        }

        try {
          // Upload single file
          const uploadedImage = await ImageService.uploadSingle(file);
          uploadedImage.order = i; // Set order
          uploadedImages.push(uploadedImage);

          console.log(`✅ [${i + 1}/${files.length}] Success: ${file.name}`);

          // Small delay between uploads to prevent server overload
          if (i < files.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay (increased from 300ms)
          }
        } catch (error: any) {
          console.warn(`⚠️ [${i + 1}/${files.length}] Failed (will skip): ${file.name}`, error.message);
          failedFiles.push(file.name);

          // Continue with other files instead of failing completely
          // You can choose to throw here if you want all-or-nothing upload
          // throw error;
        }
      }

      console.log(`\n🎯 Upload Summary:`);
      console.log(`   ✅ Successful: ${uploadedImages.length}/${files.length} files`);

      if (failedFiles.length > 0) {
        console.warn(`   ⚠️ Failed: ${failedFiles.length} files`);
        console.warn(`   Failed files:`, failedFiles);
        console.log(`   💡 Tip: Try uploading failed files individually`);
      } else {
        console.log(`   🎉 All files uploaded successfully!`);
      }

      if (uploadedImages.length === 0) {
        throw new Error('All uploads failed. Please try again.');
      }

      return uploadedImages;
    } catch (error: any) {
      console.error('❌ Error uploading multiple images:', error);
      throw error;
    }
  },

  /**
   * Compress image before upload (optional)
   */
  compress: async (
    file: File,
    maxWidth: number = 2000,
    quality: number = 0.85
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if too large
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  },

  /**
   * Delete image via API
   */
  delete: async (imageUrl: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/admin/upload?url=${encodeURIComponent(imageUrl)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  },

  /**
   * Reorder images (drag & drop)
   */
  reorder: (
    images: UploadedImage[],
    fromIndex: number,
    toIndex: number
  ): UploadedImage[] => {
    const result = Array.from(images);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);

    return result.map((img, index) => ({ ...img, order: index }));
  },

  /**
   * Validate image URL
   */
  validateUrl: async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return response.ok && (contentType?.startsWith('image/') ?? false);
    } catch {
      return false;
    }
  },

  /**
   * Download image from URL and upload
   */
  downloadFromUrl: async (url: string): Promise<UploadedImage | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], url.split('/').pop() || 'image.jpg', {
        type: blob.type,
      });

      return await ImageService.uploadSingle(file);
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  },

  /**
   * Get image dimensions
   */
  getDimensions: async (
    url: string
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  },

  /**
   * Convert base64 to File
   */
  base64ToFile: (base64: string, filename: string): File => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.* ?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  },

  /**
   * Convert File to base64
   */
  fileToBase64: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },
};