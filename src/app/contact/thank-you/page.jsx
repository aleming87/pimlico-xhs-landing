"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ThankYouPage() {
  const [calendlyReady, setCalendlyReady] = useState(false);
  const [callBooked, setCallBooked] = useState(false);
  const calendlyContainerRef = useRef(null);

  const calendlyUrl = "https://calendly.com/andrew-pimlicosolutions/xhs-demo-1?background_color=020617&text_color=ffffff&primary_color=ffffff";

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data.event && e.data.event === "calendly.event_scheduled") {
        setCallBooked(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!calendlyReady || callBooked) return;
    const container = calendlyContainerRef.current;
    if (!container || typeof window === "undefined") return;
    if (window.Calendly && typeof window.Calendly.initInlineWidget === "function") {
      container.innerHTML = "";
      window.Calendly.initInlineWidget({
        url: calendlyUrl,
        parentElement: container,
      });
    }
  }, [calendlyReady, callBooked, calendlyUrl]);

  return (
    <main className="min-h-screen pt-24" style={{ backgroundColor: "#020617", color: "#ffffff" }}>
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 sm:py-20">
        {/* Confirmation */}
        <div className="text-center mb-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 mb-6">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3">
            [ RECEIVED ]
          </p>
          <h1 className="text-2xl font-medium text-white sm:text-3xl mb-3">
            Thank you for getting in touch.
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">
            A member of our team will be in touch shortly. In the meantime, you can book a call below or start your free trial.
          </p>
        </div>

        {/* Book a call */}
        {!callBooked ? (
          <div className="rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--color-border-default)]/20">
              <h2 className="text-base font-medium text-white">Book a call</h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Schedule a 30-minute walkthrough with our team.</p>
            </div>
            <div
              ref={calendlyContainerRef}
              className="calendly-inline-widget"
              data-url={calendlyUrl}
              style={{ minWidth: "100%", height: "650px" }}
            />
          </div>
        ) : (
          <div className="rounded-xl border border-white/20 bg-white/5 p-8 text-center">
            <svg className="mx-auto h-10 w-10 text-white mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-medium text-white mb-2">Call booked.</h2>
            <p className="text-sm text-[var(--color-text-tertiary)]">Check your email for confirmation details and calendar invite.</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://xhsdata.ai/register"
            className="rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-[#020617] transition-all hover:opacity-90"
          >
            Start free trial
          </a>
          <Link
            href="/"
            className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            Back to homepage
          </Link>
        </div>
      </div>

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={() => setCalendlyReady(true)}
      />
    </main>
  );
}
