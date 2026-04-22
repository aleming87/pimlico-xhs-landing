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
    title: "Early access to our regulatory research",
    body: "See the daily feed, the country desks, and the watchlists we run for customers. Useful if regulatory change is part of your day job and you'd rather see our take first than chase it in the press.",
  },
  {
    title: "A direct line to the Pimlico team",
    body: "No support queue. Ping us with questions on a jurisdiction you care about, a regulator you're tracking, or a change that landed this week. We reply from a real inbox, not a bot.",
  },
  {
    title: "A first look at what we're building",
    body: "New research desks, new products and new integrations go to collaborators before they go wide. You get to tell us what's useful — and what we got wrong — while it's still cheap to change.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Get invited",
    body: "We keep the roster small. If you already work with someone at Pimlico, ask them. If not, email us a few lines about what you do and we'll take a look.",
  },
  {
    n: "02",
    title: "Click the magic link",
    body: "Your invite email carries a one-time link. One click, set a password, tell us how you want to use the research. Under three minutes, start to finish.",
  },
  {
    n: "03",
    title: "Start reading",
    body: "Your workspace is ready the moment you finish onboarding. The feed, the country pages and the watchlists are live from day one.",
  },
];

const AUDIENCE = [
  "Advisors and consultants who want to stay current on our jurisdictions",
  "In-house compliance leads at firms we already work with",
  "Operators who asked for a deeper look behind the product",
  "Researchers, lawyers and former regulators who trade notes with us",
  "People we've met at conferences who keep asking smart questions",
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
              An invitation-only programme for people affiliated with Pimlico. Early access to
              what we're researching, a direct line to the team, and a first look at what we're
              building next. No trial clock.
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2
          className="text-sm font-semibold uppercase tracking-wider mb-10"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          What collaborators get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUE_PROPS.map((v, i) => (
            <div
              key={v.title}
              className="rounded-2xl p-6 sm:p-7"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border-default)",
              }}
            >
              <div
                className="text-xs font-semibold mb-3"
                style={{ color: "var(--color-accent-primary)" }}
              >
                {String(i + 1).padStart(2, "0")}
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

      {/* How it works */}
      <section
        className="py-20"
        style={{ background: "var(--color-bg-base)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2
              className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              How it works.
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Three steps. We keep the roster tight so every collaborator gets actual human
              attention when they ask a question.
            </p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="rounded-2xl p-6 sm:p-7"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border-default)",
                }}
              >
                <div
                  className="text-3xl font-semibold mb-4"
                  style={{ color: "var(--color-accent-primary)" }}
                >
                  {s.n}
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <h2
              className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Who it's for.
            </h2>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              People who already care about regulatory change in the sectors we cover, and who
              we think will get real use out of our research. Usually people we've met or worked
              with in some way already.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Buying for a compliance team? Our{" "}
              <Link
                href="/pricing"
                className="underline underline-offset-4"
                style={{ color: "var(--color-accent-primary)" }}
              >
                standard pricing
              </Link>{" "}
              covers that separately.
            </p>
          </div>
          <ul
            className="rounded-2xl p-6 sm:p-7 space-y-3"
            style={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border-default)",
            }}
          >
            {AUDIENCE.map((a) => (
              <li
                key={a}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={{ color: "var(--color-text-primary)" }}
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: "var(--color-accent-primary)" }}
                />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-20"
        style={{ background: "var(--color-bg-base)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Want in?
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Send us a short note. Who you are, what you do, and what you'd want out of it. If
            there's a fit, we'll send an invite within a business day.
          </p>
          <a
            href="mailto:hello@pimlicosolutions.com?subject=Collaborator%20programme%20enquiry&body=Name%3A%0AWhat%20you%20do%3A%0AHow%20you%20know%20Pimlico%3A%0AJurisdictions%20you%20care%20about%3A%0AAnything%20else%3A"
            className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              background: "var(--color-text-primary)",
              color: "var(--color-bg-base)",
            }}
          >
            Email hello@pimlicosolutions.com
            <span aria-hidden>→</span>
          </a>
          <p
            className="text-xs mt-5"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Or{" "}
            <Link
              href="/contact"
              className="underline underline-offset-4"
              style={{ color: "var(--color-accent-primary)" }}
            >
              book a 20-minute intro call
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
