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
Phone: ${data.country} ${data.phoneNumber}
Message: ${data.message}

Consents:
- Privacy Policy Agreed: ${data.agreedToPolicy ? 'Yes' : 'No'}
- Marketing Communications: ${data.marketingConsent ? 'Yes' : 'No'}
- Newsletter Subscription: ${data.newsletterConsent ? 'Yes' : 'No'}

Submitted: ${new Date().toISOString()}
    `.trim();

    // TODO: Implement your email service here
    // Options:
    // 1. Use Resend (recommended): https://resend.com
    // 2. Use SendGrid
    // 3. Use Nodemailer with SMTP
    
    // For now, log to console (replace with actual email service)
    console.log('Form submission received:', emailContent);

    // You would send the email like this with Resend:
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // 
    // await resend.emails.send({
    //   from: 'noreply@pimlicosolutions.com',
    //   to: 'contact@pimlicosolutions.com',
    //   subject: 'New Contact Form Submission',
    //   text: emailContent,
    // });
    //
    // await resend.emails.send({
    //   from: 'noreply@pimlicosolutions.com',
    //   to: data.email,
    //   subject: 'Thank you for contacting Pimlico XHS',
    //   html: `
    //     <h1>Thank you for your interest in Pimlico XHS™</h1>
    //     <p>Hi ${data.firstName},</p>
    //     <p>We've received your inquiry and will be in touch soon.</p>
    //     <p>To help us prepare for our conversation, please complete our brief survey:</p>
    //     <a href="https://pimlicosolutions.com/contact/survey">Complete Survey</a>
    //     <p>Best regards,<br>The Pimlico XHS Team</p>
    //   `,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}
