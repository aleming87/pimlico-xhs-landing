"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Pricing model (mirrored from platform commercialPricingModel.ts) ──

const USER_BANDS = [
  { key: "1_3", min: 1, max: 3, included: 3, baseAnnual: 7950, seatMonthly: 31 },
  { key: "4_10", min: 4, max: 10, included: 10, baseAnnual: 12500, seatMonthly: 22 },
  { key: "11_25", min: 11, max: 25, included: 15, baseAnnual: 24000, seatMonthly: 18 },
  { key: "26_100", min: 26, max: 100, included: 50, baseAnnual: 48000, seatMonthly: 13 },
  { key: "101_plus", min: 101, max: 150, included: 100, baseAnnual: 105570, seatMonthly: 11 },
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
const BUNDLE_DISCOUNT = 0.12; // 12% off when all 3 verticals + global

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

  // Bundle discount — 12% off when all 3 verticals + global
  const isBundle = verticals.length >= 3 && regions.includes("global");
  if (isBundle) {
    annual *= (1 - BUNDLE_DISCOUNT);
  }

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
    q: "What's in the trial?",
    a: "Full access for 14 days. Up to 10 jurisdictions, every feature, no credit card.",
  },
  {
    q: "Can I change plan later?",
    a: "Yes. Upgrade, downgrade, or adjust coverage any time. Changes apply next cycle.",
  },
  {
    q: "How does per-user pricing work?",
    a: "Each plan includes a base seat count. Extra seats scale down in price as your team grows.",
  },
  {
    q: "Annual billing?",
    a: "Yes. 5% off monthly. Switch any time.",
  },
  {
    q: "What are the coverage regions?",
    a: "Europe, Americas, Asia-Pacific, Middle East, Africa, or global. Price scales with breadth.",
  },
  {
    q: "Enterprise pricing?",
    a: "For 25+ seats or custom procurement — SLAs, data residency, integrations. Contact sales.",
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
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [selectedVerticals, setSelectedVerticals] = useState(["Gambling"]);
  const [selectedRegions, setSelectedRegions] = useState(["europe"]);
  const [billing, setBilling] = useState("monthly");
  const isBundle = selectedVerticals.length >= 3 && selectedRegions.includes("global");

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

  const isEnterprise = users > 25;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pimlicosolutions.com" },
      { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://pimlicosolutions.com/pricing" },
    ],
  };

  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              [ PRICING ]
            </p>
            <h1 className="font-display text-3xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl leading-[1.1]">
              Pricing built around your scope.
            </h1>
            <p className="mt-5 text-base text-[var(--color-text-tertiary)] leading-relaxed max-w-xl mx-auto">
              Team size, verticals, coverage. 14-day trial, no credit card.
            </p>
            <p className="mt-5 text-sm text-[var(--color-text-tertiary)]">
              Need something custom?{" "}
              <Link
                href="/contact?interest=pricing"
                className="text-[var(--color-text-primary)] underline decoration-[var(--color-border-default)] underline-offset-4 hover:decoration-[var(--color-text-primary)] transition-colors"
              >
                Contact sales
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Configurator */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Controls */}
            <div className="lg:col-span-3 space-y-8">
              {/* Users */}
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3 block">
                  Team size
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={26}
                    value={users}
                    onChange={(e) => setUsers(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-[var(--color-bg-elevated)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-text-primary)] [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]/40 px-4 py-2 min-w-[4.5rem] text-center">
                    <span className="font-mono text-lg tabular-nums text-[var(--color-text-primary)]">
                      {users > 25 ? "25+" : users}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  {users <= 3 ? "Professional" : users <= 10 ? "Team" : users <= 25 ? "Team Plus" : "Enterprise — custom"}
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
              <div className="lg:sticky lg:top-28 rounded-xl border border-[var(--color-border-default)]/40 bg-[var(--color-bg-surface)]/50 p-6 flex flex-col">
                {isEnterprise ? (
                  <>
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-3">
                      [ ENTERPRISE ]
                    </p>
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-3xl font-medium tabular-nums text-[var(--color-text-primary)] font-mono">
                        £3k&ndash;8k
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">/mo typical</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed mb-4">
                      Custom pricing for 25+ seats. Shaped to your headcount, coverage, and procurement.
                    </p>

                    <div className="mb-4 rounded-lg border border-[var(--color-border-default)]/30 bg-[var(--color-bg-base)]/40 p-4">
                      <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--color-text-muted)] mb-3">
                        What&rsquo;s included
                      </p>
                      <ul className="space-y-2 text-xs text-[var(--color-text-secondary)]">
                        {[
                          { label: "People", desc: "Unlimited users, workspaces, and team training." },
                          { label: "Product", desc: "Custom AI credits, priority support, early access." },
                          { label: "Procurement", desc: "SLA, data residency, invoicing, security review." },
                          { label: "Partnership", desc: "Dedicated account manager and onboarding." },
                        ].map((item) => (
                          <li key={item.label} className="flex gap-3">
                            <span className="text-[var(--color-text-primary)] shrink-0 w-20">{item.label}</span>
                            <span className="text-[var(--color-text-tertiary)]">{item.desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto space-y-2">
                      <Link
                        href="/contact?interest=pricing"
                        className="block w-full rounded-lg bg-[var(--color-text-primary)] px-6 py-2.5 text-center text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
                      >
                        Contact sales
                      </Link>
                      <a
                        href="https://xhsdata.ai/register?plan=enterprise"
                        className="block w-full text-center text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors py-1"
                      >
                        Start a trial first &rarr;
                      </a>
                    </div>
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
                          <span className="text-3xl font-medium tabular-nums text-[var(--color-text-primary)] font-mono">
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
                          <span className="text-3xl font-medium tabular-nums text-[var(--color-text-primary)] font-mono">
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
                        <span className="text-xs text-[var(--color-text-tertiary)]">Lens&trade; credits/mo</span>
                        <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                          {users <= 3 ? "500" : users <= 10 ? "500" : users <= 25 ? "1,000" : "2,500"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto space-y-2">
                      <a
                        href={`https://xhsdata.ai/register?plan=${users <= 3 ? "professional" : users <= 25 ? "team" : "enterprise"}&users=${users}&verticals=${encodeURIComponent(selectedVerticals.join(","))}&coverage=${encodeURIComponent(selectedRegions.join(","))}&billing=${billing}`}
                        className="block w-full rounded-lg bg-[var(--color-text-primary)] px-6 py-2.5 text-center text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
                      >
                        Start free trial
                      </a>
                      <Link
                        href="/contact?interest=pricing"
                        className="block w-full rounded-lg border border-[var(--color-border-subtle)] px-6 py-2.5 text-center text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)]/40"
                      >
                        Contact sales
                      </Link>
                      {!showQuoteForm && !quoteSent && (
                        <button
                          onClick={() => setShowQuoteForm(true)}
                          className="block w-full text-center text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors py-1"
                        >
                          Email this quote to me &rarr;
                        </button>
                      )}
                    </div>

                    {showQuoteForm && !quoteSent && (
                      <form
                        className="mt-4 space-y-2"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setQuoteSubmitting(true);
                          const fd = new FormData(e.target);
                          try {
                            await fetch("/api/quote-request", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                name: fd.get("name"),
                                email: fd.get("email"),
                                company: fd.get("company"),
                                users,
                                verticals: selectedVerticals,
                                coverage: selectedRegions,
                                billing,
                                monthlyPrice: price.monthly,
                                annualPrice: price.annual,
                                plan: users <= 3 ? "Professional" : users <= 25 ? "Team" : "Enterprise",
                              }),
                            });
                            setQuoteSent(true);
                          } catch (err) {
                            console.error(err);
                          }
                          setQuoteSubmitting(false);
                        }}
                      >
                        <input name="name" required placeholder="Your name" className="w-full rounded-md px-3 py-2 text-xs text-white placeholder:text-[var(--color-text-muted)] border border-[var(--color-border-default)]/40" style={{ backgroundColor: "#0f172a" }} />
                        <input name="email" type="email" required placeholder="Work email" className="w-full rounded-md px-3 py-2 text-xs text-white placeholder:text-[var(--color-text-muted)] border border-[var(--color-border-default)]/40" style={{ backgroundColor: "#0f172a" }} />
                        <input name="company" placeholder="Company (optional)" className="w-full rounded-md px-3 py-2 text-xs text-white placeholder:text-[var(--color-text-muted)] border border-[var(--color-border-default)]/40" style={{ backgroundColor: "#0f172a" }} />
                        <button
                          type="submit"
                          disabled={quoteSubmitting}
                          className="w-full rounded-md bg-[var(--color-text-primary)] px-3 py-2 text-xs font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90 disabled:opacity-50"
                        >
                          {quoteSubmitting ? "Sending..." : "Send me this quote"}
                        </button>
                      </form>
                    )}

                    {quoteSent && (
                      <p className="mt-3 text-xs text-center text-[var(--color-text-tertiary)]">
                        Quote sent. Check your inbox.
                      </p>
                    )}
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
            [ IN EVERY PLAN ]
          </p>
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-12">
            The full platform. No tiers on features.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Real-time monitoring", desc: "12,000+ sources tracked continuously. Changes detected and classified as they happen." },
              { title: "Jurisdiction reports", desc: "Expert-curated legal analysis, licensing frameworks, enforcement history, and regulator directories." },
              { title: "Lens\u2122 AI", desc: "500+ credits included. Citation-backed answers, gap analysis, DeepL\u2122 translation across 30+ languages." },
              { title: "Workspace tools", desc: "Projects, Blocklists\u2122, Competitors\u2122, Technical Standards\u2122, and team collaboration." },
              { title: "Integrations & alerts", desc: "Slack, Teams, email digests, watchlists, API. Delivered where your team already works." },
              { title: "Team access", desc: "Scaling seat economics across plans. Your full compliance team, day one." },
            ].map((f) => (
              <div key={f.title}>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">{f.title}</h3>
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
          <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-10">
            Questions, answered.
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
          <h2 className="font-display text-3xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-4xl leading-[1.1]">
            See it in your jurisdictions.
          </h2>
          <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            14-day trial. Full access.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href="https://xhsdata.ai/register" className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90">
              Start free trial
            </a>
            <Link href="/contact?interest=pricing" className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)]/40">
              Contact sales
            </Link>
            <Link href="/contact?interest=demo" className="rounded-lg px-6 py-3 text-sm font-medium text-[var(--color-text-muted)] transition-all hover:text-[var(--color-text-primary)]">
              Book a demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
