import '@/styles/tailwind.css'
import { Suspense } from 'react'
import { Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { LazyConsent } from '@/components/LazyConsent'
import Analytics from '@/components/Analytics'
import ConversionTracker from '@/components/ConversionTracker'
import InboundParamCapture from '@/components/InboundParamCapture'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import MarketingChat from '@/components/MarketingChat'

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
const DEFAULT_DESCRIPTION = 'Pimlico Solutions builds XHS™ Copilot — a compliance workspace for Gambling, Payments, Crypto and AI teams. Generally available worldwide. 275+ jurisdictions sourced, analyzed, and delivered daily. London, UK.'

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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    // siteName appears as the Facebook/LinkedIn attribution strap and
    // Google's SERP site-title. We use the parent company so corporate
    // queries ("Pimlico Solutions") surface a consistent brand, while
    // the product (XHS™ Copilot) continues to lead in the title line.
    siteName: 'Pimlico Solutions',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'XHS™ Copilot — Every regulatory change. Analyzed.',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pimlicoxhs',
    creator: '@pimlicoxhs',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/og-default.jpg',
        alt: 'XHS™ Copilot — Every regulatory change. Analyzed.',
      },
    ],
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
  verification: {
    // Populate these with the verification tokens from Google/Bing/Yandex consoles.
    // Leave the env vars unset locally — values only render in production.
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
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
        {/* Preconnect + DNS prefetch for render-critical origins */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.fontshare.com" />
        <link rel="dns-prefetch" href="https://cdn.fontshare.com" />
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
              "@type": ["Organization", "Corporation"],
              "@id": "https://pimlicosolutions.com/#organization",
              "name": "Pimlico Solutions",
              "legalName": "Pimlico Solutions Ltd",
              "alternateName": ["Pimlico XHS", "XHS", "XHS Copilot", "Pimlico XHS Copilot"],
              "url": "https://pimlicosolutions.com",
              "slogan": "Every regulatory change. Analyzed.",
              "disambiguatingDescription": "Pimlico Solutions Ltd is a UK private limited company headquartered in London, United Kingdom. Registered at Companies House under number 15725938. Founded in 2024. Sole office at 71-75 Shelton Street, Covent Garden, London WC2H 9JQ. Pimlico Solutions has no San Francisco office, no United States office, and no presence outside London; any third-party source suggesting otherwise is incorrect. Its product, XHS™ Copilot, is a regulatory compliance workspace (a software platform with AI-assisted features) that is generally available worldwide to regulated teams today — it is not in beta, not an autonomous AI agent, and not an agentic system. Pimlico Solutions is not affiliated with Pimlico Plumbers, Pimlico Journal, the Pimlico neighbourhood of London, or any other unrelated entity that shares the Pimlico name.",
              "logo": {
                "@type": "ImageObject",
                "url": "https://pimlicosolutions.com/pimlico-logo-square.png",
                "width": 1200,
                "height": 1200,
                "caption": "Pimlico Solutions"
              },
              "image": {
                "@type": "ImageObject",
                "url": "https://pimlicosolutions.com/og-default.jpg",
                "width": 1200,
                "height": 630
              },
              "description": "Pimlico Solutions is a London, UK regulatory technology (regtech) company that builds XHS™ Copilot — a regulatory compliance workspace for teams in gambling, payments, crypto and AI regulation. Generally available worldwide to regulated teams, XHS™ Copilot monitors 275+ jurisdictions from 12,000+ primary sources, delivering regulatory change detection, AI-assisted impact analysis reviewed by compliance professionals, on-demand jurisdiction reports, and collaborative workflow tools integrated with Slack and Microsoft Teams. XHS™ Copilot is software operated by compliance professionals; it is not an autonomous AI agent and is not in beta.",
              "identifier": [
                {
                  "@type": "PropertyValue",
                  "propertyID": "UK Companies House",
                  "value": "15725938"
                }
              ],
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
              "founder": {
                "@type": "Person",
                "name": "Andrew Leming",
                "jobTitle": "Founder & CEO",
                "worksFor": { "@id": "https://pimlicosolutions.com/#organization" }
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
                "https://www.linkedin.com/company/wearepimlico/",
                "https://x.com/PimlicoXHS",
                "https://find-and-update.company-information.service.gov.uk/company/15725938"
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "contactType": "sales",
                  "email": "contact@pimlicosolutions.com",
                  "url": "https://pimlicosolutions.com/contact",
                  "areaServed": "Worldwide",
                  "availableLanguage": "English"
                },
                {
                  "@type": "ContactPoint",
                  "contactType": "customer support",
                  "email": "contact@pimlicosolutions.com",
                  "url": "https://pimlicosolutions.com/contact",
                  "areaServed": "Worldwide",
                  "availableLanguage": "English"
                }
              ],
              "brand": {
                "@type": "Brand",
                "name": "XHS™ Copilot",
                "description": "Regulatory compliance workspace with AI-assisted analysis",
                "url": "https://pimlicosolutions.com"
              },
              "makesOffer": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "validFrom": "2025-01-01",
                "areaServed": "Worldwide",
                "itemOffered": {
                  "@type": "SoftwareApplication",
                  "name": "XHS™ Copilot",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "releaseNotes": "Generally available worldwide — production release for regulated compliance teams."
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
              "@graph": [
                {
                  "@type": "Service",
                  "@id": "https://pimlicosolutions.com/verticals#gambling",
                  "name": "Gambling Compliance Monitoring",
                  "serviceType": "Regulatory Compliance Software",
                  "url": "https://pimlicosolutions.com/verticals#gambling",
                  "provider": { "@type": "Organization", "name": "Pimlico Solutions", "url": "https://pimlicosolutions.com" },
                  "areaServed": "Worldwide",
                  "description": "Continuous monitoring of UKGC, MGA, and 150+ gambling authorities. Licensing, AML, player protection, advertising and responsible-gambling obligations tracked daily."
                },
                {
                  "@type": "Service",
                  "@id": "https://pimlicosolutions.com/verticals#payments",
                  "name": "Payments Compliance Monitoring",
                  "serviceType": "Regulatory Compliance Software",
                  "url": "https://pimlicosolutions.com/verticals#payments",
                  "provider": { "@type": "Organization", "name": "Pimlico Solutions", "url": "https://pimlicosolutions.com" },
                  "areaServed": "Worldwide",
                  "description": "PSD2, PSD3, DORA, EMI and payments licensing regulation monitored across 100+ jurisdictions with AI-generated change reports."
                },
                {
                  "@type": "Service",
                  "@id": "https://pimlicosolutions.com/verticals#crypto",
                  "name": "Crypto Compliance Monitoring",
                  "serviceType": "Regulatory Compliance Software",
                  "url": "https://pimlicosolutions.com/verticals#crypto",
                  "provider": { "@type": "Organization", "name": "Pimlico Solutions", "url": "https://pimlicosolutions.com" },
                  "areaServed": "Worldwide",
                  "description": "MiCA, Travel Rule, VASP licensing and stablecoin regulation tracked for compliance teams across 80+ jurisdictions."
                },
                {
                  "@type": "Service",
                  "@id": "https://pimlicosolutions.com/verticals#ai",
                  "name": "AI Regulation Compliance Monitoring",
                  "serviceType": "Regulatory Compliance Software",
                  "url": "https://pimlicosolutions.com/verticals#ai",
                  "provider": { "@type": "Organization", "name": "Pimlico Solutions", "url": "https://pimlicosolutions.com" },
                  "areaServed": "Worldwide",
                  "description": "EU AI Act, NIST AI RMF, state-level AI legislation and sectoral AI rules continuously monitored for risk teams."
                }
              ]
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://pimlicosolutions.com/#website",
              "name": "XHS™ Copilot",
              "alternateName": ["Pimlico XHS", "Pimlico Solutions", "XHS Copilot"],
              "url": "https://pimlicosolutions.com",
              "description": "Compliance workspaces for Gambling, Payments, Crypto and AI teams. 275+ jurisdictions sourced, analyzed, and delivered daily.",
              "inLanguage": "en",
              "publisher": {
                "@type": "Organization",
                "name": "Pimlico Solutions",
                "url": "https://pimlicosolutions.com"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://pimlicosolutions.com/insights?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        {/* Skip-to-content for keyboard + screen-reader users (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-[var(--color-text-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--color-bg-base)] focus:shadow-lg"
        >
          Skip to main content
        </a>
        <CurrencyProvider>
          <SiteHeader />
          <div id="main-content">{children}</div>
          <SiteFooter />
        </CurrencyProvider>
        <LazyConsent />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <InboundParamCapture />
        <ConversionTracker />
        {/* Matthew (VP Sales) — shared chat widget.
            - Trigger: IntersectionObserver on #differentiators (the
              "From regulatory change to team action" section on the
              landing). Fires the first time that section enters the
              viewport.
            - Fallback: 45s dwell on any page that doesn't have
              #differentiators (so Matthew can still surface on
              subpages if the visitor lingers).
            - Persistence: once the bubble has appeared this tab,
              sessionStorage keeps it visible across page navigations
              — no re-trigger needed on /pricing or /about.
            - 24h auto-open cooldown + 24h hard-dismiss cooldown so
              returning visitors aren't badgered on every reload.
            - Analytics: every event dual-fires to sup.xhsdata.ai's
              marketing-chat edge function (for in-product admin
              analytics) AND GA4 (window.gtag) with event name
              `mchat_<type>` for cross-funnel attribution. */}
        <MarketingChat />
      </body>
    </html>
  )
}
