"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const ease = [0.25, 0.1, 0.25, 1];
const WORDS = ["Tracked.", "Sourced.", "Verified.", "Analyzed.", "Delivered."];
const TYPE_SPEED = 90;
const DELETE_SPEED = 55;
const PAUSE_AFTER_TYPE = 2500;
const PAUSE_AFTER_DELETE = 400;

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [visible, setVisible] = useState(true);
  const [cycles, setCycles] = useState(0);
  const [done, setDone] = useState(false);

  const TOTAL_CYCLES = 2;

  useEffect(() => {
    if (done) return;

    const word = WORDS[wordIndex];

    if (charIndex < word.length) {
      const t = setTimeout(() => {
        setDisplayText(word.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, TYPE_SPEED);
      return () => clearTimeout(t);
    }

    // Done typing — check if this is the final landing
    const isLastWord = wordIndex === WORDS.length - 1 && cycles >= TOTAL_CYCLES;
    if (isLastWord) {
      setShowCursor(false);
      setDone(true);
      return;
    }

    // Hide cursor, hold, then fade out and move to next
    setShowCursor(false);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        const nextIndex = (wordIndex + 1) % WORDS.length;
        if (nextIndex === 0) setCycles((c) => c + 1);
        setWordIndex(nextIndex);
        setCharIndex(0);
        setDisplayText("");
        setShowCursor(true);
        setVisible(true);
      }, 350);
    }, PAUSE_AFTER_TYPE);
    return () => clearTimeout(t);
  }, [charIndex, wordIndex, done, cycles]);

  return (
    <div className="bg-[var(--color-bg-base)]">
      <div className="relative isolate px-6 pt-24 lg:px-8">
        {/* Atmospheric light — concentrated blue glow from upper right (xAI pattern) */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease }}
            className="absolute top-[-20%] right-[-5%] w-[55%] h-[110%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(25,50,100,0.6)_0%,rgba(15,35,75,0.3)_35%,transparent_70%)]"
          />
        </div>

        <div className="mx-auto max-w-7xl py-16 sm:py-32 lg:py-40 px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Monospace announcement pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="mb-10"
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-surface)]/50 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-secondary)] animate-pulse" />
                <span className="text-xs font-mono font-medium tracking-wide text-[var(--color-text-tertiary)]">
                  NOW MONITORING 275+ JURISDICTIONS
                </span>
              </div>
            </motion.div>

            {/* Headline — staggered word reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease }}
              className="font-display text-4xl font-medium tracking-tight text-[var(--color-text-primary)] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]"
            >
              Every regulatory change.<br />
              <span className={`text-[var(--color-text-primary)] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
                {displayText}
                {showCursor && <span className="inline-block w-[3px] h-[0.85em] bg-[var(--color-text-primary)] ml-1 align-baseline animate-pulse" />}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease }}
              className="mt-8 text-sm text-[var(--color-text-tertiary)] sm:text-lg leading-relaxed"
            >
              Compliance workspaces for Gambling, Payments, Crypto and AI teams.<br />
              Sourced, analyzed, and delivered across 275+ jurisdictions.
            </motion.p>

            {/* Dual CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0, ease }}
              className="mt-12 flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                href="https://xhsdata.ai/register"
                className="rounded-lg bg-[var(--color-text-primary)] px-8 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
              >
                Start free trial
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-[var(--color-border-subtle)] px-8 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              >
                Book a demo
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
