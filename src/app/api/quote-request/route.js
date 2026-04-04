export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    const { name, email, company, users, verticals, coverage, billing, monthlyPrice, annualPrice, plan } = data;

    // Format quote details
    const quoteDetails = `
Quote Request from Pricing Configurator

Contact:
  Name: ${name}
  Email: ${email}
  Company: ${company || 'Not provided'}

Configuration:
  Plan: ${plan}
  Users: ${users}
  Verticals: ${verticals.join(', ')}
  Coverage: ${coverage.join(', ')}
  Billing: ${billing}

Pricing:
  Monthly: £${monthlyPrice?.toLocaleString()}/mo
  Annual: £${annualPrice?.toLocaleString()}/year

Submitted: ${new Date().toISOString()}
    `.trim();

    console.log('💰 Quote Request:', quoteDetails);

    // 1. Send email notification via Resend
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const recipientEmail = process.env.CONTACT_EMAIL || 'andrew@pimlicosolutions.com';

      try {
        await resend.emails.send({
          from: 'Pimlico XHS\u2122 <onboarding@resend.dev>',
          to: recipientEmail,
          subject: \`💰 QUOTE REQUEST - \${name} from \${company || 'Unknown'} (\${users} users, £\${monthlyPrice?.toLocaleString()}/mo)\`,
          text: quoteDetails,
        });

        // Confirmation to prospect
        await resend.emails.send({
          from: 'Pimlico XHS\u2122 <onboarding@resend.dev>',
          to: email,
          subject: 'Your XHS\u2122 Copilot quote',
          text: \`Hi \${name},

Thank you for your interest in XHS\u2122 Copilot.

Here's a summary of your configuration:
- Plan: \${plan}
- Users: \${users}
- Verticals: \${verticals.join(', ')}
- Coverage: \${coverage.join(', ')}
- Estimated price: £\${monthlyPrice?.toLocaleString()}/month (£\${annualPrice?.toLocaleString()}/year)

A member of our team will be in touch shortly to discuss your requirements. In the meantime, you can start a 14-day free trial at https://xhsdata.ai/register.

Best regards,
The Pimlico Team
pimlicosolutions.com\`,
        });
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    }

    // 2. Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: \`💰 *New Quote Request*\\n*\${name}* from *\${company || 'Unknown'}*\\n\${email}\\n\\n*Config:* \${users} users · \${verticals.join(', ')} · \${coverage.join(', ')} · \${billing}\\n*Price:* £\${monthlyPrice?.toLocaleString()}/mo (£\${annualPrice?.toLocaleString()}/yr)\`,
          }),
        });
      } catch (slackErr) {
        console.error('Slack notification error:', slackErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quote request error:', error);
    return NextResponse.json({ error: 'Failed to process quote request' }, { status: 500 });
  }
}
