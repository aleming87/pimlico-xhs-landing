"use client";

import { DEMO_UPDATES, DEMO_ORG } from "./demoData";
import { ShowcaseHeader } from "./ShowcaseDashboard";

/**
 * Monitors scene — regulatory feed with canonical preview cards.
 */
export default function ShowcaseMonitors() {
  return (
    <div className="bg-[var(--color-bg-base)] min-h-full">
      <ShowcaseHeader />

      <div className="px-6 py-5">
        <div className="relative">
          {/* Gradient */}
          <div
            className="absolute left-[-100vw] right-[-100vw] -top-24 pointer-events-none"
            style={{ zIndex: 0, height: "520px" }}
            aria-hidden="true"
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "radial-gradient(ellipse 40% 35% at 65% 0%, rgba(59,130,246,0.22), transparent 65%), radial-gradient(ellipse 30% 55% at 80% 10%, rgba(30,64,175,0.18), transparent 70%), linear-gradient(180deg, #020617 0%, #0b1220 45%, #060c1a 80%, transparent 100%)",
                borderRadius: "0 0 30% 30% / 0 0 100% 100%",
              }}
            />
          </div>

          <section className="relative" style={{ zIndex: 1 }}>
            <div className="max-w-5xl mx-auto px-6">
              {/* Logo + org */}
              <div className="flex items-center gap-3 pt-10 mb-5">
                <img src="/Pimlico_SI_Brandmark - II.png" alt="" className="h-6 w-auto opacity-80" />
                <span
                  className="text-xs font-medium text-white/60 uppercase tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {DEMO_ORG.name}
                </span>
              </div>

              <h2
                className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your regulatory feed.
              </h2>
              <p className="mt-3 text-base text-white/50">
                Real-time developments across your subscribed jurisdictions.
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-6">
                <div>
                  <p className="text-3xl font-semibold text-white tabular-nums">12,847</p>
                  <p className="text-xs text-white/45 mt-0.5">updates across 4 jurisdictions</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Feed cards — below gradient */}
        <div className="max-w-5xl mx-auto px-6 mt-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {["Timeline", "By Country", "Feed"].map((view, i) => (
                <span
                  key={view}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    i === 0
                      ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {view}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)]">Filters</span>
              <span className="text-xs text-[var(--color-text-muted)]">Sort</span>
            </div>
          </div>

          {/* Preview cards */}
          <div className="space-y-3">
            {DEMO_UPDATES.map((upd) => (
              <div
                key={upd.id}
                className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-4 hover:border-[var(--color-border-subtle)] transition-all"
              >
                {/* Row 1: Title */}
                <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">
                  {upd.title}
                </p>

                {/* Row 2: Source + date */}
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                  {upd.source} &middot; {formatDate(upd.date)}
                </p>

                {/* Row 3: Tag pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {/* Status pill */}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: getStatusColor(upd.status) }}
                    />
                    {upd.status}
                  </span>
                  {/* Vertical pill */}
                  <span className="inline-flex items-center rounded-full border border-[var(--color-border-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]">
                    {upd.vertical}
                  </span>
                  {/* Region pill */}
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]">
                    {getFlagEmoji(upd.regionCode)} {upd.region}
                  </span>
                  {/* Category pill */}
                  <span className="inline-flex items-center rounded-full border border-[var(--color-border-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]">
                    {upd.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getFlagEmoji(code) {
  if (!code || code.length !== 2) return "\ud83c\udf10";
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

function getStatusColor(status) {
  const map = {
    Published: "#10b981",
    "In Force": "#3b82f6",
    Open: "#f59e0b",
    Adopted: "#8b5cf6",
    Final: "#10b981",
  };
  return map[status] || "#64748b";
}

function formatDate(str) {
  const d = new Date(str + "T00:00:00");
  const today = new Date();
  const diff = Math.floor((today - d) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
