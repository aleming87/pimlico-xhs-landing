import Link from "next/link";

export const metadata = {
  title: "Payments & Crypto Compliance",
  description: "PSD2, MiCA, EMD2, and cross-border licensing. AML, operational resilience, and supervisory expectations across payments and crypto markets.",
  alternates: { canonical: "/payments" },
  openGraph: {
    title: "Payments & Crypto Compliance | XHS™ Copilot",
    description: "PSD2, MiCA, EMD2, and cross-border licensing. Payments and crypto regulation, end to end.",
    url: "https://pimlicosolutions.com/payments",
    images: ["/vertical-payments-hero.jpg"],
  },
  twitter: {
    title: "Payments & Crypto Compliance | XHS™ Copilot",
    description: "PSD2, MiCA, EMD2, and cross-border licensing. Payments and crypto regulation, end to end.",
    images: ["/vertical-payments-hero.jpg"],
  },
};

const CATEGORIES = [
  { name: "Payment Services & EMI", desc: "Licensing and authorisation for payment institutions and e-money issuers. PSD2, EMD2, open banking, and US state money transmission." },
  { name: "Crypto & Digital Assets", desc: "Exchange licensing, stablecoin regulation, custody rules, and token classification. MiCA, MAS, and state-level requirements." },
  { name: "AML & Financial Crime", desc: "Travel rule, transaction monitoring, CDD, beneficial ownership, and sanctions screening across jurisdictions." },
  { name: "Operational Resilience", desc: "ICT risk management, incident reporting, business continuity, and outsourcing. DORA, FCA, and MAS frameworks." },
  { name: "Consumer Protection", desc: "Disclosure requirements, complaint handling, safeguarding obligations, and conduct of business rules." },
  { name: "Cross-Border Flows", desc: "Passporting, third-country equivalence, correspondent banking, and cross-border payment regulations." },
];

const REGULATORS = [
  // Row 1 — Tier 1 established
  { jurisdiction: "European Union", abbr: "EBA", name: "European Banking Authority" },
  { jurisdiction: "United Kingdom", abbr: "FCA", name: "Financial Conduct Authority" },
  { jurisdiction: "United States", abbr: "FinCEN", name: "Financial Crimes Enforcement Network" },
  { jurisdiction: "Singapore", abbr: "MAS", name: "Monetary Authority of Singapore" },
  // Row 2 — Established global
  { jurisdiction: "Switzerland", abbr: "FINMA", name: "Swiss Financial Market Supervisory Authority" },
  { jurisdiction: "Hong Kong", abbr: "HKMA", name: "Hong Kong Monetary Authority" },
  { jurisdiction: "Japan", abbr: "JFSA", name: "Japan Financial Services Agency" },
  { jurisdiction: "Canada", abbr: "FINTRAC", name: "Financial Transactions and Reports Analysis Centre" },
  // Row 3 — Niche & emerging
  { jurisdiction: "United Arab Emirates", abbr: "VARA", name: "Virtual Assets Regulatory Authority" },
  { jurisdiction: "Germany", abbr: "BaFin", name: "Bundesanstalt für Finanzdienstleistungsaufsicht" },
  { jurisdiction: "Brazil", abbr: "BCB", name: "Banco Central do Brasil" },
  { jurisdiction: "Lithuania", abbr: "LB", name: "Bank of Lithuania" },
];

const FRAMEWORKS = [
  { name: "Payment Institution Authorisation", desc: "Licence to provide payment services, execute transactions, and manage client funds under PSD2 and national equivalents." },
  { name: "E-Money Institution Licence", desc: "Authorisation to issue electronic money, manage float, and provide redemption under EMD2 and local frameworks." },
  { name: "VASP / CASP Registration", desc: "Virtual asset and crypto-asset service provider registration under MiCA, FinCEN, and national regimes." },
  { name: "Money Transmitter Licence", desc: "US state-by-state licensing for money transmission, with individual application and bonding requirements." },
  { name: "Agent Registration", desc: "Authorisation of third-party agents acting on behalf of licensed payment institutions and EMIs." },
  { name: "Safeguarding Compliance", desc: "Client fund segregation, asset protection, and safeguarding audit requirements across jurisdictions." },
  { name: "Passporting Notification", desc: "Cross-border service notifications under PSD2 freedom-of-services and freedom-of-establishment provisions." },
  { name: "Operational Resilience Filing", desc: "ICT risk management, incident reporting, and business continuity under DORA and FCA requirements." },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pimlicosolutions.com" },
    { "@type": "ListItem", "position": 2, "name": "Payments & Crypto", "item": "https://pimlicosolutions.com/payments" },
  ],
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "XHS\u2122 Copilot for Payments & Crypto",
  "provider": { "@type": "Organization", "name": "Pimlico Solutions", "url": "https://pimlicosolutions.com" },
  "description": "Payments and crypto regulatory monitoring across licensed markets worldwide. PSD2, MiCA, EMD2, cross-border licensing, AML, and operational resilience.",
  "areaServed": "Worldwide",
  "serviceType": "Regulatory Compliance Software",
};

export default function PaymentsPage() {
  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <section className="relative overflow-hidden">
        <img src="/vertical-payments-hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-base)]/60 via-[var(--color-bg-base)]/40 to-[var(--color-bg-base)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 sm:py-28">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ PAYMENTS &amp; CRYPTO ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] max-w-3xl mb-6">
            Payments and crypto regulation. End to end.
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl mb-10">
            PSD2, MiCA, and DORA in Europe, state money transmission in the US, emerging frameworks across APAC and the Middle East. Licensing, AML, operational resilience — sourced and analysed daily.
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
            Plus 40+ additional financial regulators, central banks, and state-level licensing authorities tracked daily across every payments and crypto market.
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
