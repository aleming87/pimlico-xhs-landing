"use client";

import { AnimatedNumber } from "./animated-number";

const STATS = [
  { end: 875, suffix: "k+", label: "Regulatory updates parsed annually across all monitored jurisdictions" },
  { end: 250, suffix: "+", label: "Jurisdictions monitored in real time, including all 50 US states" },
  { end: 12000, suffix: "+", label: "Regulatory sources tracked daily, from central banks to gaming authorities", display: "12,000" },
  { end: 90, suffix: "+", label: "Regulatory topics classified, from AML to responsible gambling" },
];

export default function StatsSection() {
  return (
    <div className="border-t border-[var(--color-border-default)]/20 bg-[var(--color-bg-surface)] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-12">
          [ BY THE NUMBERS ]
        </p>
        <div className="divide-y divide-[var(--color-border-default)]/30">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between py-6 sm:py-10 gap-2 sm:gap-8">
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-sm leading-relaxed order-2 sm:order-1">
                {stat.label}
              </p>
              <p className="font-mono text-2xl font-medium tabular-nums text-[var(--color-text-primary)] sm:text-3xl order-1 sm:order-2 shrink-0">
                <AnimatedNumber start={0} end={stat.end} />
                {stat.suffix}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
