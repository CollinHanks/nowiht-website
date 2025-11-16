// app/api/media/metadata/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Simple metadata handling without Supabase dependency
const metadataStore = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('media_id');

    if (!mediaId) {
      return NextResponse.json({ error: 'media_id required' }, { status: 400 });
    }

    const metadata = metadataStore.get(mediaId) || null;
    return NextResponse.json(metadata);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.media_id) {
      return NextResponse.json({ error: 'media_id required' }, { status: 400 });
    }

    // Generate SEO filename if not provided
    if (!body.seo_filename && body.alt_text) {
      body.seo_filename = generateSeoFilename(body.alt_text);
    }

    metadataStore.set(body.media_id, body);
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('media_id');
    const updates = await request.json();

    if (!mediaId) {
      return NextResponse.json({ error: 'media_id required' }, { status: 400 });
    }

    const existing = metadataStore.get(mediaId) || { media_id: mediaId };
    const updated = { ...existing, ...updates };

    // Auto-generate SEO filename if alt_text changes
    if (updates.alt_text && !updates.seo_filename) {
      updated.seo_filename = generateSeoFilename(updates.alt_text);
    }

    metadataStore.set(mediaId, updated);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('media_id');

    if (!mediaId) {
      return NextResponse.json({ error: 'media_id required' }, { status: 400 });
    }

    metadataStore.delete(mediaId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function generateSeoFilename(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}