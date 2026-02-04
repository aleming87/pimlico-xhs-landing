import { NextResponse } from 'next/server';
import { sampleArticles } from '@/data/sample-articles';

// GET - Return all articles (for metadata generation)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
  if (slug) {
    // Return single article by slug
    const article = sampleArticles.find(a => a.slug === slug);
    if (article) {
      return NextResponse.json(article);
    }
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
  
  // Return all articles
  return NextResponse.json(sampleArticles);
}
