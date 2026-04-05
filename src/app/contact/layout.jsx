export const metadata = {
  title: 'Contact',
  description: 'Talk to the XHS™ Copilot team. Book a demo, start a free trial, or get answers to pricing, procurement, and partnership questions.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | XHS™ Copilot',
    description: 'Book a demo. See the platform in your jurisdictions.',
    url: 'https://pimlicosolutions.com/contact',
    images: ['/cta-bg.jpg'],
  },
  twitter: {
    title: 'Contact | XHS™ Copilot',
    description: 'Book a demo. See the platform in your jurisdictions.',
    images: ['/cta-bg.jpg'],
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pimlicosolutions.com" },
    { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://pimlicosolutions.com/contact" },
  ],
};

export default function ContactLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  )
}
