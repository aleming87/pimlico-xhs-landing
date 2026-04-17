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

All routes now read the sender from `SENDER_EMAIL` (default
`noreply@pimlicosolutions.com`). The Resend sandbox (`onboarding@resend.dev`)
is no longer hard-coded anywhere.

### 4a. Configure Webhooks (for analytics)

Go to [Resend Webhooks](https://resend.com/webhooks) → Add endpoint:

- **URL**: `https://pimlicosolutions.com/api/webhooks/resend`
- **Events**: `email.delivered`, `email.opened`, `email.clicked`,
  `email.bounced`, `email.complained`

Copy the signing secret (starts with `whsec_`) and add it to Cloudflare
Pages env vars as `RESEND_WEBHOOK_SECRET`.

Each event is forwarded to GA4 via the Measurement Protocol so you
can see email engagement (opens / clicks) alongside web conversions
in GA4 → Reports → Engagement → Events.

Also enable **account-level** open + click tracking in
Resend → Settings → Email so the tracking pixel + link rewriting are
applied to every outbound email.

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

### Cloudflare Pages (current)

Set the following in **Cloudflare Pages → Settings → Environment Variables**
(both Production and Preview):

| Variable | Type | Value |
|---|---|---|
| `RESEND_API_KEY` | Secret | `re_...` from Resend → API Keys |
| `RESEND_WEBHOOK_SECRET` | Secret | `whsec_...` from Resend → Webhooks → endpoint |
| `SENDER_EMAIL` | Plain | `noreply@pimlicosolutions.com` (already in wrangler.toml as fallback) |
| `CONTACT_EMAIL` | Plain | `contact@pimlicosolutions.com` or whichever inbox should receive form submissions |
| `NEXT_PUBLIC_GA_ID` | Plain | `G-XXXXXXXXXX` from GA4 → Admin → Data Streams |
| `GA_MEASUREMENT_API_SECRET` | Secret | from GA4 → Admin → Data Streams → Measurement Protocol |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Plain | `content="..."` value from Google Search Console verification meta tag |
| `NEXT_PUBLIC_BING_VERIFICATION` | Plain | `content="..."` value from Bing Webmaster meta tag |
| `ARTICLES_API_KEY` | Secret | strong random string for the agent-publishing endpoint |

Then redeploy. The webhook endpoint and analytics will start receiving
data immediately.

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
