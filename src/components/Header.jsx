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
            <a href="/contact" className="inline-flex items-center rounded-md px-5 py-2.5 font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105">
              Book a demo
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}