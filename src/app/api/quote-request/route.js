export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, company, users, verticals, coverage, billing, monthlyPrice, annualPrice, plan } = data;

    const verticalsList = (verticals || []).join(', ');
    const coverageList = (coverage || []).join(', ');
    const monthlyStr = monthlyPrice ? monthlyPrice.toLocaleString() : '0';
    const annualStr = annualPrice ? annualPrice.toLocaleString() : '0';

    const quoteDetails = [
      'Quote Request from Pricing Configurator',
      '',
      'Contact:',
      '  Name: ' + name,
      '  Email: ' + email,
      '  Company: ' + (company || 'Not provided'),
      '',
      'Configuration:',
      '  Plan: ' + plan,
      '  Users: ' + users,
      '  Verticals: ' + verticalsList,
      '  Coverage: ' + coverageList,
      '  Billing: ' + billing,
      '',
      'Pricing:',
      '  Monthly: \u00a3' + monthlyStr + '/mo',
      '  Annual: \u00a3' + annualStr + '/year',
      '',
      'Submitted: ' + new Date().toISOString(),
    ].join('\n');

    console.log('Quote Request:', quoteDetails);

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const recipientEmail = process.env.CONTACT_EMAIL || 'andrew@pimlicosolutions.com';

      try {
        await resend.emails.send({
          from: 'Pimlico XHS <onboarding@resend.dev>',
          to: recipientEmail,
          subject: 'QUOTE REQUEST - ' + name + ' from ' + (company || 'Unknown') + ' (' + users + ' users, \u00a3' + monthlyStr + '/mo)',
          text: quoteDetails,
        });

        const confirmText = [
          'Hi ' + name + ',',
          '',
          'Thank you for your interest in XHS Copilot.',
          '',
          'Here is a summary of your configuration:',
          '- Plan: ' + plan,
          '- Users: ' + users,
          '- Verticals: ' + verticalsList,
          '- Coverage: ' + coverageList,
          '- Estimated price: \u00a3' + monthlyStr + '/month (\u00a3' + annualStr + '/year)',
          '',
          'A member of our team will be in touch shortly to discuss your requirements.',
          'In the meantime, you can start a 14-day free trial at https://xhsdata.ai/register',
          '',
          'Best regards,',
          'The Pimlico Team',
          'pimlicosolutions.com',
        ].join('\n');

        await resend.emails.send({
          from: 'Pimlico XHS <onboarding@resend.dev>',
          to: email,
          subject: 'Your XHS Copilot quote',
          text: confirmText,
        });
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    }

    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        const slackText = 'New Quote Request\n*' + name + '* from *' + (company || 'Unknown') + '*\n' + email + '\n\n*Config:* ' + users + ' users, ' + verticalsList + ', ' + coverageList + ', ' + billing + '\n*Price:* \u00a3' + monthlyStr + '/mo (\u00a3' + annualStr + '/yr)';
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: slackText }),
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
