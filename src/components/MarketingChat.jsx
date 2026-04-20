"use client";

/**
 * MarketingChat — Matthew on pimlicosolutions.com landing.
 *
 * Port of web/src/components/chat/MarketingChat.tsx. Shares the
 * marketing-chat edge function at sup.xhsdata.ai — CORS already
 * allowlists pimlicosolutions.com.
 *
 * Trigger: 45 seconds of page dwell on /.
 * Behaviour:
 *   - Pimlico-logo bubble fades in bottom-right
 *   - Panel auto-opens with Matthew's greeting + 5 quick-reply pills
 *   - 24h auto-open cooldown so returning visitors don't get popped at
 *   - 24h hard-dismiss cooldown if they close via the X
 *
 * Analytics: every step (bubble_appeared / auto_opened / manually_opened /
 * quick_reply_clicked / message_sent / panel_closed / dismissed /
 * trial_link_clicked) fires to the same edge function with
 * { event: true, event_type, session_id, source_path, persona_id, utm_* }.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "xhs:marketing-chat-session-id";
const OPEN_KEY = "xhs:marketing-chat-was-open";
const DISMISSED_KEY = "xhs:marketing-chat-dismissed-at";
const AUTO_OPENED_KEY = "xhs:marketing-chat-auto-opened-at";
// Session-scoped: once the bubble has fired this tab, keep it visible
//   across page navigations (every page of pimlicosolutions.com, not
//   just the landing). Cleared when the tab closes.
const BUBBLE_SEEN_SESSION_KEY = "xhs:marketing-chat-bubble-seen";

const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const AUTO_OPEN_COOLDOWN_MS = 24 * 60 * 60 * 1000;
// Fallback dwell — used on pages that DON\u2019T have #differentiators
//   (/about, /pricing, etc). Gives the bubble a way to appear there
//   too once a visitor lingers. On the landing page proper the
//   IntersectionObserver trigger almost always fires first.
//   Shortened from 45s \u2192 22s per Andrew: "45 seconds is too long".
const FALLBACK_DWELL_MS = 22_000;

// Matthew\u2019s portrait lives in /public/personas/ (copied from the
//   platform). Using a local asset avoids cross-origin image loads
//   and the Supabase Storage round-trip.
const MATTHEW_PORTRAIT_SRC = "/personas/matthew-langston.png";
// CSS selector the observer watches on pages that have it. When this
//   element crosses into the viewport the bubble opens. Matches the
//   "From regulatory change to team action" section on the landing.
const SCROLL_TRIGGER_SELECTOR = "#differentiators";

// sup.xhsdata.ai is a custom-domain alias for our Supabase project.
// marketing-chat edge function already allowlists pimlicosolutions.com
// origins (see web/supabase/functions/marketing-chat/index.ts).
const SUPABASE_URL = "https://sup.xhsdata.ai";
const SUPABASE_ANON_KEY = "sb_publishable_vd8k7yq856LAm9OgDLMw9w_wHIE4ptd";

const QUICK_REPLIES = [
  { id: "see_pricing",  label: "See pricing",          prompt: "Can you show me pricing for our team size?" },
  { id: "book_demo",    label: "Book a demo",          prompt: "I\u2019d like to book a 20-minute demo." },
  { id: "start_trial",  label: "Start a free trial",   prompt: "How do I start a free trial?" },
  { id: "coverage",     label: "Check jurisdictions",  prompt: "Which jurisdictions do you cover?" },
  { id: "use_case",     label: "Discuss our use case", prompt: "I\u2019d like to chat through our specific regulatory use case." },
];

function getOrCreateSessionId() {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
  } catch {}
  const fresh = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
  try { window.localStorage.setItem(SESSION_KEY, fresh); } catch {}
  return fresh;
}

function readUtm() {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") ?? undefined,
      utm_medium: params.get("utm_medium") ?? undefined,
      utm_campaign: params.get("utm_campaign") ?? undefined,
      referrer: document.referrer || undefined,
    };
  } catch { return {}; }
}

function dismissedRecently() {
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    return !isNaN(ts) && Date.now() - ts < DISMISS_COOLDOWN_MS;
  } catch { return false; }
}

function autoOpenedRecently() {
  try {
    const raw = window.localStorage.getItem(AUTO_OPENED_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    return !isNaN(ts) && Date.now() - ts < AUTO_OPEN_COOLDOWN_MS;
  } catch { return false; }
}

function bubbleSeenThisSession() {
  try { return window.sessionStorage.getItem(BUBBLE_SEEN_SESSION_KEY) === "1"; }
  catch { return false; }
}

function markBubbleSeenThisSession() {
  try { window.sessionStorage.setItem(BUBBLE_SEEN_SESSION_KEY, "1"); }
  catch { /* ignore */ }
}

// GA4 passthrough. The landing site already mounts <Analytics /> which
//   loads gtag; we just push events onto the same dataLayer / gtag
//   pipeline so the marketing-chat funnel is visible in GA4 reports
//   alongside the existing site-wide events. Silent no-op if gtag
//   hasn\u2019t loaded yet.
function sendGA4(eventType, metadata = {}) {
  try {
    if (typeof window === "undefined") return;
    const w = window;
    const params = {
      event_category: "marketing_chat",
      persona_id: "matthew-langston",
      origin_site: "pimlicosolutions.com",
      ...metadata,
    };
    if (typeof w.gtag === "function") {
      w.gtag("event", `mchat_${eventType}`, params);
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: `mchat_${eventType}`, ...params });
    }
  } catch {}
}

function trackEvent(sessionId, eventType, metadata = {}) {
  // Fan-out: Supabase edge function for the in-product admin analytics
  //   surface + GA4 for cross-funnel attribution. Both are best-effort;
  //   analytics never blocks UX.
  sendGA4(eventType, metadata);
  try {
    const utm = readUtm();
    const payload = {
      event: true,
      event_type: eventType,
      session_id: sessionId,
      source_path: typeof window !== "undefined" ? window.location.pathname + window.location.search : null,
      persona_id: "matthew-langston",
      origin_site: "pimlicosolutions.com",
      ts: Date.now(),
      ...utm,
      ...metadata,
    };
    void fetch(`${SUPABASE_URL}/functions/v1/marketing-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
      keepalive: true,
      signal: AbortSignal.timeout(3_000),
    }).catch(() => {});
  } catch {}
}

export default function MarketingChat() {
  const [open, setOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [trialUrl, setTrialUrl] = useState(null);
  const sessionIdRef = useRef("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // Ref mirror of bubbleVisible so the IntersectionObserver callback
  //   can early-exit without depending on React state inside its
  //   stable closure.
  const bubbleVisibleRef = useRef(false);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  // Trigger strategy:
  //   1. If the visitor has already seen the bubble this session
  //      (navigating between pages), keep it visible immediately.
  //      No re-trigger needed \u2014 it's been established.
  //   2. If #differentiators exists on THIS page (landing only), arm
  //      an IntersectionObserver that fires when the section crosses
  //      50% into the viewport. Andrew's ask: "pops up automatically
  //      once an individual has scrolled down to Regulatory Change
  //      to Team Action".
  //   3. Otherwise (subpages), fall back to a 45s dwell so the bubble
  //      still surfaces for users who linger without scrolling into
  //      the trigger zone.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionIdRef.current) return;
    if (dismissedRecently()) return;

    // Case 1: already seen this session \u2014 persist across page loads.
    if (bubbleSeenThisSession()) {
      setBubbleVisible(true);
      return;
    }

    const fire = (triggerReason) => {
      if (bubbleVisibleRef.current) return; // already fired, don't re-announce
      setBubbleVisible(true);
      bubbleVisibleRef.current = true;
      markBubbleSeenThisSession();
      trackEvent(sessionIdRef.current, "bubble_appeared", { trigger: triggerReason });
      if (!autoOpenedRecently()) {
        setOpen(true);
        try { window.localStorage.setItem(AUTO_OPENED_KEY, String(Date.now())); } catch {}
        trackEvent(sessionIdRef.current, "auto_opened", { trigger: triggerReason });
      }
    };

    // Case 2: scroll-based trigger on the landing page section.
    //   Loosened threshold \u2014 fires the moment ANY part of the section
    //   enters the viewport. Earlier version required 40% visibility
    //   which never triggered if the section was taller than the
    //   viewport (a common case on short laptops / scrolling fast).
    //   rootMargin adds a small upward buffer so we fire just before
    //   the heading reaches centre-of-screen.
    const triggerEl = document.querySelector(SCROLL_TRIGGER_SELECTOR);
    let observer = null;
    if (triggerEl && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            fire("scroll_into_view_differentiators");
            observer?.disconnect();
            break;
          }
        }
      }, { threshold: 0, rootMargin: "0px 0px -15% 0px" });
      observer.observe(triggerEl);
    }

    // Case 3: fallback dwell \u2014 fires on pages without the trigger
    //   section, or if the user never scrolls to it.
    const dwellTimer = window.setTimeout(() => {
      fire("fallback_dwell_45s");
    }, FALLBACK_DWELL_MS);

    return () => {
      observer?.disconnect();
      window.clearTimeout(dwellTimer);
    };
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(OPEN_KEY, open ? "1" : "0"); } catch {}
    if (open) {
      setMessages((curr) => {
        if (curr.length > 0) return curr;
        return [{
          role: "assistant",
          content: "Hi \u2014 I\u2019m Matthew, I lead sales at Pimlico. How can I help you today?",
          ts: Date.now(),
        }];
      });
      window.setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const handleDismiss = useCallback(() => {
    setOpen(false);
    try { window.localStorage.setItem(DISMISSED_KEY, String(Date.now())); } catch {}
    trackEvent(sessionIdRef.current, "dismissed", { messages_in_conversation: messages.length });
  }, [messages.length]);

  const handleClose = useCallback(() => {
    setOpen(false);
    trackEvent(sessionIdRef.current, "panel_closed", { messages_in_conversation: messages.length });
  }, [messages.length]);

  const sendMessage = useCallback(async (overrideText, meta) => {
    const text = (overrideText ?? input).trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    const userTurn = { role: "user", content: text, ts: Date.now() };
    setMessages((curr) => [...curr, userTurn]);
    trackEvent(sessionIdRef.current, "message_sent", {
      via: meta?.via ?? "free_text",
      option_id: meta?.option_id,
      length: text.length,
      turn_index: (messages.length ?? 0) + 1,
    });
    try {
      const utm = readUtm();
      const res = await fetch(`${SUPABASE_URL}/functions/v1/marketing-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          message: text,
          source_path: window.location.pathname + window.location.search,
          origin_site: "pimlicosolutions.com",
          ...utm,
        }),
        signal: AbortSignal.timeout(35_000),
      });
      const data = await res.json().catch(() => null);
      const replyText = data?.text ?? "Sorry, I\u2019m having trouble connecting right now. Try again in a moment, or drop us a note at hello@pimlicosolutions.com.";
      const replyTurn = { role: "assistant", content: replyText, ts: Date.now(), toolInvocations: data?.tool_invocations };
      setMessages((curr) => [...curr, replyTurn]);
      const trialLink = data?.tool_invocations?.find((t) => t.sideEffect?.kind === "trial_link");
      if (trialLink?.sideEffect?.url) setTrialUrl(trialLink.sideEffect.url);
    } catch (err) {
      console.error("[MarketingChat] send failed", err);
      setMessages((curr) => [...curr, {
        role: "assistant",
        content: "Something\u2019s gone sideways on my end. Drop us a note at hello@pimlicosolutions.com and we\u2019ll come back to you.",
        ts: Date.now(),
      }]);
    } finally {
      setSending(false);
    }
  }, [input, sending, messages.length]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleQuickReply = useCallback((option) => {
    trackEvent(sessionIdRef.current, "quick_reply_clicked", {
      option_id: option.id,
      option_label: option.label,
    });
    void sendMessage(option.prompt, { via: "quick_reply", option_id: option.id });
  }, [sendMessage]);

  if (!bubbleVisible && !open) return null;

  return (
    <>
      {/* Pimlico-logo bubble. Bigger (56px) to register as a real
          presence, not a throwaway icon. Ring shadow + subtle scale
          hover. Same pattern used on the platform. */}
      <button
        type="button"
        onClick={() => {
          if (open) {
            handleClose();
          } else {
            setOpen(true);
            trackEvent(sessionIdRef.current, "manually_opened", { messages_in_conversation: messages.length });
          }
        }}
        aria-label={open ? "Close chat" : "Open chat with Matthew Langston"}
        className={`fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all ring-1 ring-black/5 ${
          open
            ? "bg-white text-[#0b1738] border border-gray-200 hover:scale-105"
            : "bg-[#0b1738] text-white hover:scale-105"
        }`}
        style={{ animation: "fadeIn 0.4s ease-out" }}
      >
        {open
          ? <XIcon className="h-5 w-5" />
          : (
            <img
              src="/Pimlico_Logo_Inverted.png"
              alt="Pimlico"
              className="h-8 w-auto"
              loading="eager"
            />
          )}
      </button>

      {/* Panel — Rev 48d3. Structured to mirror the platform in-product
          chat: Pimlico wordmark bar at the top, then a proper hero band
          with Matthew\u2019s portrait + name + title, then the greeting +
          pills, then composer. Andrew: "when Eleanor comes up on the
          main platform and we see her photo we see her title we got
          the Pimlico logo at the top and we can you know get some
          information some pills structured below that \u2014 it needs to
          be structured in the exact same way for this". */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Matthew Langston"
          className="fixed bottom-20 right-4 z-40 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden flex flex-col"
        >
          {/* Pimlico wordmark bar \u2014 brand anchor at the very top. */}
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-[#0b1738]">
            <img
              src="/Pimlico_Logo_Inverted.png"
              alt="Pimlico Solutions"
              className="h-5 w-auto"
              loading="eager"
            />
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss chat"
              className="text-white/70 hover:text-white transition-colors p-1 -mr-1"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Hero band \u2014 portrait + name + title, same pattern as
              the platform persona surfaces. Portrait is large enough
              to register as a real person, not a tiny icon. */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-gradient-to-b from-[#0b1738]/[0.03] to-transparent">
            <img
              src={MATTHEW_PORTRAIT_SRC}
              alt="Matthew Langston"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md shrink-0"
              loading="eager"
              decoding="async"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-[#0b1738] leading-tight">Matthew Langston</p>
              <p className="text-[12px] text-gray-600 leading-tight mt-0.5">VP Sales</p>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Pimlico Solutions &middot; London, UK</p>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[9px] uppercase tracking-wider text-gray-500 font-medium">Online</span>
            </div>
          </div>

          {/* Messages — assistant messages show a small Matthew avatar
              so the user can track who they\u2019re talking to across
              longer conversations. */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <img
                      src={MATTHEW_PORTRAIT_SRC}
                      alt=""
                      aria-hidden="true"
                      className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
                    />
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-[#0b1738] text-white rounded-br-md"
                        : "bg-white border border-gray-200 text-[#0b1738] rounded-bl-md shadow-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
            {sending && (
              <div className="flex items-end gap-2 justify-start">
                <img
                  src={MATTHEW_PORTRAIT_SRC}
                  alt=""
                  aria-hidden="true"
                  className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
                />
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3 py-2.5 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0b1738]/60 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0b1738]/60 animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0b1738]/60 animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick-reply chips \u2014 structured pill options below Matthew\u2019s
                greeting. Only shown while the conversation is one-turn
                deep so they don\u2019t hover around once a thread is
                underway. */}
            {messages.length === 1 && !sending && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold ml-8 mb-1">
                  Pick a topic or type your own
                </p>
                <div className="flex flex-wrap gap-1.5 ml-8">
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr.id}
                      type="button"
                      onClick={() => handleQuickReply(qr)}
                      className="rounded-full border border-[#0b1738]/25 bg-white px-3 py-1.5 text-[12px] font-medium text-[#0b1738] hover:bg-[#0b1738] hover:text-white hover:border-[#0b1738] transition-colors shadow-sm"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          {/* Trial CTA */}
          {trialUrl && (
            <div className="px-4 py-2 border-t border-gray-200 bg-emerald-50">
              <a
                href={trialUrl}
                onClick={() => trackEvent(sessionIdRef.current, "trial_link_clicked", {
                  trial_url: trialUrl,
                  messages_in_conversation: messages.length,
                })}
                className="flex items-center justify-between gap-2 text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <span>Start your 7-day trial &mdash; no card required</span>
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Composer */}
          <div className="px-3 py-2 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell Matthew what you&rsquo;re looking for&hellip;"
                rows={2}
                disabled={sending}
                className="flex-1 resize-none rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-[#0b1738] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0b1738] disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={!input.trim() || sending}
                aria-label="Send"
                className="h-8 w-8 rounded-full bg-[#0b1738] text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform"
              >
                <SendIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              Anonymous chat. We never share your details &mdash; you choose what to give us.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

// Inline icon components — avoid pulling in lucide-react which isn't a
//   dep of this repo. SVGs are near-free weight.
function XIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function ExternalLinkIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
