"use client";

/**
 * MarketingChat — Nadia on pimlicosolutions.com landing.
 *
 * Port of web/src/components/chat/MarketingChat.tsx. Shares the
 * marketing-chat edge function at sup.xhsdata.ai — CORS already
 * allowlists pimlicosolutions.com.
 *
 * Trigger: 45 seconds of page dwell on /.
 * Behaviour:
 *   - Pimlico-logo bubble fades in bottom-right
 *   - Panel auto-opens with Nadia's greeting + 5 quick-reply pills
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
// Rev 48d6 — persist the last N messages so a reload doesn't wipe the
//   thread. Keyed by session_id so the same session rehydrates on return.
const HISTORY_KEY = "xhs:marketing-chat-history";
const HISTORY_MAX = 20;
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
//   Rev 48d9 \u2014 Andrew reported Nadia wasn\u2019t triggering at all.
//   Reduced 22s \u2192 8s so there\u2019s no perceived dead time, and so it
//   beats the scroll observer on impatient scrollers too.
const FALLBACK_DWELL_MS = 8_000;

// Rev 48d6 \u2014 Nadia Olsson (Enterprise Account Lead) replaces Nadia
//   as the marketing chat anchor. Andrew: "I'm not sure what else,
//   Nadia intends [seniority]" \u2014 swapping to Nadia because the
//   role (Enterprise AE) actually matches what a chat-widget greeter
//   does, and it gives gender parity with Eleanor on the product side.
//   Nadia stays in the roster for signatories / escalations.
const NADIA_PORTRAIT_SRC = "/personas/nadia-olsson.png";
// CSS selector the observer watches on pages that have it. When this
//   element crosses into the viewport the bubble opens. Matches the
//   "From regulatory change to team action" section on the landing.
const SCROLL_TRIGGER_SELECTOR = "#differentiators";

// sup.xhsdata.ai is a custom-domain alias for our Supabase project.
// marketing-chat edge function already allowlists pimlicosolutions.com
// origins (see web/supabase/functions/marketing-chat/index.ts).
const SUPABASE_URL = "https://sup.xhsdata.ai";
const SUPABASE_ANON_KEY = "sb_publishable_vd8k7yq856LAm9OgDLMw9w_wHIE4ptd";

// Rev 48d6 \u2014 four pills only. Decisional intents only. Dropped
//   "Check jurisdictions" (specification question, comes up naturally
//   inside "Discuss our use case"). Two pills now DIRECT-REDIRECT
//   instead of routing through the LLM:
//     - start_trial \u2192 /start-trial (no LLM dependency)
//     - book_demo   \u2192 /contact?intent=demo (lands them in the form)
//   The two conversational pills (see_pricing, use_case) stay as
//   prompts because they produce value inside the chat.
// Rev 48d7 — three direct-conversion redirects + one consultative
//   prompt. "See pricing" moved to a redirect because the /pricing
//   page already has a full calculator (team-size slider + verticals
//   + regions + monthly/annual toggle + quote form). Sending the
//   visitor straight there is a cleaner experience than a Haiku
//   summary that leaves them guessing how to actually calculate.
// Rev 48d8 \u2014 redirect paths only. The session_id and chat=continue
//   flag are appended at click time so they\u2019re current for whichever
//   session triggered the pill. On pimlicosolutions.com these are
//   same-origin paths; absolute URLs aren\u2019t needed here because the
//   landing is one domain. The xhsdata.ai (web repo) version uses
//   absolute pimlicosolutions.com URLs for its matching pills.
const QUICK_REPLIES = [
  { id: "see_pricing", label: "See pricing",          redirect: "/pricing" },
  { id: "book_demo",   label: "Book a demo",          redirect: "/contact?intent=demo" },
  { id: "start_trial", label: "Start a free trial",   redirect: "/start-trial" },
  { id: "use_case",    label: "Discuss our use case", prompt: "I\u2019d like to chat through our specific regulatory use case." },
];

// Build the final redirect URL for a pill click. Appends:
//   - from=marketing-chat \u2014 traffic attribution on the landing page
//   - mchat_session=<id>  \u2014 lets /pricing, /start-trial, /contact join
//                            their own logs back to the chat session
//   - chat=continue       \u2014 signals to the MarketingChat on the next
//                            page that the visitor was mid-conversation,
//                            so the panel opens immediately instead of
//                            waiting for the dwell timer
function buildRedirectUrl(baseUrl, sessionId) {
  try {
    const url = new URL(baseUrl, typeof window !== "undefined" ? window.location.origin : "https://pimlicosolutions.com");
    url.searchParams.set("from", "marketing-chat");
    if (sessionId) url.searchParams.set("mchat_session", sessionId);
    url.searchParams.set("chat", "continue");
    // Return relative when same-origin so the navigation feels native.
    if (typeof window !== "undefined" && url.origin === window.location.origin) {
      return url.pathname + url.search + url.hash;
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}

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

// Rev 48d6 — cookie-consent gate for GA4. Landing already has a
//   CookieConsent component that sets `xhs-consent` in localStorage
//   (values: "granted" | "denied" | absent). We only ping GA4 when
//   consent is granted. Supabase event logging continues regardless
//   because it\u2019s first-party + we disclose it in the privacy policy.
function hasAnalyticsConsent() {
  try {
    return window.localStorage.getItem("xhs-consent") === "granted";
  } catch {
    return false;
  }
}

// Rev 48d6 — chat history persistence. Stores the last N turns keyed
//   by session_id so a reload doesn\u2019t wipe the thread. Also survives
//   closing + reopening the panel in the same tab.
function readHistory(sessionId) {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.session_id !== sessionId) return [];
    return Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch { return []; }
}

function writeHistory(sessionId, messages) {
  try {
    const trimmed = messages.slice(-HISTORY_MAX);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify({
      session_id: sessionId,
      messages: trimmed,
      saved_at: Date.now(),
    }));
  } catch { /* quota — ignore */ }
}

// GA4 passthrough. The landing site already mounts <Analytics /> which
//   loads gtag; we just push events onto the same dataLayer / gtag
//   pipeline so the marketing-chat funnel is visible in GA4 reports
//   alongside the existing site-wide events. Silent no-op if gtag
//   hasn\u2019t loaded yet.
function sendGA4(eventType, metadata = {}) {
  try {
    if (typeof window === "undefined") return;
    // Rev 48d6 \u2014 consent gate. Only ping GA4 once the visitor has
    //   granted analytics consent via the CookieConsent component.
    //   Supabase event logging (trackEvent) continues regardless
    //   because it\u2019s first-party + covered by the privacy policy.
    if (!hasAnalyticsConsent()) return;
    const w = window;
    const params = {
      event_category: "marketing_chat",
      persona_id: "nadia-olsson",
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
      persona_id: "nadia-olsson",
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
    // Rev 48d8 \u2014 if the visitor arrived with ?mchat_session=<id>,
    //   prefer that over the local session so the thread rehydrates
    //   correctly across a pill-click navigation. Cross-domain safe
    //   (xhsdata.ai \u2192 pimlicosolutions.com handoff).
    let sessionId = null;
    try {
      sessionId = new URLSearchParams(window.location.search).get("mchat_session");
    } catch { /* ignore */ }
    if (sessionId) {
      try { window.localStorage.setItem(SESSION_KEY, sessionId); } catch {}
      sessionIdRef.current = sessionId;
    } else {
      sessionIdRef.current = getOrCreateSessionId();
    }

    // Rehydrate thread from localStorage. If the visitor had a
    //   conversation going on the previous page load, the bubble
    //   re-opens with the thread intact rather than a blank hero.
    const saved = readHistory(sessionIdRef.current);
    if (saved.length > 0) setMessages(saved);

    // Rev 48d8 \u2014 "chat=continue" URL param means the visitor was
    //   mid-conversation on a prior page and clicked a redirect pill.
    //   Show bubble immediately so Nadia follows. Whether the panel
    //   also OPENS depends on what page we landed on:
    //     - focused conversion pages (/pricing /contact etc.): bubble
    //       only, panel stays closed. Calculator/form is the focus.
    //     - mobile (< 768px): bubble only. Full-screen takeover too
    //       aggressive when the visitor is already engaged elsewhere.
    //     - everywhere else: open the panel, Nadia picks up where
    //       the conversation was.
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("chat") === "continue") {
        setBubbleVisible(true);
        bubbleVisibleRef.current = true;
        markBubbleSeenThisSession();
        const path = window.location.pathname;
        const FOCUSED_PAGES = ["/pricing", "/contact", "/start-trial", "/quote"];
        const isFocusedPage = FOCUSED_PAGES.some((p) => path.startsWith(p));
        const isMobile = window.matchMedia?.("(max-width: 767px)").matches ?? false;
        const shouldOpenPanel = !isFocusedPage && !isMobile;
        if (shouldOpenPanel) {
          setOpen(true);
          trackEvent(sessionIdRef.current, "panel_continued_on_navigation", {
            from_path: document.referrer || null,
          });
        } else {
          trackEvent(sessionIdRef.current, "bubble_continued_on_navigation", {
            from_path: document.referrer || null,
            path,
            is_focused_page: isFocusedPage,
            is_mobile: isMobile,
          });
        }
        // Strip the chat + mchat_session params from the URL without
        //   a reload so a back-button doesn\u2019t re-trigger.
        params.delete("chat");
        params.delete("mchat_session");
        const clean = window.location.pathname + (params.toString() ? "?" + params.toString() : "") + window.location.hash;
        window.history.replaceState({}, "", clean);
      }
    } catch { /* ignore */ }
  }, []);

  // Persist every message-list change.
  useEffect(() => {
    if (!sessionIdRef.current) return;
    if (messages.length === 0) return;
    writeHistory(sessionIdRef.current, messages);
  }, [messages]);

  // Trigger strategy:
  //   1. If the visitor has already seen the bubble this session
  //      (navigating between pages), keep it visible immediately.
  //      No re-trigger needed \u2014 it's been established.
  //   2. If they dismissed within the last 24h, still show the bubble
  //      (so they can re-engage if they change their mind) but skip
  //      the auto-open. Previous behaviour hid the bubble entirely,
  //      which made the widget feel broken after a single dismiss.
  //   3. If #differentiators exists on THIS page (landing only), arm
  //      an IntersectionObserver that fires when the section enters
  //      the viewport. Andrew's ask: "pops up automatically once an
  //      individual has scrolled down to Regulatory Change to Team
  //      Action".
  //   4. Otherwise (subpages), fall back to a 22s dwell so the bubble
  //      still surfaces for users who linger without scrolling into
  //      the trigger zone.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionIdRef.current) return;

    // Case 2: hard-dismissed within 24h \u2014 show the bubble but don't
    //   auto-open. User can click it if they want to re-engage.
    if (dismissedRecently()) {
      setBubbleVisible(true);
      bubbleVisibleRef.current = true;
      return;
    }

    // Case 1: already seen this session \u2014 persist across page loads.
    if (bubbleSeenThisSession()) {
      setBubbleVisible(true);
      return;
    }

    // Rev 48d8 \u2014 suppress auto-open on pages where the visitor is
    //   focused on a conversion tool of their own (calculator, form).
    //   Rev 48d9 \u2014 also suppress on mobile. Full-screen takeover is
    //   too aggressive when the visitor isn\u2019t expecting it. Bubble
    //   still appears so Nadia is reachable.
    const currentPath = window.location.pathname;
    const FOCUSED_PAGES = ["/pricing", "/contact", "/start-trial", "/quote"];
    const isFocusedPage = FOCUSED_PAGES.some((p) => currentPath.startsWith(p));
    const isMobile = window.matchMedia?.("(max-width: 767px)").matches ?? false;
    const suppressAutoOpen = isFocusedPage || isMobile;

    const fire = (triggerReason) => {
      if (bubbleVisibleRef.current) return; // already fired, don't re-announce
      setBubbleVisible(true);
      bubbleVisibleRef.current = true;
      markBubbleSeenThisSession();
      trackEvent(sessionIdRef.current, "bubble_appeared", { trigger: triggerReason, path: currentPath });
      if (!autoOpenedRecently() && !suppressAutoOpen) {
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
      // Rev 48d5 \u2014 no seeded greeting message. The hero already shows
      //   name + role + "What can I help you with today?", so any
      //   seeded assistant bubble was just redundant ("How can I help
      //   today?" right after "What can I help you with today?").
      //   Thread view opens clean on first user message.
      window.setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  /** Reset conversation back to the hero view (portrait + pills). */
  const handleBackToHero = useCallback(() => {
    setMessages([]);
    setTrialUrl(null);
    trackEvent(sessionIdRef.current, "back_to_hero", {});
    window.setTimeout(() => inputRef.current?.focus(), 120);
  }, []);

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
      // Rev 48d6 \u2014 specific handoff on rate-limit (429) or capacity
      //   blocks (503). The edge function returns 429 after 30 msgs
      //   per IP per hour or 40 turns per session. Rather than the
      //   generic error, tell the visitor clearly + give them email.
      if (res.status === 429 || res.status === 503) {
        trackEvent(sessionIdRef.current, "rate_limited", { status: res.status });
        setMessages((curr) => [...curr, {
          role: "assistant",
          content: "Looks like we\u2019ve hit the limit for this session. Email hello@pimlicosolutions.com and I\u2019ll pick it up there \u2014 usually under an hour during UK business hours.",
          ts: Date.now(),
        }]);
        return;
      }
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
      action: option.redirect ? "redirect" : "prompt",
    });
    // Rev 48d6 \u2014 direct-redirect pills (start_trial, book_demo) skip
    //   the LLM entirely and send the user straight to the conversion
    //   surface. More reliable than hoping Haiku emits the right tool
    //   invocation. GA4 + edge-fn analytics still fire so the funnel
    //   report sees the click.
    // Rev 48d8 \u2014 append mchat_session + chat=continue so Nadia stays
    //   alongside the visitor on the next page.
    if (option.redirect) {
      window.location.href = buildRedirectUrl(option.redirect, sessionIdRef.current);
      return;
    }
    void sendMessage(option.prompt, { via: "quick_reply", option_id: option.id });
  }, [sendMessage]);

  if (!bubbleVisible && !open) return null;

  return (
    <>
      {/* Pimlico bubble \u2014 circular, matching the platform
          ChatFloatingBubble exactly (h-16 w-16 navy circle with the
          full wordmark scaled via object-contain so nothing crops).
          Andrew: "I want the Pimlico logo in the bubble like we
          fucking have on the side you made it into some big fucking
          pill". */}
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
        aria-label={open ? "Close chat" : "Open chat with Nadia Olsson"}
        className={`fixed bottom-5 right-5 z-40 h-16 w-16 rounded-full shadow-xl flex items-center justify-center transition-all ring-1 ring-black/5 overflow-hidden ${
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
              className="max-h-9 max-w-[44px] object-contain pointer-events-none select-none"
              loading="eager"
              draggable={false}
            />
          )}
      </button>

      {/* Panel \u2014 Rev 48d4. Structure matches the platform in-product
          chat (Eleanor) pattern 1:1: slim Pimlico-wordmark bar at top
          with close, then a CENTERED hero (big portrait with online
          dot, name, role), then a big centered "How can I help you"
          heading, then a 2-column grid of pill options, then composer.
          Andrew: "structure fucking Nadia\u2019s in the same goddamn
          way". */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Nadia Olsson"
          className="fixed bottom-20 right-4 z-40 w-[400px] max-w-[calc(100vw-2rem)] h-[640px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden flex flex-col"
        >
          {/* Top bar \u2014 back arrow (if in thread view) + Pimlico wordmark + close. */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-[#0b1738]">
            <div className="flex items-center gap-2 min-w-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleBackToHero}
                  aria-label="Back to menu"
                  className="text-white/70 hover:text-white transition-colors p-1 -ml-1"
                >
                  <BackIcon className="h-4 w-4" />
                </button>
              )}
              <img
                src="/Pimlico_Logo_Inverted.png"
                alt="Pimlico Solutions"
                className="h-5 w-auto"
                loading="eager"
              />
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss chat"
              className="text-white/70 hover:text-white transition-colors p-1 -mr-1"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {/* When the conversation hasn\u2019t started (just Nadia\u2019s
              opener is in the queue), render the Eleanor-style hero.
              Once the user has sent a message or clicked a pill, the
              layout switches to the regular message thread view. */}
          {messages.length <= 1 && !sending ? (
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* Hero — big centred portrait + name + role. AI-native
                  platform, global regulatory intelligence — the dot
                  is always green. */}
              <div className="flex flex-col items-center pt-8 pb-5 px-6">
                <div className="relative">
                  <img
                    src={NADIA_PORTRAIT_SRC}
                    alt="Nadia Olsson"
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                    loading="eager"
                    decoding="async"
                  />
                  <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <p className="mt-3 text-[17px] font-semibold text-[#0b1738]">Nadia Olsson</p>
                <p className="text-[13px] text-gray-600">Enterprise Account Lead</p>
              </div>

              {/* Greeting heading \u2014 no "I\u2019m Nadia" (name is already
                  above). Centered question. Andrew: "maybe what can
                  I help you with today would probably be better". */}
              <div className="px-6 pb-4 text-center">
                <h2 className="text-[22px] font-semibold text-[#0b1738] leading-snug">
                  What can I help you with today?
                </h2>
              </div>

              {/* Stacked single-column pill grid. Andrew: "they should be
                  stacked on top of one another, you can make the text a
                  bit larger". Each tile is full-width so the label has
                  breathing room and the intent is unambiguous. */}
              <div className="px-4 pb-4 flex flex-col gap-2">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr.id}
                    type="button"
                    onClick={() => handleQuickReply(qr)}
                    className="text-left rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-medium text-[#0b1738] hover:border-[#0b1738] hover:bg-[#0b1738]/[0.03] transition-colors shadow-sm"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Thread view \u2014 conventional chat list once the user
            //   engages. Nadia avatar next to his replies.
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
              {messages.map((m, i) => {
                const isUser = m.role === "user";
                return (
                  <div key={i} className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                    {!isUser && (
                      <img
                        src={NADIA_PORTRAIT_SRC}
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
                    src={NADIA_PORTRAIT_SRC}
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
              <div ref={messagesEndRef} aria-hidden="true" />
            </div>
          )}

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
                placeholder="Ask a question&hellip;"
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

function BackIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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
