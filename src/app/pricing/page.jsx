"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ── Pricing model (mirrored from platform commercialPricingModel.ts) ──

const USER_BANDS = [
  { key: "1_3", min: 1, max: 3, included: 3, baseAnnual: 7950, seatMonthly: 31 },
  { key: "4_10", min: 4, max: 10, included: 10, baseAnnual: 18630, seatMonthly: 25 },
  { key: "11_25", min: 11, max: 25, included: 15, baseAnnual: 36020, seatMonthly: 22 },
  { key: "26_100", min: 26, max: 100, included: 50, baseAnnual: 62100, seatMonthly: 15 },
  { key: "101_plus", min: 101, max: 150, included: 100, baseAnnual: 105570, seatMonthly: 13 },
];

const COVERAGE = [
  { key: "global", label: "Global", weight: 1.0 },
  { key: "europe", label: "Europe", weight: 0.32 },
  { key: "americas", label: "Americas", weight: 0.30 },
  { key: "asia_pacific", label: "Asia-Pacific", weight: 0.22 },
  { key: "middle_east", label: "Middle East", weight: 0.14 },
  { key: "africa", label: "Africa", weight: 0.12 },
];

const VERTICALS = ["Gambling", "Payments & Crypto", "Artificial Intelligence"];
const ADDITIONAL_VERTICAL_WEIGHTS = [0.22, 0.15, 0.1];
const ANNUAL_DISCOUNT = 0.05;

function calculatePrice(users, verticals, regions, billing) {
  // Find user band and interpolate smoothly between bands
  let band = USER_BANDS[0];
  let baseAnnual = band.baseAnnual;

  for (let i = 0; i < USER_BANDS.length; i++) {
    const b = USER_BANDS[i];
    if (users >= b.min && (b.max === null || users <= b.max)) {
      band = b;
      // Interpolate within the band
      const range = (b.max || b.min + 50) - b.min;
      const progress = (users - b.min) / range;
      const nextBand = USER_BANDS[i + 1];
      if (nextBand) {
        baseAnnual = b.baseAnnual + (nextBand.baseAnnual - b.baseAnnual) * progress;
      } else {
        baseAnnual = b.baseAnnual;
      }
      break;
    }
  }

  // Coverage weight
  const coverageWeight = regions.includes("global")
    ? 1.0
    : Math.min(1.0, regions.reduce((sum, r) => sum + (COVERAGE.find(c => c.key === r)?.weight || 0), 0));

  // Vertical pricing (1 included, additional at declining weights)
  let verticalMultiplier = 1;
  const extraVerticals = Math.max(0, verticals.length - 1);
  for (let i = 0; i < extraVerticals; i++) {
    verticalMultiplier += ADDITIONAL_VERTICAL_WEIGHTS[i] || 0.06;
  }

  // Calculate annual price
  let annual = baseAnnual * coverageWeight * verticalMultiplier;

  // Additional seats beyond included
  const extraSeats = Math.max(0, users - band.included);
  annual += extraSeats * band.seatMonthly * 12;

  // Annual discount
  if (billing === "annual") {
    annual *= (1 - ANNUAL_DISCOUNT);
  }

  const monthly = Math.round(annual / 12);
  return { monthly, annual: Math.round(annual) };
}

// ── FAQ ──

const FAQS = [
  {
    q: "What's included in the free trial?",
    a: "Full platform access for 14 days. Up to 10 jurisdictions, all features, no credit card required.",
  },
  {
    q: "Can I change my plan later?",
    a: "Yes. You can upgrade, downgrade, or adjust your coverage at any time. Changes take effect on your next billing cycle.",
  },
  {
    q: "How does per-user pricing work?",
    a: "Each plan includes a base number of users. Additional seats are available at a per-user monthly rate that decreases as your team grows.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes. Annual billing saves 5% compared to monthly. You can switch between monthly and annual at any time.",
  },
  {
    q: "What's the difference between coverage regions?",
    a: "You can select specific regions (Europe, Americas, Asia-Pacific, Middle East, Africa) or choose global coverage. Pricing adjusts based on the breadth of your coverage.",
  },
  {
    q: "Is enterprise pricing available?",
    a: "Yes. For teams of 25+ users or organisations needing custom integrations, dedicated support, or SLAs, contact us for tailored pricing.",
  },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-border-default)]/20 py-5">
      <button onClick={() => setOpen(!open)} className="flex w-full items-start justify-between text-left">
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{q}</span>
        <svg className={`h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && <p className="mt-3 text-sm text-[var(--color-text-tertiary)] leading-relaxed">{a}</p>}
    </div>
  );
}

// ── Page ──

export default function PricingPage() {
  const [users, setUsers] = useState(3);
  const [selectedVerticals, setSelectedVerticals] = useState(["Gambling"]);
  const [selectedRegions, setSelectedRegions] = useState(["global"]);
  const [billing, setBilling] = useState("monthly");

  const toggleVertical = (v) => {
    setSelectedVerticals((prev) =>
      prev.includes(v) ? (prev.length > 1 ? prev.filter((x) => x !== v) : prev) : [...prev, v]
    );
  };

  const toggleRegion = (r) => {
    if (r === "global") {
      setSelectedRegions(["global"]);
      return;
    }
    setSelectedRegions((prev) => {
      const without = prev.filter((x) => x !== "global");
      if (without.includes(r)) {
        return without.length > 1 ? without.filter((x) => x !== r) : without;
      }
      return [...without, r];
    });
  };

  const price = useMemo(
    () => calculatePrice(users, selectedVerticals, selectedRegions, billing),
    [users, selectedVerticals, selectedRegions, billing]
  );

  const isEnterprise = users > 100;

  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      {/* Hero */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              [ PRICING ]
            </p>
            <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
              Transparent pricing. No surprises.
            </h1>
            <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed max-w-xl mx-auto">
              Configure your plan based on team size, verticals, and coverage. Start with a 14-day free trial.
            </p>
          </div>
        </div>
      </section>

      {/* Configurator */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-8 sm:gap-10">
            {/* Controls */}
            <div className="sm:col-span-3 space-y-8">
              {/* Users */}
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3 block">
                  Team size
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={150}
                    value={users}
                    onChange={(e) => setUsers(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-[var(--color-bg-elevated)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-text-primary)] [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]/40 px-4 py-2 min-w-[4rem] text-center">
                    <span className="font-mono text-lg tabular-nums text-[var(--color-text-primary)]">{users}</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  {users <= 3 ? "Professional" : users <= 10 ? "Team" : users <= 25 ? "Team" : users <= 100 ? "Enterprise" : "Enterprise (custom)"} plan
                </p>
              </div>

              {/* Verticals */}
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3 block">
                  Verticals
                </label>
                <div className="flex flex-wrap gap-2">
                  {VERTICALS.map((v) => (
                    <button
                      key={v}
                      onClick={() => toggleVertical(v)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        selectedVerticals.includes(v)
                          ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-text-primary)]/20"
                          : "text-[var(--color-text-muted)] border border-[var(--color-border-default)]/30 hover:border-[var(--color-border-subtle)] hover:text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  1 included. {selectedVerticals.length > 1 ? `+${selectedVerticals.length - 1} additional.` : "Select more to add."}
                </p>
              </div>

              {/* Coverage */}
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3 block">
                  Coverage
                </label>
                <div className="flex flex-wrap gap-2">
                  {COVERAGE.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => toggleRegion(c.key)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        selectedRegions.includes(c.key)
                          ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-text-primary)]/20"
                          : "text-[var(--color-text-muted)] border border-[var(--color-border-default)]/30 hover:border-[var(--color-border-subtle)] hover:text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Price card */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 rounded-xl border border-[var(--color-border-default)]/40 bg-[var(--color-bg-surface)]/50 p-6">
                {isEnterprise ? (
                  <>
                    <p className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2">
                      Enterprise
                    </p>
                    <p className="text-3xl font-semibold text-[var(--color-text-primary)] mb-3">
                      Custom pricing
                    </p>
                    <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed mb-6">
                      Dedicated account management, custom integrations, and SLA guarantees.
                    </p>
                    <Link
                      href="/contact"
                      className="block w-full rounded-lg bg-[var(--color-text-primary)] px-6 py-2.5 text-center text-sm font-semibold text-[var(--color-bg-base)] transition-all hover:opacity-90"
                    >
                      Contact sales
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Billing toggle — small, inside card */}
                    <div className="flex gap-1 mb-5 rounded-lg bg-[var(--color-bg-base)] p-0.5">
                      {["monthly", "annual"].map((b) => (
                        <button
                          key={b}
                          onClick={() => setBilling(b)}
                          className={`flex-1 rounded-md px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide transition-all ${
                            billing === b
                              ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]"
                              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                          }`}
                        >
                          {b === "annual" ? "Annual -5%" : "Monthly"}
                        </button>
                      ))}
                    </div>

                    {billing === "monthly" ? (
                      <>
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-3xl font-semibold tabular-nums text-[var(--color-text-primary)] font-mono">
                            £{price.monthly.toLocaleString()}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">/mo</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)] mb-5">
                          £{price.annual.toLocaleString()}/year billed monthly
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-3xl font-semibold tabular-nums text-[var(--color-text-primary)] font-mono">
                            £{price.annual.toLocaleString()}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">/year</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)] mb-5">
                          £{price.monthly.toLocaleString()}/mo equivalent (5% saved)
                        </p>
                      </>
                    )}

                    {/* Summary */}
                    <div className="divide-y divide-[var(--color-border-default)]/20 mb-5">
                      <div className="flex justify-between py-2">
                        <span className="text-xs text-[var(--color-text-tertiary)]">Users</span>
                        <span className="text-xs font-mono text-[var(--color-text-secondary)]">{users}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-xs text-[var(--color-text-tertiary)]">Verticals</span>
                        <span className="text-xs font-mono text-[var(--color-text-secondary)]">{selectedVerticals.length}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-xs text-[var(--color-text-tertiary)]">Coverage</span>
                        <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                          {selectedRegions.includes("global") ? "Global" : `${selectedRegions.length} region${selectedRegions.length !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-xs text-[var(--color-text-tertiary)]">AI credits/mo</span>
                        <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                          {users <= 3 ? "500" : users <= 10 ? "500" : users <= 25 ? "1,000" : "2,500"}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://xhsdata.ai/register?plan=${users <= 3 ? "professional" : users <= 25 ? "team" : "enterprise"}&users=${users}&verticals=${encodeURIComponent(selectedVerticals.join(","))}&coverage=${encodeURIComponent(selectedRegions.join(","))}&billing=${billing}`}
                      className="block w-full rounded-lg bg-[var(--color-text-primary)] px-6 py-2.5 text-center text-sm font-semibold text-[var(--color-bg-base)] transition-all hover:opacity-90 mb-2"
                    >
                      Start free trial
                    </a>
                    <Link
                      href="/contact"
                      className="block w-full rounded-lg border border-[var(--color-border-subtle)] px-6 py-2.5 text-center text-xs font-medium text-[var(--color-text-muted)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] mb-2"
                    >
                      Book a demo
                    </Link>
                    <Link
                      href="/contact"
                      className="block w-full text-center text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors py-1"
                    >
                      Contact sales
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ INCLUDED IN EVERY PLAN ]
          </p>
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] sm:text-3xl mb-12">
            Everything you need to stay ahead.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Real-time monitoring", desc: "12,000+ regulatory sources tracked continuously. Changes detected, classified, and delivered as they happen." },
              { title: "Jurisdiction reports", desc: "In-depth profiles for every monitored jurisdiction. Regulator directories, licensing requirements, and compliance obligations." },
              { title: "XHS\u2122 Copilot AI", desc: "500+ AI credits included. Ask any regulatory question and get source-grounded, cited answers powered by Claude, GPT, Gemini, Grok, and Perplexity." },
              { title: "Slack & Teams integration", desc: "Push regulatory updates directly into the channels where your team works. Real-time or daily digest." },
              { title: "DeepL translation", desc: "Instant translation of regulatory documents across 30+ languages. Read any regulation in your preferred language." },
              { title: "Watchlists & alerts", desc: "Custom monitoring feeds filtered by jurisdiction, topic, and regulatory stage. Email digests on your schedule." },
              { title: "Workspace tools", desc: "Projects, Lens compliance analysis, blocklist management, competitor tracking, technical standards, and team collaboration." },
              { title: "API access", desc: "Enterprise-grade APIs for integrating regulatory data directly into your existing compliance workflows and internal systems." },
              { title: "Unlimited users", desc: "No per-seat pricing on Team and Enterprise plans. Your entire compliance team gets access from day one." },
            ].map((f) => (
              <div key={f.title}>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ FAQ ]
          </p>
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] sm:text-3xl mb-10">
            Common questions
          </h2>
          <div>
            {FAQS.map((faq) => (
              <FAQ key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl">
            Start your free trial
          </h2>
          <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            14 days. Full access. No credit card required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://xhsdata.ai/register" className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-semibold text-[var(--color-bg-base)] transition-all hover:opacity-90">
              Start free trial
            </a>
            <Link href="/contact" className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-semibold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
              Book a demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
