import '@/styles/tailwind.css'
import { Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { CookieConsent } from '@/components/CookieConsent'
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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
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
        <CurrencyProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CurrencyProvider>
        <CookieConsent />
      </body>
    </html>
  )
}
