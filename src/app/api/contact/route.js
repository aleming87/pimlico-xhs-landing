export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { renderEmail, renderAdminNotification, escapeHtml } from '@/lib/emailTemplate';
import { trackedLink } from '@/lib/trackedLink';
import { sender, teamRecipient } from '@/lib/email';

export async function POST(request) {
  try {
    const data = await request.json();

    console.log('Contact Form Submission:', {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      company: data.company,
    });

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const recipientEmail = teamRecipient();

      try {
        // Admin notification
        const adminHtml = renderAdminNotification({
          title: 'New contact submission',
          subtitle: `${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)} · ${escapeHtml(data.company || 'Unknown')}`,
          fields: [
            { label: 'Name', value: `${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}` },
            { label: 'Email', value: `<a href="mailto:${escapeHtml(data.email)}" style="color:#cbd5e1;text-decoration:none;">${escapeHtml(data.email)}</a>` },
            { label: 'Company', value: escapeHtml(data.company || 'Not provided') },
            { label: 'Interest', value: escapeHtml(data.interest || 'General') },
            { label: 'Message', value: escapeHtml(data.message || '—').replace(/\n/g, '<br>') },
            { label: 'Privacy', value: data.agreedToPolicy ? 'Accepted' : 'Not accepted' },
            { label: 'Marketing', value: data.marketingConsent ? 'Opted in' : 'Opted out' },
            { label: 'Submitted', value: new Date().toISOString() },
          ],
        });

        await resend.emails.send({
          from: sender('Pimlico XHS Contact'),
          to: recipientEmail,
          subject: `CONTACT · ${data.firstName} ${data.lastName} · ${data.company || 'Unknown'}`,
          html: adminHtml,
        });

        // User confirmation
        const userHtml = renderEmail({
          preheader: 'Thanks for getting in touch with Pimlico XHS\u2122 Copilot',
          eyebrow: 'RECEIVED',
          heading: 'Thanks for getting in touch.',
          intro: `Hi ${escapeHtml(data.firstName)}, we've received your message and a member of the Pimlico team will be in touch shortly.`,
          body: `
            <p style="margin: 0 0 16px; color: #cbd5e1;">In the meantime, you can start your 14-day trial — up to 8 jurisdictions, no credit card required.</p>
            <p style="margin: 0; color: #94a3b8; font-size: 14px;">Every regulatory change. Tracked. Sourced. Verified. Delivered.</p>
          `,
          ctaLabel: 'Start your 14-day trial',
          ctaHref: trackedLink('https://xhsdata.ai/register', {
            campaign: 'contact_confirmation',
            content: 'cta_button',
            clickParams: data.clickParams || {},
          }),
          footerNote: 'Reply directly to this email if you need anything. We read every message.',
        });

        await resend.emails.send({
          from: sender('Pimlico XHS'),
          to: data.email,
          subject: 'Thanks for contacting Pimlico XHS\u2122',
          html: userHtml,
          replyTo: recipientEmail,
        });

        console.log('Contact emails sent successfully');
      } catch (emailError) {
        console.error('ERROR sending contact email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      contactData: {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        email: data.email,
        message: data.message,
        agreedToPolicy: data.agreedToPolicy,
        marketingConsent: data.marketingConsent,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}
