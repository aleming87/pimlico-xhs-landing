export const metadata = {
  title: 'Security',
  description: 'SOC 2 Type II infrastructure, EU data residency, AES-256 encryption, row-level isolation and GDPR-compliant processing. Built for regulated compliance teams.',
  alternates: { canonical: '/security' },
  openGraph: {
    title: 'Security — XHS™ Copilot',
    description: 'SOC 2 Type II, EU data residency, AES-256 encryption, GDPR-compliant processing. Built for regulated teams.',
    url: 'https://pimlicosolutions.com/security',
    images: ['/cta-bg.jpg'],
  },
  twitter: {
    title: 'Security — XHS™ Copilot',
    description: 'SOC 2 Type II, EU data residency, AES-256 encryption, GDPR-compliant processing. Built for regulated teams.',
    images: ['/cta-bg.jpg'],
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pimlicosolutions.com" },
    { "@type": "ListItem", "position": 2, "name": "Security", "item": "https://pimlicosolutions.com/security" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is XHS™ Copilot SOC 2 compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. XHS™ Copilot is built on SOC 2 Type II infrastructure with annual audit attestations. Security controls cover confidentiality, integrity, and availability of customer data."
      }
    },
    {
      "@type": "Question",
      "name": "Is XHS™ Copilot GDPR compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Pimlico Solutions is the data controller, EU data residency is available, and all processing follows UK GDPR and EU GDPR requirements. Customer data is never used to train shared AI models."
      }
    },
    {
      "@type": "Question",
      "name": "Where is customer data stored?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "XHS™ Copilot offers EU data residency by default, with row-level isolation between customer tenants. Enterprise plans support UK-only or region-specific data residency on request."
      }
    },
    {
      "@type": "Question",
      "name": "How is data encrypted?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All data is encrypted at rest with AES-256 and in transit with TLS 1.3. Customer credentials and API keys are stored in hardware-backed secrets management."
      }
    },
    {
      "@type": "Question",
      "name": "Do you train AI models on customer data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Customer-uploaded documents, watchlists, and workspace content are never used to train any shared model. AI analysis runs on isolated inference endpoints with no cross-tenant data leakage."
      }
    }
  ]
};

export default function SecurityLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  )
}
