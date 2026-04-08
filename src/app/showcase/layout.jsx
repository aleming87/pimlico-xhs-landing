/**
 * Showcase Layout — minimal chrome for clean screen captures.
 * No SiteHeader/Footer. Just the scene content.
 * Add ?capture=1 to URL to hide even the scene nav.
 */
export const metadata = {
  title: "XHS Copilot — Product Showcase",
  robots: { index: false, follow: false },
};

export default function ShowcaseLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      {children}
    </div>
  );
}
