"use client";

import { DEMO_COUNTRY, DEMO_UPDATES } from "./demoData";
import { ShowcaseHeader } from "./ShowcaseDashboard";

/**
 * Country detail scene — Finland with gradient heading, sector tabs,
 * and dashboard grey-box treatment.
 */
export default function ShowcaseCountry() {
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
              {/* Back link */}
              <div className="pt-8">
                <span className="text-xs text-white/70 mb-3 flex items-center gap-1">
                  &larr; Countries
                </span>
              </div>

              {/* Flag + heading */}
              <div className="flex items-start gap-4 pb-4">
                <span className="text-5xl mt-1">{DEMO_COUNTRY.flag}</span>
                <div>
                  <h2
                    className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {DEMO_COUNTRY.name}
                  </h2>
                  <p className="mt-2 text-sm text-white/50">
                    {DEMO_COUNTRY.sectors.map((s) => s.name).join(" \u00b7 ")}
                  </p>
                </div>
              </div>

              {/* Sector tabs */}
              <div className="flex items-center gap-1 mb-4">
                {DEMO_COUNTRY.sectors.map((sector, i) => (
                  <span
                    key={sector.name}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      i === 0
                        ? "bg-white/10 text-white"
                        : "text-white/40"
                    }`}
                  >
                    {sector.name}
                  </span>
                ))}
              </div>

              {/* Grey container with content */}
              <div className="rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] p-5 mb-10">
                <div className="grid grid-cols-3 gap-4">
                  {/* Main column */}
                  <div className="col-span-2 space-y-4">
                    {/* Overview card */}
                    <div className="rounded-xl bg-white border border-[#cbd5e1] p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-[#0f172a] mb-3">Overview</h3>
                      <p className="text-sm text-[#334155] leading-relaxed">
                        Finland is preparing to open its gambling market in 2027 following the landmark Gambling Act 2026. The licence application window opened in April 2026, with the National Police Board acting as primary regulator.
                      </p>
                      <div className="grid grid-cols-4 gap-3 mt-4">
                        {Object.entries(DEMO_COUNTRY.keyFacts).map(([key, val]) => (
                          <div key={key} className="text-center">
                            <p className="text-xs text-[#64748b] mb-0.5 capitalize">{key === "euMember" ? "EU" : key}</p>
                            <p className="text-sm font-semibold text-[#0f172a]">
                              {typeof val === "boolean" ? (val ? "Yes" : "No") : val}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Regulators card */}
                    <div className="rounded-xl bg-white border border-[#cbd5e1] p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-[#0f172a] mb-3">Regulators</h3>
                      <div className="space-y-2">
                        {DEMO_COUNTRY.regulators.map((reg) => (
                          <div
                            key={reg}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]"
                          >
                            <div className="h-8 w-8 rounded-lg bg-[#0f172a]/5 flex items-center justify-center shrink-0">
                              <span className="text-xs">\ud83c\udfe6</span>
                            </div>
                            <span className="text-sm font-medium text-[#0f172a]">{reg}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Latest updates */}
                    <div className="rounded-xl bg-white border border-[#cbd5e1] p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-[#0f172a] mb-3">Latest Updates</h3>
                      <div className="space-y-2">
                        {DEMO_UPDATES.filter((u) => u.regionCode === "FI" || u.regionCode === "EU")
                          .slice(0, 3)
                          .map((upd) => (
                            <div key={upd.id} className="flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-[#f8fafc]">
                              <span
                                className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0"
                                style={{ background: upd.status === "Open" ? "#f59e0b" : "#10b981" }}
                              />
                              <div>
                                <p className="text-sm text-[#0f172a] leading-snug">{upd.title}</p>
                                <p className="text-xs text-[#64748b] mt-1">{upd.source}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                    {/* Country photo */}
                    <div className="rounded-xl overflow-hidden border border-[#cbd5e1] shadow-sm">
                      <img
                        src={DEMO_COUNTRY.photo}
                        alt={DEMO_COUNTRY.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3 bg-white">
                        <p className="text-xs text-[#64748b]">Helsinki, Finland</p>
                      </div>
                    </div>

                    {/* Quick nav */}
                    <div className="rounded-xl bg-white border border-[#cbd5e1] p-4 shadow-sm">
                      <h4 className="text-xs font-semibold text-[#0f172a] mb-2">Quick Navigation</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {["Overview", "Regulators", "Licensing", "Enforcement", "Timeline"].map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 rounded-md text-xs text-[#334155] bg-[#f1f5f9] border border-[#e2e8f0]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="rounded-xl bg-white border border-[#cbd5e1] p-4 shadow-sm">
                      <h4 className="text-xs font-semibold text-[#0f172a] mb-3">Key Dates</h4>
                      <div className="space-y-3">
                        {DEMO_COUNTRY.timeline.map((evt, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-[#3b82f6] shrink-0 mt-1" />
                              {i < DEMO_COUNTRY.timeline.length - 1 && (
                                <div className="w-px flex-1 bg-[#e2e8f0] mt-1" />
                              )}
                            </div>
                            <div className="pb-3">
                              <p className="text-[10px] font-medium text-[#3b82f6]" style={{ fontFamily: "var(--font-mono)" }}>
                                {evt.date}
                              </p>
                              <p className="text-xs text-[#334155] mt-0.5">{evt.event}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
