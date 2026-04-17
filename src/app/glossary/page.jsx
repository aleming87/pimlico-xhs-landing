import Link from 'next/link'
import { listGlossaryTerms } from '@/data/glossary'
import InlineCTA from '@/components/InlineCTA'

export const metadata = {
  title: 'Compliance glossary — key regulatory terms explained',
  description:
    'Plain-language definitions of KYC, AML, CDD, EDD, PEP, SAR, Travel Rule, SCA, Consumer Duty, CASP, VASP and stablecoin — the terms every compliance team needs to know.',
  alternates: { canonical: '/glossary' },
  openGraph: {
    title: 'Compliance glossary — XHS™ Copilot',
    description:
      'Plain-language definitions of the regulatory terms that matter most to gambling, payments, crypto and AI compliance teams.',
    url: 'https://pimlicosolutions.com/glossary',
    siteName: 'Pimlico Solutions',
    images: ['/og-default.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pimlicoxhs',
    title: 'Compliance glossary — XHS™ Copilot',
    description:
      'Plain-language definitions of the regulatory terms that matter most.',
    images: ['/og-default.jpg'],
  },
}

const BASE = 'https://pimlicosolutions.com'

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: `${BASE}/glossary` },
  ],
}

const VERTICAL_LABELS = {
  gambling: 'Gambling',
  payments: 'Payments',
  crypto: 'Crypto',
  ai: 'AI',
}

export default function GlossaryIndex() {
  const terms = listGlossaryTerms()

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: terms.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/glossary/${t.slug}`,
      name: t.abbr ? `${t.abbr} — ${t.term}` : t.term,
    })),
  }

  const definedTermSetSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Pimlico compliance glossary',
    description:
      'Plain-language definitions of the regulatory concepts that matter most to gambling, payments, crypto and AI compliance teams.',
    url: `${BASE}/glossary`,
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `${BASE}/glossary/${t.slug}`,
      name: t.term,
      alternateName: t.abbr || undefined,
      description: t.definition,
      url: `${BASE}/glossary/${t.slug}`,
      inDefinedTermSet: `${BASE}/glossary`,
    })),
  }

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Compliance glossary',
    description:
      'Plain-language definitions of the regulatory concepts that matter most to gambling, payments, crypto and AI compliance teams.',
    url: `${BASE}/glossary`,
    isPartOf: { '@type': 'WebSite', url: BASE, name: 'Pimlico Solutions' },
    inLanguage: 'en-GB',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: terms.length,
      itemListElement: terms.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE}/glossary/${t.slug}`,
        name: t.abbr ? `${t.abbr} — ${t.term}` : t.term,
      })),
    },
  }

  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-[55%] h-[110%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(25,50,100,0.5)_0%,rgba(15,35,75,0.25)_35%,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ GLOSSARY ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
            Compliance terms, explained.
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl">
            Plain-language definitions of the regulatory concepts that matter
            most to gambling, payments, crypto and AI compliance teams.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {terms.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/glossary/${t.slug}`}
                  className="block rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/30 p-5 transition-colors hover:border-[var(--color-text-tertiary)]/40"
                >
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">
                    {t.verticals.map((v) => VERTICAL_LABELS[v] || v).join(' · ')}
                  </p>
                  <p className="font-display text-base font-medium text-[var(--color-text-primary)] mb-1">
                    {t.abbr || t.term}
                  </p>
                  <p className="text-sm text-[var(--color-text-tertiary)] line-clamp-2">
                    {t.term}{t.abbr ? ` (${t.abbr})` : ''} — {t.definition.split('.')[0]}.
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <InlineCTA
        eyebrow="SEE IT LIVE"
        headline="Every term, tracked in context."
        subhead="14-day trial. Each concept above mapped to live regulator updates, frameworks and enforcement across your jurisdictions."
      />
    </main>
  )
}
