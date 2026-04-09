import Link from "next/link";

export const metadata = {
  title: "AI Compliance",
  description: "EU AI Act, national frameworks, risk classification, and conformity assessment. Regulatory monitoring for AI governance teams across 275+ jurisdictions.",
  alternates: { canonical: "/ai" },
  openGraph: {
    title: "AI Compliance | XHS™ Copilot",
    description: "EU AI Act, risk classification, and governance frameworks. AI regulation, sourced and analyzed daily.",
    url: "https://pimlicosolutions.com/ai",
    images: ["/vertical-ai-hero.jpg"],
  },
  twitter: {
    title: "AI Compliance | XHS™ Copilot",
    description: "EU AI Act, risk classification, and governance frameworks. AI regulation, sourced and analyzed daily.",
    images: ["/vertical-ai-hero.jpg"],
  },
};

const CATEGORIES = [
  { name: "AI Legislation & Governance", desc: "National and international AI laws, risk frameworks, and governance policies for development and deployment." },
  { name: "Risk Classification", desc: "High-risk system identification, prohibited practices, conformity assessment, and CE marking obligations under the EU AI Act." },
  { name: "Transparency & Accountability", desc: "Disclosure requirements, model cards, algorithmic auditing, and explainability obligations across jurisdictions." },
  { name: "Data Protection", desc: "Privacy regulations governing training data, model outputs, and personal data processing — intersection of AI and GDPR." },
  { name: "National Security & Export Controls", desc: "Restrictions on AI technology transfers, export controls, and chip regulations affecting development." },
  { name: "Sector Overlays", desc: "Financial services, healthcare, employment, and public sector AI rules — how horizontal AI law meets vertical supervision." },
];

const REGULATORS = [
  // Row 1 — Primary legislative bodies
  { jurisdiction: "European Union", abbr: "EU AI Office", name: "European AI Office" },
  { jurisdiction: "United Kingdom", abbr: "DSIT", name: "Department for Science, Innovation and Technology" },
  { jurisdiction: "United States", abbr: "NIST", name: "National Institute of Standards and Technology" },
  { jurisdiction: "Canada", abbr: "ISED", name: "Innovation, Science and Economic Development" },
  // Row 2 — Asia-Pacific & standards
  { jurisdiction: "Singapore", abbr: "IMDA", name: "Infocomm Media Development Authority" },
  { jurisdiction: "Japan", abbr: "METI", name: "Ministry of Economy, Trade and Industry" },
  { jurisdiction: "South Korea", abbr: "MSIT", name: "Ministry of Science and ICT" },
  { jurisdiction: "Australia", abbr: "DISR", name: "Department of Industry, Science and Resources" },
  // Row 3 — Enforcement & cross-cutting
  { jurisdiction: "United Kingdom", abbr: "ICO", name: "Information Commissioner's Office" },
  { jurisdiction: "United States", abbr: "FTC", name: "Federal Trade Commission" },
  { jurisdiction: "France", abbr: "CNIL", name: "Commission Nationale de l'Informatique et des Libertés" },
  { jurisdiction: "Brazil", abbr: "ANPD", name: "Autoridade Nacional de Proteção de Dados" },
];

const FRAMEWORKS = [
  { name: "High-Risk System Registration", desc: "Mandatory registration of AI systems classified as high-risk under the EU AI Act, with conformity assessment and CE marking." },
  { name: "Algorithmic Impact Assessment", desc: "Pre-deployment impact analysis required across Canada (AIDA), EU member states, and emerging US state frameworks." },
  { name: "Data Protection Impact Assessment", desc: "GDPR Article 35 DPIA obligations for AI systems processing personal data, intersecting with AI-specific rules." },
  { name: "AI Sandbox Admission", desc: "Regulatory sandbox programmes for testing AI systems under supervised conditions before full deployment." },
  { name: "Model Risk Management Filing", desc: "Documentation and governance requirements for AI model validation, monitoring, and risk management." },
  { name: "Transparency Declaration", desc: "Disclosure obligations for AI-generated content, chatbot interactions, and automated decision-making." },
  { name: "Sector-Specific Authorisation", desc: "Additional requirements when AI is deployed in financial services, healthcare, employment, or public administration." },
  { name: "Export Control Compliance", desc: "Restrictions on AI technology transfers, compute thresholds, and chip export regulations." },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pimlicosolutions.com" },
    { "@type": "ListItem", "position": 2, "name": "Artificial Intelligence", "item": "https://pimlicosolutions.com/ai" },
  ],
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "XHS\u2122 Copilot for AI",
  "provider": { "@type": "Organization", "name": "Pimlico Solutions", "url": "https://pimlicosolutions.com" },
  "description": "AI regulatory monitoring across global jurisdictions. EU AI Act, national frameworks, risk classification, conformity assessment, and governance.",
  "areaServed": "Worldwide",
  "serviceType": "Regulatory Compliance Software",
};

export default function AIPage() {
  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <section className="relative overflow-hidden">
        <img src="/vertical-ai-hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-base)]/60 via-[var(--color-bg-base)]/40 to-[var(--color-bg-base)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 sm:py-28">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ ARTIFICIAL INTELLIGENCE ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] max-w-3xl mb-6">
            AI regulation is moving fast. Stay ahead.
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl mb-10">
            EU AI Act implementation, national frameworks, and the sector overlays landing on financial services, healthcare, and employment. Classification, conformity, and governance — sourced and analyzed daily.
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
              href="https://xhsdata.ai/register?vertical=ai"
              className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              Start free trial
            </Link>
            <Link
              href="/contact?interest=demo&vertical=ai"
              className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            >
              Talk to AI governance specialist
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
            Plus national data protection authorities, sector regulators, and standards bodies across every jurisdiction with enacted or proposed AI legislation.
          </p>
        </div>
      </section>

      {/* Compliance Requirements */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ COMPLIANCE REQUIREMENTS ]
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
            See it in your frameworks.
          </h2>
          <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            14-day trial. Full access. No credit card.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://xhsdata.ai/register?vertical=ai"
              className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              Start free trial
            </Link>
            <Link
              href="/contact?interest=demo&vertical=ai"
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
