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

export default function InsightsLayout({ children }) {
  return children
}
