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

const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const AUTO_OPEN_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const ENGAGEMENT_DWELL_MS = 45_000;

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

function trackEvent(sessionId, eventType, metadata = {}) {
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

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  // 45s dwell → bubble + auto-open (unless cooldown).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionIdRef.current) return;
    if (dismissedRecently()) return;

    const timer = window.setTimeout(() => {
      setBubbleVisible(true);
      trackEvent(sessionIdRef.current, "bubble_appeared", { dwell_ms: ENGAGEMENT_DWELL_MS });
      if (!autoOpenedRecently()) {
        setOpen(true);
        try { window.localStorage.setItem(AUTO_OPENED_KEY, String(Date.now())); } catch {}
        trackEvent(sessionIdRef.current, "auto_opened", { dwell_ms: ENGAGEMENT_DWELL_MS });
      }
    }, ENGAGEMENT_DWELL_MS);

    return () => window.clearTimeout(timer);
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
      {/* Pimlico-logo bubble */}
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
        aria-label={open ? "Close chat" : "Open chat with Matthew"}
        className={`fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
          open
            ? "bg-white text-[#0b1738] border border-gray-200"
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
              className="h-7 w-auto"
              loading="eager"
            />
          )}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Matthew"
          className="fixed bottom-20 right-4 z-40 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 bg-[#0b1738] text-white">
            <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center text-xs font-semibold">
              ML
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">Matthew Langston</p>
              <p className="text-[11px] opacity-75">VP Sales &middot; Pimlico Solutions</p>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss chat"
              className="text-white/70 hover:text-white transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[#0b1738] text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-[#0b1738] rounded-bl-md shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0b1738]/60 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0b1738]/60 animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0b1738]/60 animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick-reply chips — only while conversation is one-turn deep */}
            {messages.length === 1 && !sending && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr.id}
                    type="button"
                    onClick={() => handleQuickReply(qr)}
                    className="rounded-full border border-[#0b1738]/30 bg-white px-2.5 py-1 text-[11px] font-medium text-[#0b1738] hover:bg-[#0b1738] hover:text-white transition-colors"
                  >
                    {qr.label}
                  </button>
                ))}
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
