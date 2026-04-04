"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Verticals", href: "/verticals" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

function MobileMenu({ open, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-sm bg-[var(--color-bg-base)] border-l border-[var(--color-border-default)]/30 overflow-y-auto">
        <div className="px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link href="/" onClick={onClose} className="-m-1.5 p-1.5">
              <Image
                src="/Pimlico_Logo_Inverted.png"
                alt="Pimlico"
                width={100}
                height={27}
                className="h-6 w-auto"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-[var(--color-text-tertiary)]"
              onClick={onClose}
            >
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <div className="mt-10 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-lg px-4 py-3.5 text-lg font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] transition-colors"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border-default)]/30 space-y-3">
            <a
              href="https://xhsdata.ai/login"
              className="block rounded-lg px-4 py-3 text-base font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
              onClick={onClose}
            >
              Log in
            </a>
            <a
              href="https://xhsdata.ai/register"
              className="block rounded-lg bg-[var(--color-text-primary)] px-4 py-3 text-center text-base font-semibold text-[var(--color-bg-base)] hover:opacity-90 transition-all"
              onClick={onClose}
            >
              Start free trial
            </a>
          </div>
        </div>
      </div>
    </div>,
    typeof document !== "undefined" ? document.body : null
  );
}

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border-default)]/30 bg-[var(--color-bg-base)]/80 backdrop-blur-xl">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pimlico Solutions</span>
              <Image
                src="/Pimlico_Logo_Inverted.png"
                alt="Pimlico"
                width={100}
                height={27}
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[var(--color-text-tertiary)]"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex lg:gap-x-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-6">
            <a
              href="https://xhsdata.ai/login"
              className="text-sm font-medium text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              Log in
            </a>
            <a
              href="https://xhsdata.ai/register"
              className="rounded-lg border border-[var(--color-text-primary)]/20 px-5 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-text-primary)]/40 hover:bg-[var(--color-bg-elevated)]/50"
            >
              Start free trial
            </a>
          </div>
        </nav>
      </header>

      {/* Mobile menu portaled to body */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
