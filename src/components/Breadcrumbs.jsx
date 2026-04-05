import Link from "next/link";

/**
 * Visual breadcrumb trail. Paired with BreadcrumbList JSON-LD emitted on
 * the consuming page. Supply items as [{ label, href }]. The final item is
 * rendered as the current page (no link).
 */
export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 lg:px-8 pt-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href || item.label} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-[var(--color-text-secondary)]">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-[var(--color-border-default)]">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
