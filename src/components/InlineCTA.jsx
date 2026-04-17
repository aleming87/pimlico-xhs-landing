import Link from 'next/link'

export default function InlineCTA({
  eyebrow = 'TRY IT',
  headline,
  subhead,
  primaryHref = 'https://xhsdata.ai/register',
  primaryLabel = 'Start your trial',
  secondaryHref = '/contact',
  secondaryLabel = 'Talk to us',
}) {
  return (
    <section className="border-t border-[var(--color-border-default)]/20 py-14 sm:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/40 px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3">
            [ {eyebrow} ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl mb-3 leading-tight">
            {headline}
          </h2>
          {subhead ? (
            <p className="text-base text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl mb-7">
              {subhead}
            </p>
          ) : (
            <div className="mb-4" />
          )}
          <div className="flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="rounded-lg bg-[var(--color-text-primary)] px-6 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="rounded-lg border border-[var(--color-border-default)]/40 px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-text-tertiary)]"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
