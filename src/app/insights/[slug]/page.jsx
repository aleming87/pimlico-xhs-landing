import { sampleArticles } from '@/data/sample-articles';
import ArticlePageClient from './ArticlePageClient';

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

  // Use Dashboard.png as the default OG image (must be absolute URL)
  let ogImage = `${baseUrl}/Dashboard.png`;
  
  // Check if article has a valid image path that exists in public folder
  if (article.image) {
    if (article.image.startsWith('data:')) {
      // Base64 images can't be used for OG - use default
      ogImage = `${baseUrl}/Dashboard.png`;
    } else if (article.image.startsWith('http')) {
      // External URL - use as is
      ogImage = article.image;
    } else {
      // For local paths, always use Dashboard.png for OG (more reliable)
      // Article images like /screenshots/dashboard.png may not exist
      ogImage = `${baseUrl}/Dashboard.png`;
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
