export const runtime = 'edge';

import ArticlePageClient from './ArticlePageClient';
import { getArticleFaqs } from '@/data/article-faqs';

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
        siteName: 'Pimlico Solutions',
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

  // Rev 2026-04-23 — surface the real journalist persona (e.g. "Daniel
  // Yoon", "Priya Desai") in metadata + OG tags for SEO / social
  // attribution. Falls back to "Pimlico editorial desk" when the DB
  // row has no persona set or still carries the old generic author.
  const genericAuthors = ['Pimlico XHS™ Team', 'XHS™ Team', 'Pimlico XHS Team'];
  const bylineName = article.author && !genericAuthors.includes(article.author)
    ? article.author
    : 'Pimlico editorial desk';

  const metadata = {
    title: `${article.title} - XHS™ Copilot`,
    description: description,
    authors: [{ name: bylineName }],
    openGraph: {
      title: article.title,
      description: description,
      url: `${baseUrl}/insights/${slug}`,
      siteName: 'Pimlico Solutions',
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: [bylineName],
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

  // Rev 48db.49 (2026-04-22): previously articleBody was omitted from
  // this JSON-LD and the body was only rendered client-side, so Google
  // crawled a page with zero article text. Now the full Markdown body
  // is emitted via articleBody + wordCount; <NoscriptArticleBody> below
  // also renders the HTML so any non-JS client (crawler, old browser,
  // email-link fetcher) sees real regulatory prose.
  const bodyPlainText = (article?.content ?? '').replace(/[#*_`>[\]()!]/g, '').replace(/\n{2,}/g, '\n\n').trim();
  const wordCount = bodyPlainText ? bodyPlainText.split(/\s+/).filter(Boolean).length : 0;

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
        "author": (() => {
          const genericAuthors = ['Pimlico XHS™ Team', 'XHS™ Team', 'Pimlico XHS Team'];
          if (article.author && !genericAuthors.includes(article.author)) {
            return {
              "@type": "Person",
              "name": article.author,
              "affiliation": {
                "@type": "Organization",
                "name": "Pimlico Solutions",
                "url": baseUrl,
              },
            };
          }
          return {
            "@type": "Organization",
            "name": "Pimlico Solutions",
            "url": baseUrl,
          };
        })(),
        "publisher": {
          "@type": "Organization",
          "name": "Pimlico Solutions",
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/pimlico-logo-square.png`,
            "width": 1200,
            "height": 1200,
          },
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}/insights/${slug}`,
        },
        // Rev 48db.49 (2026-04-22): articleBody + wordCount so Google
        // Search can actually index the regulatory prose instead of
        // reading just the headline + metadata.
        "articleBody": bodyPlainText,
        "wordCount": wordCount,
        "isAccessibleForFree": !article.isPremium,
        ...(article.isPremium ? {
          "hasPart": {
            "@type": "WebPageElement",
            "isAccessibleForFree": false,
            "cssSelector": ".paywalled-content",
          },
        } : {}),
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

  // FAQPage schema — emit only when an authored FAQ block exists for this slug
  // AND the visible <FaqSection /> in ArticlePageClient.jsx will render the
  // same questions. Mismatched FAQ schema (in JSON-LD but not on the page) is
  // a Google manual-action trigger; keep these two in lockstep.
  const faqs = getArticleFaqs(slug);
  const faqSchema = faqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(({ question, answer }) => ({
          "@type": "Question",
          "name": question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": answer,
          },
        })),
      }
    : null;

  return (
    <>
      {articleSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      {/* Rev 48db.49: <noscript> body so crawlers + any JS-blocked
          reader get a text version of the article. Visible only when
          JavaScript is disabled; JS clients render the full interactive
          article via ArticlePageClient below (hydration takes over). */}
      {article && (
        <noscript>
          <main style={{ maxWidth: '720px', margin: '120px auto 80px', padding: '0 24px', color: '#111', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666' }}>{article.category}</p>
            <h1 style={{ fontSize: '28px', fontWeight: 500, marginTop: '8px' }}>{article.title}</h1>
            {article.excerpt && <p style={{ fontSize: '18px', color: '#444', marginTop: '16px' }}>{article.excerpt}</p>}
            <p style={{ fontSize: '13px', color: '#777', marginTop: '12px' }}>{article.date} · {article.readTime}</p>
            <hr style={{ margin: '24px 0', border: 0, borderTop: '1px solid #ddd' }} />
            <div style={{ fontSize: '16px', whiteSpace: 'pre-wrap' }}>
              {article.isPremium
                ? `${(article.excerpt || '').slice(0, 500)}\n\n---\n\nThis is a premium article. Subscribe to XHS™ Copilot at xhsdata.ai for full access.`
                : bodyPlainText}
            </div>
          </main>
        </noscript>
      )}
      <ArticlePageClient />
    </>
  );
}
