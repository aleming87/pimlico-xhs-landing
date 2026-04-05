"use client";

import { Reveal, StaggerGroup, StaggerItem } from "./motion";

export function TrustedBy() {
  return (
    <Reveal>
      <div className="border-t border-b border-[var(--color-border-default)]/20 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-8">
            Trusted by teams at
          </p>
          <div className="mx-auto flex items-center justify-center gap-x-6 sm:gap-x-16">
            <img src="/Microsoft_logo_(2012).svg" alt="Microsoft" className="max-h-5 sm:max-h-7 w-auto object-contain" />
            <img src="/BVNK.svg" alt="BVNK" className="max-h-4 sm:max-h-5 w-auto object-contain brightness-0 invert" />
            <img src="/Mastercard.svg" alt="Mastercard" className="max-h-7 sm:max-h-10 w-auto object-contain" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Sectors() {
  const sectors = [
    { title: "Gambling", desc: "Licensing, responsible gaming, advertising, and AML across global markets.", href: "/gambling", image: "/sector-gambling.jpg" },
    { title: "Payments & Crypto", desc: "PSD3, MiCA, PSR, cross-border licensing, and operational resilience.", href: "/payments", image: "/sector-payments.jpg" },
    { title: "Artificial Intelligence", desc: "EU AI Act, national frameworks, risk classification, and conformity assessment.", href: "/ai", image: "/sector-ai.jpg" },
  ];

  return (
    <div className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ VERTICALS ]
          </p>
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl leading-[1.1] mb-3">
            Purpose-built for dynamic sectors.
          </h2>
          <p className="text-base text-[var(--color-text-tertiary)] leading-relaxed max-w-xl mb-12">
            Dedicated regulatory coverage tailored to the compliance requirements of each industry. Structured by jurisdiction, topic, and regulatory stage.
          </p>
        </Reveal>
        <StaggerGroup className="grid gap-4 sm:grid-cols-3" stagger={0.1}>
          {sectors.map((sector) => (
            <StaggerItem key={sector.title}>
              <a href={sector.href} className="group block rounded-xl border border-[var(--color-border-default)]/30 overflow-hidden transition-all hover:border-[var(--color-border-subtle)] h-full">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={sector.image}
                    alt={sector.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)]/40 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 text-lg font-medium text-[var(--color-text-primary)]">
                    {sector.title}
                  </h3>
                </div>
                {/* Content */}
                <div className="p-5 bg-[var(--color-bg-base)]">
                  <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed mb-4">
                    {sector.desc}
                  </p>
                  <span className="text-xs font-mono text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors">
                    Explore &rarr;
                  </span>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </div>
  );
}

export function Coverage() {
  return (
    <div className="border-t border-[var(--color-border-default)]/20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <Reveal>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              [ COVERAGE ]
            </p>
            <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl leading-[1.1]">
              250+ jurisdictions.{" "}<br className="hidden sm:block" />12,000+ sources.
            </h2>
            <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed max-w-md">
              Regulatory bodies, central banks, gaming authorities, and financial supervisors monitored continuously. Including all 50 US states and Canadian provinces.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { region: "Europe", highlight: "UK, EU27, Switzerland, Norway, Channel Islands" },
                { region: "North America", highlight: "US federal, 50 states, Canada, Mexico" },
                { region: "Asia-Pacific", highlight: "Singapore, Japan, Australia, Hong Kong, South Korea" },
                { region: "Latin America", highlight: "Brazil, Mexico, Colombia, Argentina, Chile" },
                { region: "Middle East & Africa", highlight: "UAE, Saudi Arabia, South Africa, Nigeria, Kenya" },
                { region: "Supranational", highlight: "EU institutions, FATF, Basel, IOSCO, OECD" },
              ].map((item) => (
                <div key={item.region}>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.region}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{item.highlight}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export function Security() {
  return (
    <div className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ SECURITY ]
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl leading-[1.1]">
              Built for regulated teams.
            </h2>
            <div>
              <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">
                EU data residency, SAML SSO, audit logs, row-level isolation, and encryption at rest and in transit. Your data is never used to train AI models.
              </p>
              <a href="/security" className="inline-flex items-center mt-5 text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                Full security brief &rarr;
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-x-16 justify-items-center">
            {[
              { label: "SOC 2 Type II infra", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { label: "GDPR compliant", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "AES-256 at rest", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
              { label: "EU data residency", icon: "M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18m0-18a15 15 0 000 18M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((badge) => (
              <div key={badge.label} className="text-center">
                <svg className="mx-auto h-12 w-12 text-[var(--color-text-muted)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                </svg>
                <p className="mt-3 text-xs font-mono uppercase tracking-wide text-[var(--color-text-muted)]">{badge.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <div className="border-t border-[var(--color-border-default)]/20 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-10">
            [ FROM THE TEAMS WE WORK WITH ]
          </p>
          <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-[var(--color-text-primary)] leading-[1.25] text-center">
            &ldquo;We found enforcement data and court decisions our previous provider didn&rsquo;t have. Jurisdictions they didn&rsquo;t even cover. It changed the conversation internally about what we actually need from a compliance tool.&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-[var(--color-border-default)]/40" />
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Licensing &amp; Certification</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">European Betting Operator</p>
            </div>
            <div className="h-px w-10 bg-[var(--color-border-default)]/40" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export function FinalCTA() {
  return (
    <div id="contact" className="relative border-t border-[var(--color-border-default)]/20 py-28 sm:py-36 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <img src="/cta-bg.jpg" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-[var(--color-bg-base)]/80" />
      </div>
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
            See it in your jurisdictions.
          </h2>
          <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            14-day trial. Full access. No card.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://xhsdata.ai/register" className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90">
              Start free trial
            </a>
            <a href="/contact" className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
              Book a demo
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
