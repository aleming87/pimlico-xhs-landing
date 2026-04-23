export const runtime = 'edge';

import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://sup.xhsdata.ai';
const SUPABASE_ANON_KEY = 'sb_publishable_vd8k7yq856LAm9OgDLMw9w_wHIE4ptd';

// CORS headers for cross-origin access from xhsdata.ai
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/articles — fetch published articles from Supabase
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    let endpoint = `${SUPABASE_URL}/rest/v1/news_articles?status=eq.published&order=date.desc&limit=50`;

    // If slug provided, fetch single article — status=eq.published so
    // manually archived pieces (e.g. low-operational-payoff pulls) 404
    // on direct URL, not just on the listing. Rev 2026-04-22.
    if (slug) {
      endpoint = `${SUPABASE_URL}/rest/v1/news_articles?slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`;
    }

    const res = await fetch(endpoint, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ articles: [], error: 'Failed to fetch' }, { status: 500, headers: corsHeaders });
    }

    const data = await res.json();

    // Rev 2026-04-23 — the single-slug path previously returned the raw
    // DB row, which left is_premium/read_time in snake_case. The client
    // reads article.isPremium + article.readTime, so the paywall silently
    // never triggered (!undefined → true → hasFullAccess=true). Collapse
    // both paths through the same mapper so the shape is identical.
    const mapArticle = (a) => a && ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      contentType: a.content_type,
      category: a.category,
      author: a.author,
      date: a.date,
      readTime: a.read_time,
      image: a.image,
      ogImage: a.og_image,
      tags: a.tags || [],
      isPremium: a.is_premium ?? a.premium ?? false,
      premiumCutoff: a.premium_cutoff ?? null,
      featured: a.featured,
      status: a.status,
      scheduledAt: a.scheduled_at,
    });

    // Single article request
    if (slug) {
      const article = mapArticle(data[0] || null);
      return NextResponse.json({ article }, { headers: corsHeaders });
    }

    const articles = data.map(mapArticle);

    return NextResponse.json({ articles }, { headers: corsHeaders });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({ articles: [], error: 'Internal error' }, { status: 500, headers: corsHeaders });
  }
}

// POST /api/articles — receive published articles from news-publisher edge function
export async function POST(request) {
  try {
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.ARTICLES_API_KEY;

    if (!expectedKey || apiKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const body = await request.json();

    // Forward to Supabase
    const res = await fetch(`${SUPABASE_URL}/rest/v1/news_articles`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: body.slug || body.id,
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        author: body.author || 'Pimlico XHS™ Team',
        date: body.date,
        read_time: body.readTime,
        image: body.image,
        tags: body.tags || [],
        is_premium: body.isPremium || false,
        featured: body.featured || false,
        status: 'published',
        published_to: ['internal', 'website'],
        website_published_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Supabase insert error:', err);
      return NextResponse.json({ error: 'Failed to save' }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Articles POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500, headers: corsHeaders });
  }
}
