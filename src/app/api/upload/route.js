export const runtime = 'edge';

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Check that blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN is not configured. Add it in Vercel project settings → Environment Variables.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (max 4.5MB for Vercel serverless, use 4MB as safe limit)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 4MB. Please compress or resize the image.' }, { status: 400 });
    }

    // Validate it's an image
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type: ${file.type}. Supported: JPEG, PNG, GIF, WebP, SVG, AVIF.` }, { status: 400 });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'png';
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/-+/g, '-');
    const filename = `articles/${timestamp}-${safeName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      success: true,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error?.message || 'Unknown upload error';
    return NextResponse.json(
      { error: 'Upload failed: ' + message },
      { status: 500 }
    );
  }
}

// Vercel serverless body size limit
export const maxDuration = 60;
