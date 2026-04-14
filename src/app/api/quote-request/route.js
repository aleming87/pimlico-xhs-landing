export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { renderEmail, renderAdminNotification, escapeHtml } from '@/lib/emailTemplate';
import { trackedLink } from '@/lib/trackedLink';
import { sender, teamRecipient } from '@/lib/email';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, company, users, verticals, coverage, billing, monthlyPrice, annualPrice, plan } = data;

    const verticalsList = (verticals || []).join(', ');
    const coverageList = (coverage || []).join(', ');
    const monthlyStr = monthlyPrice ? monthlyPrice.toLocaleString() : '0';
    const annualStr = annualPrice ? annualPrice.toLocaleString() : '0';

    console.log('Quote Request:', { name, email, company, users, verticals, coverage, billing, monthlyPrice, annualPrice, plan });

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const recipientEmail = teamRecipient();

      try {
        // Admin notification
        const adminHtml = renderAdminNotification({
          title: 'New quote request',
          subtitle: `${escapeHtml(name)} · ${escapeHtml(company || 'Unknown')}`,
          fields: [
            { label: 'Contact', value: `${escapeHtml(name)}<br><a href="mailto:${escapeHtml(email)}" style="color:#cbd5e1;text-decoration:none;">${escapeHtml(email)}</a>` },
            { label: 'Company', value: escapeHtml(company || 'Not provided') },
            { label: 'Plan', value: escapeHtml(plan || '—') },
            { label: 'Users', value: String(users) },
            { label: 'Verticals', value: escapeHtml(verticalsList) },
            { label: 'Coverage', value: escapeHtml(coverageList) },
            { label: 'Billing', value: escapeHtml(billing) },
            { label: 'Monthly', value: `&pound;${monthlyStr}/mo` },
            { label: 'Annual', value: `&pound;${annualStr}/year` },
            { label: 'Submitted', value: new Date().toISOString() },
          ],
        });

        await resend.emails.send({
          from: sender('Pimlico XHS Quote'),
          to: recipientEmail,
          subject: `QUOTE REQUEST · ${name} · ${company || 'Unknown'} · £${monthlyStr}/mo`,
          html: adminHtml,
        });

        // User confirmation
        const summaryHtml = `
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 8px 0 4px; border: 1px solid #1e293b; border-radius: 8px; background-color: #020617;">
            <tr><td style="padding: 14px 18px; border-bottom: 1px solid #1e293b;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.14em;">PLAN</span><br><span style="color: #cbd5e1; font-size: 14px;">${escapeHtml(plan || '—')}</span></td></tr>
            <tr><td style="padding: 14px 18px; border-bottom: 1px solid #1e293b;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.14em;">TEAM</span><br><span style="color: #cbd5e1; font-size: 14px;">${users} user${users === 1 ? '' : 's'}</span></td></tr>
            <tr><td style="padding: 14px 18px; border-bottom: 1px solid #1e293b;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.14em;">VERTICALS</span><br><span style="color: #cbd5e1; font-size: 14px;">${escapeHtml(verticalsList)}</span></td></tr>
            <tr><td style="padding: 14px 18px; border-bottom: 1px solid #1e293b;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.14em;">COVERAGE</span><br><span style="color: #cbd5e1; font-size: 14px;">${escapeHtml(coverageList)}</span></td></tr>
            <tr><td style="padding: 14px 18px;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.14em;">ESTIMATED PRICE</span><br><span style="color: #ffffff; font-size: 18px; font-weight: 500;">&pound;${monthlyStr}/month</span> <span style="color: #94a3b8; font-size: 13px;">&nbsp;·&nbsp; &pound;${annualStr}/year</span></td></tr>
          </table>
        `;

        const userHtml = renderEmail({
          preheader: `Your XHS Copilot quote · £${monthlyStr}/mo`,
          eyebrow: 'QUOTE',
          heading: 'Your XHS\u2122 Copilot quote.',
          intro: `Hi ${escapeHtml(name)}, thanks for configuring a quote on pimlicosolutions.com. Here's the summary based on your selection.`,
          body: summaryHtml,
          ctaLabel: 'Start your 14-day trial',
          ctaHref: trackedLink('https://xhsdata.ai/register', {
            campaign: 'quote_confirmation',
            content: 'cta_button',
            term: plan || undefined,
          }),
          footerNote: 'A member of our team will be in touch shortly to walk you through the configuration and answer any questions. Reply to this email if you need anything in the meantime.',
        });

        await resend.emails.send({
          from: sender('Pimlico XHS'),
          to: email,
          subject: 'Your XHS\u2122 Copilot quote',
          html: userHtml,
          replyTo: recipientEmail,
        });
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quote request error:', error);
    return NextResponse.json({ error: 'Failed to process quote request' }, { status: 500 });
  }
}
