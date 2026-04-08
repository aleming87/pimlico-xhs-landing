"use client";

import { DEMO_ORG } from "./demoData";
import { ShowcaseHeader } from "./ShowcaseDashboard";

/**
 * Database scene — three-pillar landing with search bar.
 */
export default function ShowcaseDatabase() {
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
                Search the database.
              </h2>
              <p className="mt-3 text-base text-white/50">
                Find the latest regulations, requirements, and laws across the globe.
              </p>

              {/* Search bar */}
              <div className="mt-8 mb-10">
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                  </span>
                  <div className="w-full h-14 pl-13 pr-20 rounded-2xl bg-white text-base text-[#0f172a] shadow-lg shadow-black/10 border border-[#e2e8f0] flex items-center">
                    <span className="text-[#94a3b8] ml-8">Ask me anything...</span>
                  </div>
                  <span
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-[#cbd5e1]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Lens&trade;
                  </span>
                </div>
              </div>

              {/* Three pillars */}
              <div className="rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] p-5 mb-10">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { title: "Regulations", desc: "Updates, enforcements, standards, and taxation.", icon: "\ud83d\udcdc" },
                    { title: "Countries", desc: "Map and country reports.", icon: "\ud83c\udf0d" },
                    { title: "Laws", desc: "Legislation, acts, and directives.", icon: "\u2696\ufe0f" },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="rounded-xl border border-[#cbd5e1] bg-white px-5 pt-5 pb-6 shadow-sm"
                    >
                      <p className="text-2xl mb-5">{card.icon}</p>
                      <p className="text-lg font-medium text-[#0f172a]">{card.title}</p>
                      <p className="text-sm text-[#64748b] mt-1.5">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
