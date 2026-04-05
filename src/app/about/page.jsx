import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "About",
  description: "Pimlico Solutions builds XHS™ Copilot — a regulatory intelligence platform for Gambling, Payments, Crypto and AI compliance teams. Based in London, operating globally.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | XHS™ Copilot",
    description: "Pimlico Solutions builds XHS™ Copilot — regulatory intelligence for Gambling, Payments, Crypto and AI compliance teams.",
    url: "https://pimlicosolutions.com/about",
    images: ["/cta-bg.jpg"],
  },
  twitter: {
    title: "About | XHS™ Copilot",
    description: "Pimlico Solutions builds XHS™ Copilot — regulatory intelligence for Gambling, Payments, Crypto and AI compliance teams.",
    images: ["/cta-bg.jpg"],
  },
};

const PRINCIPLES = [
  {
    title: "Primary sources, verified.",
    desc: "Every regulatory change is traced back to an official source — regulator bulletin, legislative text, enforcement order. We do not paraphrase and call it news.",
  },
  {
    title: "Analysis over aggregation.",
    desc: "Regulatory feeds are a commodity. Context is not. Jurisdiction reports, Lens™ AI analysis, and expert-curated frameworks are what make the difference on a Monday morning.",
  },
  {
    title: "Built for regulated teams.",
    desc: "EU data residency, SOC 2 Type II infrastructure, row-level isolation. Your data is never used to train AI models. Security is not a checkbox — it is how the platform is built.",
  },
  {
    title: "Calm, exact, grounded.",
    desc: "We do not chase trends, write clickbait, or invent acronyms. The regulatory environment is complex enough. The tool you use to navigate it should not add to the noise.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-[55%] h-[110%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(25,50,100,0.5)_0%,rgba(15,35,75,0.25)_35%,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 py-20 sm:py-28">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-5">
            [ ABOUT PIMLICO SOLUTIONS ]
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl leading-[1.05] mb-8">
            Regulatory intelligence, built right.
          </h1>
          <div className="space-y-6 text-base sm:text-lg text-[var(--color-text-tertiary)] leading-relaxed max-w-3xl">
            <p>
              Pimlico Solutions builds XHS™ Copilot — a regulatory intelligence platform for Gambling, Payments, Crypto and AI compliance teams operating across 275+ jurisdictions.
            </p>
            <p>
              We exist because regulatory change is accelerating, and the tools compliance teams have had to work with have not kept up. Most &ldquo;regtech&rdquo; is a newsletter wrapped in a login page. That is not enough when every market you operate in has its own framework, every quarter brings new obligations, and your team is expected to stay ahead of all of it.
            </p>
            <p>
              We built XHS™ Copilot as the system we wished existed: primary-source monitoring across 12,000+ sources, expert-curated jurisdiction reports, and Lens™ AI for citation-backed analysis — tied together in one workspace your team actually uses.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ HOW WE BUILD ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-12">
            Four principles we do not break.
          </h2>
          <div className="grid gap-px sm:grid-cols-2 bg-[var(--color-border-default)]/20 rounded-xl overflow-hidden">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="bg-[var(--color-bg-base)] p-8">
                <h3 className="text-base font-medium text-[var(--color-text-primary)] mb-2">
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

      {/* Company */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ COMPANY ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-8">
            The details.
          </h2>
          <dl className="grid gap-x-12 gap-y-6 sm:grid-cols-2 text-sm">
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
              <dd className="text-[var(--color-text-secondary)]">XHS™ Copilot</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Coverage</dt>
              <dd className="text-[var(--color-text-secondary)]">275+ jurisdictions, 12,000+ sources</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Data residency</dt>
              <dd className="text-[var(--color-text-secondary)]">UK and EU</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-1">Contact</dt>
              <dd>
                <Link href="/contact" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  Talk to us &rarr;
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl">
            See it in your jurisdictions.
          </h2>
          <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            14-day trial. Full access. No credit card.
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
