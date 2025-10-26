import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
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

    // Check if Resend is configured
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      console.log('Sending contact form email to:', process.env.CONTACT_EMAIL || 'contact@pimlicosolutions.com');

      // Send notification to your team
      // Using onboarding@resend.dev until domain is verified
      const teamEmail = await resend.emails.send({
        from: 'Pimlico XHS <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'contact@pimlicosolutions.com',
        subject: `New Contact: ${data.firstName} ${data.lastName} from ${data.company}`,
        text: emailContent,
      });
      
      console.log('Team email sent:', teamEmail);

      // Send confirmation to the user
      const userEmail = await resend.emails.send({
        from: 'Pimlico XHS <onboarding@resend.dev>',
        to: data.email,
        subject: 'Thank you for contacting Pimlico XHS™',
        html: `
          <h1>Thank you for your interest in Pimlico XHS™</h1>
          <p>Hi ${data.firstName},</p>
          <p>We've received your inquiry and will be in touch soon.</p>
          <p>Best regards,<br>The Pimlico XHS Team</p>
        `,
      });
      
      console.log('User confirmation email sent:', userEmail);
    } else {
      // Fallback: just log to console if Resend not configured
      console.log('📧 Contact Form Submission (Resend not configured):');
      console.log(emailContent);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}
