import '@/styles/tailwind.css'
import { Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { LazyConsent } from '@/components/LazyConsent'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
})

const SITE_URL = 'https://pimlicosolutions.com'
const DEFAULT_TITLE = 'XHS™ Copilot — Every regulatory change. Analyzed.'
const DEFAULT_DESCRIPTION = 'Compliance workspaces for Gambling, Payments, Crypto and AI teams. 275+ jurisdictions sourced, analyzed, and delivered daily.'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | XHS™ Copilot',
    default: DEFAULT_TITLE,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: 'XHS™ Copilot',
  authors: [{ name: 'Pimlico Solutions', url: SITE_URL }],
  creator: 'Pimlico Solutions',
  publisher: 'Pimlico Solutions',
  keywords: [
    'regulatory compliance',
    'compliance software',
    'regulatory intelligence',
    'regtech',
    'gambling compliance',
    'payments compliance',
    'crypto compliance',
    'AI compliance',
    'EU AI Act',
    'MiCA',
    'PSD2',
    'DORA',
    'UKGC',
    'MGA',
    'regulatory monitoring',
    'compliance automation',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'XHS™ Copilot',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/cta-bg.jpg',
        width: 1920,
        height: 1278,
        alt: 'XHS™ Copilot — Every regulatory change. Analyzed.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pimlicoxhs',
    creator: '@pimlicoxhs',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/cta-bg.jpg'],
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
  manifest: '/site.webmanifest',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jetbrains.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
        />
      </head>
      <body className="text-[var(--color-text-dark)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Pimlico Solutions",
              "legalName": "Pimlico Solutions Ltd",
              "alternateName": ["Pimlico XHS", "XHS", "XHS Copilot"],
              "url": "https://pimlicosolutions.com",
              "logo": "https://pimlicosolutions.com/Pimlico_SI_Brandmark.png",
              "image": "https://pimlicosolutions.com/cta-bg.jpg",
              "description": "Pimlico Solutions is a regulatory technology company that builds XHS™ Copilot — an AI-powered compliance workspace for teams in gambling, payments, crypto, and AI regulation. The platform monitors 275+ jurisdictions worldwide, delivering real-time regulatory intelligence, AI-generated jurisdiction reports, and collaborative compliance tools.",
              "foundingDate": "2024",
              "foundingLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "London",
                  "addressCountry": "GB"
                }
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "71-75 Shelton Street, Covent Garden",
                "addressLocality": "London",
                "postalCode": "WC2H 9JQ",
                "addressCountry": "GB"
              },
              "areaServed": "Worldwide",
              "industry": "Regulatory Technology",
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "minValue": 2,
                "maxValue": 10
              },
              "knowsAbout": [
                "Regulatory compliance",
                "Gambling regulation",
                "Payments regulation",
                "Cryptocurrency regulation",
                "AI regulation",
                "EU AI Act",
                "MiCA",
                "PSD2",
                "DORA",
                "UKGC compliance",
                "MGA compliance",
                "Regulatory intelligence",
                "Compliance automation"
              ],
              "sameAs": [
                "https://www.linkedin.com/company/pimlicoxhs",
                "https://twitter.com/pimlicoxhs",
                "https://find-and-update.company-information.service.gov.uk/company/15725938"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "sales",
                "url": "https://pimlicosolutions.com/contact",
                "availableLanguage": "English"
              },
              "brand": {
                "@type": "Brand",
                "name": "XHS™ Copilot",
                "description": "AI-powered regulatory compliance workspace",
                "url": "https://pimlicosolutions.com"
              },
              "makesOffer": {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "SoftwareApplication",
                  "name": "XHS™ Copilot",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web"
                }
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "XHS™ Copilot",
              "alternateName": ["Pimlico XHS", "Pimlico Solutions", "XHS Copilot"],
              "url": "https://pimlicosolutions.com",
              "description": "Compliance workspaces for Gambling, Payments, Crypto and AI teams. 275+ jurisdictions sourced, analyzed, and delivered daily.",
              "publisher": {
                "@type": "Organization",
                "name": "Pimlico Solutions",
                "url": "https://pimlicosolutions.com"
              }
            }),
          }}
        />
        <CurrencyProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CurrencyProvider>
        <LazyConsent />
      </body>
    </html>
  )
}
