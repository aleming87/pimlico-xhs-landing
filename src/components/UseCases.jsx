function Card({ title, items }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6">
      <h3 className="font-medium">{title}</h3>
      <ul className="mt-3 text-sm text-slate-600 space-y-2 list-disc list-inside">
        {items.map((t) => <li key={t}>{t}</li>)}
      </ul>
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