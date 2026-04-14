/**
 * Single source of truth for outbound email configuration.
 *
 * Reads SENDER_EMAIL from the environment so we can swap senders per
 * environment without grepping through every API route. If the env
 * var is missing we fall back to the verified production sender.
 *
 * The previous code hard-coded `onboarding@resend.dev` everywhere,
 * which is Resend's sandbox domain — fine for dev, hurts deliverability
 * in production and bypasses the verified pimlicosolutions.com domain.
 *
 * Usage:
 *   import { sender } from '@/lib/email'
 *   await resend.emails.send({ from: sender('Pimlico XHS Contact'), to, subject, html })
 *
 * sender(label) returns "<label> <noreply@pimlicosolutions.com>" so it
 * shows up nicely in the inbox while keeping a single canonical address.
 */

// Verified production address (override per-env via SENDER_EMAIL)
const DEFAULT_SENDER_EMAIL = 'noreply@pimlicosolutions.com'

export function senderEmail() {
  return process.env.SENDER_EMAIL || DEFAULT_SENDER_EMAIL
}

export function sender(label) {
  const email = senderEmail()
  if (!label) return email
  return `${label} <${email}>`
}

/** Recipient address for inbound notifications (contact form / surveys / etc.). */
export function teamRecipient() {
  return process.env.CONTACT_EMAIL || 'andrew@pimlicosolutions.com'
}
