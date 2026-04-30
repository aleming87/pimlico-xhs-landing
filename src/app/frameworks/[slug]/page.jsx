import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getFramework, listFrameworks } from '@/data/frameworks'
import { listRegulators } from '@/data/regulators'
import InlineCTA from '@/components/InlineCTA'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return listFrameworks().map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const f = getFramework(slug)
  if (!f) return { title: 'Framework not found', robots: { index: false, follow: true } }
  const title = `${f.abbr} — ${f.name}`
  const description = `${f.summary} XHS™ Copilot tracks every change, guidance note and NCA decision.`
  return {
    title,
    description,
    alternates: { canonical: `/frameworks/${f.slug}` },
    openGraph: {
      title: `${f.abbr} — XHS™ Copilot`,
      description,
      url: `https://pimlicosolutions.com/frameworks/${f.slug}`,
      siteName: 'Pimlico',
      type: 'article',
      images: ['/og-frameworks.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@pimlicoxhs',
      title: `${f.abbr} — XHS™ Copilot`,
      description,
      images: ['/og-frameworks.jpg'],
    },
  }
}

function buildSchema(f, baseUrl) {
  const pageUrl = `${baseUrl}/frameworks/${f.slug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Frameworks', item: `${baseUrl}/frameworks` },
      { '@type': 'ListItem', position: 3, name: f.abbr, item: pageUrl },
    ],
  }

  // Legislation is the exact Schema.org type for a regulation/directive
  const legislationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Legislation',
    '@id': `${pageUrl}#legislation`,
    name: f.name,
    alternateName: f.abbr,
    legislationIdentifier: f.legalBasis,
    legislationJurisdiction: f.jurisdiction,
    url: f.officialUrl,
    description: f.summary,
    inLanguage: 'en',
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: `${f.abbr} compliance monitoring`,
    serviceType: 'Regulatory Compliance Monitoring',
    description: `Continuous monitoring of ${f.name} (${f.abbr}) — Level 2 standards, NCA guidance and enforcement.`,
    provider: { '@id': `${baseUrl}/#organization` },
    areaServed: f.jurisdiction,
    url: pageUrl,
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${f.abbr} — ${f.name}`,
    description: f.summary,
    isPartOf: { '@id': `${baseUrl}/#website` },
    about: { '@id': `${pageUrl}#legislation` },
    mainEntity: { '@id': `${pageUrl}#legislation` },
    inLanguage: 'en',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#framework-summary', '#framework-facts'],
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: f.faqs.map((q) => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a },
    })),
  }

  return [breadcrumbSchema, webPageSchema, legislationSchema, serviceSchema, faqSchema]
}

export default async function FrameworkPage({ params }) {
  const { slug } = await params
  const f = getFramework(slug)
  if (!f) notFound()
  const baseUrl = 'https://pimlicosolutions.com'
  const schemas = buildSchema(f, baseUrl)
  const relatedFrameworks = (f.relatedSlugs || [])
    .map((s) => listFrameworks().find((x) => x.slug === s))
    .filter(Boolean)
  const relatedRegulators = (f.relatedRegulators || [])
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
            [ FRAMEWORK · {f.jurisdiction.toUpperCase()} ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
            {f.abbr}, tracked end to end.
          </h1>
          <p
            id="framework-summary"
            className="text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl mb-8"
          >
            {f.summary}
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
              Start your trial
            </Link>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section
        id="framework-facts"
        className="border-y border-[var(--color-border-default)]/20 py-14 sm:py-16"
      >
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ LEGISLATION ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
            {f.abbr} at a glance.
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7 text-base">
            <div>
              <dt className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Full name</dt>
              <dd className="text-[var(--color-text-primary)]">{f.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Jurisdiction</dt>
              <dd className="text-[var(--color-text-primary)]">{f.jurisdiction}</dd>
            </div>
            <div>
              <dt className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Legal basis</dt>
              <dd className="text-[var(--color-text-primary)]">{f.legalBasis}</dd>
            </div>
            <div>
              <dt className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">In force</dt>
              <dd className="text-[var(--color-text-primary)]">{f.inForce}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">Official text</dt>
              <dd className="text-[var(--color-text-primary)]">
                <a
                  href={f.officialUrl}
                  rel="noopener"
                  className="underline decoration-[var(--color-border-default)] underline-offset-4 hover:decoration-[var(--color-text-primary)]"
                >
                  {f.officialUrl}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Applies to */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ WHO IT COVERS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
            Who has to comply with {f.abbr}.
          </h2>
          <ul className="space-y-3 text-base text-[var(--color-text-tertiary)]">
            {f.appliesTo.map((x) => (
              <li key={x} className="flex gap-3">
                <span className="text-[var(--color-accent-secondary)] mt-1">•</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Requirements */}
      <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ KEY REQUIREMENTS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
            What {f.abbr} requires.
          </h2>
          <ol className="space-y-4 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            {f.keyRequirements.map((x, i) => (
              <li key={x} className="flex gap-4">
                <span className="font-mono text-xs text-[var(--color-text-muted)] tabular-nums pt-1 w-6 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{x}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Inline CTA — mid-content conversion surface */}
      <InlineCTA
        eyebrow="TRY IT"
        headline={`See every ${f.abbr} obligation in your workspace.`}
        subhead={`14-day trial across up to 8 jurisdictions. ${f.abbr} Level 2 standards, guidance, and enforcement — all tracked.`}
      />

      {/* What XHS tracks */}
      <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ WHAT XHS™ MONITORS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
            {f.abbr} surface area, in one workspace.
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-base text-[var(--color-text-tertiary)]">
            {f.coverageAreas.map((c) => (
              <li key={c} className="flex gap-3">
                <span className="text-[var(--color-accent-secondary)] mt-1">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Milestones */}
      {f.milestones?.length ? (
        <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              [ TIMELINE ]
            </p>
            <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-8">
              {f.abbr} milestones.
            </h2>
            <ul className="space-y-3 text-base text-[var(--color-text-tertiary)]">
              {f.milestones.map((m) => (
                <li key={m} className="flex gap-3">
                  <span className="text-[var(--color-accent-secondary)] mt-1">›</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
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
            {f.abbr}, answered.
          </h2>
          <div className="space-y-6">
            {f.faqs.map((q) => (
              <div key={q.q} className="border-b border-[var(--color-border-default)]/20 pb-5">
                <p className="text-base font-medium text-[var(--color-text-primary)] mb-2">{q.q}</p>
                <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">{q.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {(relatedFrameworks.length > 0 || relatedRegulators.length > 0) && (
        <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-10">
            {relatedFrameworks.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                  [ RELATED FRAMEWORKS ]
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedFrameworks.map((rel) => (
                    <li key={rel.slug}>
                      <Link
                        href={`/frameworks/${rel.slug}`}
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
            )}
            {relatedRegulators.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                  [ SUPERVISED BY ]
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedRegulators.map((rel) => (
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
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl mb-6 leading-tight">
            See every {f.abbr} change in your workspace.
          </h2>
          <p className="text-base text-[var(--color-text-tertiary)] mb-10 max-w-xl mx-auto">
            14-day free trial. Up to 8 jurisdictions. Cancel any time. No credit card.
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
              Start your trial
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
