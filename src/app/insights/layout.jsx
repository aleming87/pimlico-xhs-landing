export const metadata = {
  title: 'Insights',
  description: 'Regulatory briefings, sector analysis and implementation notes from the Pimlico research team — gambling, payments, crypto and AI compliance intelligence.',
  alternates: { canonical: '/insights' },
  openGraph: {
    title: 'Insights — XHS™ Copilot',
    description: 'Regulatory briefings and compliance analysis covering gambling, payments, crypto and AI.',
    url: 'https://pimlicosolutions.com/insights',
    images: ['/og-default.jpg'],
  },
  twitter: {
    title: 'Insights — XHS™ Copilot',
    description: 'Regulatory briefings and compliance analysis covering gambling, payments, crypto and AI.',
    images: ['/og-default.jpg'],
  },
}

const BASE = 'https://pimlicosolutions.com'

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE },
    { "@type": "ListItem", "position": 2, "name": "Insights", "item": `${BASE}/insights` },
  ],
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "News & Insights",
  "description": "Regulatory briefings, sector analysis and implementation notes from the Pimlico research team — gambling, payments, crypto and AI compliance intelligence.",
  "url": `${BASE}/insights`,
  "isPartOf": { "@type": "WebSite", "url": BASE, "name": "Pimlico" },
  "inLanguage": "en-GB",
  "about": [
    { "@type": "Thing", "name": "AI Regulation" },
    { "@type": "Thing", "name": "Payments compliance" },
    { "@type": "Thing", "name": "Crypto regulation" },
    { "@type": "Thing", "name": "Gambling compliance" },
  ],
};

export default function InsightsLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      {children}
    </>
  )
}
