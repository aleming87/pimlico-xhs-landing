"use client";

import { DEMO_PRODUCTS, DEMO_ORG } from "./demoData";
import { ShowcaseHeader } from "./ShowcaseDashboard";

/**
 * Workspace scene — product tiles in grey container on gradient.
 */
export default function ShowcaseWorkspace() {
  const ICONS = {
    FolderKanban: "\ud83d\uddc2\ufe0f",
    ScanSearch: "\ud83d\udd0d",
    Wrench: "\ud83d\udd27",
    Shield: "\ud83d\udee1\ufe0f",
    Users: "\ud83d\udc65",
    Star: "\u2b50",
  };

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
                Build the future.
              </h2>
              <p className="mt-3 text-base text-white/50">
                Projects, analyses, and compliance tools for your team.
              </p>

              {/* Product cards */}
              <div className="mt-8 rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] p-5 mb-10">
                <div className="grid grid-cols-3 gap-3">
                  {DEMO_PRODUCTS.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-xl border border-[#cbd5e1] bg-white px-5 pt-5 pb-6 shadow-sm hover:border-[#0f172a] transition-all cursor-pointer"
                    >
                      <p className="text-2xl mb-5">{ICONS[product.icon] || "\ud83d\udce6"}</p>
                      <p className="text-lg font-medium text-[#0f172a]">{product.title}</p>
                      <p className="text-sm text-[#64748b] mt-1.5">{product.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action pills */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]/40 pl-3 pr-4 py-2">
                  <span className="relative flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/10 shrink-0">
                    <span className="text-xs">🔔</span>
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Watchlists</span>
                  <span className="text-[var(--color-text-muted)]">&rarr;</span>
                </div>
                <div className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]/40 pl-3 pr-4 py-2">
                  <span className="relative flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/10 shrink-0">
                    <span className="text-xs">{'\u2699\ufe0f'}</span>
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Workflow Builder</span>
                  <span className="text-[var(--color-text-muted)]">&rarr;</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
