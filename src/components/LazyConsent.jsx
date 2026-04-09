'use client'

import dynamic from 'next/dynamic'

const CookieConsent = dynamic(
  () => import('@/components/CookieConsent').then((mod) => mod.CookieConsent),
  { ssr: false }
)

export function LazyConsent() {
  return <CookieConsent />
}
