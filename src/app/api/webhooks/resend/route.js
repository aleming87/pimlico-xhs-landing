/**
 * Resend webhook receiver.
 *
 * Configure in Resend dashboard -> Webhooks -> Add endpoint:
 *   URL:    https://pimlicosolutions.com/api/webhooks/resend
 *   Events: email.delivered, email.opened, email.clicked,
 *           email.bounced, email.complained
 *
 * For each event we forward a server-side hit to GA4 via the
 * Measurement Protocol so you can see email engagement alongside
 * web conversions in GA4 (Reports -> Engagement -> Events).
 *
 * Optional auth: set RESEND_WEBHOOK_SECRET and Resend will sign
 * each payload with HMAC-SHA256. We verify the signature here.
 *
 * Reference:
 *   https://resend.com/docs/dashboard/webhooks/introduction
 */

export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { sendServerEvent } from '@/lib/ga4Server'

/**
 * Map a Resend event type to a clean GA4 event name + label.
 */
const EVENT_MAP = {
  'email.sent': { ga: 'email_sent' },
  'email.delivered': { ga: 'email_delivered' },
  'email.opened': { ga: 'email_opened' },
  'email.clicked': { ga: 'email_clicked' },
  'email.bounced': { ga: 'email_bounced' },
  'email.complained': { ga: 'email_complained' },
  'email.delivery_delayed': { ga: 'email_delayed' },
}

/**
 * Verify Resend's HMAC-SHA256 signature in the `svix-signature` header.
 * Format: "v1,<base64-signature> v1,<base64-signature> ..."
 *
 * Resend uses Svix under the hood. The signed payload is:
 *   `${svix-id}.${svix-timestamp}.${rawBody}`
 *
 * If RESEND_WEBHOOK_SECRET is not set we skip verification but log a
 * warning — fine for staging, NOT fine for production.
 */
async function verifySignature(request, rawBody) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    console.warn('[resend-webhook] RESEND_WEBHOOK_SECRET not set — skipping signature verification')
    return true
  }
  const id = request.headers.get('svix-id')
  const timestamp = request.headers.get('svix-timestamp')
  const signatureHeader = request.headers.get('svix-signature')
  if (!id || !timestamp || !signatureHeader) return false

  const signedPayload = `${id}.${timestamp}.${rawBody}`
  // Resend secret format: "whsec_<base64>"
  const secretBytes = Uint8Array.from(atob(secret.replace(/^whsec_/, '')), (c) => c.charCodeAt(0))
  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload))
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)))

  // Header may contain multiple signatures separated by spaces; any match passes.
  const provided = signatureHeader.split(' ').map((s) => s.split(',')[1])
  return provided.includes(expected)
}

export async function POST(request) {
  const rawBody = await request.text()

  if (!(await verifySignature(request, rawBody))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = event?.type
  const data = event?.data || {}
  const mapped = EVENT_MAP[type]
  if (!mapped) {
    // Unknown event — acknowledge so Resend doesn't retry.
    return NextResponse.json({ ok: true, ignored: type })
  }

  // Use the email_id as our pseudo client_id so GA4 keeps a coherent
  // user trail per outbound email. Recipient address goes into a
  // (custom) param so you can filter by domain in GA4 if desired.
  const clientId = data.email_id || data.id || `resend.${Date.now()}`

  const params = {
    email_id: data.email_id || data.id,
    email_subject: data.subject,
    email_to_domain: typeof data.to?.[0] === 'string' ? data.to[0].split('@')[1] : undefined,
    email_from: data.from,
    // For email.clicked Resend includes the destination URL
    link_url: data.click?.link,
  }
  // Strip undefined params so GA4 doesn't store empties
  Object.keys(params).forEach((k) => params[k] === undefined && delete params[k])

  const result = await sendServerEvent({
    clientId,
    name: mapped.ga,
    params,
  })

  return NextResponse.json({ ok: true, type, ga: result })
}
