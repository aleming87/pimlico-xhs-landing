import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2">
            {/* Put your logo at /public/pimlico-logo.svg (or .png) */}
            <Image src="/pimlico-logo.svg" alt="Pimlico" width={28} height={28} />
            <span className="text-lg font-semibold tracking-tight">Pimlico XHS</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#how" className="hover:text-brand-700">How it works</a>
            <a href="#use-cases" className="hover:text-brand-700">Use cases</a>
            <a href="#icp" className="hover:text-brand-700">ICP</a>
            <a href="/pricing" className="hover:text-brand-700">Pricing</a>
            <a href="/contact" className="inline-flex items-center rounded-xl px-4 py-2 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/50 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-105">
              Book a demo
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}