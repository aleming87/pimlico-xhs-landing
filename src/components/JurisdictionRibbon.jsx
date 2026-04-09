/**
 * JurisdictionRibbon — infinite-scroll marquee showing key regulators
 * and challenging markets per vertical. Two rows, opposite directions.
 *
 * Usage:
 *   <JurisdictionRibbon major={[...]} complex={[...]} />
 *
 * Each item: { name: "United Kingdom", tag: "UKGC" }
 */

function MarqueeRow({ items, direction = "left", label }) {
  // Duplicate items 4× for seamless wrap on wide screens
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="relative">
      {/* Screen-reader label */}
      <span className="sr-only">{label}</span>

      <div
        className={direction === "left" ? "marquee-left" : "marquee-right"}
        style={{ display: "flex", width: "max-content", willChange: "transform" }}
      >
        {repeated.map((item, i) => (
          <span
            key={`${item.name}-${i}`}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/60 px-4 py-1.5 mx-1.5 text-xs"
          >
            <span className="text-[var(--color-text-secondary)] font-medium">{item.name}</span>
            <span className="text-[var(--color-text-muted)] font-mono text-[10px] tracking-wide">{item.tag}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function JurisdictionRibbon({ major, complex }) {
  return (
    <div className="relative overflow-hidden py-10 border-t border-[var(--color-border-default)]/20">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[var(--color-bg-base)] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[var(--color-bg-base)] to-transparent z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-6">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          [ KEY REGULATORS &amp; FRAMEWORKS ]
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <MarqueeRow items={major} direction="left" label="Major licensing jurisdictions" />
        <MarqueeRow items={complex} direction="right" label="Complex and emerging markets" />
      </div>
    </div>
  );
}
