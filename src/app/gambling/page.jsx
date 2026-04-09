import Link from "next/link";

export const metadata = {
  title: "Gambling Compliance",
  description: "Licensing, responsible gaming, advertising, and AML across global gambling markets. From UKGC and MGA to US state frameworks and emerging Latin American markets.",
  alternates: { canonical: "/gambling" },
  openGraph: {
    title: "Gambling Compliance | XHS™ Copilot",
    description: "Licensing, responsible gaming, advertising, and AML across global gambling markets.",
    url: "https://pimlicosolutions.com/gambling",
    images: ["/vertical-gambling-hero.jpg"],
  },
  twitter: {
    title: "Gambling Compliance | XHS™ Copilot",
    description: "Licensing, responsible gaming, advertising, and AML across global gambling markets.",
    images: ["/vertical-gambling-hero.jpg"],
  },
};

const CATEGORIES = [
  { name: "Licensing & Authorization", desc: "Application requirements, conditions, renewals, and eligibility across every monitored market." },
  { name: "Responsible Gambling", desc: "Player protection, self-exclusion, affordability checks, and safer gambling obligations." },
  { name: "AML & Financial Crime", desc: "Anti-money laundering controls, source of funds, SAR reporting, and sanctions screening." },
  { name: "Advertising & Marketing", desc: "Promotional restrictions, social media rules, affiliate frameworks, and age-gating." },
  { name: "Technical Standards", desc: "RNG certification, game fairness testing, platform security, and data protection." },
  { name: "Enforcement & Sanctions", desc: "Regulatory actions, fines, license revocations, and compliance orders in real time." },
];

const REGULATORS = [
  // Row 1 — Tier 1 established
  { jurisdiction: "United Kingdom", abbr: "UKGC", name: "UK Gambling Commission" },
  { jurisdiction: "Malta", abbr: "MGA", name: "Malta Gaming Authority" },
  { jurisdiction: "Gibraltar", abbr: "GRA", name: "Gibraltar Regulatory Authority" },
  { jurisdiction: "Isle of Man", abbr: "GSC", name: "Gambling Supervision Commission" },
  // Row 2 — European established
  { jurisdiction: "Sweden", abbr: "SGA", name: "Swedish Gambling Authority" },
  { jurisdiction: "Netherlands", abbr: "KSA", name: "Kansspelautoriteit" },
  { jurisdiction: "Denmark", abbr: "DGA", name: "Danish Gambling Authority" },
  { jurisdiction: "Germany", abbr: "GGL", name: "Gemeinsame Glücksspielbehörde der Länder" },
  // Row 3 — Niche & challenging
  { jurisdiction: "Curaçao", abbr: "GCB", name: "Curaçao Gaming Control Board" },
  { jurisdiction: "Anjouan", abbr: "AGLB", name: "Anjouan Gaming Licence Board" },
  { jurisdiction: "Philippines", abbr: "PAGCOR", name: "Philippine Amusement and Gaming Corporation" },
  { jurisdiction: "Romania", abbr: "ONJN", name: "Oficiul Național pentru Jocuri de Noroc" },
];

const FRAMEWORKS = [
  { name: "Remote Operating Licence", desc: "B2C authorisation to offer online gambling services to consumers in a regulated market." },
  { name: "B2B / Supplier Licence", desc: "Authorisation for platform providers, game studios, and software suppliers serving licensed operators." },
  { name: "Personal Management Licence", desc: "Individual licensing for directors, compliance officers, and key personnel at licensed operators." },
  { name: "Responsible Gambling Certificate", desc: "Self-exclusion scheme enrollment, affordability checks, and player protection programme compliance." },
  { name: "AML Programme Registration", desc: "Mandatory anti-money laundering controls, suspicious activity reporting, and sanctions screening." },
  { name: "Technical Compliance Certificate", desc: "RNG testing, game fairness audits, server certification, and platform security assessment." },
  { name: "Advertising Pre-clearance", desc: "Marketing material approval, affiliate programme registration, and promotional code compliance." },
  { name: "Sports Betting Permit", desc: "Specialist authorisation for fixed-odds, exchange, pool, and in-play betting operations." },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pimlicosolutions.com" },
    { "@type": "ListItem", "position": 2, "name": "Gambling", "item": "https://pimlicosolutions.com/gambling" },
  ],
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "XHS\u2122 Copilot for Gambling",
  "provider": { "@type": "Organization", "name": "Pimlico Solutions", "url": "https://pimlicosolutions.com" },
  "description": "Gambling regulatory monitoring across licensed gaming jurisdictions worldwide. Licensing, responsible gaming, advertising, and AML.",
  "areaServed": "Worldwide",
  "serviceType": "Regulatory Compliance Software",
};

export default function GamblingPage() {
  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src="/vertical-gambling-hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-base)]/60 via-[var(--color-bg-base)]/40 to-[var(--color-bg-base)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 sm:py-28">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ GAMBLING ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] max-w-3xl mb-6">
            Gambling compliance across global gaming markets.
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl mb-10">
            From the UKGC and MGA to US state-by-state frameworks and emerging Latin American markets. Licensing, responsible gaming, advertising, and AML — sourced and analyzed daily.
          </p>

          <div className="flex gap-10 sm:gap-16 mb-12">
            {[
              { value: "275+", label: "Jurisdictions" },
              { value: "12,000+", label: "Sources" },
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
              href="https://xhsdata.ai/register?vertical=gambling"
              className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              Start free trial
            </Link>
            <Link
              href="/contact?interest=demo&vertical=gambling"
              className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            >
              Talk to gaming specialist
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
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

      {/* Key Regulators */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ KEY REGULATORS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-12">
            Authorities we track.
          </h2>
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-[var(--color-border-default)]/20 rounded-xl overflow-hidden">
            {REGULATORS.map((reg) => (
              <div key={reg.abbr} className="bg-[var(--color-bg-base)] p-5 sm:p-6">
                <p className="font-mono text-lg font-medium text-[var(--color-text-primary)] mb-1">{reg.abbr}</p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-snug">{reg.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5">{reg.jurisdiction}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-6">
            Plus 50+ additional gaming authorities, state-level regulators, and tribal gaming commissions tracked daily across every licensed market.
          </p>
        </div>
      </section>

      {/* Licensing Requirements */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ LICENSING REQUIREMENTS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-12">
            Obligations we monitor.
          </h2>
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-[var(--color-border-default)]/20 rounded-xl overflow-hidden">
            {FRAMEWORKS.map((fw) => (
              <div key={fw.name} className="bg-[var(--color-bg-base)] p-5 sm:p-6">
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">{fw.name}</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">{fw.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl">
            See it in your markets.
          </h2>
          <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            14-day trial. Full access. No credit card.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://xhsdata.ai/register?vertical=gambling"
              className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              Start free trial
            </Link>
            <Link
              href="/contact?interest=demo&vertical=gambling"
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
