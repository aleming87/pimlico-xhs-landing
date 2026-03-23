import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

const ARTICLES_BLOB_KEY = 'articles/articles-data.json';

// --- Auth helper ---
function validateApiKey(request) {
  const apiKey = process.env.ARTICLES_API_KEY;
  if (!apiKey) return { valid: false, error: 'ARTICLES_API_KEY is not configured on the server.' };

  const header = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!header || header !== apiKey) {
    return { valid: false, error: 'Invalid or missing API key.' };
  }
  return { valid: true };
}

// --- Blob helpers ---
async function getArticlesDataFromBlob() {
  try {
    const { blobs } = await list({ prefix: 'articles/articles-data' });
    if (blobs.length === 0) return { articles: [], deletedSampleIds: [] };

    const response = await fetch(blobs[0].url, { cache: 'no-store' });
    const data = await response.json();
    return {
      articles: data.articles || [],
      deletedSampleIds: data.deletedSampleIds || [],
    };
  } catch (error) {
    console.error('Error fetching from blob:', error);
    return { articles: [], deletedSampleIds: [] };
  }
}

async function saveArticlesDataToBlob(articles, deletedSampleIds = []) {
  const data = {
    articles,
    deletedSampleIds,
    updatedAt: new Date().toISOString(),
  };

  const blob = await put(ARTICLES_BLOB_KEY, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });

  return blob;
}

// --- Slug helper ---
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// --- Validation ---
const REQUIRED_FIELDS = ['title', 'content'];
const VALID_CATEGORIES = ['AI Regulation', 'Payments', 'Crypto', 'Gambling', 'Compliance', 'Technology'];
const VALID_STATUSES = ['published', 'draft', 'scheduled'];

function validateArticle(article) {
  const errors = [];
  for (const field of REQUIRED_FIELDS) {
    if (!article[field] || (typeof article[field] === 'string' && !article[field].trim())) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  if (article.category && !VALID_CATEGORIES.includes(article.category)) {
    errors.push(`Invalid category "${article.category}". Valid: ${VALID_CATEGORIES.join(', ')}`);
  }
  if (article.status && !VALID_STATUSES.includes(article.status)) {
    errors.push(`Invalid status "${article.status}". Valid: ${VALID_STATUSES.join(', ')}`);
  }
  return errors;
}

function buildArticle(input, existingId) {
  const now = new Date().toISOString();
  const wordCount = (input.content || '').split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return {
    id: existingId || Date.now(),
    slug: input.slug || generateSlug(input.title),
    title: input.title,
    excerpt: input.excerpt || input.content.substring(0, 180).replace(/[#*_\n]/g, '').trim() + '...',
    category: input.category || 'Compliance',
    author: input.author || 'Pimlico XHS™ Team',
    date: input.date || now.split('T')[0],
    readTime: input.readTime || readTime,
    image: input.image || '',
    ogImage: input.ogImage || '',
    featured: input.featured ?? false,
    isPremium: input.isPremium ?? false,
    status: input.status || 'published',
    content: input.content,
    tags: input.tags || [],
    isSample: false,
  };
}

// =====================================================
// GET - Return all articles (custom only)
// Public – no API key required
// =====================================================
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  const { articles: customArticles } = await getArticlesDataFromBlob();

  if (slug) {
    const article = customArticles.find(a => a.slug === slug);
    if (article) return NextResponse.json(article);
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  return NextResponse.json({ articles: customArticles });
}

// =====================================================
// POST - Save articles to Vercel Blob
// Supports TWO modes:
//   1. Bulk sync  (admin dashboard) — body: { articles: [...], deletedSampleIds: [...] }
//   2. Single publish (external API) — body: { title, content, ... }
//      Requires x-api-key or Authorization: Bearer <key>
// =====================================================
export async function POST(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN is not configured. Add it in Vercel project settings → Environment Variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();

    // --- Mode 1: Bulk sync (legacy admin dashboard) ---
    if (Array.isArray(body.articles)) {
      const data = {
        articles: body.articles || [],
        deletedSampleIds: body.deletedSampleIds || [],
        updatedAt: new Date().toISOString(),
      };

      const blob = await put(ARTICLES_BLOB_KEY, JSON.stringify(data, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        articleCount: (body.articles || []).length,
      });
    }

    // --- Mode 2: Single article publish (external agents) ---
    const auth = validateApiKey(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const errors = validateArticle(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const { articles: existing, deletedSampleIds } = await getArticlesDataFromBlob();
    const article = buildArticle(body);

    // Prevent duplicate slugs
    const duplicate = existing.find(a => a.slug === article.slug);
    if (duplicate) {
      return NextResponse.json(
        { error: `An article with slug "${article.slug}" already exists. Use PUT to update it.` },
        { status: 409 }
      );
    }

    existing.push(article);
    const blob = await saveArticlesDataToBlob(existing, deletedSampleIds);

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        status: article.status,
        url: `https://pimlicosolutions.com/insights/${article.slug}`,
      },
      totalArticles: existing.length,
      blobUrl: blob.url,
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving articles:', error);
    return NextResponse.json(
      { error: 'Failed to save articles: ' + error.message },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT - Update an existing article by slug
// Requires x-api-key or Authorization: Bearer <key>
// =====================================================
export async function PUT(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN is not configured.' },
        { status: 500 }
      );
    }

    const auth = validateApiKey(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const slug = body.slug;
    if (!slug) {
      return NextResponse.json({ error: 'slug is required to update an article.' }, { status: 400 });
    }

    const { articles: existing, deletedSampleIds } = await getArticlesDataFromBlob();
    const index = existing.findIndex(a => a.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: `Article with slug "${slug}" not found.` }, { status: 404 });
    }

    // Merge: keep existing fields, overwrite with provided ones
    const merged = { ...existing[index], ...body, id: existing[index].id, isSample: false };
    if (body.title && body.title !== existing[index].title && !body.slug) {
      merged.slug = existing[index].slug; // preserve original slug if title changed but slug not explicitly set
    }

    const errors = validateArticle(merged);
    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    existing[index] = buildArticle(merged, merged.id);
    await saveArticlesDataToBlob(existing, deletedSampleIds);

    return NextResponse.json({
      success: true,
      article: {
        id: existing[index].id,
        slug: existing[index].slug,
        title: existing[index].title,
        status: existing[index].status,
        url: `https://pimlicosolutions.com/insights/${existing[index].slug}`,
      },
    });

  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article: ' + error.message }, { status: 500 });
  }
}

// =====================================================
// DELETE - Remove an article by slug
// Requires x-api-key or Authorization: Bearer <key>
// =====================================================
export async function DELETE(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN is not configured.' },
        { status: 500 }
      );
    }

    const auth = validateApiKey(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: 'slug query parameter is required.' }, { status: 400 });
    }

    const { articles: existing, deletedSampleIds } = await getArticlesDataFromBlob();
    const index = existing.findIndex(a => a.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: `Article with slug "${slug}" not found.` }, { status: 404 });
    }

    const removed = existing.splice(index, 1)[0];
    await saveArticlesDataToBlob(existing, deletedSampleIds);

    return NextResponse.json({
      success: true,
      deleted: { id: removed.id, slug: removed.slug, title: removed.title },
      remainingArticles: existing.length,
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article: ' + error.message }, { status: 500 });
  }
}
