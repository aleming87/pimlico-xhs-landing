"use client";

import { Reveal, StaggerGroup, StaggerItem } from "./motion";

export default function Differentiators() {
  const items = [
    {
      title: "Monitor",
      body: "Deployed across 12,000+ regulatory sources. Real-time change detection across 250+ jurisdictions.",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
      ),
    },
    {
      title: "Analyse",
      body: "Ask any regulatory question. Get source-grounded, cited answers from AI trained on your compliance context.",
      icon: (
        <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Collaborate",
      body: "Workspaces for your team's proprietary compliance data. Projects, watchlists, and shared research tools.",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      title: "Integrate",
      body: "Enterprise APIs, Slack and Teams alerts, email digests. Compliance workflows that fit into yours.",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="differentiators" className="py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
            [ HOW IT WORKS ]
          </p>
          <h2 className="font-display text-3xl font-medium text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl leading-[1.1]">
            From regulatory change{" "}<br className="hidden sm:block" />to team action.
          </h2>
        </Reveal>

        <StaggerGroup className="grid gap-px sm:grid-cols-2 bg-[var(--color-border-default)]/20 rounded-xl overflow-hidden" stagger={0.12}>
          {items.map(({ title, body, icon }) => (
            <StaggerItem key={title}>
              <div className="bg-[var(--color-bg-base)] p-6 sm:p-10 group h-full">
                <div className="mb-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {title}
                </h3>
                <p className="text-base text-[var(--color-text-tertiary)] leading-relaxed">
                  {body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
