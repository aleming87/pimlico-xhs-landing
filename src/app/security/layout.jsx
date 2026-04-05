export const metadata = {
  title: 'Security & Privacy',
  description: 'SOC 2 Type II infrastructure, EU data residency, AES-256 encryption, row-level isolation, and GDPR-compliant processing. Built for regulated teams.',
  alternates: { canonical: '/security' },
  openGraph: {
    title: 'Security & Privacy | XHS™ Copilot',
    description: 'Built for regulated teams. EU data residency, SOC 2 Type II infrastructure, GDPR compliant.',
    url: 'https://pimlicosolutions.com/security',
    images: ['/cta-bg.jpg'],
  },
  twitter: {
    title: 'Security & Privacy | XHS™ Copilot',
    description: 'Built for regulated teams. EU data residency, SOC 2 Type II infrastructure, GDPR compliant.',
    images: ['/cta-bg.jpg'],
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pimlicosolutions.com" },
    { "@type": "ListItem", "position": 2, "name": "Security & Privacy", "item": "https://pimlicosolutions.com/security" },
  ],
};

export default function SecurityLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  )
}
