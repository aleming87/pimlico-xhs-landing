import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getGlossaryTerm, listGlossaryTerms } from '@/data/glossary'
import InlineCTA from '@/components/InlineCTA'

export const dynamic = 'force-static'

const BASE = 'https://pimlicosolutions.com'

const VERTICAL_LABELS = {
  gambling: 'Gambling',
  payments: 'Payments',
  crypto: 'Crypto',
  ai: 'AI',
}

export async function generateStaticParams() {
  return listGlossaryTerms().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const t = getGlossaryTerm(slug)
  if (!t) return { title: 'Term not found', robots: { index: false, follow: true } }

  const heading = t.abbr ? `${t.term} (${t.abbr})` : t.term
  const title = `What is ${heading}? — Compliance glossary`
  const description = `${t.definition.slice(0, 155).trim()}…`

  return {
    title,
    description,
    alternates: { canonical: `/glossary/${t.slug}` },
    openGraph: {
      title: `${heading} — Compliance glossary`,
      description,
      url: `${BASE}/glossary/${t.slug}`,
      siteName: 'Pimlico Solutions',
      type: 'article',
      images: ['/og-default.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@pimlicoxhs',
      title: `${heading} — Compliance glossary`,
      description,
      images: ['/og-default.jpg'],
    },
  }
}

function buildSchema(t) {
  const pageUrl = `${BASE}/glossary/${t.slug}`
  const heading = t.abbr ? `${t.term} (${t.abbr})` : t.term

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Glossary', item: `${BASE}/glossary` },
      { '@type': 'ListItem', position: 3, name: heading, item: pageUrl },
    ],
  }

  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${pageUrl}#term`,
    name: t.term,
    description: t.definition,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'XHS Copilot Compliance Glossary',
      url: `${BASE}/glossary`,
    },
    url: pageUrl,
  }
  if (t.abbr) definedTerm.alternateName = t.abbr

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `What is ${heading}?`,
    description: t.definition,
    url: pageUrl,
    isPartOf: { '@type': 'WebSite', url: BASE },
    about: { '@id': `${pageUrl}#term` },
    publisher: {
      '@type': 'Organization',
      name: 'Pimlico Solutions',
      url: BASE,
    },
    // Mirrors regulators/[slug]/page.jsx — flags the definition + context
    // paragraphs as Speakable so Google Assistant / Alexa flows can read
    // them aloud cleanly in a voice-search answer. The CSS selectors must
    // match the IDs on the rendered <div>s below, otherwise the schema
    // points at nothing.
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#glossary-definition', '#glossary-context'],
    },
  }

  return [breadcrumb, definedTerm, webPage]
}

export default async function GlossaryTermPage({ params }) {
  const { slug } = await params
  const t = getGlossaryTerm(slug)
  if (!t) notFound()

  const schemas = buildSchema(t)
  const heading = t.abbr ? `${t.term} (${t.abbr})` : t.term

  // Resolve related terms
  const related = (t.relatedSlugs || [])
    .map((s) => getGlossaryTerm(s))
    .filter(Boolean)

  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-[55%] h-[110%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(25,50,100,0.5)_0%,rgba(15,35,75,0.25)_35%,transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-8 py-16 sm:py-24">
          <nav className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-8 flex items-center gap-1.5">
            <Link href="/glossary" className="hover:text-[var(--color-text-primary)] transition-colors">
              Glossary
            </Link>
            <span>/</span>
            <span className="text-[var(--color-text-tertiary)]">{t.abbr || t.term}</span>
          </nav>

          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ {t.verticals.map((v) => VERTICAL_LABELS[v] || v).join(' · ')} ]
          </p>
          <h1 className="font-display text-3xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl leading-[1.1] mb-6">
            What is {heading}?
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 space-y-12">
          {/* Definition — id targeted by SpeakableSpecification in schema */}
          <div id="glossary-definition">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              Definition
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
              {t.definition}
            </p>
          </div>

          {/* Why it matters — id targeted by SpeakableSpecification in schema */}
          <div id="glossary-context">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              Why it matters
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
              {t.context}
            </p>
          </div>

          {/* Inline CTA — mid-content conversion surface */}
          <InlineCTA
            eyebrow="SEE IT LIVE"
            headline={`${t.abbr || t.term} is one of thousands of signals XHS™ Copilot tracks.`}
            subhead="14-day trial. Every regulator, framework and jurisdiction change, in one workspace."
          />

          {/* See also (external) */}
          {t.seeAlso?.length > 0 && (
            <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                Official sources
              </h2>
              <ul className="space-y-2">
                {t.seeAlso.map((ref) => (
                  <li key={ref.url}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-text-link)] hover:underline"
                    >
                      {ref.label} &rarr;
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related terms */}
          {related.length > 0 && (
            <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                Related terms
              </h2>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/glossary/${r.slug}`}
                    className="inline-flex items-center rounded-full border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/30 px-3 py-1 text-sm text-[var(--color-text-tertiary)] hover:border-[var(--color-text-tertiary)]/40 transition-colors"
                  >
                    {r.abbr || r.term}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="pt-4 border-t border-[var(--color-border-default)]/20">
            <Link
              href="/glossary"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              &larr; All glossary terms
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
