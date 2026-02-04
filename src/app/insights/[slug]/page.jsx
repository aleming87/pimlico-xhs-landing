import { sampleArticles } from '@/data/sample-articles';
import ArticlePageClient from './ArticlePageClient';

// Category-specific default OG images
const categoryImages = {
  'Gambling': '/articles/og-gambling.png',
  'AI Regulation': '/articles/og-ai-regulation.png', 
  'Payments': '/articles/og-payments.png',
};

// Generate metadata for social sharing
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = sampleArticles.find(a => a.slug === slug);
  
  // IMPORTANT: Use www subdomain to match Vercel deployment
  const baseUrl = 'https://www.pimlicosolutions.com';
  
  if (!article) {
    return {
      title: 'Article Not Found - Pimlico XHS™',
      description: 'The requested article could not be found.',
      openGraph: {
        title: 'Article Not Found - Pimlico XHS™',
        description: 'The requested article could not be found.',
        url: `${baseUrl}/insights/${slug}`,
        siteName: 'Pimlico XHS™',
        type: 'website',
      },
    };
  }

  // OG Image priority:
  // 1. Custom ogImage field on the article (uploaded via admin)
  // 2. Article's cover image (if it's a full URL from Vercel Blob)
  // 3. Category-specific default image
  // 4. No image (let social platforms use their defaults)
  let ogImage = null;
  
  if (article.ogImage) {
    // Custom OG image URL (from Vercel Blob upload)
    ogImage = article.ogImage.startsWith('http') 
      ? article.ogImage 
      : `${baseUrl}${article.ogImage.startsWith('/') ? '' : '/'}${article.ogImage}`;
  } else if (article.image && article.image.startsWith('http')) {
    // Article cover image is a public URL (Vercel Blob)
    ogImage = article.image;
  } else {
    // Use category-specific default
    const categoryImage = categoryImages[article.category];
    if (categoryImage) {
      ogImage = `${baseUrl}${categoryImage}`;
    }
  }

  const description = article.excerpt?.slice(0, 200) || 'Read the latest regulatory insights from Pimlico XHS™';

  // Build the metadata object
  const metadata = {
    title: `${article.title} - Pimlico XHS™`,
    description: description,
    authors: [{ name: 'Pimlico XHS™ Team' }],
    
    // Important for LinkedIn - must match exactly
    openGraph: {
      title: article.title,
      description: description,
      url: `${baseUrl}/insights/${slug}`,
      siteName: 'Pimlico XHS™',
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: ['Pimlico XHS™ Team'],
      locale: 'en_US',
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: article.title,
      description: description,
      creator: '@pimlicoxhs',
      site: '@pimlicoxhs',
    },
    // Additional metadata for better social sharing
    alternates: {
      canonical: `${baseUrl}/insights/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  // Only add images if we have an OG image
  if (ogImage) {
    metadata.openGraph.images = [
      {
        url: ogImage,
        secureUrl: ogImage,
        width: 1200,
        height: 630,
        alt: article.title,
        type: 'image/png',
      },
    ];
    metadata.twitter.images = [ogImage];
  }

  return metadata;
}

export default function ArticlePage() {
  return <ArticlePageClient />;
}
