import Link from "next/link";
import Image from "next/image";

export default function ConfirmedPage() {
  return (
    <main className="min-h-screen pt-24" style={{ backgroundColor: "#020617", color: "#ffffff" }}>
      <div className="mx-auto max-w-2xl px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          {/* Confirmation icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 mb-6">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <p className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3">
            [ CONFIRMED ]
          </p>
          <h1 className="text-2xl font-medium text-white sm:text-3xl mb-3">
            Your call is booked.
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed mb-10">
            Check your email for the calendar invite and confirmation details. We look forward to speaking with you.
          </p>

          {/* What to expect */}
          <div className="rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/50 p-8 text-left mb-10">
            <p className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              [ WHAT TO EXPECT ]
            </p>
            <div className="space-y-4">
              {[
                "A 30-minute walkthrough of the XHS\u2122 Copilot platform tailored to your compliance needs.",
                "Discussion of your jurisdictions, verticals, and team requirements.",
                "Live demonstration of monitoring, research, and workspace tools.",
                "Pricing and onboarding options for your organisation.",
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="https://xhsdata.ai/register"
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-[#020617] transition-all hover:opacity-90"
            >
              Start free trial
            </a>
            <Link
              href="/"
              className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              Back to homepage
            </Link>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-[var(--color-border-default)]/20">
            <Image
              src="/dual-logo.png"
              alt="Pimlico | XHS"
              width={150}
              height={42}
              className="h-6 w-auto mx-auto opacity-60 mb-4"
            />
            <div className="flex items-center justify-center gap-4 text-xs text-[var(--color-text-muted)]">
              <a href="https://www.linkedin.com/company/wearepimlico/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <span>·</span>
              <a href="https://x.com/PimlicoXHS" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
              <span>·</span>
              <a href="mailto:contact@pimlicosolutions.com" className="hover:text-white transition-colors">contact@pimlicosolutions.com</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
