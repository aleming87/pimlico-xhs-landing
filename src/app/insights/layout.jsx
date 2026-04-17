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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pimlicosolutions.com" },
    { "@type": "ListItem", "position": 2, "name": "Insights", "item": "https://pimlicosolutions.com/insights" },
  ],
};

export default function InsightsLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  )
}
