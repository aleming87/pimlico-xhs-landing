import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    console.log('🔍 Survey API called');
    console.log('📧 Environment check:');
    console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('- RESEND_API_KEY length:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0);
    console.log('- CONTACT_EMAIL:', process.env.CONTACT_EMAIL || 'NOT SET');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    // Extract contact data if it exists
    const contactData = data.contactData || {};
    
    console.log('📋 Contact data received:', {
      hasContactData: !!data.contactData,
      firstName: contactData.firstName,
      email: contactData.email,
      company: contactData.company
    });
    
    // Format the COMBINED intelligence report
    const combinedReport = `
====================================================
NEW LEAD SUBMISSION - COMPLETE PROSPECT PROFILE
====================================================

👤 CONTACT INFORMATION

Name: ${contactData.firstName || 'N/A'} ${contactData.lastName || 'N/A'}
Company: ${contactData.company || 'N/A'}
Email: ${contactData.email || 'N/A'}
Message: ${contactData.message || 'N/A'}

Consents:
- Privacy Policy Agreed: ${contactData.agreedToPolicy ? 'Yes' : 'No'}
- Marketing Communications: ${contactData.marketingConsent ? 'Yes' : 'No'}

====================================================

📊 PROSPECT INTELLIGENCE - SURVEY RESPONSES

Top 5 Jurisdictions (Ranked):
${data.topJurisdictions.map((j, i) => `${i + 1}. ${j}`).join('\n')}

Primary Focus Areas: ${data.focusAreas.join(', ')}


${data.topTopicsAI && data.topTopicsAI.length > 0 ? `
Top 3 AI Regulatory Topics (Ranked):
${data.topTopicsAI.map((t, i) => `${i + 1}. ${t}`).join('\n')}
` : ''}
${data.topTopicsPayments && data.topTopicsPayments.length > 0 ? `
Top 3 Payments Regulatory Topics (Ranked):
${data.topTopicsPayments.map((t, i) => `${i + 1}. ${t}`).join('\n')}
` : ''}
${data.topTopicsGambling && data.topTopicsGambling.length > 0 ? `
Top 3 Gambling Regulatory Topics (Ranked):
${data.topTopicsGambling.map((t, i) => `${i + 1}. ${t}`).join('\n')}
` : ''}

---------------------------------------------------

👤 PROSPECT PROFILE

Implementation Timeline: ${data.timeline}

---------------------------------------------------

🎯 COMPLIANCE INTELLIGENCE

Current Challenges:
${data.challenges.length > 0 ? data.challenges.map(c => `• ${c}`).join('\n') : '• None specified'}

Using Competing Vendors: ${data.usingCompetitors}
${data.competitorVendors ? `Competitors: ${data.competitorVendors}` : ''}

---------------------------------------------------

💼 WORKSPACE & COLLABORATION

Has Shared Regulatory Workspace: ${data.hasSharedWorkspace}

Productivity & GRC Apps:
${data.productivityApps.length > 0 ? data.productivityApps.map(i => `• ${i}`).join('\n') : '• None specified'}

---------------------------------------------------

🕐 SUBMITTED: ${new Date().toISOString()}

====================================================
    `.trim();

    // Check if Resend is configured
    if (process.env.RESEND_API_KEY) {
      console.log('✅ RESEND_API_KEY found, attempting to send email...');
      
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      const recipientEmail = process.env.CONTACT_EMAIL || 'andrew@pimlicosolutions.com';
      console.log('📧 Sending COMBINED lead report to:', recipientEmail);
      console.log('📧 Subject:', `🎯 NEW LEAD - ${contactData.firstName || 'Unknown'} ${contactData.lastName || ''} from ${contactData.company || 'Unknown Company'} | ${data.focusAreas.join('+')}`);

      // Send combined report to your team
      try {
        const leadEmail = await resend.emails.send({
          from: 'Pimlico XHS Lead Intelligence <onboarding@resend.dev>',
          to: recipientEmail,
          subject: `🎯 NEW LEAD - ${contactData.firstName || 'Unknown'} ${contactData.lastName || ''} from ${contactData.company || 'Unknown Company'} | ${data.focusAreas.join('+')}`,
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="700" cellpadding="0" cellspacing="0" style="max-width: 700px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">🎯 New Lead Submission</h1>
              <p style="margin: 8px 0 0; color: #bfdbfe; font-size: 14px;">Complete Prospect Profile</p>
            </td>
          </tr>
          
          <!-- Contact Information -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">👤 Contact Information</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600;">Name:</td>
                  <td style="color: #1e293b; font-size: 14px;"><strong>${contactData.firstName || 'N/A'} ${contactData.lastName || 'N/A'}</strong></td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600;">Company:</td>
                  <td style="color: #1e293b; font-size: 14px;"><strong>${contactData.company || 'N/A'}</strong></td>
                </tr>
                <tr>
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600;">Email:</td>
                  <td style="color: #2563eb; font-size: 14px;"><a href="mailto:${contactData.email || ''}" style="color: #2563eb; text-decoration: none;">${contactData.email || 'N/A'}</a></td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Message:</td>
                  <td style="color: #1e293b; font-size: 14px;">${contactData.message || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600;">Privacy Policy:</td>
                  <td style="color: #1e293b; font-size: 14px;">${contactData.agreedToPolicy ? '✅ Agreed' : '❌ Not Agreed'}</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600;">Marketing:</td>
                  <td style="color: #1e293b; font-size: 14px;">${contactData.marketingConsent ? '✅ Yes' : '❌ No'}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Survey Responses -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📊 Prospect Intelligence</h2>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Primary Focus Areas</p>
                <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 600; color: #2563eb;">${data.focusAreas.join(' • ')}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Top 5 Jurisdictions</p>
                <ol style="margin: 0; padding-left: 20px; color: #1e293b; font-size: 14px; line-height: 1.8;">
                  ${data.topJurisdictions.map(j => `<li>${j}</li>`).join('')}
                </ol>
              </div>
              
              ${data.topTopicsAI && data.topTopicsAI.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Top 3 AI Regulatory Topics</p>
                <ol style="margin: 0; padding-left: 20px; color: #1e293b; font-size: 14px; line-height: 1.8;">
                  ${data.topTopicsAI.map(t => `<li>${t}</li>`).join('')}
                </ol>
              </div>
              ` : ''}
              
              ${data.topTopicsPayments && data.topTopicsPayments.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Top 3 Payments Regulatory Topics</p>
                <ol style="margin: 0; padding-left: 20px; color: #1e293b; font-size: 14px; line-height: 1.8;">
                  ${data.topTopicsPayments.map(t => `<li>${t}</li>`).join('')}
                </ol>
              </div>
              ` : ''}
              
              ${data.topTopicsGambling && data.topTopicsGambling.length > 0 ? `
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Top 3 Gambling Regulatory Topics</p>
                <ol style="margin: 0; padding-left: 20px; color: #1e293b; font-size: 14px; line-height: 1.8;">
                  ${data.topTopicsGambling.map(t => `<li>${t}</li>`).join('')}
                </ol>
              </div>
              ` : ''}
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Implementation Timeline</p>
                <p style="margin: 0; color: #1e293b; font-size: 14px;">${data.timeline}</p>
              </div>
            </td>
          </tr>
          
          <!-- Compliance Intelligence -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🎯 Compliance Intelligence</h2>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Current Challenges</p>
                <ul style="margin: 0; padding-left: 20px; color: #1e293b; font-size: 14px; line-height: 1.8;">
                  ${data.challenges.length > 0 ? data.challenges.map(c => `<li>${c}</li>`).join('') : '<li>None specified</li>'}
                </ul>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Using Competitors</p>
                <p style="margin: 0; color: #1e293b; font-size: 14px;">${data.usingCompetitors}</p>
                ${data.competitorVendors ? `<p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">Competitors: ${data.competitorVendors}</p>` : ''}
              </div>
            </td>
          </tr>
          
          <!-- Workspace & Collaboration -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #2563eb; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">💼 Workspace & Collaboration</h2>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Shared Regulatory Workspace</p>
                <p style="margin: 0; color: #1e293b; font-size: 14px;">${data.hasSharedWorkspace}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Productivity & GRC Apps</p>
                <ul style="margin: 0; padding-left: 20px; color: #1e293b; font-size: 14px; line-height: 1.8;">
                  ${data.productivityApps.length > 0 ? data.productivityApps.map(i => `<li>${i}</li>`).join('') : '<li>None specified</li>'}
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-align: center;">
                Submitted: ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
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
        
        console.log('✅ Combined lead email sent successfully!');
        console.log('📧 Email ID:', leadEmail.id);
        console.log('📧 Response:', JSON.stringify(leadEmail, null, 2));
      } catch (emailError) {
        console.error('❌ ERROR sending lead email:', emailError);
        console.error('❌ Error details:', JSON.stringify(emailError, null, 2));
        throw emailError;
      }

      // Send confirmation to the user if we have their email
      if (contactData.email) {
        console.log('📧 Sending user confirmation to:', contactData.email);
        
        try {
          const userEmail = await resend.emails.send({
            from: 'Pimlico XHS <onboarding@resend.dev>',
            to: contactData.email,
            subject: 'Welcome to Pimlico XHS™ - Your Regulatory AI Workspace Partner',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Pimlico XHS™</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .header { padding: 30px 20px 20px !important; }
      .content { padding: 30px 20px !important; }
      .footer { padding: 20px !important; }
      h1 { font-size: 24px !important; }
      h2 { font-size: 18px !important; }
      .step-number { width: 28px !important; height: 28px !important; font-size: 14px !important; }
      .step-text { font-size: 14px !important; }
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
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Pimlico XHS™</h1>
              <p style="margin: 10px 0 0; color: #bfdbfe; font-size: 16px;">Your Regulatory AI Workspace Partner</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="content" style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #f1f5f9; line-height: 1.6;">
                Hi <strong>${contactData.firstName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Thank you for your interest in <strong>Pimlico XHS™</strong> - the regulatory AI workspace designed for ${data.focusAreas.join(', ')} compliance teams.
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                We've received your submission and our team is reviewing your requirements.
              </p>
              
              <!-- What's Next Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #0f172a; border-radius: 12px; padding: 24px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 20px; color: #3b82f6; font-size: 20px; font-weight: 600;">What Happens Next?</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0;">
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 50px;">
                          <table class="step-number" cellpadding="0" cellspacing="0" style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-weight: bold; font-size: 16px;">1</td>
                            </tr>
                          </table>
                        </td>
                        <td class="step-text" style="padding: 12px 0 12px 0; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                          Our team will review your submission
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 50px;">
                          <table class="step-number" cellpadding="0" cellspacing="0" style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-weight: bold; font-size: 16px;">2</td>
                            </tr>
                          </table>
                        </td>
                        <td class="step-text" style="padding: 12px 0 12px 0; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                          We'll prepare a personalized demo tailored to your focus areas
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 50px;">
                          <table class="step-number" cellpadding="0" cellspacing="0" style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-weight: bold; font-size: 16px;">3</td>
                            </tr>
                          </table>
                        </td>
                        <td class="step-text" style="padding: 12px 0 12px 0; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                          A member of our team will reach out within 24-48 hours
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Your Submission (formatted like What Happens Next) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #0f172a; border-radius: 12px; padding: 24px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 20px; color: #3b82f6; font-size: 20px; font-weight: 600;">Your Submission</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0;">
                      ${data.focusAreas.length > 0 ? `
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 50px;">
                          <table class="step-number" cellpadding="0" cellspacing="0" style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-weight: bold; font-size: 16px;">•</td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 12px 0 12px 0;">
                          <p style="margin: 0 0 4px; color: #cbd5e1; font-size: 13px; font-weight: 600;">Focus Area(s)</p>
                          <p class="step-text" style="margin: 0; color: #f1f5f9; font-size: 15px;">${data.focusAreas.join(' • ')}</p>
                        </td>
                      </tr>
                      ` : ''}
                      
                      ${data.topJurisdictions && data.topJurisdictions.length > 0 ? `
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 50px;">
                          <table class="step-number" cellpadding="0" cellspacing="0" style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-weight: bold; font-size: 16px;">•</td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 12px 0 12px 0;">
                          <p style="margin: 0 0 4px; color: #cbd5e1; font-size: 13px; font-weight: 600;">Jurisdictions</p>
                          <p class="step-text" style="margin: 0; color: #f1f5f9; font-size: 15px;">${data.topJurisdictions.join(', ')}</p>
                        </td>
                      </tr>
                      ` : ''}
                      
                      ${data.challenges && data.challenges.length > 0 ? `
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 50px;">
                          <table class="step-number" cellpadding="0" cellspacing="0" style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-weight: bold; font-size: 16px;">•</td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 12px 0 12px 0;">
                          <p style="margin: 0 0 4px; color: #cbd5e1; font-size: 13px; font-weight: 600;">Challenges</p>
                          <p class="step-text" style="margin: 0; color: #f1f5f9; font-size: 15px;">${data.challenges.join(', ')}</p>
                        </td>
                      </tr>
                      ` : ''}
                      
                      ${data.timeline ? `
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 50px;">
                          <table class="step-number" cellpadding="0" cellspacing="0" style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%;">
                            <tr>
                              <td align="center" valign="middle" style="color: #ffffff; font-weight: bold; font-size: 16px;">•</td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 12px 0 12px 0;">
                          <p style="margin: 0 0 4px; color: #cbd5e1; font-size: 13px; font-weight: 600;">Objective</p>
                          <p class="step-text" style="margin: 0; color: #f1f5f9; font-size: 15px;">${data.timeline}</p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                In the meantime, feel free to explore our website to learn more about how Pimlico XHS™ can transform your regulatory monitoring.
              </p>
              
              <p style="margin: 20px 0 0; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
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
                    <a href="https://www.pimlicosolutions.com" style="display: inline-block; margin: 0 8px; opacity: 0.6; transition: opacity 0.2s;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/company/wearepimlico" style="display: inline-block; margin: 0 8px; opacity: 0.6; transition: opacity 0.2s;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#94a3b8">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="https://x.com/pimlicoxhs" style="display: inline-block; margin: 0 8px; opacity: 0.6; transition: opacity 0.2s;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#94a3b8">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    <a href="https://wa.me/447961642867" style="display: inline-block; margin: 0 8px; opacity: 0.6; transition: opacity 0.2s;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#94a3b8">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
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
          console.log('✅ User confirmation email sent successfully!');
          console.log('📧 Email ID:', userEmail.id);
        } catch (userEmailError) {
          console.error('❌ ERROR sending user confirmation:', userEmailError);
        }
      }
    } else {
      console.error('❌ RESEND_API_KEY NOT FOUND IN ENVIRONMENT!');
      console.error('❌ Email will NOT be sent. Check Vercel environment variables.');
      // Fallback: just log to console if Resend not configured
      console.log('📊 COMBINED Lead Submission (Resend not configured):');
      console.log(combinedReport);
    }

    return NextResponse.json({ success: true, message: 'Lead intelligence captured' });
  } catch (error) {
    console.error('❌ CRITICAL ERROR in survey route:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to process survey submission',
        message: error.message,
        details: 'Check Vercel logs for full error details'
      },
      { status: 500 }
    );
  }
}
