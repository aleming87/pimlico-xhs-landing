export const metadata = {
  title: 'Enterprise Security — SOC 2 Type II & GDPR Compliant',
  description: 'SOC 2 Type II infrastructure, EU data residency, AES-256 encryption, row-level isolation, and GDPR-compliant processing. Built for regulated compliance teams.',
  alternates: { canonical: '/security' },
  openGraph: {
    title: 'Enterprise Security — SOC 2 Type II & GDPR Compliant',
    description: 'EU data residency, SOC 2 Type II infrastructure, AES-256 encryption, and GDPR-compliant processing for regulated teams.',
    url: 'https://pimlicosolutions.com/security',
    images: ['/cta-bg.jpg'],
  },
  twitter: {
    title: 'Enterprise Security — SOC 2 Type II & GDPR Compliant',
    description: 'EU data residency, SOC 2 Type II infrastructure, AES-256 encryption, and GDPR-compliant processing for regulated teams.',
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
