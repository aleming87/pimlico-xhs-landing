// Rev 48db.49 (2026-04-22): listing was "use client" → SSR shipped only
// "Loading articles..." to Googlebot and any JS-blocked visitor. Now a
// server component fetches articles at request time and renders a fully
// populated HTML list; the client sub-component owns the filter,
// search, URL-query-seed, and GA4 trackEvent interactions. Crawlers +
// first-paint both see real titles, excerpts, categories, slugs.

import InsightsListingClient from './InsightsListingClient';

export const runtime = 'edge';
export const revalidate = 300; // 5-min ISR at the edge

export const metadata = {
  title: 'News & Insights — XHS™ Copilot',
  description: 'Regulatory briefings, sector analysis, and implementation notes from the Pimlico research team. Daily coverage of gambling, payments, crypto, and AI regulation from global authorities.',
  openGraph: {
    title: 'News & Insights — XHS™ Copilot',
    description: 'Regulatory briefings, sector analysis, and implementation notes from the Pimlico research team.',
    url: 'https://pimlicosolutions.com/insights',
    siteName: 'XHS™ Copilot',
    type: 'website',
  },
  alternates: {
    canonical: 'https://pimlicosolutions.com/insights',
  },
  robots: { index: true, follow: true },
};

async function fetchArticles() {
  try {
    const response = await fetch('https://pimlicosolutions.com/api/articles', {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    const all = data.articles || [];
    const now = new Date();
    return all
      .filter((a) => {
        if (a.status === 'draft') return false;
        if (a.status === 'scheduled' && a.scheduledAt) return new Date(a.scheduledAt) <= now;
        return true;
      })
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  } catch (err) {
    console.error('[insights/page] article fetch failed:', err);
    return [];
  }
}

export default async function InsightsPage() {
  const articles = await fetchArticles();

  // ItemList JSON-LD so the listing itself is a structured entity Google
  // understands. Each item is a direct link to the article page.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.slice(0, 30).map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://pimlicosolutions.com/insights/${a.slug}`,
      name: a.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <InsightsListingClient initialArticles={articles} />
    </>
  );
}
