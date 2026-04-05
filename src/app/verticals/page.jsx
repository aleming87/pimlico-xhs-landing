"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ease = [0.25, 0.1, 0.25, 1];

const VERTICALS = [
  {
    id: "gambling",
    label: "Gambling",
    image: "/vertical-gambling-hero.jpg",
    headline: "Gambling compliance across global gaming markets.",
    desc: "Licensing regimes, responsible gambling requirements, advertising standards, and AML controls. From the UKGC and MGA to emerging US state-by-state frameworks and Latin American markets.",
    stats: [
      { value: "275+", label: "Jurisdictions" },
      { value: "12,000+", label: "Sources" },
      { value: "Daily", label: "Updates" },
    ],
    categories: [
      { name: "Licensing & Authorisation", desc: "Application requirements, license conditions, renewal processes, and jurisdictional eligibility across all monitored markets." },
      { name: "Responsible Gambling", desc: "Player protection measures, self-exclusion schemes, affordability checks, and safer gambling obligations." },
      { name: "AML & Financial Crime", desc: "Anti-money laundering controls, source of funds requirements, suspicious activity reporting, and sanctions screening." },
      { name: "Advertising & Marketing", desc: "Promotional restrictions, social media guidelines, influencer rules, and age-gating requirements." },
      { name: "Technical Standards", desc: "RNG certification, game fairness testing, platform security, and data protection requirements." },
      { name: "Enforcement & Sanctions", desc: "Regulatory actions, fines, license revocations, and compliance orders tracked in real time." },
    ],
    jurisdictions: ["UK", "Malta", "Gibraltar", "Isle of Man", "Netherlands", "Germany", "Sweden", "Denmark", "Finland", "Spain", "Italy", "France", "Greece", "Romania", "Bulgaria", "Croatia", "US (50 states)", "Canada", "Australia", "Philippines", "Macau", "Brazil", "Colombia", "South Africa", "Nigeria", "Kenya"],
  },
  {
    id: "payments",
    label: "Payments & Crypto",
    image: "/vertical-payments-hero.jpg",
    headline: "Payments and crypto regulation. End to end.",
    desc: "From PSD3 and MiCA in Europe to state-level money transmission in the US, and emerging frameworks across APAC and the Middle East. Licensing, AML, operational resilience, and supervisory expectations.",
    stats: [
      { value: "275+", label: "Jurisdictions" },
      { value: "12,000+", label: "Sources" },
      { value: "Daily", label: "Updates" },
    ],
    categories: [
      { name: "Payment Services & EMI", desc: "Licensing and authorization for payment institutions and EMIs. PSD3, PSR, open banking, and state-level money transmission." },
      { name: "Crypto & Digital Assets", desc: "Exchange licensing, stablecoin regulation, custody rules, and token classification. MiCA, MAS frameworks, and US state requirements." },
      { name: "AML & Financial Crime", desc: "Travel rule, transaction monitoring, customer due diligence, beneficial ownership, and sanctions screening across jurisdictions." },
      { name: "Operational Resilience", desc: "ICT risk management, incident reporting, business continuity, and outsourcing requirements. DORA, FCA, and MAS frameworks." },
      { name: "Consumer Protection", desc: "Disclosure requirements, complaint handling, safeguarding obligations, and conduct of business rules." },
      { name: "Cross-Border Payments", desc: "Passporting, third-country equivalence, correspondent banking requirements, and cross-border payment flow regulations." },
    ],
    jurisdictions: ["EU", "UK", "US", "Singapore", "Hong Kong", "Japan", "Switzerland", "UAE", "Bahrain", "Australia", "Canada", "Brazil", "India", "South Korea", "Turkey", "South Africa", "Nigeria"],
  },
  {
    id: "ai",
    label: "Artificial Intelligence",
    image: "/vertical-ai-hero.jpg",
    headline: "AI regulation is moving fast. Stay ahead.",
    desc: "EU AI Act, national frameworks, and emerging governance requirements. High-risk classification, conformity assessment, transparency obligations, and algorithmic accountability.",
    stats: [
      { value: "275+", label: "Jurisdictions" },
      { value: "12,000+", label: "Sources" },
      { value: "Daily", label: "Updates" },
    ],
    categories: [
      { name: "AI Legislation & Governance", desc: "National and international AI laws, regulatory frameworks, and governance policies for AI development and deployment." },
      { name: "Technical Standards", desc: "AI safety requirements, testing protocols, transparency standards, and technical compliance specifications." },
      { name: "Data Protection", desc: "Privacy regulations governing AI training data, model outputs, and personal data processing requirements." },
      { name: "Consumer Protection & Conduct", desc: "Disclosure requirements, fairness standards, bias auditing, and conduct rules for AI-powered products." },
      { name: "National Security & Export Controls", desc: "Restrictions on AI technology transfers, export controls, and chip regulations affecting AI development." },
      { name: "Compute & Infrastructure", desc: "Requirements for AI computing resources, hardware restrictions, and data center regulations." },
    ],
    jurisdictions: ["EU", "UK", "US", "China", "Canada", "Singapore", "Japan", "South Korea", "Australia", "India", "Brazil", "Israel", "UAE", "Saudi Arabia"],
  },
];

export default function VerticalsPage() {
  const [active, setActive] = useState("gambling");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && VERTICALS.find((v) => v.id === hash)) {
      setActive(hash);
    }
  }, []);

  const vertical = VERTICALS.find((v) => v.id === active);

  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      {/* Hero with background image */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={vertical.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={vertical.image}
              alt=""
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-base)]/60 via-[var(--color-bg-base)]/80 to-[var(--color-bg-base)]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24">
          {/* Vertical tabs */}
          <div className="flex gap-2 mb-12">
            {VERTICALS.map((v) => (
              <button
                key={v.id}
                onClick={() => setActive(v.id)}
                className={`relative rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                  active === v.id
                    ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={vertical.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <h1 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl leading-[1.1] max-w-2xl mb-6">
                {vertical.headline}
              </h1>
              <p className="text-base text-[var(--color-text-tertiary)] leading-relaxed max-w-xl mb-10">
                {vertical.desc}
              </p>

              {/* Stats row */}
              <div className="flex gap-10 sm:gap-16 mb-10">
                {vertical.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-mono text-2xl font-medium tabular-nums text-[var(--color-text-primary)] sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="https://xhsdata.ai/register"
                  className="rounded-lg bg-[var(--color-text-primary)] px-6 py-2.5 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
                >
                  Start free trial
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg border border-[var(--color-border-subtle)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                >
                  Book a demo
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Categories */}
      <div className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={vertical.id + "-cats"}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease }}
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                [ REGULATORY CATEGORIES ]
              </p>
              <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-12">
                What we cover in {vertical.label}.
              </h2>
              <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 bg-[var(--color-border-default)]/20 rounded-xl overflow-hidden">
                {vertical.categories.map((cat) => (
                  <div key={cat.name} className="bg-[var(--color-bg-base)] p-6 sm:p-8">
                    <h3 className="text-base font-medium text-[var(--color-text-primary)] mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl">
            See it in your jurisdictions.
          </h2>
          <p className="mt-6 text-base text-[var(--color-text-tertiary)] leading-relaxed">
            14-day trial. Full access. No card.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://xhsdata.ai/register"
              className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              Start free trial
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
