import Link from "next/link";

export const metadata = {
  title: "About Pimlico Solutions — Regulatory Intelligence Company",
  description: "London-based regtech company building XHS™ Copilot. AI-powered compliance workspaces covering 275+ jurisdictions across gambling, payments, crypto, and AI regulation.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Pimlico Solutions — Regulatory Intelligence Company",
    description: "London-based regtech company building XHS™ Copilot. AI-powered compliance workspaces covering 275+ jurisdictions.",
    url: "https://pimlicosolutions.com/about",
    images: ["/cta-bg.jpg"],
  },
  twitter: {
    title: "About Pimlico Solutions — Regulatory Intelligence Company",
    description: "London-based regtech company building XHS™ Copilot. AI-powered compliance workspaces covering 275+ jurisdictions.",
    images: ["/cta-bg.jpg"],
  },
};

const PRINCIPLES = [
  {
    number: "01",
    title: "Primary sources, always.",
    desc: "Every regulatory change is traced back to the official record — regulator bulletins, legislative texts, enforcement orders. No paraphrasing, no telephone game.",
  },
  {
    number: "02",
    title: "Analysis over aggregation.",
    desc: "Feeds are commoditized. Context is not. Jurisdiction reports, Lens™ AI, and expert-curated frameworks are what make the difference on a Monday morning.",
  },
  {
    number: "03",
    title: "Built for regulated teams.",
    desc: "EU data residency, SOC 2 Type II infrastructure, row-level isolation. Security is not a checkbox — it is how the platform is built from day one.",
  },
];

const STATS = [
  { value: "275+", label: "Jurisdictions" },
  { value: "12,000+", label: "Sources" },
  { value: "4", label: "Verticals" },
  { value: "Daily", label: "Change detection" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://pimlicosolutions.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "About Pimlico Solutions",
      "item": "https://pimlicosolutions.com/about"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Pimlico Solutions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pimlico Solutions is a London-based regulatory technology company that builds XHS™ Copilot — an AI-powered compliance workspace. The platform monitors regulatory changes across 275+ jurisdictions for teams in gambling, payments, crypto, and AI regulation."
      }
    },
    {
      "@type": "Question",
      "name": "What is XHS Copilot?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "XHS™ Copilot is a regulatory intelligence platform that provides real-time monitoring of regulatory developments across 275+ jurisdictions. It includes AI-generated jurisdiction reports, regulatory change alerts, collaborative workspaces, and integrations with Slack and Microsoft Teams."
      }
    },
    {
      "@type": "Question",
      "name": "What industries does Pimlico Solutions cover?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pimlico Solutions covers four regulated verticals: gambling and gaming, payments and financial services, cryptocurrency and digital assets, and artificial intelligence. Each vertical has purpose-built regulatory coverage including jurisdiction-specific frameworks and licensing requirements."
      }
    },
    {
      "@type": "Question",
      "name": "How many jurisdictions does XHS Copilot monitor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "XHS™ Copilot monitors regulatory changes across more than 275 jurisdictions worldwide, drawing from over 12,000 primary sources including regulator bulletins, legislative texts, and enforcement orders. Changes are detected and analyzed daily."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Pimlico Solutions based?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pimlico Solutions Ltd is headquartered in London, United Kingdom, with a registered office at 71-75 Shelton Street, Covent Garden, London WC2H 9JQ. The company operates globally, serving compliance teams across multiple jurisdictions."
      }
    }
  ]
};

export default function AboutPage() {
  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-[55%] h-[110%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(25,50,100,0.5)_0%,rgba(15,35,75,0.25)_35%,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 py-20 sm:py-28">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ ABOUT ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] mb-8 max-w-3xl">
            Regulation is moving faster than the tools built to track it.
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl">
            Pimlico Solutions builds XHS&trade; Copilot &mdash; the regulatory intelligence platform for Gambling, Payments, Crypto and <span className="whitespace-nowrap">AI teams</span> operating across 275+ jurisdictions.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-[var(--color-border-default)]/20 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="font-mono text-3xl sm:text-4xl font-medium tabular-nums text-[var(--color-text-primary)]">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why we exist */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ WHY WE BUILD IT ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl lg:text-4xl leading-[1.15] mb-10">
            Compliance teams deserve a system built for the scale of the work.
          </h2>
          <div className="space-y-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            <p>
              Gambling, Payments, Crypto and AI are the four sectors where regulation is expanding fastest and the consequences of getting it wrong are most severe. Teams operating across them are expected to track hundreds of jurisdictions, read thousands of sources, and translate raw regulatory change into decisions their business can act on.
            </p>
            <p>
              We built XHS&trade; Copilot because we believe that work deserves a serious tool &mdash; primary-source monitoring, expert-curated jurisdiction reports, and Lens&trade; AI that operates on your own policies and context. One workspace your team actually uses, not another tab you avoid opening.
            </p>
            <p className="text-[var(--color-text-secondary)]">
              Every regulatory change. Analyzed.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ HOW WE BUILD IT ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-12 max-w-2xl">
            Three principles we do not break.
          </h2>
          <div className="grid gap-px sm:grid-cols-3 bg-[var(--color-border-default)]/20 rounded-xl overflow-hidden">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="bg-[var(--color-bg-base)] p-8 sm:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                  {p.number}
                </p>
                <h3 className="font-display text-lg font-medium text-[var(--color-text-primary)] mb-3 leading-snug">
                  {p.title}
                </h3>
                <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company facts */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            <div className="md:col-span-1">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                [ COMPANY ]
              </p>
              <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1]">
                The details.
              </h2>
            </div>
            <dl className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 text-sm">
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Legal entity</dt>
                <dd className="text-[var(--color-text-secondary)]">Pimlico Solutions Limited</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Headquartered</dt>
                <dd className="text-[var(--color-text-secondary)]">London, United Kingdom</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Product</dt>
                <dd className="text-[var(--color-text-secondary)]">XHS&trade; Copilot</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Coverage</dt>
                <dd className="text-[var(--color-text-secondary)]">275+ jurisdictions &middot; 12,000+ sources</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Data residency</dt>
                <dd className="text-[var(--color-text-secondary)]">UK and EU regions</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Security</dt>
                <dd className="text-[var(--color-text-secondary)]">SOC 2 Type II, GDPR, AES-256</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Press &amp; partnerships</dt>
                <dd>
                  <a href="mailto:contact@pimlicosolutions.com" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                    contact@pimlicosolutions.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Sales</dt>
                <dd>
                  <Link href="/contact" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                    Talk to us &rarr;
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-[var(--color-border-default)]/20 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="/cta-bg.jpg" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-[var(--color-bg-base)]/80" />
        </div>
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
            See it in your jurisdictions.
          </h2>
          <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            14-day trial. Full access.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="https://xhsdata.ai/register" className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90">
              Start free trial
            </Link>
            <Link href="/contact" className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
              Book a demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
