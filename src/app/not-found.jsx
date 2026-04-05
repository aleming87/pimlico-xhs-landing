import Link from "next/link";

export const metadata = {
  title: "Page not found",
  description: "The page you’re looking for doesn’t exist or has moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] min-h-screen flex items-center justify-center px-6 py-24">
      <div className="relative mx-auto max-w-2xl text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(25,50,100,0.5)_0%,rgba(15,35,75,0.2)_40%,transparent_70%)]" />

        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
          [ 404 &middot; NOT FOUND ]
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--color-text-primary)] leading-[1.05] mb-6">
          This page has moved on.
        </h1>
        <p className="text-base text-[var(--color-text-tertiary)] leading-relaxed max-w-lg mx-auto mb-10">
          The regulatory landscape keeps changing, and apparently so does our site. Let&rsquo;s get you back to something useful.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="rounded-lg bg-[var(--color-text-primary)] px-6 py-2.5 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
          >
            Back to home
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-[var(--color-border-subtle)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
          >
            See pricing
          </Link>
          <Link
            href="/contact"
            className="rounded-lg px-6 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-all hover:text-[var(--color-text-primary)]"
          >
            Contact sales &rarr;
          </Link>
        </div>

        <div className="mt-16 pt-10 border-t border-[var(--color-border-default)]/20">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-4">
            [ COMMON DESTINATIONS ]
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/gambling" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
              Gambling
            </Link>
            <span className="text-[var(--color-border-default)]">&middot;</span>
            <Link href="/payments" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
              Payments &amp; Crypto
            </Link>
            <span className="text-[var(--color-border-default)]">&middot;</span>
            <Link href="/ai" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
              AI
            </Link>
            <span className="text-[var(--color-border-default)]">&middot;</span>
            <Link href="/insights" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
              Insights
            </Link>
            <span className="text-[var(--color-border-default)]">&middot;</span>
            <Link href="/security" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
