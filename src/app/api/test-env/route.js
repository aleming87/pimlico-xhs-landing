import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasResendKey: !!process.env.RESEND_API_KEY,
    resendKeyLength: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0,
    contactEmail: process.env.CONTACT_EMAIL || 'NOT SET',
    env: process.env.NODE_ENV
  });
}
