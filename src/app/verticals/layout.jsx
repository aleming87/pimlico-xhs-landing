export const metadata = {
  title: 'Gambling, Payments, Crypto & AI Compliance Coverage',
  description: 'Purpose-built regulatory intelligence for gambling, payments and crypto, and AI compliance teams. 275+ jurisdictions monitored, sourced and analyzed daily.',
  alternates: { canonical: '/verticals' },
  openGraph: {
    title: 'Gambling, Payments, Crypto & AI Compliance Coverage',
    description: 'Purpose-built regulatory intelligence for gambling, payments, crypto, and AI. 275+ jurisdictions monitored daily.',
    url: 'https://pimlicosolutions.com/verticals',
    images: ['/cta-bg.jpg'],
  },
  twitter: {
    title: 'Gambling, Payments, Crypto & AI Compliance Coverage',
    description: 'Purpose-built regulatory intelligence for gambling, payments, crypto, and AI. 275+ jurisdictions monitored daily.',
    images: ['/cta-bg.jpg'],
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pimlicosolutions.com" },
    { "@type": "ListItem", "position": 2, "name": "Verticals", "item": "https://pimlicosolutions.com/verticals" },
  ],
};

export default function VerticalsLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  )
}
