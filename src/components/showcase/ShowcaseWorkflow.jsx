"use client";

import { DEMO_WORKFLOW } from "./demoData";
import { ShowcaseHeader } from "./ShowcaseDashboard";

/**
 * Workflow Builder scene — Harvey-style three-panel block editor.
 */
export default function ShowcaseWorkflow() {
  const BLOCK_ICONS = {
    "jurisdiction-select": "\ud83c\udf0d",
    "ai-analysis": "\ud83e\udde0",
    conditional: "\ud83d\udd00",
    response: "\ud83d\udcdd",
    notify: "\ud83d\udd14",
  };

  return (
    <div className="bg-[var(--color-bg-base)] min-h-full">
      <ShowcaseHeader />

      <div className="px-6 py-5">
        {/* Gradient heading */}
        <div className="relative mb-6">
          <div
            className="absolute left-[-100vw] right-[-100vw] -top-24 pointer-events-none"
            style={{ zIndex: 0, height: "380px" }}
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
          <div className="relative" style={{ zIndex: 1 }}>
            <span className="text-xs text-white/70 mb-3 flex items-center gap-1">
              &larr; Workspace
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{'\u2699\ufe0f'}</span>
                <h2
                  className="text-3xl sm:text-4xl font-medium tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Workflow Builder
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 border border-white/20 bg-white/5">
                  Save
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600">
                  Run
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Three-panel editor */}
        <div
          className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-base)] overflow-hidden"
          style={{ height: "440px" }}
        >
          <div className="flex h-full">
            {/* Left sidebar — workflow list */}
            <div className="w-56 shrink-0 border-r border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
              <div className="p-3 border-b border-[var(--color-border-default)]">
                <p className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">Workflows</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">5 templates</p>
              </div>
              <div className="p-2 space-y-1">
                {[
                  "Licence Impact Assessment",
                  "Jurisdiction Comparison",
                  "Licence Checklist",
                  "Enforcement Risk",
                  "Gap Analysis",
                ].map((name, i) => (
                  <div
                    key={name}
                    className={`px-3 py-2 rounded-lg text-xs ${
                      i === 0
                        ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] font-medium"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]"
                    } transition-all cursor-pointer`}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>

            {/* Centre — canvas */}
            <div className="flex-1 bg-[var(--color-bg-base)] p-6 overflow-y-auto">
              <div className="max-w-sm mx-auto">
                <p
                  className="text-xs font-medium text-[var(--color-text-muted)] mb-4 text-center uppercase tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {DEMO_WORKFLOW.name}
                </p>

                {/* Block flow */}
                {DEMO_WORKFLOW.blocks.map((block, i) => (
                  <div key={block.id}>
                    {/* Block card */}
                    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-4 hover:border-[var(--color-border-subtle)] transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-lg shrink-0">
                          {BLOCK_ICONS[block.type] || "\ud83d\udce6"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                            {block.type.replace(/-/g, " ")}
                          </p>
                          <p className="text-sm font-medium text-[var(--color-text-primary)] mt-0.5">
                            {block.label}
                          </p>
                        </div>
                        <span className="text-[var(--color-text-muted)]">&hellip;</span>
                      </div>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-2 pl-9">
                        &rarr; {block.output}
                      </p>
                    </div>

                    {/* Connector line */}
                    {i < DEMO_WORKFLOW.blocks.length - 1 && (
                      <div className="flex justify-center py-2">
                        <div className="w-px h-6 bg-[var(--color-border-default)]" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Add step */}
                <div className="flex justify-center mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
                    + Add step
                  </span>
                </div>
              </div>
            </div>

            {/* Right sidebar — config panel */}
            <div className="w-64 shrink-0 border-l border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
              <div className="p-3 border-b border-[var(--color-border-default)]">
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">Block Config</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">jurisdiction-select</p>
              </div>
              <div className="p-3 space-y-3">
                <div>
                  <label className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">
                    Label
                  </label>
                  <div className="h-8 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-base)] px-3 flex items-center text-xs text-[var(--color-text-primary)]">
                    Select Jurisdictions
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">
                    Selection Mode
                  </label>
                  <div className="h-8 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-base)] px-3 flex items-center text-xs text-[var(--color-text-primary)]">
                    Multi-select
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">
                    Context
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {["@jurisdictions", "@org-profile"].map((ctx) => (
                      <span
                        key={ctx}
                        className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-400"
                      >
                        {ctx}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
