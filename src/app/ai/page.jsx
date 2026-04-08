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

const JURISDICTIONS = [
  "European Union", "United Kingdom", "United States", "Canada", "Singapore", "Japan",
  "South Korea", "Australia", "Brazil",
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
        <div className="absolute top-[-20%] right-[-5%] w-[55%] h-[110%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(25,50,100,0.5)_0%,rgba(15,35,75,0.25)_35%,transparent_70%)]" />
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

      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ JURISDICTIONS ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-3">
            Frameworks tracked, daily.
          </h2>
          <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed max-w-xl mb-10">
            A selection of the jurisdictions actively tracked for AI legislation and governance. Coverage extends across every enacted, proposed, and consultative framework.
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
