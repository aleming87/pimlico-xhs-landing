export const runtime = 'edge';

import ArticlePageClient from './ArticlePageClient';

// Category-specific default OG images
const categoryImages = {
  'Gambling': '/articles/og-gambling.png',
  'AI Regulation': '/articles/og-ai-regulation.png',
  'Payments': '/articles/og-payments.png',
  'Crypto': '/articles/og-crypto.png',
};

// Helper to fetch articles (migrated from Vercel Blob to API-based)
async function getArticleBySlug(slug) {
  try {
    const response = await fetch(`https://www.pimlicosolutions.com/api/articles?slug=${slug}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.article || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Generate metadata for social sharing
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

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

  let ogImage = null;

  if (article.ogImage) {
    ogImage = article.ogImage.startsWith('http')
      ? article.ogImage
      : `${baseUrl}${article.ogImage.startsWith('/') ? '' : '/'}${article.ogImage}`;
  } else if (article.image && article.image.startsWith('http')) {
    ogImage = article.image;
  } else {
    const categoryImage = categoryImages[article.category];
    if (categoryImage) {
      ogImage = `${baseUrl}${categoryImage}`;
    }
  }

  const description = article.excerpt?.slice(0, 200) || 'Read the latest regulatory insights from Pimlico XHS™';

  const metadata = {
    title: `${article.title} - Pimlico XHS™`,
    description: description,
    authors: [{ name: 'Pimlico XHS™ Team' }],
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
    alternates: {
      canonical: `${baseUrl}/insights/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };

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
