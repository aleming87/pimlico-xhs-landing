import '@/styles/tailwind.css'
import { Analytics } from '@vercel/analytics/react'
import WhatsAppWidget from '@/components/WhatsAppWidget'

export const metadata = {
  title: {
    template: '%s - Pimlico XHS',
    default: 'Pimlico XHS™ - AI-Powered Regulatory Compliance Workspaces',
  },
  description: 'AI-native regulatory intelligence platform for compliance teams. Monitor, analyse, and collaborate on AI and Payments regulations across 90+ jurisdictions in real-time.',
  keywords: ['regulatory compliance', 'AI compliance', 'payments regulation', 'EU AI Act', 'PSD3', 'MiCA', 'regulatory monitoring', 'compliance software', 'regulatory intelligence'],
  authors: [{ name: 'Pimlico XHS' }],
  creator: 'Pimlico XHS',
  publisher: 'Pimlico XHS',
  metadataBase: new URL('https://pimlicosolutions.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pimlico XHS™ - AI-Powered Regulatory Compliance Workspaces',
    description: 'AI-native regulatory intelligence platform for compliance teams. Monitor, analyse, and collaborate on AI and Payments regulations across 90+ jurisdictions.',
    url: 'https://pimlicosolutions.com',
    siteName: 'Pimlico XHS',
    images: [
      {
        url: '/XHS Logo BLUE on WHITE.png',
        width: 1200,
        height: 630,
        alt: 'Pimlico XHS - Regulatory AI Workspaces',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pimlico XHS™ - AI-Powered Regulatory Compliance Workspaces',
    description: 'AI-native regulatory intelligence platform for compliance teams. Monitor, analyse, and collaborate on regulations across 90+ jurisdictions.',
    images: ['/XHS Logo BLUE on WHITE.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
        />
      </head>
      <body className="text-gray-950 antialiased">
        {children}
        <WhatsAppWidget />
        <Analytics />
      </body>
    </html>
  )
}
