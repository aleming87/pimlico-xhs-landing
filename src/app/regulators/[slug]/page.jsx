import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRegulator, listRegulators } from '@/data/regulators'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return listRegulators().map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const r = getRegulator(slug)
  if (!r) {
    return { title: 'Regulator not found', robots: { index: false, follow: true } }
  }
  const title = `${r.abbr} compliance — ${r.name}`
  const description = `${r.summary} XHS™ Copilot tracks every change daily across licensing, AML, advertising and enforcement.`
  return {
    title,
    description,
    alternates: { canonical: `/regulators/${r.slug}` },
    openGraph: {
      title: `${r.abbr} compliance — XHS™ Copilot`,
      description,
      url: `https://pimlicosolutions.com/regulators/${r.slug}`,
      siteName: 'Pimlico Solutions',
      type: 'article',
      images: ['/og-regulators.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@pimlicoxhs',
      title: `${r.abbr} compliance — XHS™ Copilot`,
      description,
      images: ['/og-regulators.jpg'],
    },
  }
}

function buildSchema(r, baseUrl) {
  const pageUrl = `${baseUrl}/regulators/${r.slug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Regulators', item: `${baseUrl}/regulators` },
      { '@type': 'ListItem', position: 3, name: r.abbr, item: pageUrl },
    ],
  }

  const govSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    '@id': `${pageUrl}#regulator`,
    name: r.name,
    alternateName: r.abbr,
    url: r.officialUrl,
    foundingDate: String(r.established),
    areaServed: { '@type': 'Country', name: r.jurisdiction },
    description: r.summary,
  }

  // Service Pimlico provides for this specific regulator
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: `${r.abbr} regulatory monitoring`,
    serviceType: 'Regulatory Compliance Monitoring',
    description: `Continuous monitoring of ${r.name} (${r.abbr}) — licensing, AML, advertising, technical standards and enforcement.`,
    provider: { '@id': `${baseUrl}/#organization` },
    areaServed: { '@type': 'Country', name: r.jurisdiction },
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Compliance teams, legal teams, regulatory affairs professionals',
    },
    url: pageUrl,
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${r.abbr} compliance — ${r.name}`,
    description: r.summary,
    isPartOf: { '@id': `${baseUrl}/#website` },
    about: { '@id': `${pageUrl}#regulator` },
    mainEntity: { '@id': `${pageUrl}#regulator` },
    inLanguage: 'en',
    breadcrumb: { '@id': `${pageUrl}#breadcrumbs` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#regulator-summary', '#regulator-facts'],
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: r.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return [breadcrumbSchema, webPageSchema, govSchema, serviceSchema, faqSchema]
}

export default async function RegulatorPage({ params }) {
  const { slug } = await params
  const r = getRegulator(slug)
  if (!r) notFound()
  const baseUrl = 'https://pimlicosolutions.com'
  const schemas = buildSchema(r, baseUrl)
  const related = (r.relatedSlugs || [])
    .map((s) => listRegulators().find((x) => x.slug === s))
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
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ REGULATOR · {r.jurisdiction.toUpperCase()} ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
            {r.abbr} compliance, monitored daily.
          </h1>
          <p
            id="regulator-summary"
            className="text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl mb-8"
          >
            {r.summary}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact?interest=demo"
              className="rounded-lg bg-[var(--color-text-primary)] px-6 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              Book a demo
            </Link>
            <Link
              href="/contact?trial=true"
              className="rounded-lg border border-[var(--color-border-default)]/40 px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-text-tertiary)]"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Authority facts */}
      <section
        id="regulator-facts"
        className="border-y border-[var(--color-border-default)]/20 py-14 sm:py-16"
      >
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ AUTHORITY ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
            {r.name} at a glance.
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7 text-base">
            <div>
              <dt className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Full name</dt>
              <dd className="text-[var(--color-text-primary)]">{r.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Abbreviation</dt>
              <dd className="text-[var(--color-text-primary)]">{r.abbr}</dd>
            </div>
            <div>
              <dt className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Jurisdiction</dt>
              <dd className="text-[var(--color-text-primary)]">{r.jurisdiction}</dd>
            </div>
            <div>
              <dt className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Established</dt>
              <dd className="text-[var(--color-text-primary)]">{r.established}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Official website</dt>
              <dd className="text-[var(--color-text-primary)]">
                <a
                  href={r.officialUrl}
                  rel="noopener"
                  className="underline decoration-[var(--color-border-default)] underline-offset-4 hover:decoration-[var(--color-text-primary)]"
                >
                  {r.officialUrl}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* What we cover */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ WHAT XHS™ MONITORS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
            Full {r.abbr} surface area, in one workspace.
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-base text-[var(--color-text-tertiary)]">
            {r.coverageAreas.map((c) => (
              <li key={c} className="flex gap-3">
                <span className="text-[var(--color-accent-secondary)] mt-1">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Key obligations */}
      <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ KEY OBLIGATIONS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
            What {r.abbr} licensees must do.
          </h2>
          <ol className="space-y-4 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            {r.keyObligations.map((o, i) => (
              <li key={o} className="flex gap-4">
                <span className="font-mono text-xs text-[var(--color-text-muted)] tabular-nums pt-1 w-6 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{o}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Licences */}
      <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ LICENCES & PERMITS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
            {r.abbr} licence categories.
          </h2>
          <ul className="space-y-3 text-base text-[var(--color-text-tertiary)]">
            {r.licences.map((l) => (
              <li key={l} className="flex gap-3">
                <span className="text-[var(--color-accent-secondary)] mt-1">•</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent focus */}
      {r.recentFocus ? (
        <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              [ CURRENT FOCUS ]
            </p>
            <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-6">
              What {r.abbr} is emphasising right now.
            </h2>
            <p className="text-base text-[var(--color-text-tertiary)] leading-relaxed max-w-3xl">
              {r.recentFocus}
            </p>
          </div>
        </section>
      ) : null}

      {/* FAQs */}
      <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ QUESTIONS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
            {r.abbr} compliance, answered.
          </h2>
          <div className="space-y-6">
            {r.faqs.map((f) => (
              <div key={f.q} className="border-b border-[var(--color-border-default)]/20 pb-5">
                <p className="text-base font-medium text-[var(--color-text-primary)] mb-2">{f.q}</p>
                <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related regulators */}
      {related.length > 0 ? (
        <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              [ RELATED ]
            </p>
            <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
              Other authorities tracked.
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/regulators/${rel.slug}`}
                    className="block rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/30 p-5 transition-colors hover:border-[var(--color-text-tertiary)]/40"
                  >
                    <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">
                      {rel.jurisdiction}
                    </p>
                    <p className="font-display text-base font-medium text-[var(--color-text-primary)]">
                      {rel.abbr} — {rel.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl mb-6 leading-tight">
            See {r.abbr} change-detection in your workspace.
          </h2>
          <p className="text-base text-[var(--color-text-tertiary)] mb-10 max-w-xl mx-auto">
            14-day free trial. Full platform access. Cancel any time. No credit card.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact?interest=demo"
              className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              Book a demo
            </Link>
            <Link
              href="/contact?trial=true"
              className="rounded-lg border border-[var(--color-border-default)]/40 px-8 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-text-tertiary)]"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
