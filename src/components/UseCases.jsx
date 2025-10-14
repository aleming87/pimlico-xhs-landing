function Card({ title, items, href }) {
  const content = (
    <>
      <h3 className="font-medium text-lg">{title}</h3>
      <ul className="mt-3 text-sm text-slate-600 space-y-2 list-disc list-inside">
        {items.map((t) => <li key={t}>{t}</li>)}
      </ul>
      {href && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <span className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Learn more →
          </span>
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <a 
        href={href} 
        className="block rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 p-6">
      {content}
    </div>
  );
}

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-semibold tracking-tight">Use cases</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card
            title="AI"
            href="/ai"
            items={[
              "AI Legislation & Governance",
              "Compute & Infrastructure",
              "Data Protection",
              "Technical Standards",
              "National Security & Export Controls",
              "Consumer Protection & Conduct",
            ]}
          />
          <Card
            title="Payments"
            href="/payments"
            items={[
              "Licensing & Authorisations",
              "Crypto & Digital Assets",
              "AML/CTF & Sanctions",
              "Operational Resilience & ICT Risk",
            ]}
          />
        </div>
      </div>
    </section>
  );
}