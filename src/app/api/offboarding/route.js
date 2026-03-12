import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    console.log('🔍 Offboarding survey API called');
    console.log('📧 Environment check:');
    console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('- CONTACT_EMAIL:', process.env.CONTACT_EMAIL || 'NOT SET');

    const {
      name = 'N/A',
      email = 'N/A',
      company = 'N/A',
      trialDuration = 'N/A',
      overallRating = 'N/A',
      primaryReason = 'N/A',
      reasonDetail = '',
      featuresUsed = [],
      featureRatings = {},
      mostValuable = '',
      leastValuable = '',
      missingFeatures = '',
      dataQuality = 'N/A',
      coverageGaps = '',
      easeOfUse = 'N/A',
      uiImprovements = '',
      wouldRecommend = 'N/A',
      switchingTo = '',
      switchingReason = '',
      comeback = 'N/A',
      comebackConditions = '',
      additionalFeedback = '',
    } = data;

    // Format the plain text report
    const plainReport = `
====================================================
POST-TRIAL OFFBOARDING SURVEY
====================================================

👤 USER INFORMATION

Name: ${name}
Email: ${email}
Company: ${company}
Trial Duration: ${trialDuration}

====================================================

📊 OVERALL EXPERIENCE

Overall Rating: ${overallRating} / 5
Primary Reason for Leaving: ${primaryReason}
${reasonDetail ? `Detail: ${reasonDetail}` : ''}

---------------------------------------------------

🔧 FEATURE FEEDBACK

Features Used:
${featuresUsed.length > 0 ? featuresUsed.map(f => `• ${f}`).join('\n') : '• None selected'}

Feature Ratings:
${Object.entries(featureRatings).map(([f, r]) => `• ${f}: ${r}/5`).join('\n') || '• None rated'}

Most Valuable Feature: ${mostValuable || 'N/A'}
Least Valuable Feature: ${leastValuable || 'N/A'}
Missing Features: ${missingFeatures || 'N/A'}

---------------------------------------------------

📋 DATA & COVERAGE

Data Quality Rating: ${dataQuality} / 5
Coverage Gaps: ${coverageGaps || 'None reported'}

---------------------------------------------------

🖥️ USABILITY

Ease of Use Rating: ${easeOfUse} / 5
UI Improvements: ${uiImprovements || 'None suggested'}

---------------------------------------------------

🔮 FUTURE INTENT

Would Recommend: ${wouldRecommend}
Switching To: ${switchingTo || 'Not specified'}
Switching Reason: ${switchingReason || 'N/A'}
Would Come Back: ${comeback}
${comebackConditions ? `Conditions: ${comebackConditions}` : ''}

---------------------------------------------------

💬 ADDITIONAL FEEDBACK

${additionalFeedback || 'None provided'}

🕐 SUBMITTED: ${new Date().toISOString()}

====================================================
    `.trim();

    // Check if Resend is configured
    if (process.env.RESEND_API_KEY) {
      console.log('✅ RESEND_API_KEY found, sending offboarding survey email...');

      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      const recipientEmail = process.env.CONTACT_EMAIL || 'andrew@pimlicosolutions.com';

      // Generate star display
      const stars = (n) => '★'.repeat(Number(n) || 0) + '☆'.repeat(5 - (Number(n) || 0));

      // Feature rating rows
      const featureRatingRows = Object.entries(featureRatings).map(([feature, rating], i) => `
        <tr${i % 2 === 1 ? ' style="background-color: #f8fafc;"' : ''}>
          <td style="padding: 8px; color: #1e293b; font-size: 14px;">${feature}</td>
          <td style="padding: 8px; color: #f59e0b; font-size: 14px; text-align: center;">${stars(rating)}</td>
        </tr>
      `).join('');

      try {
        const emailResult = await resend.emails.send({
          from: 'Pimlico XHS Feedback <onboarding@resend.dev>',
          to: recipientEmail,
          subject: `📋 Post-Trial Feedback - ${name} from ${company} | Rating: ${overallRating}/5`,
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="700" cellpadding="0" cellspacing="0" style="max-width: 700px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">📋 Post-Trial Feedback</h1>
              <p style="margin: 8px 0 0; color: #c7d2fe; font-size: 14px;">Offboarding Survey Response</p>
            </td>
          </tr>
          
          <!-- User Info -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px; color: #4f46e5; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">👤 User Information</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="width: 30%; color: #64748b; font-size: 14px; font-weight: 600;">Name:</td>
                  <td style="color: #1e293b; font-size: 14px;"><strong>${name}</strong></td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="color: #64748b; font-size: 14px; font-weight: 600;">Company:</td>
                  <td style="color: #1e293b; font-size: 14px;"><strong>${company}</strong></td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px; font-weight: 600;">Email:</td>
                  <td style="color: #4f46e5; font-size: 14px;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="color: #64748b; font-size: 14px; font-weight: 600;">Trial Duration:</td>
                  <td style="color: #1e293b; font-size: 14px;">${trialDuration}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Overall Experience -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #4f46e5; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📊 Overall Experience</h2>
              <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 4px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Overall Rating</p>
                <p style="margin: 0; color: #f59e0b; font-size: 20px;">${stars(overallRating)} <span style="color: #1e293b; font-size: 14px;">(${overallRating}/5)</span></p>
              </div>
              <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 4px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Primary Reason for Leaving</p>
                <p style="margin: 0; color: #dc2626; font-size: 15px; font-weight: 600;">${primaryReason}</p>
                ${reasonDetail ? `<p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">${reasonDetail}</p>` : ''}
              </div>
            </td>
          </tr>
          
          <!-- Feature Feedback -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #4f46e5; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🔧 Feature Feedback</h2>
              
              <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Features Used</p>
                <p style="margin: 0; color: #1e293b; font-size: 14px;">${featuresUsed.length > 0 ? featuresUsed.join(' • ') : 'None selected'}</p>
              </div>

              ${featureRatingRows ? `
              <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Feature Ratings</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                  <tr style="background-color: #f1f5f9;">
                    <th style="padding: 8px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">Feature</th>
                    <th style="padding: 8px; text-align: center; color: #64748b; font-size: 12px; text-transform: uppercase;">Rating</th>
                  </tr>
                  ${featureRatingRows}
                </table>
              </div>
              ` : ''}
              
              ${mostValuable ? `<div style="margin-bottom: 12px;"><p style="margin: 0 0 4px; color: #64748b; font-size: 13px; font-weight: 600;">Most Valuable:</p><p style="margin: 0; color: #1e293b; font-size: 14px;">${mostValuable}</p></div>` : ''}
              ${leastValuable ? `<div style="margin-bottom: 12px;"><p style="margin: 0 0 4px; color: #64748b; font-size: 13px; font-weight: 600;">Least Valuable:</p><p style="margin: 0; color: #1e293b; font-size: 14px;">${leastValuable}</p></div>` : ''}
              ${missingFeatures ? `<div style="margin-bottom: 12px;"><p style="margin: 0 0 4px; color: #64748b; font-size: 13px; font-weight: 600;">Missing Features:</p><p style="margin: 0; color: #1e293b; font-size: 14px;">${missingFeatures}</p></div>` : ''}
            </td>
          </tr>
          
          <!-- Data & Usability -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #4f46e5; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📋 Data & Usability</h2>
              <div style="margin-bottom: 12px;">
                <p style="margin: 0 0 4px; color: #64748b; font-size: 13px; font-weight: 600;">Data Quality:</p>
                <p style="margin: 0; color: #f59e0b; font-size: 16px;">${stars(dataQuality)} <span style="color: #1e293b; font-size: 14px;">(${dataQuality}/5)</span></p>
              </div>
              ${coverageGaps ? `<div style="margin-bottom: 12px;"><p style="margin: 0 0 4px; color: #64748b; font-size: 13px; font-weight: 600;">Coverage Gaps:</p><p style="margin: 0; color: #1e293b; font-size: 14px;">${coverageGaps}</p></div>` : ''}
              <div style="margin-bottom: 12px;">
                <p style="margin: 0 0 4px; color: #64748b; font-size: 13px; font-weight: 600;">Ease of Use:</p>
                <p style="margin: 0; color: #f59e0b; font-size: 16px;">${stars(easeOfUse)} <span style="color: #1e293b; font-size: 14px;">(${easeOfUse}/5)</span></p>
              </div>
              ${uiImprovements ? `<div style="margin-bottom: 12px;"><p style="margin: 0 0 4px; color: #64748b; font-size: 13px; font-weight: 600;">UI Improvements:</p><p style="margin: 0; color: #1e293b; font-size: 14px;">${uiImprovements}</p></div>` : ''}
            </td>
          </tr>
          
          <!-- Future Intent -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #4f46e5; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🔮 Future Intent</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="width: 40%; color: #64748b; font-size: 14px; font-weight: 600;">Would Recommend:</td>
                  <td style="color: #1e293b; font-size: 14px;">${wouldRecommend}</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="color: #64748b; font-size: 14px; font-weight: 600;">Switching To:</td>
                  <td style="color: #1e293b; font-size: 14px;">${switchingTo || 'Not specified'}</td>
                </tr>
                ${switchingReason ? `<tr><td style="color: #64748b; font-size: 14px; font-weight: 600;">Why:</td><td style="color: #1e293b; font-size: 14px;">${switchingReason}</td></tr>` : ''}
                <tr style="background-color: #f8fafc;">
                  <td style="color: #64748b; font-size: 14px; font-weight: 600;">Would Come Back:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: 600; color: ${comeback === 'Yes' ? '#16a34a' : comeback === 'Maybe' ? '#f59e0b' : '#dc2626'};">${comeback}</td>
                </tr>
                ${comebackConditions ? `<tr><td style="color: #64748b; font-size: 14px; font-weight: 600;">Conditions:</td><td style="color: #1e293b; font-size: 14px;">${comebackConditions}</td></tr>` : ''}
              </table>
            </td>
          </tr>
          
          <!-- Additional Feedback -->
          ${additionalFeedback ? `
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; color: #4f46e5; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">💬 Additional Feedback</h2>
              <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #4f46e5;">${additionalFeedback}</p>
            </td>
          </tr>
          ` : ''}
          
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

        console.log('✅ Offboarding survey email sent:', emailResult.id);
      } catch (emailError) {
        console.error('❌ ERROR sending offboarding email:', emailError);
        throw emailError;
      }

      return NextResponse.json({
        success: true,
        message: 'Offboarding survey submitted and emailed',
      });
    } else {
      // No Resend — log to console
      console.log('⚠️ RESEND_API_KEY not found. Logging survey data:');
      console.log(plainReport);

      return NextResponse.json({
        success: true,
        message: 'Survey recorded (email not configured)',
        note: 'Set RESEND_API_KEY to enable email delivery',
      });
    }
  } catch (error) {
    console.error('Offboarding survey error:', error);
    return NextResponse.json(
      { error: 'Failed to process survey: ' + error.message },
      { status: 500 }
    );
  }
}
