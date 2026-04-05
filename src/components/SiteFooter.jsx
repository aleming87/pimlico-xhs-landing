import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "Gambling", href: "/verticals#gambling" },
    { label: "Payments & Crypto", href: "/verticals#payments" },
    { label: "Artificial Intelligence", href: "/verticals#ai" },
    { label: "Pricing", href: "/pricing" },
  ],
  Resources: [
    { label: "Insights", href: "/insights" },
    { label: "Security", href: "/security" },
    { label: "Book a demo", href: "/contact" },
    { label: "Contact", href: "mailto:contact@pimlicosolutions.com" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms-and-conditions" },
  ],
};

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/wearepimlico/",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/PimlicoXHS",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-default)]/30 bg-[var(--color-bg-base)]">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
        {/* Brand */}
        <div className="mb-10">
          <Image
            src="/dual-logo.png"
            alt="Pimlico | XHS"
            width={300}
            height={84}
            className="h-8 sm:h-10 w-auto"
          />
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
            Compliance workspaces for regulated teams.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <Link
              href="https://xhsdata.ai/register"
              className="rounded-lg bg-[var(--color-text-primary)] px-5 py-2 text-xs font-medium text-[var(--color-bg-base)] transition-all hover:opacity-90"
            >
              Start free trial
            </Link>
            <a
              href="https://xhsdata.ai/login"
              className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              Log in
            </a>
          </div>
        </div>

        {/* Links — always 3 columns */}
        <div className="grid grid-cols-3 gap-8">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                {heading}
              </h3>
              <ul role="list" className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("mailto:") || link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-[var(--color-border-default)]/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} Pimlico Solutions Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex gap-x-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
                >
                  <span className="sr-only">{social.label}</span>
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-xs font-mono text-[var(--color-text-muted)]/60 tracking-wide">
              XHS{"\u2122"} Copilot
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
