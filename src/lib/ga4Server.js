/**
 * Server-side GA4 forwarder using the Measurement Protocol.
 *
 * Sends an event to GA4 from a backend route (e.g. our Resend webhook
 * receiver). Requires two env vars:
 *
 *   NEXT_PUBLIC_GA_ID         — same Measurement ID used client-side ("G-XXXXXXXXXX")
 *   GA_MEASUREMENT_API_SECRET — generated in GA4 Admin -> Data Streams -> Measurement Protocol
 *
 * If either is missing this is a no-op so the function is safe to call
 * unconditionally from any route.
 *
 * `clientId` should be a stable identifier for the user/session. For
 * server-emitted events (email opens/clicks) we don't have a real
 * web client_id, so we pass a hashed surrogate (the email message id
 * is fine) — these will form their own user buckets in GA4.
 *
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4
 */
export async function sendServerEvent({ clientId, name, params = {}, userId } = {}) {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  const apiSecret = process.env.GA_MEASUREMENT_API_SECRET
  if (!measurementId || !apiSecret) return { skipped: true, reason: 'GA4 env vars not configured' }
  if (!clientId || !name) return { skipped: true, reason: 'clientId and name are required' }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`

  const body = {
    client_id: String(clientId),
    ...(userId ? { user_id: String(userId) } : {}),
    non_personalized_ads: true,
    events: [
      {
        name,
        params: {
          // GA4 requires session_id + engagement_time_msec for a session to register
          engagement_time_msec: 1,
          ...params,
        },
      },
    ],
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return { ok: response.ok, status: response.status }
  } catch (err) {
    console.error('GA4 server event failed:', err)
    return { ok: false, error: String(err) }
  }
}
