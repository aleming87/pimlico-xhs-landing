# Resend Email Integration Setup Guide

## Overview
Contact form submissions and survey data are now sent via email using Resend.

## Setup Steps

### 1. Install Resend Package
```bash
npm install resend
# or
pnpm install resend
# or
yarn add resend
```

### 2. Get Resend API Key

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to [API Keys](https://resend.com/api-keys)
3. Click "Create API Key"
4. Give it a name (e.g., "Pimlico XHS Production")
5. Copy the API key (starts with `re_`)

### 3. Configure Environment Variables

1. Create a `.env.local` file in the root directory:
```bash
RESEND_API_KEY=re_your_actual_api_key_here
CONTACT_EMAIL=contact@pimlicosolutions.com
```

2. **Important**: Never commit `.env.local` to git (it's already in .gitignore)

### 4. Verify Your Domain (Important!)

To send emails from `@pimlicosolutions.com`:

1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter `pimlicosolutions.com`
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually a few minutes)

**Until domain is verified**, emails will be sent from `onboarding@resend.dev` (Resend's default domain)

### 5. Test the Integration

1. Restart your dev server: `npm run dev`
2. Fill out the contact form
3. Check your email inbox (CONTACT_EMAIL)
4. Check the form submitter's email for confirmation

## What Gets Sent

### Contact Form
- **To your team**: Full contact details and message
- **To the user**: Thank you confirmation

### Survey
- **To your team**: Formatted intelligence report with:
  - Top 3 jurisdictions
  - Focus areas (AI/Payments/Gambling)
  - Top 3 regulatory topics
  - Compliance challenges
  - Competitor information
  - Productivity apps used
  - Timeline

## Production Deployment

### Vercel (Recommended)
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `RESEND_API_KEY` = your API key
   - `CONTACT_EMAIL` = your team email
4. Redeploy the project

### Other Platforms
Add the same environment variables to your hosting platform's settings.

## Troubleshooting

### Emails not sending?
1. Check console logs for errors
2. Verify `RESEND_API_KEY` is set correctly
3. Check Resend dashboard for error logs
4. Ensure domain is verified for production use

### Getting 500 errors?
1. Check server logs
2. Verify Resend package is installed
3. Ensure environment variables are loaded

### Emails going to spam?
1. Verify your domain in Resend
2. Add SPF, DKIM records as instructed
3. Consider using a dedicated sending domain

## Cost
- Resend free tier: 3,000 emails/month
- More than enough for most lead generation sites
- See [pricing](https://resend.com/pricing) for details

## Support
- Resend docs: https://resend.com/docs
- Resend support: https://resend.com/support
