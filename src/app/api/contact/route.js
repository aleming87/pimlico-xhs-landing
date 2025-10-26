import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await request.json();
    
    // Format the email content
    const emailContent = `
New Contact Form Submission

Name: ${data.firstName} ${data.lastName}
Company: ${data.company}
Email: ${data.email}
Message: ${data.message}

Consents:
- Privacy Policy Agreed: ${data.agreedToPolicy ? 'Yes' : 'No'}
- Marketing Communications: ${data.marketingConsent ? 'Yes' : 'No'}

Submitted: ${new Date().toISOString()}
    `.trim();

    // Send notification to your team
    await resend.emails.send({
      from: 'Pimlico XHS <noreply@pimlicosolutions.com>',
      to: process.env.CONTACT_EMAIL || 'contact@pimlicosolutions.com',
      subject: `New Contact: ${data.firstName} ${data.lastName} from ${data.company}`,
      text: emailContent,
    });

    // Send confirmation to the user
    await resend.emails.send({
      from: 'Pimlico XHS <noreply@pimlicosolutions.com>',
      to: data.email,
      subject: 'Thank you for contacting Pimlico XHS™',
      html: `
        <h1>Thank you for your interest in Pimlico XHS™</h1>
        <p>Hi ${data.firstName},</p>
        <p>We've received your inquiry and will be in touch soon.</p>
        <p>Best regards,<br>The Pimlico XHS Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}
