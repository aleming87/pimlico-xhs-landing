import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Format the email content for the team
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

    console.log('📧 Contact Form Data Received:');
    console.log(emailContent);

    // Send email notification to the team
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const recipientEmail = process.env.CONTACT_EMAIL || 'andrew@pimlicosolutions.com';

      try {
        // Send to team
        await resend.emails.send({
          from: 'Pimlico XHS Contact <onboarding@resend.dev>',
          to: recipientEmail,
          subject: `🎯 NEW CONTACT - ${data.firstName} ${data.lastName} from ${data.company}`,
          text: emailContent,
        });

        // Send confirmation to user
        await resend.emails.send({
          from: 'Pimlico XHS <onboarding@resend.dev>',
          to: data.email,
          subject: 'Thank you for contacting Pimlico XHS™',
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You - Pimlico XHS™</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .header { padding: 30px 20px 20px !important; }
      .content { padding: 30px 20px !important; }
      .footer { padding: 20px !important; }
      h1 { font-size: 24px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table class="container" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
          
          <!-- Header with Logo -->
          <tr>
            <td class="header" style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 40px 30px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <img src="https://pimlicosolutions.com/XHS_Logo_White.png" alt="Pimlico XHS" style="max-width: 180px; height: auto;" />
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Thank You for Getting in Touch</h1>
              <p style="margin: 10px 0 0; color: #bfdbfe; font-size: 16px;">We'll be in contact soon</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="content" style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #f1f5f9; line-height: 1.6;">
                Hi <strong>${data.firstName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Thank you for contacting <strong>Pimlico XHS™</strong>. We've received your message and a member of our team will get back to you within 24-48 hours.
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                In the meantime, feel free to explore our website to learn more about how XHS™ transforms regulatory compliance.
              </p>
              
              <p style="margin: 30px 0 0; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #f1f5f9;">The Pimlico XHS™ Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer" style="background-color: #0f172a; padding: 30px 40px; border-top: 1px solid #334155;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <!-- Social Media Icons -->
                    <a href="https://www.pimlicosolutions.com" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <img src="https://img.icons8.com/material-outlined/20/94a3b8/domain.png" alt="Website" width="20" height="20" style="display: block; opacity: 0.7;" />
                    </a>
                    <a href="https://www.linkedin.com/company/wearepimlico" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <img src="https://img.icons8.com/ios-filled/20/94a3b8/linkedin.png" alt="LinkedIn" width="20" height="20" style="display: block; opacity: 0.7;" />
                    </a>
                    <a href="https://x.com/pimlicoxhs" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <img src="https://img.icons8.com/ios-filled/20/94a3b8/twitterx.png" alt="X" width="20" height="20" style="display: block; opacity: 0.7;" />
                    </a>
                    <a href="https://wa.me/447961642867" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <img src="https://img.icons8.com/ios-filled/20/94a3b8/whatsapp.png" alt="WhatsApp" width="20" height="20" style="display: block; opacity: 0.7;" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px; color: #64748b; font-size: 13px; line-height: 1.6;">
                    © 2025 Pimlico Solutions Ltd. All rights reserved.
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
</html>
          `,
        });

        console.log('✅ Contact emails sent successfully');
      } catch (emailError) {
        console.error('❌ ERROR sending contact email:', emailError);
      }
    }
    
    // Store the contact data for the survey to use
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
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}
