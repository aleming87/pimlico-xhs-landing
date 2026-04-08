"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShowcaseDashboard from "../../components/showcase/ShowcaseDashboard";
import ShowcaseWorkspace from "../../components/showcase/ShowcaseWorkspace";
import ShowcaseDatabase from "../../components/showcase/ShowcaseDatabase";
import ShowcaseCountry from "../../components/showcase/ShowcaseCountry";
import ShowcaseMonitors from "../../components/showcase/ShowcaseMonitors";
import ShowcaseWorkflow from "../../components/showcase/ShowcaseWorkflow";

/**
 * /showcase — Internal product showcase for marketing screenshots & video.
 *
 * Each scene renders a self-contained view of the platform UI
 * with curated demo data. No auth, no Supabase, no live data.
 *
 * Usage:
 *   /showcase              — Scene picker with browser frame
 *   /showcase?scene=dashboard  — Jump to a specific scene
 *   /showcase?capture=1    — Hide all chrome, pure scene only
 *   /showcase?capture=1&scene=workspace — Direct capture mode
 *
 * Keyboard:
 *   ←/→  — Navigate scenes
 *   C    — Toggle capture mode
 *   F    — Toggle fullscreen
 */

const SCENES = [
  {
    id: "dashboard",
    label: "Dashboard",
    desc: "Personalised regulatory briefing hub",
    component: ShowcaseDashboard,
  },
  {
    id: "workspace",
    label: "Workspace",
    desc: "Product tiles and compliance tools",
    component: ShowcaseWorkspace,
  },
  {
    id: "database",
    label: "Database",
    desc: "Three-pillar landing with search",
    component: ShowcaseDatabase,
  },
  {
    id: "country",
    label: "Country",
    desc: "Jurisdiction detail with sector tabs",
    component: ShowcaseCountry,
  },
  {
    id: "monitors",
    label: "Monitors",
    desc: "Real-time regulatory feed",
    component: ShowcaseMonitors,
  },
  {
    id: "workflow",
    label: "Workflow Builder",
    desc: "AI compliance workflow editor",
    component: ShowcaseWorkflow,
  },
];

const ease = [0.25, 0.1, 0.25, 1];

export default function ShowcasePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [capture, setCapture] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("capture") === "1") setCapture(true);
    const sceneParam = params.get("scene");
    if (sceneParam) {
      const idx = SCENES.findIndex((s) => s.id === sceneParam);
      if (idx >= 0) setActiveIdx(idx);
    }
  }, []);

  // Keyboard navigation
  const handleKey = useCallback(
    (e) => {
      if (e.key === "ArrowRight")
        setActiveIdx((i) => Math.min(i + 1, SCENES.length - 1));
      if (e.key === "ArrowLeft") setActiveIdx((i) => Math.max(i - 1, 0));
      if (e.key === "c" || e.key === "C") setCapture((c) => !c);
      if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const ActiveComponent = SCENES[activeIdx].component;

  return (
    <div className="min-h-screen">
      {/* Scene navigation — hidden in capture mode */}
      {!capture && (
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-[var(--color-bg-base)]/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
            {/* Left: logo + title */}
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                XHS Showcase
              </span>
              <span className="text-white/10">|</span>
              <span className="text-xs text-white/30">
                {activeIdx + 1} / {SCENES.length}
              </span>
            </div>

            {/* Centre: scene tabs */}
            <div className="flex items-center gap-1">
              {SCENES.map((scene, i) => (
                <button
                  key={scene.id}
                  onClick={() => setActiveIdx(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    i === activeIdx
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  {scene.label}
                </button>
              ))}
            </div>

            {/* Right: controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCapture(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                title="Enter capture mode (C)"
              >
                Capture
              </button>
              <span className="text-[10px] text-white/20" style={{ fontFamily: "var(--font-mono)" }}>
                ←→ navigate &middot; C capture &middot; F fullscreen
              </span>
            </div>
          </div>
        </nav>
      )}

      {/* Capture mode exit hint */}
      {capture && (
        <button
          onClick={() => setCapture(false)}
          className="fixed top-3 right-3 z-50 px-2 py-1 rounded text-[10px] text-white/20 hover:text-white/60 bg-black/50 backdrop-blur-sm transition-all opacity-0 hover:opacity-100"
        >
          Press C to exit capture
        </button>
      )}

      {/* Scene content — wrapped in browser frame unless capture mode */}
      {capture ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={SCENES[activeIdx].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="mx-auto max-w-6xl px-6 py-8">
          {/* Scene description */}
          <div className="mb-6 text-center">
            <h2
              className="text-2xl font-medium text-white tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {SCENES[activeIdx].label}
            </h2>
            <p className="mt-1 text-sm text-white/40">{SCENES[activeIdx].desc}</p>
          </div>

          {/* Browser frame */}
          <div className="rounded-2xl border border-white/10 bg-[var(--color-bg-surface)] overflow-hidden shadow-2xl shadow-black/40">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-[var(--color-bg-base)]">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 mx-8">
                <div className="mx-auto max-w-sm h-5 rounded-md bg-white/5 flex items-center justify-center">
                  <span className="text-[10px] text-white/25" style={{ fontFamily: "var(--font-mono)" }}>
                    app.pimlicosolutions.com
                  </span>
                </div>
              </div>
            </div>

            {/* Scene viewport */}
            <div className="relative overflow-hidden" style={{ height: "680px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={SCENES[activeIdx].id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease }}
                  className="absolute inset-0 overflow-y-auto"
                >
                  <ActiveComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
