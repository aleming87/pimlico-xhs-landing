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
        images: [
          {
            url: `${baseUrl}/Dashboard.png`,
            width: 1200,
            height: 630,
            alt: 'Pimlico XHS™',
          },
        ],
      },
    };
  }

  // OG Image priority:
  // 1. Article-specific image in /articles/[slug].png
  // 2. Custom ogImage field on the article
  // 3. Category-specific default image
  // 4. General default (Dashboard.png)
  let ogImage = `${baseUrl}/Dashboard.png`;
  
  // Check for article-specific OG image (must be added to public/articles/)
  if (article.ogImage) {
    // Custom OG image path specified on article
    ogImage = article.ogImage.startsWith('http') 
      ? article.ogImage 
      : `${baseUrl}${article.ogImage.startsWith('/') ? '' : '/'}${article.ogImage}`;
  } else {
    // Use category-specific default
    const categoryImage = categoryImages[article.category];
    if (categoryImage) {
      ogImage = `${baseUrl}${categoryImage}`;
    }
  }

  const description = article.excerpt?.slice(0, 200) || 'Read the latest regulatory insights from Pimlico XHS™';

  return {
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
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: description,
      images: [ogImage],
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
}

export default function ArticlePage() {
  return <ArticlePageClient />;
}
