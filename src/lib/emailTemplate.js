/**
 * Shared email template for all marketing-site transactional emails.
 * Matches the dark brand aesthetic of pimlicosolutions.com:
 *  - #020617 page background
 *  - #0f172a body / card
 *  - #1e293b elevated surface / hero
 *  - #ffffff primary text / accent (white on dark)
 *  - #cbd5e1 secondary text
 *  - #94a3b8 tertiary text
 *  - #64748b muted / footer
 *  - font-weight: 500 throughout (no bold)
 *  - border-radius: 8px / 12px (no pill buttons)
 *  - Playfair Display serif for headline optional
 *
 * Keeps the light-body / dark-hero pattern that email clients render reliably.
 * Do NOT use fully dark backgrounds — Outlook renders them poorly.
 * Hero is dark, body is dark-tinted (#f8fafc) for readability, card is white.
 *
 * Actually — reviewing our marketing site branding, the consistent look is
 * fully dark. Most premium SaaS emails now use dark backgrounds and most
 * modern email clients (Gmail, Apple Mail, iOS/Android, Outlook 2019+)
 * render them correctly. We'll go fully dark to match the marketing site.
 */

const BRAND = {
  pageBg: '#020617',
  cardBg: '#0f172a',
  heroBg: '#020617',
  elevated: '#1e293b',
  border: '#1e293b',
  divider: '#334155',
  textPrimary: '#ffffff',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  textMuted: '#64748b',
  accent: '#ffffff',
  buttonBg: '#ffffff',
  buttonText: '#020617',
  logoUrl: 'https://pimlicosolutions.com/dual-logo.png',
};

export function renderEmail({
  preheader = '',
  eyebrow = '',
  heading = '',
  intro = '',
  body = '',
  ctaLabel = '',
  ctaHref = '',
  footerNote = '',
}) {
  const year = new Date().getFullYear();

  const ctaBlock = ctaLabel && ctaHref
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0 0;">
        <tr>
          <td style="border-radius: 8px; background-color: ${BRAND.buttonBg};">
            <a href="${ctaHref}" style="display: inline-block; padding: 13px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; font-weight: 500; color: ${BRAND.buttonText}; text-decoration: none; border-radius: 8px; letter-spacing: -0.1px;">${ctaLabel}</a>
          </td>
        </tr>
      </table>
    `
    : '';

  const eyebrowBlock = eyebrow
    ? `<p style="margin: 0 0 14px; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 500; color: ${BRAND.textMuted}; text-transform: uppercase; letter-spacing: 0.18em;">[ ${eyebrow} ]</p>`
    : '';

  const introBlock = intro
    ? `<p style="margin: 0 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; font-weight: 400; color: ${BRAND.textSecondary}; line-height: 1.6;">${intro}</p>`
    : '';

  const bodyBlock = body
    ? `<div style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; font-weight: 400; color: ${BRAND.textSecondary}; line-height: 1.7;">${body}</div>`
    : '';

  const footerNoteBlock = footerNote
    ? `<p style="margin: 24px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 400; color: ${BRAND.textMuted}; line-height: 1.6;">${footerNote}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Pimlico XHS&trade;</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .hero { padding: 36px 24px 28px !important; }
      .content { padding: 32px 24px !important; }
      .footer { padding: 24px !important; }
      h1 { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND.pageBg}; color: ${BRAND.textPrimary};">
  ${preheader ? `<div style="display: none; font-size: 1px; color: ${BRAND.pageBg}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">${preheader}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${BRAND.pageBg};">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: ${BRAND.cardBg}; border-radius: 12px; overflow: hidden; border: 1px solid ${BRAND.border};">

          <!-- Hero -->
          <tr>
            <td class="hero" style="background-color: ${BRAND.heroBg}; padding: 40px 40px 32px; text-align: left; border-bottom: 1px solid ${BRAND.border};">
              <img src="${BRAND.logoUrl}" alt="Pimlico | XHS" width="180" style="display: block; max-width: 180px; height: auto; margin-bottom: 24px;" />
              ${eyebrowBlock}
              <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: ${BRAND.textPrimary}; font-size: 26px; font-weight: 500; line-height: 1.25; letter-spacing: -0.4px;">${heading}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding: 36px 40px 40px;">
              ${introBlock}
              ${bodyBlock}
              ${ctaBlock}
              ${footerNoteBlock}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer" style="background-color: ${BRAND.heroBg}; padding: 28px 40px; border-top: 1px solid ${BRAND.border};">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="left" style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 500; color: ${BRAND.textMuted}; text-transform: uppercase; letter-spacing: 0.16em;">
                    PIMLICO&nbsp;&nbsp;·&nbsp;&nbsp;XHS&trade; COPILOT
                  </td>
                  <td align="right" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: 400; color: ${BRAND.textMuted};">
                    <a href="https://pimlicosolutions.com" style="color: ${BRAND.textTertiary}; text-decoration: none;">pimlicosolutions.com</a>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 11px; font-weight: 400; color: ${BRAND.textMuted}; line-height: 1.6;">
                    &copy; ${year} Pimlico Solutions Ltd. All rights reserved.<br>
                    You're receiving this email because you contacted Pimlico XHS&trade; Copilot.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Render a simple admin notification email (internal).
 * Plain, legible, same palette.
 */
export function renderAdminNotification({ title, subtitle, fields = [] }) {
  const year = new Date().getFullYear();
  const rows = fields
    .map(
      (f) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid ${BRAND.border}; font-family: 'Courier New', Courier, monospace; font-size: 11px; color: ${BRAND.textMuted}; text-transform: uppercase; letter-spacing: 0.12em; vertical-align: top; width: 140px;">${f.label}</td>
        <td style="padding: 10px 0 10px 16px; border-bottom: 1px solid ${BRAND.border}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BRAND.textSecondary}; line-height: 1.5;">${f.value}</td>
      </tr>
    `,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND.pageBg}; color: ${BRAND.textPrimary};">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${BRAND.pageBg};">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: ${BRAND.cardBg}; border-radius: 12px; border: 1px solid ${BRAND.border};">
          <tr>
            <td style="padding: 32px 36px 28px; border-bottom: 1px solid ${BRAND.border};">
              <p style="margin: 0 0 10px; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 500; color: ${BRAND.textMuted}; text-transform: uppercase; letter-spacing: 0.18em;">[ INTERNAL ]</p>
              <h1 style="margin: 0 0 6px; font-size: 22px; font-weight: 500; color: ${BRAND.textPrimary}; line-height: 1.3; letter-spacing: -0.3px;">${title}</h1>
              ${subtitle ? `<p style="margin: 0; font-size: 14px; color: ${BRAND.textTertiary}; line-height: 1.5;">${subtitle}</p>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 36px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                ${rows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: ${BRAND.heroBg}; padding: 18px 36px; border-top: 1px solid ${BRAND.border}; font-family: 'Courier New', Courier, monospace; font-size: 10px; color: ${BRAND.textMuted}; text-transform: uppercase; letter-spacing: 0.14em;">
              PIMLICO&nbsp;·&nbsp;XHS&trade; COPILOT&nbsp;·&nbsp;${year}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Escape HTML to safely interpolate user-provided content.
 */
export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
