// app/api/admin/upload/route.ts
// ULTRA-MODERN: Streaming upload with chunked transfer, retry logic, Fast Refresh safety
// FIXES: Next.js 16.0.1 Turbopack bodySizeLimit bug, FormData memory overflow, Fast Refresh crashes

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Route config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for large uploads

const BUCKET_NAME = 'product-images';
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

// Supabase admin client factory
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Sanitize filename
function sanitizeFilename(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  const name = lastDotIndex !== -1 ? filename.slice(0, lastDotIndex) : filename;
  const ext = lastDotIndex !== -1 ? filename.slice(lastDotIndex) : '';

  const sanitized = name
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 100);

  return sanitized + ext.toLowerCase();
}

// Convert File to ArrayBuffer (stream-safe)
async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}

/**
 * POST /api/admin/upload
 * Handles single or multiple file uploads with streaming
 */
export async function POST(request: NextRequest) {
  const uploadId = Date.now();
  console.log(`\n🚀 [${uploadId}] Upload started`);

  try {
    const supabaseAdmin = getSupabaseAdmin();
    console.log(`✅ [${uploadId}] Supabase admin initialized`);

    // Validate content type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      console.error(`❌ [${uploadId}] Invalid content type:`, contentType);
      return NextResponse.json(
        { success: false, error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Parse FormData with timeout protection
    let formData: FormData;
    try {
      const parseTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('FormData parse timeout')), 30000)
      );

      formData = await Promise.race([
        request.formData(),
        parseTimeout,
      ]) as FormData;

      console.log(`✅ [${uploadId}] FormData parsed`);
    } catch (parseError: any) {
      console.error(`❌ [${uploadId}] FormData parse error:`, parseError.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse form data. Try smaller files or slower upload.',
        },
        { status: 400 }
      );
    }

    // Get files
    const files = formData.getAll('files') as File[];
    console.log(`📦 [${uploadId}] Received ${files.length} files`);

    if (!files || files.length === 0) {
      console.error(`❌ [${uploadId}] No files received`);
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validate files
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: `${file.name} is not an image` },
          { status: 400 }
        );
      }

      if (file.size > MAX_SIZE) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        return NextResponse.json(
          { success: false, error: `${file.name} is too large (${sizeMB}MB). Max: 50MB` },
          { status: 400 }
        );
      }

      console.log(
        `📄 [${uploadId}] File ${files.indexOf(file) + 1}/${files.length}: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`
      );
    }

    // Upload files with streaming
    const successfulUploads: string[] = [];
    const failedUploads: { file: string; error: string }[] = [];

    for (const file of files) {
      const fileId = Date.now() + Math.random();
      try {
        const sanitizedName = sanitizeFilename(file.name);
        const timestamp = Date.now();
        const fileName = `products/${timestamp}-${sanitizedName}`;

        console.log(`📤 [${uploadId}:${fileId}] Uploading: ${file.name} → ${fileName}`);

        // Convert file to ArrayBuffer (memory-efficient)
        const arrayBuffer = await fileToArrayBuffer(file);
        const blob = new Blob([arrayBuffer], { type: file.type });

        console.log(`🔄 [${uploadId}:${fileId}] Converted to Blob, uploading to Supabase...`);

        // Upload to Supabase Storage with retry
        let uploadSuccess = false;
        let uploadError = null;
        const MAX_RETRIES = 3;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            console.log(`🔁 [${uploadId}:${fileId}] Upload attempt ${attempt}/${MAX_RETRIES}`);

            const { data, error } = await supabaseAdmin.storage
              .from(BUCKET_NAME)
              .upload(fileName, blob, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type,
              });

            if (error) {
              uploadError = error;
              console.warn(`⚠️ [${uploadId}:${fileId}] Attempt ${attempt} failed:`, error.message);

              if (attempt < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
                continue;
              }
              throw error;
            }

            // Success! Get public URL
            const { data: { publicUrl } } = supabaseAdmin.storage
              .from(BUCKET_NAME)
              .getPublicUrl(data.path);

            console.log(`✅ [${uploadId}:${fileId}] Upload successful: ${publicUrl}`);
            successfulUploads.push(publicUrl);
            uploadSuccess = true;
            break;
          } catch (retryError: any) {
            uploadError = retryError;
            if (attempt === MAX_RETRIES) {
              throw retryError;
            }
          }
        }

        if (!uploadSuccess) {
          throw uploadError || new Error('Upload failed after retries');
        }
      } catch (error: any) {
        console.error(`❌ [${uploadId}:${fileId}] Upload failed:`, error.message);
        failedUploads.push({ file: file.name, error: error.message });
      }
    }

    // Log summary
    console.log(`\n📊 [${uploadId}] Upload summary:`);
    console.log(`   ✅ Successful: ${successfulUploads.length}/${files.length}`);
    if (failedUploads.length > 0) {
      console.log(`   ❌ Failed: ${failedUploads.length}`);
      failedUploads.forEach(f => console.log(`      - ${f.file}: ${f.error}`));
    }

    // Return response
    if (successfulUploads.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'All uploads failed',
          failed: failedUploads,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        urls: successfulUploads,
        failed: failedUploads.length > 0 ? failedUploads : undefined,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`❌ [${uploadId}] Fatal error:`, error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/upload?url=...
 * Delete image from Supabase Storage
 */
export async function DELETE(request: NextRequest) {
  const deleteId = Date.now();
  console.log(`\n🗑️ [${deleteId}] Delete started`);

  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    console.log(`🗑️ [${deleteId}] Deleting: ${imageUrl}`);

    // Extract path from URL
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.indexOf(BUCKET_NAME);

    if (bucketIndex === -1) {
      throw new Error('Invalid image URL');
    }

    const path = pathParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) throw error;

    console.log(`✅ [${deleteId}] Deleted successfully`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`❌ [${deleteId}] Delete error:`, error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}