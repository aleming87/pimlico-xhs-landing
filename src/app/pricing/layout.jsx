export const metadata = {
  title: 'Pricing',
  description:
    'Transparent pricing for XHS™ Copilot. From £660/month for 1-3 seat teams to enterprise plans at £8,800+/month. Pick your sectors, jurisdictions and team size. 14-day free trial, no credit card.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing — XHS™ Copilot',
    description:
      'Transparent pricing from £660/month. Pick your sectors, jurisdictions and team size. 14-day free trial.',
    url: 'https://pimlicosolutions.com/pricing',
    images: ['/og-default.jpg'],
  },
  twitter: {
    title: 'Pricing — XHS™ Copilot',
    description:
      'Transparent pricing from £660/month. 14-day free trial, no credit card.',
    images: ['/og-default.jpg'],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pimlicosolutions.com' },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://pimlicosolutions.com/pricing' },
  ],
}

// Schema.org Product with AggregateOffer gives Google the canonical
// price range for XHS™ Copilot. The same numbers are used on the
// homepage SoftwareApplication schema; keep them in sync if the
// pricing model in src/app/pricing/page.jsx changes.
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://pimlicosolutions.com/pricing#product',
  name: 'XHS™ Copilot',
  description:
    'Regulatory compliance workspace for gambling, payments, crypto and AI teams.',
  brand: { '@type': 'Brand', name: 'Pimlico Solutions' },
  url: 'https://pimlicosolutions.com/pricing',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'GBP',
    lowPrice: '660',
    highPrice: '8800',
    offerCount: '5',
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2026-12-31',
    seller: { '@type': 'Organization', name: 'Pimlico Solutions' },
  },
}

// FAQ schema is a strong signal for AI Overview pricing answers
// ("how much does XHS Copilot cost", "is there a free trial", etc.).
// Kept in sync with the visible FAQs in src/app/pricing/page.jsx.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does XHS™ Copilot cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'XHS™ Copilot pricing starts at £660 per month for teams of 1-3 seats with a single vertical and region, and scales to around £8,800 per month for enterprise deployments with 101+ seats, all four sectors and global coverage. The interactive configurator at pimlicosolutions.com/pricing produces an instant quote based on your exact team size, vertical mix and jurisdictional coverage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free trial of XHS™ Copilot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. XHS™ Copilot includes a 14-day free trial with up to 8 jurisdictions of coverage, full database access, Slack/Teams alerts, and CSV/PDF exports. Projects™ and Briefings are paid-only. No credit card is required to start the trial.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is annual billing cheaper?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Paying annually saves 5% compared with monthly billing. You can switch billing cadence at any time. Enterprise contracts can access additional discounts as part of a custom procurement process.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does per-seat pricing work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each plan includes a base seat count — 3 seats on the starter plan, up to 100 on the enterprise plan. Additional seats beyond the included allocation are billed monthly at a per-seat rate that decreases as team size grows (£31/seat at 1-3 seats, down to £11/seat at 101+ seats).',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I cover multiple sectors on one plan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The first vertical is included. Each additional vertical adds to the plan price on a declining scale — typically +22% for the second, +15% for the third and +10% for the fourth. Teams that take all four sectors with global coverage qualify for a 12% bundle discount.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the coverage regions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Europe, Americas, Asia-Pacific, Middle East, Africa, or global. The price scales with the breadth of regulatory coverage you need — a single region is the cheapest option; global coverage covers every in-scope regulator across 275+ jurisdictions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer enterprise pricing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Enterprise pricing applies to teams of 25+ seats or organisations that require custom procurement terms — bespoke SLAs, specific data-residency commitments, SSO, enterprise integrations and dedicated onboarding. Contact sales at pimlicosolutions.com/contact to start a procurement conversation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I change my plan later?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can upgrade, downgrade or adjust coverage at any time. Changes apply at the next billing cycle. Enterprise contracts can be restructured at mutually agreed milestones.',
      },
    },
  ],
}

export default function PricingLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  )
}
