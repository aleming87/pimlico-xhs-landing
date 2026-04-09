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
    headline: "Stay compliant across global gaming markets.",
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
    regulators: [
      { jurisdiction: "United Kingdom", abbr: "UKGC", name: "UK Gambling Commission" },
      { jurisdiction: "Malta", abbr: "MGA", name: "Malta Gaming Authority" },
      { jurisdiction: "Gibraltar", abbr: "GRA", name: "Gibraltar Regulatory Authority" },
      { jurisdiction: "Isle of Man", abbr: "GSC", name: "Gambling Supervision Commission" },
      { jurisdiction: "Sweden", abbr: "SGA", name: "Swedish Gambling Authority" },
      { jurisdiction: "Netherlands", abbr: "KSA", name: "Kansspelautoriteit" },
      { jurisdiction: "Denmark", abbr: "DGA", name: "Danish Gambling Authority" },
      { jurisdiction: "Germany", abbr: "GGL", name: "Gemeinsame Glücksspielbehörde der Länder" },
      { jurisdiction: "Curaçao", abbr: "GCB", name: "Curaçao Gaming Control Board" },
      { jurisdiction: "Anjouan", abbr: "AGLB", name: "Anjouan Gaming Licence Board" },
      { jurisdiction: "Philippines", abbr: "PAGCOR", name: "Philippine Amusement and Gaming Corporation" },
      { jurisdiction: "Romania", abbr: "ONJN", name: "Oficiul Național pentru Jocuri de Noroc" },
    ],
    regulatorsMore: "Plus 50+ additional gaming authorities, state-level regulators, and tribal gaming commissions tracked daily across every licensed market.",
    frameworks: [
      { name: "Remote Operating Licence", desc: "B2C authorisation to offer online gambling services to consumers in a regulated market." },
      { name: "B2B / Supplier Licence", desc: "Authorisation for platform providers, game studios, and software suppliers serving licensed operators." },
      { name: "Personal Management Licence", desc: "Individual licensing for directors, compliance officers, and key personnel at licensed operators." },
      { name: "Responsible Gambling Certificate", desc: "Self-exclusion scheme enrollment, affordability checks, and player protection programme compliance." },
      { name: "AML Programme Registration", desc: "Mandatory anti-money laundering controls, suspicious activity reporting, and sanctions screening." },
      { name: "Technical Compliance Certificate", desc: "RNG testing, game fairness audits, server certification, and platform security assessment." },
      { name: "Advertising Pre-clearance", desc: "Marketing material approval, affiliate programme registration, and promotional code compliance." },
      { name: "Sports Betting Permit", desc: "Specialist authorisation for fixed-odds, exchange, pool, and in-play betting operations." },
    ],
  },
  {
    id: "payments",
    label: "Payments & Crypto",
    image: "/vertical-payments-hero.jpg",
    headline: "Payments and crypto regulation. End to end.",
    desc: "PSD2, MiCA, and DORA in Europe, state-level money transmission in the US, and emerging frameworks across APAC and the Middle East. Licensing, AML, operational resilience, and supervisory expectations.",
    stats: [
      { value: "275+", label: "Jurisdictions" },
      { value: "12,000+", label: "Sources" },
      { value: "Daily", label: "Updates" },
    ],
    categories: [
      { name: "Payment Services & EMI", desc: "Licensing and authorisation for payment institutions and e-money issuers. PSD2, EMD2, open banking, and state-level money transmission." },
      { name: "Crypto & Digital Assets", desc: "Exchange licensing, stablecoin regulation, custody rules, and token classification. MiCA, MAS frameworks, and US state requirements." },
      { name: "AML & Financial Crime", desc: "Travel rule, transaction monitoring, customer due diligence, beneficial ownership, and sanctions screening across jurisdictions." },
      { name: "Operational Resilience", desc: "ICT risk management, incident reporting, business continuity, and outsourcing requirements. DORA, FCA, and MAS frameworks." },
      { name: "Consumer Protection", desc: "Disclosure requirements, complaint handling, safeguarding obligations, and conduct of business rules." },
      { name: "Cross-Border Payments", desc: "Passporting, third-country equivalence, correspondent banking requirements, and cross-border payment flow regulations." },
    ],
    regulators: [
      { jurisdiction: "European Union", abbr: "EBA", name: "European Banking Authority" },
      { jurisdiction: "United Kingdom", abbr: "FCA", name: "Financial Conduct Authority" },
      { jurisdiction: "United States", abbr: "FinCEN", name: "Financial Crimes Enforcement Network" },
      { jurisdiction: "Singapore", abbr: "MAS", name: "Monetary Authority of Singapore" },
      { jurisdiction: "Switzerland", abbr: "FINMA", name: "Swiss Financial Market Supervisory Authority" },
      { jurisdiction: "Hong Kong", abbr: "HKMA", name: "Hong Kong Monetary Authority" },
      { jurisdiction: "Japan", abbr: "JFSA", name: "Japan Financial Services Agency" },
      { jurisdiction: "Canada", abbr: "FINTRAC", name: "Financial Transactions and Reports Analysis Centre" },
      { jurisdiction: "United Arab Emirates", abbr: "VARA", name: "Virtual Assets Regulatory Authority" },
      { jurisdiction: "Germany", abbr: "BaFin", name: "Bundesanstalt für Finanzdienstleistungsaufsicht" },
      { jurisdiction: "Brazil", abbr: "BCB", name: "Banco Central do Brasil" },
      { jurisdiction: "Lithuania", abbr: "LB", name: "Bank of Lithuania" },
    ],
    regulatorsMore: "Plus 40+ additional financial regulators, central banks, and state-level licensing authorities tracked daily across every payments and crypto market.",
    frameworks: [
      { name: "Payment Institution Authorisation", desc: "Licence to provide payment services, execute transactions, and manage client funds under PSD2 and national equivalents." },
      { name: "E-Money Institution Licence", desc: "Authorisation to issue electronic money, manage float, and provide redemption under EMD2 and local frameworks." },
      { name: "VASP / CASP Registration", desc: "Virtual asset and crypto-asset service provider registration under MiCA, FinCEN, and national regimes." },
      { name: "Money Transmitter Licence", desc: "US state-by-state licensing for money transmission, with individual application and bonding requirements." },
      { name: "Agent Registration", desc: "Authorisation of third-party agents acting on behalf of licensed payment institutions and EMIs." },
      { name: "Safeguarding Compliance", desc: "Client fund segregation, asset protection, and safeguarding audit requirements across jurisdictions." },
      { name: "Passporting Notification", desc: "Cross-border service notifications under PSD2 freedom-of-services and freedom-of-establishment provisions." },
      { name: "Operational Resilience Filing", desc: "ICT risk management, incident reporting, and business continuity under DORA and FCA requirements." },
    ],
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
      { name: "Risk Classification", desc: "High-risk system identification, prohibited practices, conformity assessment, and CE marking obligations under the EU AI Act." },
      { name: "Transparency & Accountability", desc: "Disclosure requirements, model cards, algorithmic auditing, and explainability obligations across jurisdictions." },
      { name: "Data Protection", desc: "Privacy regulations governing AI training data, model outputs, and personal data processing requirements." },
      { name: "National Security & Export Controls", desc: "Restrictions on AI technology transfers, export controls, and chip regulations affecting AI development." },
      { name: "Sector Overlays", desc: "Financial services, healthcare, employment, and public sector AI rules — how horizontal AI law meets vertical supervision." },
    ],
    regulators: [
      { jurisdiction: "European Union", abbr: "EU AI Office", name: "European AI Office" },
      { jurisdiction: "United Kingdom", abbr: "DSIT", name: "Department for Science, Innovation and Technology" },
      { jurisdiction: "United States", abbr: "NIST", name: "National Institute of Standards and Technology" },
      { jurisdiction: "Canada", abbr: "ISED", name: "Innovation, Science and Economic Development" },
      { jurisdiction: "Singapore", abbr: "IMDA", name: "Infocomm Media Development Authority" },
      { jurisdiction: "Japan", abbr: "METI", name: "Ministry of Economy, Trade and Industry" },
      { jurisdiction: "South Korea", abbr: "MSIT", name: "Ministry of Science and ICT" },
      { jurisdiction: "Australia", abbr: "DISR", name: "Department of Industry, Science and Resources" },
      { jurisdiction: "United Kingdom", abbr: "ICO", name: "Information Commissioner's Office" },
      { jurisdiction: "United States", abbr: "FTC", name: "Federal Trade Commission" },
      { jurisdiction: "France", abbr: "CNIL", name: "Commission Nationale de l'Informatique et des Libertés" },
      { jurisdiction: "Brazil", abbr: "ANPD", name: "Autoridade Nacional de Proteção de Dados" },
    ],
    regulatorsMore: "Plus national data protection authorities, sector regulators, and standards bodies across every jurisdiction with enacted or proposed AI legislation.",
    frameworks: [
      { name: "High-Risk System Registration", desc: "Mandatory registration of AI systems classified as high-risk under the EU AI Act, with conformity assessment and CE marking." },
      { name: "Algorithmic Impact Assessment", desc: "Pre-deployment impact analysis required across Canada (AIDA), EU member states, and emerging US state frameworks." },
      { name: "Data Protection Impact Assessment", desc: "GDPR Article 35 DPIA obligations for AI systems processing personal data, intersecting with AI-specific rules." },
      { name: "AI Sandbox Admission", desc: "Regulatory sandbox programmes for testing AI systems under supervised conditions before full deployment." },
      { name: "Model Risk Management Filing", desc: "Documentation and governance requirements for AI model validation, monitoring, and risk management." },
      { name: "Transparency Declaration", desc: "Disclosure obligations for AI-generated content, chatbot interactions, and automated decision-making." },
      { name: "Sector-Specific Authorisation", desc: "Additional requirements when AI is deployed in financial services, healthcare, employment, or public administration." },
      { name: "Export Control Compliance", desc: "Restrictions on AI technology transfers, compute thresholds, and chip export regulations." },
    ],
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

      {/* Key Regulators */}
      <div className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={vertical.id + "-regs"}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease }}
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                [ KEY REGULATORS ]
              </p>
              <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-12">
                Authorities we track.
              </h2>
              <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-[var(--color-border-default)]/20 rounded-xl overflow-hidden">
                {vertical.regulators.map((reg) => (
                  <div key={reg.abbr} className="bg-[var(--color-bg-base)] p-5 sm:p-6">
                    <p className="font-mono text-lg font-medium text-[var(--color-text-primary)] mb-1">{reg.abbr}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-snug">{reg.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1.5">{reg.jurisdiction}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-6">
                {vertical.regulatorsMore}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Licensing Requirements */}
      <div className="border-t border-[var(--color-border-default)]/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={vertical.id + "-fws"}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease }}
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
                {vertical.id === "ai" ? "[ COMPLIANCE REQUIREMENTS ]" : "[ LICENSING REQUIREMENTS ]"}
              </p>
              <h2 className="font-display text-2xl font-medium text-[var(--color-text-primary)] sm:text-3xl leading-[1.1] mb-12">
                Obligations we monitor.
              </h2>
              <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-[var(--color-border-default)]/20 rounded-xl overflow-hidden">
                {vertical.frameworks.map((fw) => (
                  <div key={fw.name} className="bg-[var(--color-bg-base)] p-5 sm:p-6">
                    <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">{fw.name}</h3>
                    <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">{fw.desc}</p>
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
            14-day trial. Full access.
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
