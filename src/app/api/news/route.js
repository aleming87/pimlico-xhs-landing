export const runtime = 'edge';

import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://xldyvilhtvxmfgtyjusb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZHl2aWxodHZ4bWZndHlqdXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNzU3ODQsImV4cCI6MjA0Nzk1MTc4NH0.tBMCMf4KE9XD1bs3-cNlpSXsOjMfBXJBLl3E6nfJdwU';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/news_articles?status=eq.published&order=date.desc&limit=50`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json([], { headers: corsHeaders });
    }

    const data = await res.json();

    const articles = data.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      author: a.author,
      date: a.date,
      readTime: a.read_time,
      image: a.image,
      tags: a.tags || [],
      isPremium: a.is_premium,
      featured: a.featured,
    }));

    return NextResponse.json(articles, { headers: corsHeaders });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json([], { headers: corsHeaders });
  }
}
