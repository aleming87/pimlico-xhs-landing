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
    };
  }

  // Use a default OG image if article image is base64 or not set
  const ogImage = article.image?.startsWith('data:') 
    ? `${baseUrl}/XHS%20Logo%20BLUE%20on%20WHITE.png`
    : article.image 
      ? `${baseUrl}${article.image}`
      : `${baseUrl}/XHS%20Logo%20BLUE%20on%20WHITE.png`;

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
