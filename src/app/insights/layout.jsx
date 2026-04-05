export const metadata = {
  title: 'Insights',
  description: 'Regulatory briefings, sector analysis, and implementation notes from the Pimlico research team. Gambling, Payments, Crypto, and AI compliance intelligence.',
  alternates: { canonical: '/insights' },
  openGraph: {
    title: 'Insights | XHS™ Copilot',
    description: 'Regulatory briefings and sector analysis from the Pimlico research team.',
    url: 'https://pimlicosolutions.com/insights',
    images: ['/cta-bg.jpg'],
  },
  twitter: {
    title: 'Insights | XHS™ Copilot',
    description: 'Regulatory briefings and sector analysis from the Pimlico research team.',
    images: ['/cta-bg.jpg'],
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
