"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const SCREENS = [
  {
    id: "dashboard",
    label: "Dashboard",
    image: "/Product-1---Dashboard.webp",
    headline: "One surface for the regulatory day.",
    desc: "Every development that matters to your jurisdictions, surfaced automatically. Watchlist activity, breaking changes, and Lens\u2122 insights — continuously updated.",
  },
  {
    id: "regulations",
    label: "Regulations",
    image: "/Product-2---Database-Regulations.webp",
    headline: "The complete regulatory record",
    desc: "Filter by jurisdiction, sector, topic, status, and regulatory stage. 275+ jurisdictions, source-verified, timestamped, and structured for compliance teams.",
  },
  {
    id: "insights",
    label: "News",
    image: "/Product-5---News-and-Insights.webp",
    headline: "Expert analysis, not noise",
    desc: "Regulatory Catalyst briefings, implementation notes, and sector deep-dives from the Pimlico research team. Published weekly, always actionable.",
  },
  {
    id: "countries",
    label: "Countries",
    image: "/Product-6---Countries.webp",
    headline: "Jurisdiction-level depth",
    desc: "Drill into any market. Regulator directories, active frameworks, licensing requirements, enforcement history, and compliance obligations at a glance.",
  },
  {
    id: "laws",
    label: "Laws",
    image: "/Product-7---Laws.webp",
    headline: "Primary legislation, structured",
    desc: "Full legislative texts with structured metadata, amendment history, and AI-powered cross-referencing. From the EU AI Act to local gaming statutes.",
  },
  {
    id: "reports",
    label: "Reports",
    image: "/Product-8---Reports.webp",
    headline: "Board-ready compliance reports",
    desc: "Generate reports with cited regulatory sources. Jurisdiction comparisons, gap analyses, and compliance summaries — export as PDF or share directly.",
  },
];

const AUTO_CYCLE_MS = 3500;
const ease = [0.25, 0.1, 0.25, 1];

export default function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goTo = useCallback(
    (idx) => {
      if (idx === active) return;
      setActive(idx);
    },
    [active]
  );

  // Autoplay on — rotates through product screens. Respects prefers-reduced-motion
  // and pauses on hover. Testimonials rotates on a different cadence (7s vs 3.5s)
  // so both can run without feeling frenetic.
  const AUTO_CYCLE_ENABLED = true;

  useEffect(() => {
    if (!AUTO_CYCLE_ENABLED || paused || !isInView || reducedMotion) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SCREENS.length);
    }, AUTO_CYCLE_MS);
    return () => clearInterval(timer);
  }, [paused, isInView, reducedMotion]);

  const screen = SCREENS[active];

  return (
    <div ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ THE PLATFORM ]
          </p>
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl leading-[1.1]">
            One workspace for your entire compliance operation.
          </h2>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="mb-6 flex gap-1 overflow-x-auto scrollbar-hide pb-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {SCREENS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`relative shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-300 ${
                i === active
                  ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]"
              }`}
            >
              {s.label}
              {i === active && !paused && (
                <span
                  key={`bar-${active}`}
                  className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-text-tertiary)] rounded-full"
                  style={{ animation: `progress ${AUTO_CYCLE_MS}ms linear forwards` }}
                />
              )}
              {i === active && paused && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-text-tertiary)] rounded-full" />
              )}
            </button>
          ))}
        </motion.div>

        {/* Browser chrome + screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          className="rounded-xl border border-[var(--color-border-default)]/40 bg-[var(--color-bg-surface)] overflow-hidden shadow-2xl shadow-black/20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border-default)]/30">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-text-muted)]/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-text-muted)]/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-text-muted)]/20" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="rounded-md bg-[var(--color-bg-elevated)] px-4 py-1 text-[10px] font-mono text-[var(--color-text-muted)]">
                xhsdata.ai
              </div>
            </div>
          </div>

          {/* Screenshot — fixed aspect ratio container with layered crossfade */}
          <div className="relative" style={{ aspectRatio: "2.1 / 1" }}>
            <AnimatePresence mode="popLayout">
              <motion.img
                key={screen.id}
                src={screen.image}
                alt={screen.label}
                className="absolute inset-0 w-full h-full object-contain object-top"
                style={{ willChange: "opacity" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Description below */}
        <div className="mt-8 min-h-[4.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="text-base font-medium text-[var(--color-text-primary)] mb-1">
                {screen.headline}
              </p>
              <p className="text-sm text-[var(--color-text-tertiary)] max-w-2xl leading-relaxed">
                {screen.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
