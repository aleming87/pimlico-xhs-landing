import Link from 'next/link'
import { listRegulators } from '@/data/regulators'

export const metadata = {
  title: 'Regulators',
  description:
    'Every regulator XHS™ Copilot tracks — UKGC, MGA, FCA, EBA, MAS, FINMA and 270+ more — with daily change detection across gambling, payments, crypto and AI compliance.',
  alternates: { canonical: '/regulators' },
  openGraph: {
    title: 'Regulators — XHS™ Copilot',
    description:
      'Every regulator XHS™ Copilot tracks across gambling, payments, crypto and AI compliance.',
    url: 'https://pimlicosolutions.com/regulators',
    images: ['/og-default.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pimlicoxhs',
    title: 'Regulators — XHS™ Copilot',
    description:
      'Every regulator XHS™ Copilot tracks across gambling, payments, crypto and AI compliance.',
    images: ['/og-default.jpg'],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pimlicosolutions.com' },
    { '@type': 'ListItem', position: 2, name: 'Regulators', item: 'https://pimlicosolutions.com/regulators' },
  ],
}

export default function RegulatorsIndex() {
  const items = listRegulators()
  // Group by vertical for scannable layout
  const byVertical = items.reduce((acc, r) => {
    ;(acc[r.vertical] ||= []).push(r)
    return acc
  }, {})

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://pimlicosolutions.com/regulators/${r.slug}`,
      name: `${r.abbr} — ${r.name}`,
    })),
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

      <section className="relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-[55%] h-[110%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(25,50,100,0.5)_0%,rgba(15,35,75,0.25)_35%,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ REGULATORS ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
            Every authority. One workspace.
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl">
            XHS™ Copilot tracks {items.length === 1 ? 'this authority' : `${items.length} authorities`} today and 275+ more across gambling, payments, crypto and AI regulation. Every page below is updated as the authority publishes.
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
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/regulators/${r.slug}`}
                      className="block rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/30 p-5 transition-colors hover:border-[var(--color-text-tertiary)]/40"
                    >
                      <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">
                        {r.jurisdiction}
                      </p>
                      <p className="font-display text-base font-medium text-[var(--color-text-primary)] mb-1">
                        {r.abbr}
                      </p>
                      <p className="text-sm text-[var(--color-text-tertiary)]">{r.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
