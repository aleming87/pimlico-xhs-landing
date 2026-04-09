"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="bg-[var(--color-bg-base)] min-h-screen pt-24" />}>
      <ContactPageInner />
    </Suspense>
  );
}

function ContactPageInner() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  // Trial requests go straight to xhsdata.ai/register
  const isTrial = searchParams.get("trial") === "true";
  if (typeof window !== "undefined" && isTrial) {
    window.location.href = "https://xhsdata.ai/register";
    return null;
  }

  // Pre-fill interest from URL (e.g. /contact?interest=pricing from pricing page)
  const interestParam = searchParams.get("interest");
  const validInterests = ["trial", "demo", "pricing", "partnership", "other"];
  const defaultInterest = validInterests.includes(interestParam) ? interestParam : "";

  const freeEmailProviders = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
    "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
    "gmx.com", "live.com", "msn.com", "inbox.com", "tutanota.com",
  ];

  const blockedDomains = [
    "vixio.com", "gambling-compliance.com", "gamblingcompliance.com",
    "regology.com", "ascendtech.com", "corlytics.com", "cube.global",
    "suade.org", "regtech.global", "icomplyis.com",
  ];

  const validateBusinessEmail = (email) => {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return false;
    if (freeEmailProviders.includes(domain)) {
      setEmailError("Please use your business email address");
      return false;
    }
    if (blockedDomains.includes(domain)) {
      setEmailError("We are unable to process your request at this time.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");

    // Blocked domains handled by validateBusinessEmail above

    if (!validateBusinessEmail(email)) {
      setIsSubmitting(false);
      return;
    }

    const data = {
      firstName: formData.get("first-name"),
      lastName: formData.get("last-name"),
      company: formData.get("company"),
      email: email,
      interest: formData.get("interest"),
      message: formData.get("message"),
      agreedToPolicy: formData.get("agree-to-policies") === "on",
      marketingConsent: formData.get("marketing-consent") === "on",
    };

    localStorage.setItem("contactFormData", JSON.stringify(data));
    sessionStorage.setItem("contactEmail", data.email);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit");
      router.push("/contact/thank-you");
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "block w-full rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]/40 px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text-tertiary)] transition-colors";

  return (
    <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)] pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — context */}
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              {isTrial ? "[ START FREE TRIAL ]" : "[ GET IN TOUCH ]"}
            </p>
            <h1 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl leading-[1.1] mb-6">
              {isTrial
                ? "Start your 14-day free trial."
                : defaultInterest === "pricing"
                  ? "Talk to our sales team."
                  : defaultInterest === "partnership"
                    ? "Explore a partnership."
                    : "Book a demo. See the platform."}
            </h1>
            <p className="text-base text-[var(--color-text-tertiary)] leading-relaxed mb-10">
              {isTrial
                ? "Full access to the XHS\u2122 Copilot platform. Your team can be onboarded in minutes."
                : defaultInterest === "pricing"
                  ? "Custom pricing, procurement, and enterprise packages. We\u2019ll scope your requirements and put together a proposal."
                  : defaultInterest === "partnership"
                    ? "Integration, implementation, and channel relationships. Tell us what you have in mind."
                    : "We\u2019ll walk you through XHS\u2122 Copilot in your jurisdictions and answer every question your team has."}
            </p>

            {/* Value props */}
            <div className="space-y-5">
              {[
                { label: "275+ jurisdictions", desc: "Gambling, Payments, Crypto, and AI regulation monitored continuously." },
                { label: "Team economics", desc: "Scaling seat pricing across plans. Your full compliance team, day one." },
                { label: "Slack & Teams", desc: "Regulatory updates delivered where your team already works." },
                { label: "14-day trial", desc: "Full platform access. Cancel any time. No commitment." },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <svg className="h-5 w-5 text-[var(--color-accent-secondary)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.label}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Already have an account */}
            <div className="mt-10 pt-8 border-t border-[var(--color-border-default)]/20">
              <p className="text-sm text-[var(--color-text-muted)]">
                Already have an account?{" "}
                <a href="https://xhsdata.ai/login" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  Log in &rarr;
                </a>
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--color-border-default)]/30 bg-[var(--color-bg-surface)]/30 p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-2">
                    First name
                  </label>
                  <input id="first-name" type="text" name="first-name" autoComplete="given-name" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-2">
                    Last name
                  </label>
                  <input id="last-name" type="text" name="last-name" autoComplete="family-name" required className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-2">
                    Company
                  </label>
                  <input id="company" type="text" name="company" autoComplete="organization" required className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-2">
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    onChange={(e) => validateBusinessEmail(e.target.value)}
                    className={inputClass}
                  />
                  {emailError && <p className="mt-2 text-xs text-red-400">{emailError}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="interest" className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-2">
                    I'm interested in
                  </label>
                  <select id="interest" name="interest" className={inputClass + " appearance-none"} defaultValue={defaultInterest}>
                    <option value="" disabled>Select an option</option>
                    <option value="trial">Starting a free trial</option>
                    <option value="demo">Booking a demo</option>
                    <option value="pricing">Pricing information</option>
                    <option value="partnership">Partnership inquiry</option>
                    <option value="other">General inquiry</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-2">
                    Message <span className="text-[var(--color-text-muted)]">(optional)</span>
                  </label>
                  <textarea id="message" name="message" rows={3} className={inputClass + " resize-none"} />
                </div>
                <div className="flex gap-x-3 sm:col-span-2">
                  <input
                    id="agree-to-policies"
                    type="checkbox"
                    name="agree-to-policies"
                    required
                    className="mt-1 h-4 w-4 rounded border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-accent-secondary)] focus:ring-0"
                  />
                  <label htmlFor="agree-to-policies" className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    I agree to the{" "}
                    <Link href="/privacy" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
                      privacy policy
                    </Link>.
                  </label>
                </div>
                <div className="flex gap-x-3 sm:col-span-2">
                  <input
                    id="marketing-consent"
                    type="checkbox"
                    name="marketing-consent"
                    className="mt-1 h-4 w-4 rounded border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-accent-secondary)] focus:ring-0"
                  />
                  <label htmlFor="marketing-consent" className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Receive product updates and regulatory briefings from Pimlico.
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full rounded-lg bg-[var(--color-text-primary)] px-6 py-3 text-sm font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : isTrial ? "Start free trial" : "Book a demo"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
