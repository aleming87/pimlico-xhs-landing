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
    const response = await fetch(`https://pimlicosolutions.com/api/articles?slug=${slug}`, {
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

  const baseUrl = 'https://pimlicosolutions.com';

  if (!article) {
    return {
      title: 'Article Not Found - XHS™ Copilot',
      description: 'The requested article could not be found.',
      openGraph: {
        title: 'Article Not Found - XHS™ Copilot',
        description: 'The requested article could not be found.',
        url: `${baseUrl}/insights/${slug}`,
        siteName: 'XHS™ Copilot',
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

  const description = article.excerpt?.slice(0, 200) || 'Read the latest regulatory insights from XHS™ Copilot';

  const metadata = {
    title: `${article.title} - XHS™ Copilot`,
    description: description,
    authors: [{ name: 'XHS™ Copilot Team' }],
    openGraph: {
      title: article.title,
      description: description,
      url: `${baseUrl}/insights/${slug}`,
      siteName: 'XHS™ Copilot',
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: ['XHS™ Copilot Team'],
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

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const baseUrl = 'https://pimlicosolutions.com';

  const articleSchema = article
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": article.title,
        "description": article.excerpt || '',
        "image": [article.ogImage || article.image || `${baseUrl}/og-default.jpg`],
        "datePublished": article.date,
        "dateModified": article.date,
        "inLanguage": "en",
        "articleSection": article.category || undefined,
        "keywords": Array.isArray(article.tags) ? article.tags.join(", ") : undefined,
        "author": {
          "@type": "Organization",
          "name": "Pimlico Solutions",
          "url": baseUrl,
        },
        "publisher": {
          "@type": "Organization",
          "name": "Pimlico Solutions",
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/Pimlico_SI_Brandmark.png`,
            "width": 249,
            "height": 187,
          },
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}/insights/${slug}`,
        },
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Insights", "item": `${baseUrl}/insights` },
      ...(article ? [{ "@type": "ListItem", "position": 3, "name": article.title, "item": `${baseUrl}/insights/${slug}` }] : []),
    ],
  };

  return (
    <>
      {articleSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ArticlePageClient />
    </>
  );
}
