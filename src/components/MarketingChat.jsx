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
// Rev 48e5 \u2014 two-stage trigger. Andrew: "I want the bubble there
//   almost from the very beginning \u2014 subtle, not obtrusive \u2014 then
//   once you scroll or after a bit of time Nadia comes out a little
//   more gradually."
//
//   STAGE 1: bubble fades in 1.5s after first paint. No panel pop,
//   no peek tip. Just a quiet presence signal \u2014 "someone\u2019s here
//   if you need them."
//
//   STAGE 2: engagement (peek tip or panel auto-open) fires on
//   scroll into #differentiators OR after 25s dwell, whichever
//   first. Scroll trigger gets a 2s settle so it doesn\u2019t feel
//   abrupt the instant a visitor scrolls past.
// Rev 48f2 \u2014 timing bumped. Andrew: "time Nadia a little bit longer
//   so she's not interrupting someone's thought path while they look
//   at something." Bubble now 3s (from 1.5) so the visitor has time
//   to begin reading the hero before any visual element appears.
//   Engagement (peek or auto-open) now 45s (from 25) so her overture
//   lands when the visitor has actually had a chance to absorb the
//   page. Scroll-settle stays tight at 2s because that one fires only
//   when the visitor has actively scrolled into the CTA section \u2014
//   they're past "reading the hero" at that point.
const BUBBLE_APPEAR_MS = 3_000;
const ENGAGEMENT_DWELL_MS = 45_000;
const SCROLL_SETTLE_MS = 2_000;
// Retained alias for any existing call-sites expecting the old name.
const FALLBACK_DWELL_MS = ENGAGEMENT_DWELL_MS;

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
// Rev 48e0 \u2014 order reflects buying psychology:
//   1. Start a free trial  \u2014 highest intent, lowest friction. Try before buy.
//   2. Book a demo         \u2014 qualified prospect wanting a human walkthrough.
//   3. See pricing         \u2014 exploration, calculator on /pricing.
//   4. Chat with Nadia     \u2014 open-ended consultative route (contact-sales).
// Andrew: "start a free trial higher than book demo, contact sales at bottom."
// Rev 48e1 \u2014 /start-trial is a web-app route on xhsdata.ai, NOT a
//   landing-page route on pimlicosolutions.com. Previous rev sent the
//   visitor to pimlicosolutions.com/start-trial which 404\u2019d. Must be
//   an absolute URL to the xhsdata.ai sign-up flow.
const APP_HOST = "https://xhsdata.ai";
const QUICK_REPLIES = [
  { id: "start_trial", label: "Start a free trial",    redirect: `${APP_HOST}/start-trial` },
  { id: "book_demo",   label: "Book a demo",           redirect: "/contact?intent=demo" },
  { id: "see_pricing", label: "See pricing",           redirect: "/pricing" },
  /* Rev 48e4 \u2014 Contact sales renders an inline mini-form in the
     thread instead of routing through the LLM. Andrew: "just
     include a form here, she says happy to assist and they fill
     it out." Prompt drops "about our use case." */
  { id: "use_case",    label: "Contact sales",         contactForm: true,                      prompt: "I\u2019d like to talk to sales." },
  /* Rev 48f8 \u2014 IA audit: dedicated security/privacy path. Without
     this, vuln disclosures and DSARs had no surface on Nadia. */
  { id: "security_privacy", label: "Security or privacy", redirect: "/contact?intent=security" },
];

// Rev 48e0 \u2014 per-page contextual tip. When a visitor arrives with
//   chat=continue (clicked a pill from a prior page), we show a small
//   speech bubble extending from Nadia so she feels like a guide, not
//   a dropped-the-ball redirect. Auto-dismisses after 14s or on tap.
//   Keep lines short \u2014 one-sentence guidance, plain English, no hype.
//   Never invent features or jurisdictions here; this is signposting
//   only. Tap-through opens the full panel so the guide message then
//   continues as a chat thread.
const POST_REDIRECT_TIPS = {
  "/pricing":
    "Defaults to annual + global coverage. Tweak the slider + regions, then the calculator updates live.",
  "/start-trial":
    "I\u2019ll stay alongside while you set up. Reopen this chat for a walk-through.",
  "/contact":
    "The form gets a reply within one business day. Reopen this chat for anything else.",
  "/quote":
    "I\u2019ll pull together a tailored number. Reopen this chat to walk through coverage or seat assumptions.",
};

function pickPostRedirectTip(pathname) {
  if (!pathname) return null;
  for (const prefix of Object.keys(POST_REDIRECT_TIPS)) {
    if (pathname.startsWith(prefix)) return POST_REDIRECT_TIPS[prefix];
  }
  return null;
}

// Rev 48e2 \u2014 when the visitor taps the peek or the bubble on a
//   focused page, seed the panel with a context-aware first assistant
//   turn + structured follow-ups SO SHE ACTUALLY ENGAGES WITH THE
//   TOPIC SHE JUST RAISED. Andrew: "when I click her again she just
//   goes back to the normal options, she\u2019s not engaging in the
//   discussion at all." The seed uses the same framing as the peek
//   tip but adds a sharp qualifying question so the conversation has
//   forward motion immediately.
const PAGE_SEED_MESSAGES = {
  "/pricing": {
    content:
      "Defaults to annual billing + global coverage so the number you see is what we\u2019d actually quote. Tweak team size, regions, or verticals and it updates live. What\u2019s the team shape you\u2019re sizing for?",
    followUps: ["Under 5 people", "5\u201325 people", "25+ people", "What\u2019s in the trial?"],
  },
  "/contact": {
    content:
      "The form gets you a reply within one business day. If you\u2019d rather talk it through now, tell me what you\u2019re exploring \u2014 pricing for a specific team, a trial, or scoping a custom setup.",
    followUps: ["Evaluating vendors", "Replacing a tool", "Scoping a trial", "Just curious"],
  },
  "/start-trial": {
    content:
      "You\u2019re one form away from a live workspace. I can walk you through what\u2019s gated on the trial, match a plan shape to your team, or book a proper scoping call \u2014 whichever is more useful right now.",
    followUps: [
      "What\u2019s in the trial?",
      "Pick the right plan for my team",
      "Book a demo",
      "Talk to sales",
    ],
  },
  "/quote": {
    content:
      "Tailored quotes take a minute \u2014 team size, regions, verticals. Tell me your shape and I\u2019ll stitch it together; or walk through the calculator and I\u2019ll match it.",
    followUps: ["Start from team size", "Start from coverage", "Match an existing vendor", "Enterprise procurement"],
  },
};

function pickPageSeed(pathname) {
  if (!pathname) return null;
  for (const prefix of Object.keys(PAGE_SEED_MESSAGES)) {
    if (pathname.startsWith(prefix)) return PAGE_SEED_MESSAGES[prefix];
  }
  return null;
}

/* Rev 48ed \u2014 classify a follow-up pill and redirect to the right
   conversion surface instead of wasting a Claude turn on a text-plus-
   link reply. Pattern-matches the pill label. Landing uses APP_HOST
   for trial (xhsdata.ai/start-trial, cross-domain) and same-origin
   paths for demo + pricing. */
function classifyFollowUp(label) {
  const lower = String(label).toLowerCase().trim();
  if (/\b(start|begin|kick\s*off)\b.*\btrial\b/.test(lower) || lower === "14-day trial") {
    return { kind: "redirect", url: `${APP_HOST}/start-trial` };
  }
  if (/\b(book|schedule)\b.*\bdemo\b/.test(lower) || lower.includes("walkthrough demo")) {
    return { kind: "redirect", url: "/contact?intent=demo" };
  }
  // Rev 48f2 \u2014 only explicit "Talk to sales" / "Contact sales"
  //   auto-redirect. "25+" team-size pill stays with Claude so
  //   context drives the recommendation, not the numeric suffix.
  if (/\btalk to sales\b/.test(lower) || /\bcontact sales\b/.test(lower)) {
    return { kind: "redirect", url: "/contact?intent=sales" };
  }
  if (lower === "see pricing" || lower === "show pricing" || lower === "pricing" || lower === "see pricing calculator") {
    return { kind: "redirect", url: "/pricing" };
  }
  return null;
}

// Rev 48e1 \u2014 extract the trailing "NEXT: A | B | C" line from a
//   Claude reply. Returns clean text (reply with NEXT: line removed)
//   + an array of up to 4 follow-up options, de-duped and trimmed.
//   Safe: if no NEXT: line is present, returns the original text +
//   an empty array, so the UI simply renders a free-text bubble.
function parseFollowUps(rawReply) {
  if (typeof rawReply !== "string" || !rawReply.trim()) {
    return { cleanText: String(rawReply ?? ""), followUps: [] };
  }
  // Match NEXT: line either at the very end or on its own line. Case
  //   insensitive. Tolerant of trailing whitespace / multiple newlines.
  const match = rawReply.match(/\n?\s*NEXT:\s*(.+?)\s*$/im);
  if (!match) return { cleanText: rawReply.trim(), followUps: [] };
  const cleanText = rawReply.slice(0, match.index).trim();
  const raw = match[1];
  const followUps = raw
    .split("|")
    .map((o) => o.trim().replace(/^[-*]\s*/, ""))
    .filter((o) => o.length > 0 && o.length <= 80)
    .slice(0, 4);
  return { cleanText, followUps };
}

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
  // Rev 48e0 \u2014 contextual speech-bubble that pops out of Nadia on
  //   focused-page arrivals (post-redirect). Acts as a guide. Null
  //   when not showing.
  const [peekTip, setPeekTip] = useState(null);
  // Rev 48e5 \u2014 soft idle nudge above the composer. Two fires max:
  //   first at 120s idle, second at 240s after dismissal. After two
  //   dismissals we stop. Andrew: "it doesn\u2019t have to happen if
  //   they close it out unless we think it should \u2014 I\u2019m open." My
  //   view: one re-fire is the right balance. Respects their first
  //   dismissal, but catches people who are genuinely stuck.
  const [idleNudgeVisible, setIdleNudgeVisible] = useState(false);
  const [idleNudgeDismissCount, setIdleNudgeDismissCount] = useState(0);
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
          // Rev 48e0 \u2014 surface a contextual guide tip alongside the
          //   bubble on focused pages so Nadia feels like she\u2019s
          //   walking the visitor through, not dumping them. Mobile
          //   gets a tip too (same rules as above \u2014 no panel auto-
          //   open, just an unobtrusive speech bubble they can tap
          //   through or dismiss).
          const tip = pickPostRedirectTip(path);
          if (tip) {
            // Small delay so the bubble fade-in and peek feel
            //   choreographed rather than landing simultaneously.
            window.setTimeout(() => {
              setPeekTip(tip);
              trackEvent(sessionIdRef.current, "peek_tip_shown", { path });
            }, 900);
          }
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

    // Rev 48e5 \u2014 two-stage trigger.
    //
    //   STAGE 1 (showBubble): subtle presence. Bubble fades in at
    //   BUBBLE_APPEAR_MS. Just the brand circle + green dot. No
    //   panel, no peek tip. Visitor sees "someone is here" without
    //   interruption. Equivalent to an Intercom launcher always-on.
    //
    //   STAGE 2 (engage): the panel auto-opens or the peek tip
    //   appears. Fires either on scroll into #differentiators
    //   (after a 2s settle so it doesn\u2019t feel abrupt mid-scroll)
    //   or at ENGAGEMENT_DWELL_MS dwell total, whichever first.
    const showBubble = (triggerReason) => {
      if (bubbleVisibleRef.current) return;
      setBubbleVisible(true);
      bubbleVisibleRef.current = true;
      markBubbleSeenThisSession();
      trackEvent(sessionIdRef.current, "bubble_appeared", { trigger: triggerReason, path: currentPath });
    };

    const engage = (triggerReason) => {
      // Must have bubble shown already; if not, show it now so the
      //   visitor sees a coherent sequence (bubble \u2192 panel/peek).
      if (!bubbleVisibleRef.current) showBubble(triggerReason);
      if (!autoOpenedRecently() && !suppressAutoOpen) {
        setOpen(true);
        try { window.localStorage.setItem(AUTO_OPENED_KEY, String(Date.now())); } catch {}
        trackEvent(sessionIdRef.current, "auto_opened", { trigger: triggerReason });
        return;
      }
      // Auto-open suppressed (focused page or mobile). Surface a
      //   contextual peek so Nadia is present but quiet.
      const tip = pickPostRedirectTip(currentPath);
      if (tip && !peekTip) {
        setPeekTip(tip);
        trackEvent(sessionIdRef.current, "peek_tip_shown", { trigger: triggerReason, path: currentPath });
      }
    };

    // STAGE 1 \u2014 bubble appears quickly, as a subtle presence.
    const bubbleTimer = window.setTimeout(() => {
      showBubble("initial_dwell");
    }, BUBBLE_APPEAR_MS);

    // STAGE 2a \u2014 scroll trigger. When #differentiators enters the
    //   viewport, wait 2s (SCROLL_SETTLE_MS) before engaging so the
    //   visitor has a moment to stop scrolling and land on the
    //   section first.
    const triggerEl = document.querySelector(SCROLL_TRIGGER_SELECTOR);
    let observer = null;
    let scrollSettleTimer = null;
    if (triggerEl && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            scrollSettleTimer = window.setTimeout(() => {
              engage("scroll_into_view_differentiators");
            }, SCROLL_SETTLE_MS);
            observer?.disconnect();
            break;
          }
        }
      }, { threshold: 0, rootMargin: "0px 0px -15% 0px" });
      observer.observe(triggerEl);
    }

    // STAGE 2b \u2014 long-dwell fallback in case the visitor never
    //   scrolls to the trigger section.
    const dwellTimer = window.setTimeout(() => {
      engage("engagement_dwell_25s");
    }, ENGAGEMENT_DWELL_MS);

    return () => {
      observer?.disconnect();
      window.clearTimeout(bubbleTimer);
      window.clearTimeout(dwellTimer);
      if (scrollSettleTimer) window.clearTimeout(scrollSettleTimer);
    };
  }, []);

  // Rev 2026-04-23 — external-trigger bridge. Any surface on the marketing
  //   site (paywall CTA, pricing CTA, etc.) can open Nadia by firing
  //   `window.dispatchEvent(new CustomEvent("pimlico:open-nadia", {
  //     detail: { hint?: string, source?: string } }))`. `hint` seeds a
  //   user-side message so Nadia has context on what they want guidance
  //   on; `source` is attribution for analytics.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (ev) => {
      const detail = (ev && ev.detail) || {};
      setBubbleVisible(true);
      bubbleVisibleRef.current = true;
      markBubbleSeenThisSession();
      setOpen(true);
      setPeekTip(null);
      trackEvent(sessionIdRef.current, "auto_opened", {
        trigger: "external_event",
        source: typeof detail.source === "string" ? detail.source.slice(0, 60) : null,
      });
      if (typeof detail.hint === "string" && detail.hint.trim().length > 0) {
        const hint = detail.hint.trim().slice(0, 240);
        setInput(hint);
      }
    };
    window.addEventListener("pimlico:open-nadia", handler);
    return () => window.removeEventListener("pimlico:open-nadia", handler);
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
      // Opening the panel supersedes any peek tip \u2014 the guidance
      //   now lives in the full chat surface.
      setPeekTip(null);
    }
  }, [open]);

  // Rev 48e0 \u2014 auto-dismiss the peek tip after 14s. Long enough to
  //   actually read, short enough that it doesn\u2019t become visual
  //   noise. Visitor can also dismiss manually via the peek\u2019s X.
  useEffect(() => {
    if (!peekTip) return;
    const t = window.setTimeout(() => setPeekTip(null), 14_000);
    return () => window.clearTimeout(t);
  }, [peekTip]);

  // Rev 48e3 \u2014 idle nudge. Andrew: previous 45s-chat-message version
  //   "feels pushy" and "should probably be a slightly different
  //   screen, not just another message under this." Now:
  //     1. Delay bumped 45s \u2192 120s so the nudge only fires when
  //        the visitor is genuinely stalled, not mid-thought.
  //     2. Rendered as a slim inline banner ABOVE the composer, not
  //        as a fresh assistant bubble in the thread. Two actions +
  //        a dismiss X; feels like a softer shoulder-tap.
  //     3. One-shot per open session \u2014 once dismissed or actioned,
  //        it doesn\u2019t re-fire.
  useEffect(() => {
    if (!open) return;
    if (idleNudgeVisible) return;
    if (idleNudgeDismissCount >= 2) return; // two-strikes rule: quit after the re-fire
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role !== "assistant") return;
    // First fire at 120s idle. Re-fire waits 240s after the prior
    //   dismissal to give proper breathing room before nudging again.
    const delay = idleNudgeDismissCount === 0 ? 120_000 : 240_000;
    const t = window.setTimeout(() => {
      setIdleNudgeVisible(true);
      trackEvent(sessionIdRef.current, "idle_nudge_shown", {
        after_turn_index: messages.length - 1,
        fire_number: idleNudgeDismissCount + 1,
      });
    }, delay);
    return () => window.clearTimeout(t);
  }, [messages, open, idleNudgeVisible, idleNudgeDismissCount]);

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
    // Rev 48e3 \u2014 any user send resets the idle nudge state so if
    //   they hit another quiet window later, the nudge can re-arm.
    setIdleNudgeVisible(false);
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
          content: "Chat is briefly over capacity. Pick a route below and I'll still get you where you need to go.",
          followUps: ["Book a demo", "Start a 14-day trial", "See pricing", "Talk to sales"],
          ts: Date.now(),
        }]);
        return;
      }
      const data = await res.json().catch(() => null);
      const rawReply = data?.text ?? "Connection is slow right now. Pick a route below and I'll still route you properly.\n\nNEXT: Book a demo | Start a 14-day trial | See pricing | Talk to sales";
      // Rev 48e1 \u2014 parse structured NEXT: options from the reply so
      //   every assistant turn offers 2\u20134 tappable follow-ups. Andrew:
      //   "everything Nadia does should be structured, I should always
      //   be routed in the direction we need and want to." The edge
      //   function system prompt instructs Claude to append a line of
      //   the form:  NEXT: Option A | Option B | Option C
      //   We split the reply there, render the clean text as the
      //   bubble, and render the pipe-separated options as pills
      //   underneath.
      const { cleanText, followUps } = parseFollowUps(rawReply);
      const replyTurn = {
        role: "assistant",
        content: cleanText,
        followUps,
        ts: Date.now(),
        toolInvocations: data?.tool_invocations,
      };
      setMessages((curr) => [...curr, replyTurn]);
      const trialLink = data?.tool_invocations?.find((t) => t.sideEffect?.kind === "trial_link");
      if (trialLink?.sideEffect?.url) setTrialUrl(trialLink.sideEffect.url);
    } catch (err) {
      console.error("[MarketingChat] send failed", err);
      setMessages((curr) => [...curr, {
        role: "assistant",
        content: "Something went sideways on my end. Pick a route below and I'll still route you properly.",
        followUps: ["Book a demo", "Start a 14-day trial", "Talk to sales"],
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
      action: option.redirect ? "redirect" : option.contactForm ? "contact_form" : "prompt",
    });
    if (option.redirect) {
      window.location.href = buildRedirectUrl(option.redirect, sessionIdRef.current);
      return;
    }
    // Rev 48e4 \u2014 contact-form pill bypasses the LLM. Pushes a
    //   deterministic user-turn + assistant-turn with an inline form
    //   so the visitor goes straight from pill click to capture.
    if (option.contactForm) {
      setMessages((curr) => [
        ...curr,
        { role: "user", content: option.prompt ?? "I\u2019d like to talk to sales.", ts: Date.now() },
        {
          role: "assistant",
          content: "Drop your details in. I\u2019ll pick it up personally and come back inside a business day.",
          contactForm: true,
          contactFormStatus: "idle",
          ts: Date.now() + 1,
        },
      ]);
      setIdleNudgeVisible(false);
      return;
    }
    void sendMessage(option.prompt, { via: "quick_reply", option_id: option.id });
  }, [sendMessage]);

  // Rev 48e4 \u2014 contact-form submit handler. Fires the marketing-chat
  //   event endpoint with contact_form_submitted + form fields.
  //   Backend inserts into marketing_leads and pings the BD pipeline.
  //   Client flips the turn\u2019s status from idle \u2192 submitting \u2192
  //   submitted (or error) to swap form for a confirmation.
  const submitContactForm = useCallback(async (turnIndex, form) => {
    setMessages((curr) => curr.map((m, i) => i === turnIndex ? { ...m, contactFormStatus: "submitting" } : m));
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
          event: true,
          event_type: "contact_form_submitted",
          session_id: sessionIdRef.current,
          source_path: window.location.pathname + window.location.search,
          persona_id: "nadia-olsson",
          origin_site: "pimlicosolutions.com",
          ts: Date.now(),
          contact_name: form.name,
          contact_email: form.email,
          contact_company: form.company,
          contact_message: form.message,
          ...utm,
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error(`status_${res.status}`);
      // Rev 48e6 \u2014 post-submit keeps momentum. The visitor just gave
      //   us their details; they\u2019re high intent. Instead of going
      //   silent, offer three concrete routes + a graceful out.
      setMessages((curr) => curr.map((m, i) => i === turnIndex ? {
        ...m,
        contactFormStatus: "submitted",
        content: "Got your note. I\u2019ve logged it and I\u2019ll come back inside a business day. While you\u2019re here, anything I can clarify about pricing, trial, or coverage?",
        followUps: ["What\u2019s in the trial?", "Which jurisdictions are covered?", "See pricing shape", "I\u2019m good for now"],
      } : m));
    } catch (err) {
      console.error("[MarketingChat] contact form submit failed", err);
      setMessages((curr) => curr.map((m, i) => i === turnIndex ? { ...m, contactFormStatus: "error" } : m));
    }
  }, []);

  if (!bubbleVisible && !open) return null;

  return (
    <>
      {/* Rev 48e0 \u2014 bubble is hidden when the panel is open. The
          panel\u2019s own X handles close, and earlier we had both the
          bubble rendering a big X icon AND the panel header X, which
          Andrew flagged as a duplicate close affordance. Single close
          surface now. Bubble always shows the Pimlico brandmark
          (never transforms), so Nadia\u2019s presence reads as stable
          across pages.
       */}
      {!open && (
        <div
          className="fixed bottom-5 right-5 z-40"
          style={{ animation: "fadeIn 0.4s ease-out" }}
        >
          <button
            type="button"
            onClick={() => {
              /* Rev 48f3 \u2014 bubble click just opens the panel; hero
                 adapts to page context while preserving full layout.
                 No more pushing a synthetic assistant message. */
              setOpen(true);
              trackEvent(sessionIdRef.current, "manually_opened", {
                messages_in_conversation: messages.length,
                path: typeof window !== "undefined" ? window.location.pathname : null,
              });
            }}
            aria-label="Open chat with Nadia Olsson"
            /* Rev 48e2 \u2014 overflow-hidden removed. On a rounded-full
               element overflow-hidden clips to the CIRCLE SHAPE, which
               half-ate the green online dot. The Pimlico logo inside
               is already constrained by object-contain + max-h/max-w
               so no clipping is needed for the image. */
            className="relative h-16 w-16 rounded-full shadow-xl flex items-center justify-center transition-all ring-2 ring-white/30 bg-[#0b1738] text-white hover:scale-105"
          >
            <img
              src="/Pimlico_Logo_Inverted.png"
              alt="Pimlico"
              className="max-h-9 max-w-[44px] object-contain pointer-events-none select-none"
              loading="eager"
              draggable={false}
            />
          </button>
          {/* Green online dot \u2014 sits at the edge of the bubble with
              a small offset so it extends cleanly beyond the circle.
              Ring uses the bubble colour to create a visual gap
              between dot and bubble. pointer-events-none so clicks
              pass through to the bubble. */}
          <span
            aria-hidden="true"
            className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-[#0b1738] pointer-events-none"
            style={{ animation: "onlinePulse 2.2s ease-in-out infinite" }}
          />
        </div>
      )}

      {/* Peek speech bubble \u2014 contextual guide tip that extends from
          Nadia on focused-page arrivals. Rev 48e1 \u2014 now includes
          Nadia\u2019s portrait so she feels present, not anonymous. */}
      {!open && bubbleVisible && peekTip && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 right-5 z-40 max-w-[320px] rounded-2xl bg-white text-[#0b1738] shadow-xl ring-1 ring-black/5 border border-gray-200"
          style={{ animation: "fadeIn 0.35s ease-out" }}
        >
          <button
            type="button"
            onClick={() => {
              setPeekTip(null);
              trackEvent(sessionIdRef.current, "peek_tip_dismissed", {});
            }}
            aria-label="Dismiss tip"
            className="absolute top-1.5 right-1.5 text-gray-400 hover:text-gray-700 transition-colors p-1"
          >
            <XIcon className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => {
              /* Rev 48f3 \u2014 peek tap opens the panel; hero adapts to
                 page context while preserving full portrait-name-
                 heading-pills layout. No synthetic message push. */
              setOpen(true);
              trackEvent(sessionIdRef.current, "peek_tip_expanded", {
                path: typeof window !== "undefined" ? window.location.pathname : null,
              });
              setPeekTip(null);
            }}
            className="flex w-full items-start gap-3 px-4 py-3 pr-7 text-left"
          >
            <div className="relative shrink-0">
              <img
                src={NADIA_PORTRAIT_SRC}
                alt=""
                aria-hidden="true"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                loading="eager"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
              />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold tracking-wide text-[#0b1738]/60 mb-0.5">
                Nadia {"\u2014"} Enterprise Account Lead
              </span>
              <span className="block text-[13px] leading-relaxed">
                {peekTip}
              </span>
            </div>
          </button>
          {/* Little tail pointing down towards the bubble */}
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-white border-r border-b border-gray-200"
          />
        </div>
      )}

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
          className="fixed bottom-20 right-4 z-40 w-[400px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden flex flex-col"
        >
          {/* Top bar \u2014 Rev 48e1 \u2014 shows Nadia\u2019s face + name + online
              dot when the visitor is in thread view, so they know
              who they\u2019re talking to at a glance. On the hero view
              (no messages yet) we keep the clean Pimlico wordmark
              because the big centred portrait below takes care of
              identity. */}
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
              {messages.length > 0 ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={NADIA_PORTRAIT_SRC}
                      alt=""
                      aria-hidden="true"
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-white/20"
                      loading="eager"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-[1.5px] ring-[#0b1738]"
                    />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <p className="text-[13px] font-semibold text-white truncate">Nadia Olsson</p>
                    {/* Rev 48e3 \u2014 "\u00b7 online" removed. Andrew: "I don\u2019t
                        think 'online' is really necessary \u2014 we see that
                        she is." The green dot on the avatar already
                        signals presence. */}
                    <p className="text-[10px] text-white/60 truncate">
                      Enterprise Account Lead
                    </p>
                  </div>
                </div>
              ) : (
                <img
                  src="/Pimlico_Logo_Inverted.png"
                  alt="Pimlico Solutions"
                  className="h-5 w-auto"
                  loading="eager"
                />
              )}
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

          {/* Rev 48e2 \u2014 hero only when the thread is genuinely empty.
              A seeded page-context opener (messages.length === 1 with
              role: "assistant") should show the thread view so the
              visitor sees the opener + follow-up pills and can engage
              immediately \u2014 not the 4-pill menu which was the dead-
              end Andrew flagged. */}
          {messages.length === 0 && !sending ? (() => {
            /* Rev 48f3 \u2014 hero stays the full layout on every page;
               only the heading + pills adapt to page context.
               Andrew: "when I tap Nadia I want her to look like she
               did on the front page but with new pills adapted to
               this context." */
            const heroPath = typeof window !== "undefined" ? window.location.pathname : "";
            const heroSeed = pickPageSeed(heroPath);
            const heroHeading = heroSeed?.content ?? "What can I help you with today?";
            const heroSubhead = heroSeed ? null : "Pick a route to get started.";
            return (
              <div className="flex-1 overflow-y-auto flex flex-col">
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
                  <p className="mt-3 font-display text-[18px] font-medium text-[#0b1738]">Nadia Olsson</p>
                  <p className="text-[13px] text-gray-600">Enterprise Account Lead</p>
                </div>

                <div className="px-6 pb-4 text-center">
                  {/* Rev 2026-04-23 pt14 — Andrew: "why is this bold,
                      please fix". Dropped from font-medium → font-normal
                      and size from 22px → 18px so the hero copy reads
                      as a conversational greeting, not a headline slab. */}
                  <h2 className="font-display text-[18px] font-normal text-[#0b1738] leading-snug">
                    {heroHeading}
                  </h2>
                  {heroSubhead && (
                    <p className="mt-1.5 text-[12px] text-gray-500">
                      {heroSubhead}
                    </p>
                  )}
                </div>

                <div className="px-4 pb-4 flex flex-col gap-2">
                  {/* Rev 2026-04-23 pt14 — Andrew: "these boxes should be
                      a lighter colour so people can see them". Bumped
                      border from gray-200 → gray-300 + switched bg from
                      pure white → gray-50 tint so the cards sit visibly
                      on the white panel instead of disappearing into it.
                      Kept navy text for contrast. */}
                  {heroSeed
                    ? heroSeed.followUps.map((fu, idx) => (
                        <button
                          key={`seed-${idx}-${fu}`}
                          type="button"
                          onClick={() => {
                            const classified = classifyFollowUp(fu);
                            if (classified) {
                              trackEvent(sessionIdRef.current, "page_seed_pill_redirect", { label: fu, path: heroPath, target_url: classified.url });
                              window.location.href = buildRedirectUrl(classified.url, sessionIdRef.current);
                              return;
                            }
                            trackEvent(sessionIdRef.current, "page_seed_pill_clicked", { label: fu, path: heroPath });
                            void sendMessage(fu, { via: "quick_reply", option_id: "page_seed" });
                          }}
                          className="text-left rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-[14px] font-medium text-[#0b1738] hover:border-[#0b1738] hover:bg-white transition-colors shadow-sm"
                        >
                          {fu}
                        </button>
                      ))
                    : QUICK_REPLIES.map((qr) => (
                        <button
                          key={qr.id}
                          type="button"
                          onClick={() => handleQuickReply(qr)}
                          className="text-left rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-[14px] font-medium text-[#0b1738] hover:border-[#0b1738] hover:bg-white transition-colors shadow-sm"
                        >
                          {qr.label}
                        </button>
                      ))}
                </div>
              </div>
            );
          })() : (
            // Thread view \u2014 conventional chat list once the user
            //   engages. Rev 48e1 \u2014 enlarged avatars (h-8 w-8) + green
            //   dot so Nadia\u2019s presence carries through the thread.
            //   Also renders structured NEXT: follow-up pills under
            //   the most recent assistant turn that has any.
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
              {messages.map((m, i) => {
                const isUser = m.role === "user";
                const isLastAssistant = !isUser && i === messages.length - 1;
                return (
                  <div key={i} className="space-y-2">
                    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                      {!isUser && (
                        <div className="relative shrink-0">
                          <img
                            src={NADIA_PORTRAIT_SRC}
                            alt=""
                            aria-hidden="true"
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-gray-50"
                          />
                        </div>
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
                    {/* Rev 48e1 \u2014 structured follow-up pills. Only
                        renders on the most recent assistant turn so
                        stale pills from earlier turns don\u2019t clutter
                        the thread. Tap sends the pill text as a new
                        user message and lets Nadia pick it up.
                        Rev 48e4 \u2014 suppressed on contact-form turns
                        (the form is the action). */}
                    {/* Rev 48e6 \u2014 follow-ups render on a contact-form
                        turn IF status === submitted, so after the
                        form is sent the pills take over as the
                        post-action menu. */}
                    {isLastAssistant && Array.isArray(m.followUps) && m.followUps.length > 0 && (!m.contactForm || m.contactFormStatus === "submitted") && (
                      <div className="flex flex-col gap-2 pl-10">
                        {m.followUps.map((fu, j) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() => {
                              /* Rev 48e6 \u2014 dismissal pills close locally. */
                              const lower = fu.toLowerCase();
                              if (lower.includes("i\u2019m good") || lower.includes("im good") || lower.includes("no thanks")) {
                                trackEvent(sessionIdRef.current, "follow_up_dismissed", { option: fu, turn_index: i });
                                handleDismiss();
                                return;
                              }
                              /* Rev 48ed \u2014 trial / demo / generic pricing
                                 pills redirect directly; don\u2019t waste a
                                 Claude turn. */
                              const classified = classifyFollowUp(fu);
                              if (classified) {
                                trackEvent(sessionIdRef.current, "follow_up_redirect", {
                                  option: fu,
                                  turn_index: i,
                                  target_url: classified.url,
                                });
                                window.location.href = buildRedirectUrl(classified.url, sessionIdRef.current);
                                return;
                              }
                              trackEvent(sessionIdRef.current, "follow_up_clicked", {
                                option: fu,
                                turn_index: i,
                              });
                              void sendMessage(fu, { via: "quick_reply", option_id: "follow_up" });
                            }}
                            className="text-left rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-medium text-[#0b1738] hover:border-[#0b1738] hover:bg-[#0b1738]/[0.03] transition-colors shadow-sm"
                          >
                            {fu}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Rev 48e4 \u2014 inline contact-sales form. Renders
                        when the assistant turn has contactForm: true
                        AND the form hasn\u2019t been submitted. After
                        submission the turn\u2019s content swaps to the
                        confirmation and this block stops rendering. */}
                    {m.contactForm && m.contactFormStatus !== "submitted" && (
                      <div className="pl-10">
                        <ContactSalesForm
                          status={m.contactFormStatus ?? "idle"}
                          onSubmit={(form) => submitContactForm(i, form)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              {sending && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="relative shrink-0">
                    <img
                      src={NADIA_PORTRAIT_SRC}
                      alt=""
                      aria-hidden="true"
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-gray-50"
                    />
                  </div>
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
                <span>Start your 14-day trial &mdash; no card required</span>
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Rev 48f5 \u2014 Nadia is pill-guided only. No free-text composer.
              Andrew: "I don't want to give everybody that option just to type
              \u2014 it creates odd lots of problems." Every path routes
              through pills, NEXT: follow-ups, or the ContactSalesForm.
              If the user needs to say something the pills don't cover,
              they pick "Talk to sales" which opens the structured form. */}

          {/* Rev 48f4 \u2014 idle nudge modal overlay (replaces the thin
              banner-above-composer treatment). Andrew: "the still-there
              thing should be something that pops up over the whole
              chat window." Backdrop-blurs the thread, centred card,
              two stacked CTAs. Dismiss-sticky via idleNudgeDismissCount
              (two fires per session max). */}
          {idleNudgeVisible && (
            <div
              role="dialog"
              aria-label="Still there?"
              className="absolute inset-0 z-50 flex items-center justify-center px-5 bg-[#020617]/55 backdrop-blur-[2px]"
              style={{ animation: "fadeIn 0.2s ease-out" }}
            >
              <div className="w-full rounded-2xl bg-white shadow-xl border border-gray-200 p-5">
                <div className="flex items-start gap-3">
                  <img
                    src={NADIA_PORTRAIT_SRC}
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white shrink-0"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0b1738]">Still there?</p>
                    <p className="mt-1 text-[13px] text-[#475569] leading-snug">
                      Want me to summarise what we&rsquo;ve covered and email you the next step? Or carry on whenever you&rsquo;re ready.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIdleNudgeVisible(false);
                      setIdleNudgeDismissCount((c) => c + 1);
                      trackEvent(sessionIdRef.current, "idle_nudge_dismissed", { fire_number: idleNudgeDismissCount + 1 });
                    }}
                    aria-label="Dismiss"
                    className="shrink-0 text-gray-400 hover:text-gray-700 -mt-1 -mr-1 p-1"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIdleNudgeVisible(false);
                      setIdleNudgeDismissCount((c) => c + 1);
                      trackEvent(sessionIdRef.current, "idle_nudge_actioned", { action: "summarise_email" });
                      void sendMessage("Summarise what we\u2019ve covered and send the next step to my email.", { via: "quick_reply", option_id: "idle_nudge_summarise" });
                    }}
                    className="w-full rounded-xl bg-[#0b1738] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#0b1738]/90 transition-colors"
                  >
                    Summarise & email me
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdleNudgeVisible(false);
                      setIdleNudgeDismissCount((c) => c + 1);
                      trackEvent(sessionIdRef.current, "idle_nudge_dismissed", { fire_number: idleNudgeDismissCount + 1, via: "still_here" });
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-medium text-[#0b1738] hover:bg-gray-50 transition-colors"
                  >
                    I&rsquo;m still here
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes onlinePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.75; transform: scale(0.9); }
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

// Rev 48e4 \u2014 inline contact-sales form rendered directly in the
//   chat thread under Nadia\u2019s "Happy to assist" bubble. Four fields
//   (name, company, work email, optional message). Lightweight
//   validation \u2014 required + basic email regex. Submit delegates
//   to parent; status controls the visual state.
function ContactSalesForm({ status, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const disabled = status === "submitting" || status === "submitted";
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = !disabled && name.trim() && emailLooksValid && company.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        void onSubmit({ name: name.trim(), email: email.trim(), company: company.trim(), message: message.trim() });
      }}
      className="mt-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm space-y-2"
    >
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#0b1738]/60 mb-0.5">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
            required
            autoComplete="name"
            className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[12px] text-[#0b1738] focus:outline-none focus:ring-1 focus:ring-[#0b1738] disabled:opacity-50"
          />
        </label>
        <label className="block">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#0b1738]/60 mb-0.5">Company</span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={disabled}
            required
            autoComplete="organization"
            className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[12px] text-[#0b1738] focus:outline-none focus:ring-1 focus:ring-[#0b1738] disabled:opacity-50"
          />
        </label>
      </div>
      <label className="block">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#0b1738]/60 mb-0.5">Work email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          required
          autoComplete="email"
          className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[12px] text-[#0b1738] focus:outline-none focus:ring-1 focus:ring-[#0b1738] disabled:opacity-50"
        />
      </label>
      <label className="block">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#0b1738]/60 mb-0.5">Anything helpful to know? <span className="text-[#0b1738]/40 font-normal">(optional)</span></span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          rows={2}
          className="w-full resize-none rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[12px] text-[#0b1738] focus:outline-none focus:ring-1 focus:ring-[#0b1738] disabled:opacity-50"
        />
      </label>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-gray-500">
          {status === "error" ? "Couldn\u2019t send \u2014 try once more?" : "Reply within one business day."}
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center rounded-full bg-[#0b1738] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[#0b1738]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {status === "submitting" ? "Sending\u2026" : "Send it to Nadia"}
        </button>
      </div>
    </form>
  );
}
