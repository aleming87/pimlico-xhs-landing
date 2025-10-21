import Image from "next/image";

export default function Differentiators() {
  const items = [
    { 
      title: 'Monitor',
      body: 'Regulatory AI agents deployed on 10,000+ regulator sources',
      icon: (
        <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      title: 'Analyse',
      body: 'LLM engines generate actionable insights for user-led projects',
      icon: (
        <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      title: 'Collaborate',
      body: 'Workspaces manage proprietary data for risk and compliance strategies',
      icon: (
        <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      title: 'Integrate',
      body: 'API access offers quick integration with work and GRC apps',
      icon: (
        <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      showLogos: true
    },
  ];

  return (
    <section id="differentiators" className="py-32 scroll-mt-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 sm:text-4xl lg:text-5xl">
            Turn noise into<br/>
            <span className="text-blue-600">collaboration</span> for <span className="text-blue-600">growth</span>.
          </h2>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ title, body, icon, showLogos }) => (
            <div key={title} className="rounded-3xl border-2 border-slate-200 bg-white p-8 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
              <div className="mb-6">
                {icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
              <p className="text-slate-600 text-base leading-relaxed mb-6">{body}</p>
              
              {showLogos && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Image 
                    src="/Logo_Strip.png" 
                    alt="Integration partners" 
                    width={200} 
                    height={40} 
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}