/**
 * Build a tracking URL for use in transactional or marketing emails.
 *
 * Appends GA4-compatible UTM parameters so when the recipient clicks
 * a link in an email, the destination's analytics (xhsdata.ai or
 * pimlicosolutions.com) can attribute the visit to the email.
 *
 * Existing query params on the URL are preserved.
 *
 * @example
 *   trackedLink('https://xhsdata.ai/register', { campaign: 'contact_confirmation' })
 *   // -> https://xhsdata.ai/register?utm_source=email&utm_medium=transactional&utm_campaign=contact_confirmation
 */
export function trackedLink(href, { source = 'email', medium = 'transactional', campaign, content, term } = {}) {
  if (!href) return href
  let url
  try {
    // Allow protocol-less or absolute URLs; default base for relative paths.
    url = new URL(href, 'https://pimlicosolutions.com')
  } catch {
    return href
  }
  // Don't append UTM to mailto: / tel: / # anchors
  if (!['http:', 'https:'].includes(url.protocol)) return href

  url.searchParams.set('utm_source', source)
  url.searchParams.set('utm_medium', medium)
  if (campaign) url.searchParams.set('utm_campaign', campaign)
  if (content) url.searchParams.set('utm_content', content)
  if (term) url.searchParams.set('utm_term', term)
  return url.toString()
}
