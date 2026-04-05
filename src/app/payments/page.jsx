import Link from "next/link";

export const metadata = {
  title: "Payments & Crypto Compliance — XHS™ Copilot",
  description: "PSD3, MiCA, PSR, and cross-border licensing. AML, operational resilience, and supervisory expectations across payments and crypto markets.",
};

const CATEGORIES = [
  { name: "Payment Services & EMI", desc: "Licensing and authorization for payment institutions and EMIs. PSD3, PSR, open banking, and US state money transmission." },
  { name: "Crypto & Digital Assets", desc: "Exchange licensing, stablecoin regulation, custody rules, and token classification. MiCA, MAS, and state-level requirements." },
  { name: "AML & Financial Crime", desc: "Travel rule, transaction monitoring, CDD, beneficial ownership, and sanctions screening across jurisdictions." },
  { name: "Operational Resilience", desc: "ICT risk management, incident reporting, business continuity, and outsourcing. DORA, FCA, and MAS frameworks." },
  { name: "Consumer Protection", desc: "Disclosure requirements, complaint handling, safeguarding obligations, and conduct of business rules." },
  { name: "Cross-Border Flows", desc: "Passporting, third-country equivalence, correspondent banking, and cross-border payment regulations." },
];

const JURISDICTIONS = [
  "EU27", "UK", "US federal", "US states", "Singapore", "Hong Kong", "Japan", "Switzerland",
  "UAE", "Bahrain", "Australia", "Canada", "Brazil", "Mexico", "India", "South Korea",
];

export default function PaymentsPage() {
  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      <section className="relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-[55%] h-[110%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(25,50,100,0.5)_0%,rgba(15,35,75,0.25)_35%,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 sm:py-28">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ PAYMENTS &amp; CRYPTO ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] max-w-3xl mb-6">
            Payments and crypto regulation. End to end.
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl mb-10">
            PSD3 and MiCA in Europe, state money transmission in the US, emerging frameworks across APAC and the Middle East. Licensing, AML, operational resilience — sourced and analyzed daily.
          </p>

          <div className="flex gap-10 sm:gap-16 mb-12">
            {[
              { value: "85+", label: "Payment jurisdictions" },
              { value: "600+", label: "Regulations tracked" },
              { value: "Daily", label: "Change detection" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-2xl font-medium tabular-nums text-[var(--color-text-primary)] sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="https://xhsdata.ai/register?vertical=payments"
              className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              Start free trial
            </Link>
            <Link
              href="/contact?interest=demo&vertical=payments"
              className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            >
              Talk to payments specialist
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ REGULATORY CATEGORIES ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-12">
            What we cover.
          </h2>
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 bg-[var(--color-border-default)]/20 rounded-xl overflow-hidden">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="bg-[var(--color-bg-base)] p-6 sm:p-8">
                <h3 className="text-base font-medium text-[var(--color-text-primary)] mb-2">{cat.name}</h3>
                <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ JURISDICTIONS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-3">
            Licensed markets, monitored daily.
          </h2>
          <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed max-w-xl mb-10">
            A selection of the payment and crypto jurisdictions actively tracked. Full coverage extends across every licensing regime and emerging framework.
          </p>
          <div className="flex flex-wrap gap-2">
            {JURISDICTIONS.map((j) => (
              <span
                key={j}
                className="rounded-lg border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/40 px-3 py-1.5 text-xs text-[var(--color-text-secondary)]"
              >
                {j}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl">
            See it in your markets.
          </h2>
          <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            14-day trial. Full access. No card.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://xhsdata.ai/register?vertical=payments"
              className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              Start free trial
            </Link>
            <Link
              href="/contact?interest=demo&vertical=payments"
              className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
