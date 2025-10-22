function Card({ title, items, href }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6">
      <h3 className="font-medium text-lg">{title}</h3>
      <ul className="mt-3 text-sm text-slate-600 space-y-2">
        {items.map((item) => (
          <li key={item.name}>
            <a 
              href={item.href} 
              className="flex items-start group hover:text-blue-600 transition-colors duration-200"
            >
              <span className="mr-2 text-blue-600">•</span>
              <span className="group-hover:underline">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
      {href && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <a href={href} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Learn more →
          </a>
        </div>
      )}
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
              { name: "AI Legislation & Governance", href: "/ai#category-1" },
              { name: "Compute & Infrastructure", href: "/ai#category-2" },
              { name: "Data Protection", href: "/ai#category-3" },
              { name: "Technical Standards", href: "/ai#category-4" },
              { name: "National Security & Export Controls", href: "/ai#category-5" },
              { name: "Consumer Protection & Conduct", href: "/ai#category-6" },
            ]}
          />
          <Card
            title="Payments"
            href="/payments"
            items={[
              { name: "Licensing & Authorisations", href: "/payments#category-1" },
              { name: "Crypto & Digital Assets", href: "/payments#category-3" },
              { name: "AML/CTF & Sanctions", href: "/payments#category-5" },
              { name: "Operational Resilience & ICT Risk", href: "/payments#category-6" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}