import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    console.log('🔍 Trial completion survey API called');
    console.log('📧 Environment check:');
    console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('- CONTACT_EMAIL:', process.env.CONTACT_EMAIL || 'NOT SET');

    const {
      name = 'N/A',
      email = 'N/A',
      company = 'N/A',
      role = 'N/A',
      trialDuration = 'N/A',
      featureRatings = {},
      selectedImprovements = [],
      missingFeatures = '',
      mostValuable = '',
      overallRating = 0,
      upcomingFeatureInterest = {},
      keepInTouch = 'N/A',
      wouldRecommend = 'N/A',
      meetExpectations = 'N/A',
      additionalFeedback = '',
    } = data;

    // Helper: render stars as text
    const starsText = (n) => '★'.repeat(n || 0) + '☆'.repeat(5 - (n || 0));
    const starsHtml = (n) => {
      const filled = '★'.repeat(n || 0);
      const empty = '☆'.repeat(5 - (n || 0));
      return `<span style="color:#facc15">${filled}</span><span style="color:#4b5563">${empty}</span>`;
    };

    // Calculate average feature rating
    const ratedFeatures = Object.values(featureRatings).filter(v => v > 0);
    const avgRating = ratedFeatures.length > 0
      ? (ratedFeatures.reduce((a, b) => a + b, 0) / ratedFeatures.length).toFixed(1)
      : 'N/A';

    // Interest level labels
    const interestLabel = (n) => (['', 'Not interested', 'Slightly interested', 'Moderately interested', 'Very interested', 'Must-have'])[n] || 'N/A';

    // Build plain text report
    const plainReport = `
====================================================
TRIAL COMPLETION SURVEY
====================================================

👤 USER INFORMATION

Name: ${name}
Email: ${email}
Company: ${company}
Role: ${role}
Trial Duration: ${trialDuration}

====================================================
⭐ FEATURE RATINGS (Average: ${avgRating}/5)
====================================================

${Object.entries(featureRatings).map(([label, val]) =>
  `${label}: ${starsText(val)} (${val}/5)`
).join('\n') || 'No features rated'}

====================================================
🔧 IMPROVEMENTS REQUESTED
====================================================

${selectedImprovements.length > 0 ? selectedImprovements.map(i => `• ${i}`).join('\n') : 'None selected'}

Most Valuable Feature: ${mostValuable || 'Not specified'}
Missing Features: ${missingFeatures || 'None mentioned'}

====================================================
🚀 UPCOMING FEATURES INTEREST
====================================================

${Object.entries(upcomingFeatureInterest).map(([label, val]) =>
  `${label}: ${interestLabel(val)} (${val}/5)`
).join('\n') || 'No upcoming features rated'}

Keep in Touch: ${keepInTouch}

====================================================
📊 OVERALL EXPERIENCE
====================================================

Overall Rating: ${starsText(overallRating)} (${overallRating}/5)
Met Expectations: ${meetExpectations}
Would Recommend: ${wouldRecommend}

Additional Feedback:
${additionalFeedback || 'None provided'}

====================================================
Submitted: ${new Date().toISOString()}
====================================================
`.trim();

    // Build HTML email
    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#111827;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px 0;">Trial Completion Survey</h1>
      <p style="color:#9ca3af;font-size:14px;margin:0;">Submitted ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>

    <!-- User Info Card -->
    <div style="background-color:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin-bottom:20px;">
      <h2 style="color:#ffffff;font-size:16px;margin:0 0 16px 0;">👤 User Information</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;width:120px;">Name</td><td style="color:#ffffff;padding:6px 0;font-size:14px;">${name}</td></tr>
        <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Email</td><td style="color:#ffffff;padding:6px 0;font-size:14px;"><a href="mailto:${email}" style="color:#60a5fa;text-decoration:none;">${email}</a></td></tr>
        <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Company</td><td style="color:#ffffff;padding:6px 0;font-size:14px;">${company}</td></tr>
        <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Role</td><td style="color:#ffffff;padding:6px 0;font-size:14px;">${role}</td></tr>
        <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Trial Duration</td><td style="color:#ffffff;padding:6px 0;font-size:14px;">${trialDuration}</td></tr>
      </table>
    </div>

    <!-- Feature Ratings Card -->
    <div style="background-color:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin-bottom:20px;">
      <h2 style="color:#ffffff;font-size:16px;margin:0 0 4px 0;">⭐ Feature Ratings</h2>
      <p style="color:#9ca3af;font-size:13px;margin:0 0 16px 0;">Average: <strong style="color:#facc15;">${avgRating}/5</strong> &nbsp;|&nbsp; ${ratedFeatures.length} features rated</p>
      
      <table style="width:100%;border-collapse:collapse;">
        ${Object.entries(featureRatings).map(([label, val], i) => `
        <tr style="background-color:${i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent'};">
          <td style="color:#e5e7eb;padding:10px 12px;font-size:14px;border-radius:6px 0 0 6px;">${label}</td>
          <td style="color:#ffffff;padding:10px 12px;font-size:16px;text-align:right;white-space:nowrap;border-radius:0 6px 6px 0;">${starsHtml(val)} <span style="color:#9ca3af;font-size:12px;margin-left:4px;">${val}/5</span></td>
        </tr>`).join('') || '<tr><td style="color:#6b7280;padding:10px 12px;font-size:14px;">No features were rated</td></tr>'}
      </table>
    </div>

    <!-- Improvements Card -->
    <div style="background-color:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin-bottom:20px;">
      <h2 style="color:#ffffff;font-size:16px;margin:0 0 16px 0;">🔧 Feedback & Improvements</h2>
      
      ${selectedImprovements.length > 0 ? `
      <div style="margin-bottom:16px;">
        <p style="color:#9ca3af;font-size:13px;margin:0 0 8px 0;">Areas for improvement:</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${selectedImprovements.map(item => `<span style="display:inline-block;background-color:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.3);color:#93c5fd;padding:4px 12px;border-radius:20px;font-size:13px;">${item}</span>`).join('')}
        </div>
      </div>` : ''}

      ${mostValuable ? `
      <div style="margin-bottom:12px;">
        <p style="color:#9ca3af;font-size:13px;margin:0 0 4px 0;">Most valuable feature:</p>
        <p style="color:#ffffff;font-size:14px;margin:0;">${mostValuable}</p>
      </div>` : ''}

      ${missingFeatures ? `
      <div>
        <p style="color:#9ca3af;font-size:13px;margin:0 0 4px 0;">Missing features:</p>
        <p style="color:#ffffff;font-size:14px;margin:0;">${missingFeatures}</p>
      </div>` : ''}

      ${!selectedImprovements.length && !mostValuable && !missingFeatures ? '<p style="color:#6b7280;font-size:14px;margin:0;">No improvement feedback provided</p>' : ''}
    </div>

    <!-- Upcoming Features Card -->
    <div style="background-color:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin-bottom:20px;">
      <div style="margin-bottom:16px;">
        <h2 style="color:#ffffff;font-size:16px;margin:0 0 4px 0;display:inline;">🚀 Upcoming Features Interest</h2>
        <span style="display:inline-block;margin-left:8px;padding:2px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;background-color:rgba(168,85,247,0.2);border:1px solid rgba(168,85,247,0.3);color:#d8b4fe;border-radius:12px;vertical-align:middle;">Preview</span>
      </div>
      
      <table style="width:100%;border-collapse:collapse;">
        ${Object.entries(upcomingFeatureInterest).map(([label, val], i) => {
          const barColor = val >= 4 ? '#a855f7' : val >= 3 ? '#7c3aed' : '#6b7280';
          return `
        <tr style="background-color:${i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent'};">
          <td style="color:#e5e7eb;padding:10px 12px;font-size:14px;border-radius:6px 0 0 6px;width:140px;">${label}</td>
          <td style="padding:10px 12px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="flex:1;background-color:rgba(255,255,255,0.1);border-radius:4px;height:8px;">
                <div style="width:${val * 20}%;background-color:${barColor};border-radius:4px;height:8px;"></div>
              </div>
              <span style="color:#9ca3af;font-size:12px;white-space:nowrap;">${val}/5</span>
            </div>
            <p style="color:#6b7280;font-size:11px;margin:2px 0 0 0;">${interestLabel(val)}</p>
          </td>
        </tr>`;
        }).join('') || '<tr><td style="color:#6b7280;padding:10px 12px;font-size:14px;">No upcoming features rated</td></tr>'}
      </table>

      <div style="margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.1);">
        <p style="color:#9ca3af;font-size:13px;margin:0 0 4px 0;">Keep in touch about these features:</p>
        <p style="font-size:14px;margin:0;"><span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:13px;${
          keepInTouch === 'Yes please' ? 'background-color:rgba(34,197,94,0.2);color:#86efac;' :
          keepInTouch === 'Maybe later' ? 'background-color:rgba(234,179,8,0.2);color:#fde047;' :
          keepInTouch === 'No thanks' ? 'background-color:rgba(239,68,68,0.2);color:#fca5a5;' :
          'color:#9ca3af;'
        }">${keepInTouch}</span></p>
      </div>
    </div>

    <!-- Overall Card -->
    <div style="background-color:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin-bottom:20px;">
      <h2 style="color:#ffffff;font-size:16px;margin:0 0 16px 0;">📊 Overall Experience</h2>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="color:#9ca3af;padding:8px 0;font-size:14px;width:160px;">Overall Rating</td>
          <td style="padding:8px 0;font-size:18px;">${starsHtml(overallRating)} <span style="color:#9ca3af;font-size:13px;margin-left:4px;">${overallRating}/5</span></td>
        </tr>
        <tr>
          <td style="color:#9ca3af;padding:8px 0;font-size:14px;">Met Expectations</td>
          <td style="color:#ffffff;padding:8px 0;font-size:14px;">${meetExpectations}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;padding:8px 0;font-size:14px;">Would Recommend</td>
          <td style="padding:8px 0;font-size:14px;">
            <span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:13px;${
              wouldRecommend === 'Yes' ? 'background-color:rgba(34,197,94,0.2);color:#86efac;' :
              wouldRecommend === 'Maybe' ? 'background-color:rgba(234,179,8,0.2);color:#fde047;' :
              wouldRecommend === 'No' ? 'background-color:rgba(239,68,68,0.2);color:#fca5a5;' :
              'color:#9ca3af;'
            }">${wouldRecommend}</span>
          </td>
        </tr>
      </table>

      ${additionalFeedback ? `
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);">
        <p style="color:#9ca3af;font-size:13px;margin:0 0 6px 0;">Additional feedback:</p>
        <p style="color:#ffffff;font-size:14px;margin:0;line-height:1.6;">${additionalFeedback}</p>
      </div>` : ''}
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:16px;">
      <p style="color:#6b7280;font-size:12px;margin:0;">Pimlico XHS™ Trial Completion Survey</p>
    </div>
  </div>
</body>
</html>`.trim();

    // Attempt to send via Resend
    if (process.env.RESEND_API_KEY) {
      const toEmail = process.env.CONTACT_EMAIL || 'andrew@pimlicosolutions.com';

      console.log(`📤 Sending trial survey email to: ${toEmail}`);

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Pimlico XHS Feedback <onboarding@resend.dev>',
          to: [toEmail],
          subject: `Trial Completion Survey — ${name} ${company ? `(${company})` : ''}`.trim(),
          html: htmlReport,
          text: plainReport,
        }),
      });

      const resendData = await resendRes.json();
      console.log('📧 Resend response:', JSON.stringify(resendData));

      if (!resendRes.ok) {
        console.error('❌ Resend error:', resendData);
        return NextResponse.json(
          { success: false, error: 'Failed to send email', details: resendData },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Trial completion survey submitted and emailed',
        emailId: resendData.id,
      });
    }

    // Fallback: no Resend key — just log
    console.log('⚠️ No RESEND_API_KEY — logging survey only');
    console.log(plainReport);

    return NextResponse.json({
      success: true,
      message: 'Survey received (email not configured)',
    });
  } catch (error) {
    console.error('❌ Trial survey error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
