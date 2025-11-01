export default function ICP() {
  return (
    <section id="icp" className="py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-semibold tracking-tight">Ideal Customer Profile (ICP)</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="font-medium">Who we serve</h3>
            <ul className="mt-3 text-sm text-slate-600 space-y-2 list-disc list-inside">
              <li>Regulated enterprises and vendors in AI, Payments & Gambling</li>
              <li>Leaders in Compliance, Regulatory Affairs, Policy, Strategy</li>
              <li>Teams managing risk, governance, and horizon-scanning</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="font-medium">Buying triggers</h3>
            <ul className="mt-3 text-sm text-slate-600 space-y-2 list-disc list-inside">
              <li>New or changing requirements (e.g., AI Act, DORA, AML updates)</li>
              <li>Need to consolidate sources and reduce external counsel spend</li>
              <li>Desire to operationalise regulatory monitoring and responses</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}