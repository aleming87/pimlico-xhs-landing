import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { sampleArticles } from '@/data/sample-articles';

const ARTICLES_BLOB_KEY = 'articles/articles-data.json';

// Helper to fetch custom articles from Vercel Blob
async function getCustomArticlesFromBlob() {
  try {
    const { blobs } = await list({ prefix: 'articles/articles-data' });
    
    if (blobs.length === 0) {
      return { articles: [], deletedSampleIds: [] };
    }

    const response = await fetch(blobs[0].url, { cache: 'no-store' });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from blob:', error);
    return { articles: [], deletedSampleIds: [] };
  }
}

// GET - Return all articles (custom + samples, for metadata generation)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
  // Fetch custom articles from blob
  const { articles: customArticles, deletedSampleIds } = await getCustomArticlesFromBlob();
  
  // Get visible sample articles (not deleted, not overridden)
  const customSlugs = customArticles.map(a => a.slug);
  const visibleSamples = sampleArticles.filter(s => 
    !(deletedSampleIds || []).includes(s.id) && !customSlugs.includes(s.slug)
  );
  
  // Combine all articles
  const allArticles = [...customArticles, ...visibleSamples];
  
  if (slug) {
    // Return single article by slug
    const article = allArticles.find(a => a.slug === slug);
    if (article) {
      return NextResponse.json(article);
    }
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
  
  // Return all articles
  return NextResponse.json({ 
    articles: allArticles, 
    customArticles, 
    deletedSampleIds: deletedSampleIds || [] 
  });
}

// POST - Save articles to Vercel Blob
export async function POST(request) {
  try {
    const { articles, deletedSampleIds } = await request.json();
    
    const data = {
      articles: articles || [],
      deletedSampleIds: deletedSampleIds || [],
      updatedAt: new Date().toISOString(),
    };
    
    // Delete existing blob if it exists
    try {
      const { blobs } = await list({ prefix: 'articles/articles-data' });
      for (const blob of blobs) {
        await del(blob.url);
      }
    } catch (e) {
      // Ignore deletion errors
    }
    
    // Upload new JSON
    const blob = await put(ARTICLES_BLOB_KEY, JSON.stringify(data, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error('Error saving articles:', error);
    return NextResponse.json(
      { error: 'Failed to save articles: ' + error.message },
      { status: 500 }
    );
  }
}
