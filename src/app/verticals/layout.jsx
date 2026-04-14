export const metadata = {
  title: 'Verticals',
  description: 'Purpose-built regulatory intelligence for gambling, payments, crypto and AI compliance teams. 275+ jurisdictions sourced and analyzed daily.',
  alternates: { canonical: '/verticals' },
  openGraph: {
    title: 'Verticals — XHS™ Copilot',
    description: 'Regulatory intelligence for gambling, payments, crypto and AI compliance teams. 275+ jurisdictions, analyzed daily.',
    url: 'https://pimlicosolutions.com/verticals',
    images: ['/cta-bg.jpg'],
  },
  twitter: {
    title: 'Verticals — XHS™ Copilot',
    description: 'Regulatory intelligence for gambling, payments, crypto and AI compliance teams. 275+ jurisdictions, analyzed daily.',
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
