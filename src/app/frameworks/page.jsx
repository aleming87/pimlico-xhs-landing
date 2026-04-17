import Link from 'next/link'
import { listFrameworks } from '@/data/frameworks'
import InlineCTA from '@/components/InlineCTA'

export const metadata = {
  title: 'Frameworks',
  description:
    'MiCA, PSD2, DORA, the EU AI Act and every framework XHS™ Copilot tracks — from Level 2 technical standards to national competent authority guidance.',
  alternates: { canonical: '/frameworks' },
  openGraph: {
    title: 'Frameworks — XHS™ Copilot',
    description: 'MiCA, PSD2, DORA, EU AI Act and more — tracked end-to-end by XHS™ Copilot.',
    url: 'https://pimlicosolutions.com/frameworks',
    images: ['/og-frameworks.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pimlicoxhs',
    title: 'Frameworks — XHS™ Copilot',
    description: 'MiCA, PSD2, DORA, EU AI Act and more — tracked end-to-end by XHS™ Copilot.',
    images: ['/og-frameworks.jpg'],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pimlicosolutions.com' },
    { '@type': 'ListItem', position: 2, name: 'Frameworks', item: 'https://pimlicosolutions.com/frameworks' },
  ],
}

export default function FrameworksIndex() {
  const items = listFrameworks()
  const byVertical = items.reduce((acc, f) => {
    ;(acc[f.vertical] ||= []).push(f)
    return acc
  }, {})

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://pimlicosolutions.com/frameworks/${f.slug}`,
      name: `${f.abbr} — ${f.name}`,
    })),
  }

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Frameworks tracked by XHS™ Copilot',
    description:
      'Every major regulatory framework XHS™ Copilot tracks — from Level 1 legislation through technical standards and national competent authority guidance.',
    url: 'https://pimlicosolutions.com/frameworks',
    isPartOf: { '@type': 'WebSite', url: 'https://pimlicosolutions.com', name: 'Pimlico Solutions' },
    inLanguage: 'en-GB',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://pimlicosolutions.com/frameworks/${f.slug}`,
        name: `${f.abbr} — ${f.name}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-[55%] h-[110%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(25,50,100,0.5)_0%,rgba(15,35,75,0.25)_35%,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ FRAMEWORKS ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
            Every major framework. Level 2 to enforcement.
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl">
            XHS™ Copilot tracks the full lifecycle of each framework — from Level 1 legislation through Level 2 technical standards, Level 3 guidelines and national competent authority decisions.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--color-border-default)]/20 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-16">
          {Object.entries(byVertical).map(([vertical, list]) => (
            <div key={vertical}>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-6">
                [ {vertical.toUpperCase()} ]
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {list.map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/frameworks/${f.slug}`}
                      className="block rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/30 p-5 transition-colors hover:border-[var(--color-text-tertiary)]/40"
                    >
                      <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">
                        {f.jurisdiction}
                      </p>
                      <p className="font-display text-base font-medium text-[var(--color-text-primary)] mb-1">
                        {f.abbr}
                      </p>
                      <p className="text-sm text-[var(--color-text-tertiary)]">{f.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <InlineCTA
        eyebrow="SEE IT LIVE"
        headline="Every framework, one workspace."
        subhead="14-day trial. Full access to every framework above — Level 2 through enforcement, across 275+ jurisdictions."
      />
    </main>
  )
}
