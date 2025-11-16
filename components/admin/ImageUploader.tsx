// components/admin/ImageUploader.tsx
// ULTRA-MODERN: Sequential upload with real-time progress tracking

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, GripVertical, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { ImageService } from '@/lib/services/ImageService';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 8,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    message: string;
  } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Clear input value to allow same file re-upload
    e.target.value = '';

    // Check total images limit
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more.`);
      return;
    }

    await uploadFiles(files);
  };

  // Handle drag and drop upload
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Filter image files
    const imageFiles = files.filter((file) =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      alert('Please drop image files only (PNG, JPG, WEBP, etc.)');
      return;
    }

    // Check total images limit
    if (images.length + imageFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more.`);
      return;
    }

    await uploadFiles(imageFiles);
  };

  // Upload files with better error handling and progress tracking
  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setUploadProgress({
      current: 0,
      total: files.length,
      message: 'Preparing to upload...',
    });

    try {
      console.log('📤 Starting sequential upload:', files.map(f => `${f.name} (${(f.size / 1024).toFixed(2)}KB)`));

      // Upload with progress callback
      const uploadedImages = await ImageService.uploadMultiple(
        files,
        (current, total) => {
          setUploadProgress({
            current,
            total,
            message: `Uploading ${current}/${total} files... Please wait.`,
          });
        }
      );

      // Extract URLs from UploadedImage objects
      const uploadedUrls = uploadedImages.map(img =>
        typeof img === 'string' ? img : img.url
      );

      console.log('✅ Upload successful:', uploadedUrls);

      setUploadProgress({
        current: files.length,
        total: files.length,
        message: 'Upload complete! Adding images...',
      });

      // Use functional setState to prevent race conditions
      onChange([...images, ...uploadedUrls]);

      // Show success message briefly
      setTimeout(() => {
        setUploadProgress(null);
      }, 1000);
    } catch (error: any) {
      console.error('❌ Upload error:', error);

      // Better error messages
      let errorMessage = 'Failed to upload images';

      if (error.message.includes('timeout')) {
        errorMessage = 'Upload timeout - files might be too large or connection is slow. Try smaller files or check your internet connection.';
      } else if (error.message.includes('Server error')) {
        errorMessage = 'Server error - please try again or restart the dev server (Ctrl+C then npm run dev).';
      } else if (error.message.includes('too large')) {
        errorMessage = error.message;
      } else if (error.message.includes('All uploads failed')) {
        errorMessage = 'All uploads failed. Please check your internet connection and try again.';
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }

      alert(errorMessage);
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Image removal
  const handleRemove = async (index: number) => {
    const imageUrl = images[index];

    console.log('🗑️ Removing image at index:', index, 'URL:', imageUrl);

    // Remove from UI immediately
    const newImages = images.filter((_, i) => i !== index);

    console.log('✅ Image removed. New array:', newImages);

    onChange(newImages);

    // Optional: Delete from Supabase (in background)
    // This is async and won't block UI
    // ImageService.delete(imageUrl).catch(err => {
    //   console.warn('Failed to delete from storage:', err);
    // });
  };

  // Drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    console.log('🔄 Drag started at index:', index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    console.log('🔄 Drag ended');
  };

  const handleDragOverImage = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];

    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    console.log('🔄 Reordered:', { from: draggedIndex, to: index });

    onChange(newImages);
    setDraggedIndex(index);
  };

  // Image load error handler
  const handleImageError = (index: number) => {
    console.error('❌ Image load error at index:', index, 'URL:', images[index]);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  // Image load success handler
  const handleImageLoad = (index: number) => {
    console.log('✅ Image loaded at index:', index);
    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${uploading
            ? 'border-gray-400 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxImages}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="space-y-4">
          {uploading ? (
            <Loader2 className="w-12 h-12 mx-auto text-gray-400 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP up to 50MB ({images.length}/{maxImages} images)
            </p>
          </div>

          {/* Progress Bar */}
          {uploadProgress && (
            <div className="space-y-2">
              <div className="text-sm text-gray-700 font-medium">
                {uploadProgress.message}
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-black h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                  }}
                />
              </div>

              {/* Progress text */}
              <div className="text-xs text-gray-500">
                {uploadProgress.current} / {uploadProgress.total} files
              </div>
            </div>
          )}

          {images.length >= maxImages && !uploading && (
            <p className="text-sm text-red-600">
              Maximum {maxImages} images reached
            </p>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              draggable={!uploading}
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOverImage(e, index)}
              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${uploading
                  ? 'cursor-default'
                  : 'cursor-move'
                } ${draggedIndex === index
                  ? 'border-black opacity-50'
                  : imageErrors[index]
                    ? 'border-red-500'
                    : 'border-transparent hover:border-gray-300'
                }`}
            >
              {/* Image or Error State */}
              {imageErrors[index] ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 p-4">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-xs text-center font-medium">Failed to load</p>
                  <p className="text-[10px] text-center break-all mt-1 opacity-70">
                    {image.substring(0, 30)}...
                  </p>
                  <button
                    onClick={() => handleRemove(index)}
                    className="mt-2 text-[10px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onError={() => handleImageError(index)}
                  onLoad={() => handleImageLoad(index)}
                  unoptimized
                />
              )}

              {/* Drag Handle */}
              {!uploading && (
                <div className="absolute top-2 left-2 p-1 bg-black/70 rounded cursor-move">
                  <GripVertical className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black text-white text-[10px] font-medium uppercase tracking-wider rounded">
                  Primary
                </div>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(index);
                }}
                disabled={uploading}
                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Number */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {images.length > 0 && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Drag images to reorder them</p>
          <p>• The first image will be the primary product image</p>
          <p>• Recommended size: 1200x1600px (3:4 aspect ratio)</p>
          <p>• Multiple files upload one at a time to prevent server overload</p>
          {Object.keys(imageErrors).length > 0 && (
            <p className="text-red-600">
              • Some images failed to load. Check Supabase Storage permissions or try re-uploading.
            </p>
          )}
        </div>
      )}

      {/* DEBUG: Show current images array */}
      {process.env.NODE_ENV === 'development' && images.length > 0 && (
        <details className="text-xs text-gray-400 font-mono">
          <summary className="cursor-pointer hover:text-gray-600">
            🐛 Debug: Images Array ({images.length})
          </summary>
          <div className="mt-2 p-2 bg-gray-50 rounded max-h-40 overflow-auto space-y-1">
            {images.map((url, i) => (
              <div key={i} className="truncate">
                <span className="text-gray-600">[{i}]</span> {url}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}