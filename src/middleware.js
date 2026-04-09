import { NextResponse } from 'next/server'

/**
 * SEO middleware: enforces canonical domain (non-www, HTTPS).
 *
 * Redirects:
 *   www.pimlicosolutions.com/* → pimlicosolutions.com/*  (301)
 *   http://pimlicosolutions.com/* → https://pimlicosolutions.com/*  (301)
 *
 * This prevents duplicate content across www/non-www and ensures
 * all link equity consolidates to the canonical origin.
 */
export function middleware(request) {
  const { hostname, pathname, search } = request.nextUrl

  // Skip in development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return NextResponse.next()
  }

  // Redirect www → non-www
  if (hostname.startsWith('www.')) {
    const canonical = new URL(`https://${hostname.replace('www.', '')}${pathname}${search}`)
    return NextResponse.redirect(canonical, 301)
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except static assets and API
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|icon-.*\\.png|apple-touch-icon\\.png|site\\.webmanifest|robots\\.txt|sitemap\\.xml|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.webp|api/).*)',
  ],
}
