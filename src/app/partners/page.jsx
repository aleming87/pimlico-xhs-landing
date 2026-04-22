import Link from "next/link";

export const metadata = {
  title: "Pimlico Partner Programme — Bring regulatory intelligence to your clients",
  description:
    "Invitation-only programme for consultancies, advisory firms and in-house teams who run regulatory work on behalf of their clients. Shared workspace, API + MCP access, and a named Pimlico account manager.",
  alternates: { canonical: "https://pimlicosolutions.com/partners" },
  openGraph: {
    title: "Pimlico Partner Programme",
    description:
      "Invitation-only programme for firms that manage regulatory work on behalf of their clients.",
    url: "https://pimlicosolutions.com/partners",
    type: "website",
  },
};

const VALUE_PROPS = [
  {
    title: "One workspace for every client you manage",
    body: "Manage 1 or 100 client organisations from a single Pimlico workspace. Each client keeps their own data scope; you keep the overview. No duplicate logins, no copy-paste across accounts.",
  },
  {
    title: "Web, API or MCP — integrate however you already work",
    body: "Use the dashboard with your team. Pipe our data into your own tools via the XHS™ API. Or let your AI agents reach our research desks directly via MCP. Self-serve keys from day one.",
  },
  {
    title: "A named account manager, not a queue",
    body: "Every partner firm gets a dedicated Pimlico contact. Human triage on urgent client questions, proactive briefings on jurisdictions you cover, and a private channel for escalations.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Get invited",
    body: "Reach out, or be approached. We run the programme invitation-only to keep the roster tight and the service quality high.",
  },
  {
    n: "02",
    title: "Set up your workspace",
    body: "Click the magic link in your invite email. Set a password. Tell us which jurisdictions you cover and how you like to work. Takes under three minutes.",
  },
  {
    n: "03",
    title: "Link your clients",
    body: "We attach the client organisations you manage to your partner workspace. Clients opt-in once; after that you see their regulatory feed alongside your own desks.",
  },
];

const AUDIENCE = [
  "Regulatory consultancies and advisory boutiques",
  "Law firms with financial-services and gaming practices",
  "Compliance-as-a-service providers and MLRO bureaus",
  "Big 4 and mid-market advisory teams covering payments, crypto, gambling or AI",
  "In-house compliance leads who support sister companies or portfolio investments",
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
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6"
              style={{
                background: "var(--color-bg-elevated)",
                color: "var(--color-accent-primary)",
                border: "1px solid var(--color-border-default)",
              }}
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--color-accent-primary)" }}
              />
              Pimlico Partner Programme
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              Bring regulatory intelligence to every client you manage.
            </h1>
            <p
              className="text-lg sm:text-xl leading-relaxed max-w-2xl mb-8"
              style={{ color: "var(--color-text-secondary)" }}
            >
              An invitation-only programme for consultancies, law firms and advisory teams who
              run regulatory work on behalf of others. Shared workspace. API + MCP access. A
              named Pimlico contact. No trial clock.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href="mailto:hello@pimlicosolutions.com?subject=Partner%20programme%20enquiry&body=Firm%20name%3A%0AYour%20role%3A%0AClients%20we%20manage%20(approx)%3A%0AJurisdictions%20we%20cover%3A%0AWhy%20now%3A"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: "var(--color-text-primary)",
                  color: "var(--color-bg-base)",
                }}
              >
                Request an invite
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
                Talk to us first
              </Link>
            </div>
            <p
              className="text-xs mt-5"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Typical response time: under one business day.
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
          What partners get
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
              We keep the roster tight so every partner gets a real account manager. The
              onboarding is three steps. No trial clock — access is indefinite while the
              relationship is active.
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
              Who the programme is for.
            </h2>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Firms that manage regulatory workload on behalf of their clients — not end-user
              compliance teams. If you're the go-to advisor or the firm that other firms rely
              on, this is for you.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Not a fit? Our{" "}
              <Link
                href="/pricing"
                className="underline underline-offset-4"
                style={{ color: "var(--color-accent-primary)" }}
              >
                standard pricing
              </Link>{" "}
              covers in-house compliance teams at every size.
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
            Ready to talk?
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Tell us about your firm and the clients you manage. If there's a fit, we'll send
            an invite within a business day.
          </p>
          <a
            href="mailto:hello@pimlicosolutions.com?subject=Partner%20programme%20enquiry&body=Firm%20name%3A%0AYour%20role%3A%0AClients%20we%20manage%20(approx)%3A%0AJurisdictions%20we%20cover%3A%0AWhy%20now%3A"
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
