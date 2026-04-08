"use client";

import { DEMO_UPDATES, DEMO_ORG, DEMO_NEWS } from "./demoData";

/**
 * Dashboard scene — the first thing users see when they log in.
 * Gradient heading, greeting, action cards in grey container.
 */
export default function ShowcaseDashboard() {
  return (
    <div className="bg-[var(--color-bg-base)] min-h-full">
      {/* Platform header bar */}
      <ShowcaseHeader />

      <div className="px-6 py-5">
        <div className="relative">
          {/* Gradient backdrop */}
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
                <img
                  src="/Pimlico_SI_Brandmark - II.png"
                  alt="Pimlico"
                  className="h-6 w-auto opacity-80"
                />
                <span
                  className="text-xs font-medium text-white/60 uppercase tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {DEMO_ORG.name}
                </span>
              </div>

              {/* Greeting */}
              <h2
                className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Good morning, Sarah.
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Select an option to get started.
              </p>

              {/* Action cards */}
              <div className="mt-8 mb-10 rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] p-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Monitors", desc: "Track regulatory updates in real time", icon: "\ud83d\udce1" },
                    { title: "Database", desc: "Search regulations, countries, and laws", icon: "\ud83d\uddc4\ufe0f" },
                    { title: "Workspace", desc: "Projects, analyses, and compliance tools", icon: "\ud83d\udcc2" },
                    { title: "Insights", desc: "Expert analysis and commentary", icon: "\ud83d\udcf0" },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="rounded-xl border border-[#cbd5e1] bg-white px-5 pt-5 pb-6 shadow-sm"
                    >
                      <p className="text-2xl mb-4">{card.icon}</p>
                      <p className="text-lg font-medium text-[#0f172a]">{card.title}</p>
                      <p className="text-sm text-[#64748b] mt-1.5">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority developments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Priority Developments
                  </h3>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {DEMO_UPDATES.length} updates
                  </span>
                </div>
                {DEMO_UPDATES.slice(0, 4).map((upd) => (
                  <div
                    key={upd.id}
                    className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg shrink-0 mt-0.5">{getFlagEmoji(upd.regionCode)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug line-clamp-2">
                          {upd.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: getStatusColor(upd.status) }}
                            />
                            {upd.status}
                          </span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">{upd.region}</span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">{upd.vertical}</span>
                          <span className="text-[10px] text-[var(--color-text-muted)] ml-auto">{formatDate(upd.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ── Shared mini-header for all scenes ───────────────────
export function ShowcaseHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-2.5 border-b border-white/5 bg-[var(--color-bg-base)]">
      <div className="flex items-center gap-6">
        <img src="/Pimlico_SI_Brandmark - II.png" alt="" className="h-5 w-auto opacity-60" />
        <div className="flex items-center gap-1">
          {["Dashboard", "Database", "Monitors", "Insights", "Workspace"].map((item) => (
            <span
              key={item}
              className="px-2.5 py-1 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-white/10" />
        <div className="h-6 w-6 rounded-full bg-white/10" />
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
          SC
        </div>
      </div>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────
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
