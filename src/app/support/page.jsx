import Link from "next/link";

export const metadata = {
  title: "Support - XHS\u2122 Copilot",
  description: "Troubleshooting and self-help for XHS\u2122 Copilot users.",
};

const TROUBLESHOOTING = [
  {
    id: "hard-refresh",
    title: "Hard refresh your browser",
    desc: "If you're seeing stale data or the page isn't loading correctly, a hard refresh forces your browser to reload everything from scratch.",
    steps: [
      { platform: "Windows / Linux", keys: "Ctrl + Shift + R", alt: "Or Ctrl + F5" },
      { platform: "Mac (Chrome/Edge)", keys: "\u2318 + Shift + R" },
      { platform: "Mac (Safari)", keys: "\u2318 + Option + R" },
      { platform: "Mobile", keys: "Pull down to refresh, or close and reopen the app" },
    ],
  },
  {
    id: "clear-cache",
    title: "Clear your browser cache",
    desc: "If hard refresh doesn't work, clearing the cache removes all stored data and forces a completely fresh load.",
    steps: [
      { platform: "Chrome", keys: "\u2318/Ctrl + Shift + Delete \u2192 select 'Cached images and files' \u2192 Clear" },
      { platform: "Safari", keys: "Safari \u2192 Settings \u2192 Privacy \u2192 Manage Website Data \u2192 Remove All" },
      { platform: "Edge", keys: "Ctrl + Shift + Delete \u2192 select 'Cached images and files' \u2192 Clear now" },
      { platform: "Firefox", keys: "Ctrl + Shift + Delete \u2192 select 'Cache' \u2192 Clear Now" },
    ],
  },
  {
    id: "dev-tools",
    title: "Open developer tools",
    desc: "Developer tools help diagnose loading issues. Open them and check the Console tab for error messages.",
    steps: [
      { platform: "Windows / Linux", keys: "F12 or Ctrl + Shift + I" },
      { platform: "Mac", keys: "\u2318 + Option + I" },
      { platform: "Safari", keys: "Enable in Safari \u2192 Settings \u2192 Advanced \u2192 'Show Develop menu', then \u2318 + Option + I" },
    ],
  },
  {
    id: "incognito",
    title: "Try incognito / private mode",
    desc: "If the issue persists, try opening XHS\u2122 Copilot in a private window. This rules out browser extensions or cached data causing problems.",
    steps: [
      { platform: "Chrome", keys: "Ctrl/\u2318 + Shift + N" },
      { platform: "Safari", keys: "\u2318 + Shift + N" },
      { platform: "Edge", keys: "Ctrl + Shift + N" },
      { platform: "Firefox", keys: "Ctrl/\u2318 + Shift + P" },
    ],
  },
  {
    id: "login-issues",
    title: "Can't log in or account locked",
    desc: "If you're unable to sign in, try resetting your password. If your account is locked or you're seeing an error, contact us directly.",
    steps: [
      { platform: "Reset password", keys: "Go to xhsdata.ai/forgot-password and enter your work email" },
      { platform: "Still stuck?", keys: "Email support@pimlicosolutions.com or message us on WhatsApp" },
    ],
  },
  {
    id: "notifications",
    title: "Not receiving email notifications",
    desc: "Check your spam/junk folder. Our emails come from noreply@pimlicosolutions.com. Add this to your contacts or safe senders list.",
    steps: [
      { platform: "Gmail", keys: "Check Spam \u2192 if found, click 'Not spam'" },
      { platform: "Outlook", keys: "Check Junk \u2192 right-click \u2192 'Never block sender'" },
      { platform: "Corporate", keys: "Ask your IT team to whitelist pimlicosolutions.com and resend.dev" },
    ],
  },
];

export default function SupportPage() {
  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 sm:py-20">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
          [ SUPPORT ]
        </p>
        <h1 className="text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl mb-4">
          Troubleshooting & support
        </h1>
        <p className="text-base text-[var(--color-text-tertiary)] leading-relaxed mb-12">
          Common fixes for issues with XHS{"\u2122"} Copilot. If these don't resolve your problem, contact us directly.
        </p>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 mb-12">
          <a href="mailto:support@pimlicosolutions.com" className="rounded-lg bg-[var(--color-text-primary)] px-5 py-2 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90">
            Email support
          </a>
          <a href="https://wa.me/447961642867" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[var(--color-border-subtle)] px-5 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
            WhatsApp support
          </a>
          <a href="https://xhsdata.ai/login" className="rounded-lg border border-[var(--color-border-subtle)] px-5 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
            Log in to XHS{"\u2122"}
          </a>
        </div>

        {/* Troubleshooting sections */}
        <div className="space-y-8">
          {TROUBLESHOOTING.map((item) => (
            <div key={item.id} id={item.id} className="rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/50 p-6">
              <h2 className="text-base font-medium text-[var(--color-text-primary)] mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed mb-4">
                {item.desc}
              </p>
              <div className="space-y-2">
                {item.steps.map((step) => (
                  <div key={step.platform} className="flex gap-3">
                    <span className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5 shrink-0 w-28">{step.platform}</span>
                    <span className="text-sm font-mono text-[var(--color-text-secondary)]">{step.keys}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-16 pt-10 border-t border-[var(--color-border-default)]/20 text-center">
          <h2 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
            Still need help?
          </h2>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-6">
            Contact us on WhatsApp or email and we'll get back to you within a few hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/447961642867?text=Hi%2C%20I%20need%20help%20with%20XHS%E2%84%A2%20Copilot" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[var(--color-text-primary)] px-6 py-2.5 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90">
              Message us on WhatsApp
            </a>
            <a href="mailto:support@pimlicosolutions.com" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              support@pimlicosolutions.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
