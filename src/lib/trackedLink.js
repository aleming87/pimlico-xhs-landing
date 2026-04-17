/**
 * Build a tracking URL for use in transactional or marketing emails.
 *
 * Appends GA4-compatible UTM parameters so when the recipient clicks
 * a link in an email, the destination's analytics (xhsdata.ai or
 * pimlicosolutions.com) can attribute the visit to the email.
 *
 * If `clickParams` is provided (e.g. gclid/gbraid/wbraid captured on the
 * client at form submit time), those identifiers are appended to the URL
 * after the UTM tagging — so email CTAs inherit the original ad click
 * attribution in addition to the email-medium tagging.
 *
 * Existing query params on the URL are preserved. Existing values of any
 * key the caller is setting are overwritten.
 *
 * @example
 *   trackedLink('https://xhsdata.ai/register', { campaign: 'contact_confirmation' })
 *   // -> https://xhsdata.ai/register?utm_source=email&utm_medium=transactional&utm_campaign=contact_confirmation
 *
 * @example
 *   trackedLink('https://xhsdata.ai/register', {
 *     campaign: 'quote_confirmation',
 *     clickParams: { gclid: 'Cj0K...', utm_source: 'cpc' },
 *   })
 *   // -> https://xhsdata.ai/register?utm_source=email&utm_medium=transactional&utm_campaign=quote_confirmation&gclid=Cj0K...
 *   //   (utm_source stays 'email' because the email's own tagging wins at send time; gclid is added)
 */
export function trackedLink(
  href,
  { source = 'email', medium = 'transactional', campaign, content, term, clickParams = {} } = {},
) {
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

  // Carry click identifiers (gclid etc.) that the client captured at
  // form-submit time. Only add if not already present; utm_* keys on
  // clickParams are intentionally skipped so the email tagging above wins.
  if (clickParams && typeof clickParams === 'object') {
    const clickIdKeys = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid']
    for (const key of clickIdKeys) {
      const value = clickParams[key]
      if (value && !url.searchParams.has(key)) {
        url.searchParams.set(key, value)
      }
    }
  }

  return url.toString()
}
