import Link from "next/link";

export const metadata = {
  title: "Pimlico Collaborators — Stay close to our regulatory work",
  description:
    "Invitation-only programme for people and firms affiliated with Pimlico. Early access to our regulatory research, direct contact with the team, and a first look at what we're building.",
  alternates: { canonical: "https://pimlicosolutions.com/partners" },
  openGraph: {
    title: "Pimlico Collaborators",
    description:
      "Invitation-only programme for people affiliated with Pimlico who want to stay close to our regulatory work.",
    url: "https://pimlicosolutions.com/partners",
    type: "website",
  },
};

const VALUE_PROPS = [
  {
    label: "The work",
    title: "The same daily feed our customers see",
    body: "Every regulatory change we surface, the country desks, the watchlists, the briefings. No second-tier feed for collaborators — you read what they read.",
  },
  {
    label: "The line",
    title: "A real inbox, not a queue",
    body: "Reply to anything we send. Ask about a jurisdiction, a regulator, a change that landed this week. Answers come back from a human at Pimlico — usually within a day.",
  },
  {
    label: "What's next",
    title: "First look at the product",
    body: "New research desks, new tools and new integrations go to collaborators before they go wide. Your feedback shapes what ships next.",
  },
];

const AUDIENCE = [
  "Advisors and consultants tracking the same jurisdictions we cover",
  "In-house compliance leads at firms we already work with",
  "Operators and former regulators who trade notes with us",
  "Anyone building something where regulation is the bottleneck",
];

export default function PartnersPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, var(--color-bg-base) 0%, var(--color-bg-surface) 100%)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 20%, rgba(25,50,100,0.35) 0%, transparent 55%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-24">
          <div className="max-w-3xl">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              Bring Pimlico's regulatory intelligence closer.
            </h1>
            <p
              className="text-lg sm:text-xl leading-relaxed max-w-2xl mb-8"
              style={{ color: "var(--color-text-secondary)" }}
            >
              An invitation-only programme for early partners of Pimlico. Get access to what
              we're researching, a direct line to the team, and a first look at the products
              we're building next. No trial clock.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href="mailto:hello@pimlicosolutions.com?subject=Collaborator%20programme%20enquiry&body=Name%3A%0AWhat%20you%20do%3A%0AHow%20you%20know%20Pimlico%3A%0AJurisdictions%20you%20care%20about%3A%0AAnything%20else%3A"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: "var(--color-text-primary)",
                  color: "var(--color-bg-base)",
                }}
              >
                Ask about an invite
                <span aria-hidden>→</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border-default)",
                }}
              >
                Just say hi
              </Link>
            </div>
            <p
              className="text-xs mt-5"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Typical response time: under a business day.
            </p>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mb-12">
          <h2
            className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            What you get.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUE_PROPS.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl p-6 sm:p-7"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border-default)",
              }}
            >
              <div
                className="text-xs font-semibold mb-4 uppercase tracking-wider"
                style={{ color: "var(--color-accent-primary)" }}
              >
                {v.label}
              </div>
              <h3
                className="text-lg font-semibold mb-3 leading-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                {v.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section
        className="py-20"
        style={{ background: "var(--color-bg-base)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <h2
                className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Who it's for.
              </h2>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                People who already care about regulatory change in the sectors we cover. Most
                are people we've met or worked with at some point.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Buying for a compliance team? See{" "}
                <Link
                  href="/pricing"
                  className="underline underline-offset-4"
                  style={{ color: "var(--color-accent-primary)" }}
                >
                  standard pricing
                </Link>
                .
              </p>
            </div>
            <ul
              className="lg:col-span-7 rounded-2xl p-6 sm:p-8 space-y-4"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border-default)",
              }}
            >
              {AUDIENCE.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-3 text-base leading-relaxed"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--color-accent-primary)" }}
                  />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Want in?
          </h2>
          <p
            className="text-base leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            A short note works. Who you are, what you do, and what you'd want from it.
            If there's a fit we'll send an invite within a business day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:hello@pimlicosolutions.com?subject=Pimlico%20Collaborator%20programme&body=Name%3A%0AWhat%20you%20do%3A%0AHow%20you%20know%20Pimlico%3A%0AJurisdictions%20you%20care%20about%3A%0AAnything%20else%3A"
              className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                background: "var(--color-text-primary)",
                color: "var(--color-bg-base)",
              }}
            >
              Email us
              <span aria-hidden>→</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-default)",
              }}
            >
              Book a 20-min intro
            </Link>
          </div>
          <p
            className="text-xs mt-6"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            hello@pimlicosolutions.com
          </p>
        </div>
      </section>
    </main>
  );
}
