import { sampleArticles } from '@/data/sample-articles';
import ArticlePageClient from './ArticlePageClient';

// Generate metadata for social sharing
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = sampleArticles.find(a => a.slug === slug);
  
  const baseUrl = 'https://pimlicosolutions.com';
  
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
            url: `${baseUrl}/XHS%20Logo%20BLUE%20on%20WHITE.png`,
            width: 1200,
            height: 630,
            alt: 'Pimlico XHS™',
          },
        ],
      },
    };
  }

  // Use Dashboard.png as a more relevant article image, or the article's own image if it's a valid path
  let ogImage = `${baseUrl}/Dashboard.png`;
  
  if (article.image) {
    if (article.image.startsWith('data:')) {
      // Base64 images can't be used for OG - use default
      ogImage = `${baseUrl}/Dashboard.png`;
    } else if (article.image.startsWith('http')) {
      // External URL - use as is
      ogImage = article.image;
    } else {
      // Relative path - make absolute
      ogImage = `${baseUrl}${article.image.startsWith('/') ? '' : '/'}${article.image}`;
    }
  }

  return {
    title: `${article.title} - Pimlico XHS™`,
    description: article.excerpt,
    authors: [{ name: 'Pimlico XHS™ Team' }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${baseUrl}/insights/${slug}`,
      siteName: 'Pimlico XHS™',
      type: 'article',
      publishedTime: article.date,
      authors: ['Pimlico XHS™ Team'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
      creator: '@pimlicoxhs',
    },
  };
}

export default function ArticlePage() {
  return <ArticlePageClient />;
}
