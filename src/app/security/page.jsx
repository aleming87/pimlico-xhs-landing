"use client";

import { Footer } from '@/components/footer';
import Link from 'next/link';

const securityFeatures = [
  {
    title: 'Encryption',
    items: [
      'AES-256 encryption at rest for all stored data and files',
      'TLS 1.3 encryption in transit for all API communications',
      'SHA-256 file integrity verification on every upload',
    ],
  },
  {
    title: 'Access Control',
    items: [
      'Organisation-level data isolation with Row Level Security (RLS)',
      'Role-based access control (Owner, Admin, Member, Viewer)',
      'Multi-factor authentication (MFA) with brute-force protection',
      'Session management with automatic expiry',
    ],
  },
  {
    title: 'Audit & Compliance',
    items: [
      'Immutable audit trail for all file operations (upload, download, delete)',
      'Email delivery tracking and engagement logging',
      'User activity monitoring with session attribution',
      'Compliance-ready reporting for regulatory requirements',
    ],
  },
  {
    title: 'Data Residency',
    items: [
      'Primary data storage in the European Union (London, UK)',
      'Supabase infrastructure with SOC 2 Type II certification',
      'Cloudflare edge network for global performance with EU data processing',
      'No data transferred outside the EU unless explicitly configured',
    ],
  },
  {
    title: 'Data Retention & Deletion',
    items: [
      'Configurable data retention policies per organisation (default: 365 days)',
      'Automated retention enforcement with daily compliance checks',
      'Right to deletion: complete data purge available on request',
      'GDPR-compliant data subject access and portability',
    ],
  },
  {
    title: 'Payment Security',
    items: [
      'PCI DSS compliant payment processing via Stripe',
      'No credit card data stored on our servers',
      'Cryptographic webhook signature verification on all payment events',
      'Automated payment failure handling with grace periods',
    ],
  },
  {
    title: 'Application Security',
    items: [
      'Input validation and sanitisation on all user inputs',
      'Cross-Site Scripting (XSS) protection with content sanitisation',
      'API rate limiting and brute-force protection',
      'JWT-based authentication on all sensitive endpoints',
      'Webhook signature verification (Stripe, third-party integrations)',
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      'Cloudflare DDoS protection and Web Application Firewall',
      'Automated SSL certificate management',
      'Edge function isolation (each API runs in its own sandbox)',
      'Database connection encryption and IP restrictions',
    ],
  },
];

export default function SecurityPage() {
  return (
    <>
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Security & Privacy</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Enterprise-grade security for regulatory compliance
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
              XHS™ Copilot is built from the ground up with security at its core. Your regulatory data
              is protected with the same rigour you apply to your compliance programmes.
            </p>
          </div>
        </div>

        {/* Security features */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((section) => (
              <div key={section.title} className="border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="h-4 w-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Certifications & Standards */}
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Standards & Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">GDPR</p>
                <p className="text-sm text-gray-500 mt-2">EU General Data Protection Regulation compliant</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">SOC 2</p>
                <p className="text-sm text-gray-500 mt-2">SOC 2 Type II aligned infrastructure (Supabase)</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">PCI DSS</p>
                <p className="text-sm text-gray-500 mt-2">PCI DSS compliant payment processing (Stripe)</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-16 bg-slate-900 text-white rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold">Security questions?</h3>
            <p className="text-slate-300 mt-2 text-sm">
              For security enquiries, vulnerability reports, or data protection requests, contact us directly.
            </p>
            <a
              href="mailto:andrew@pimlicosolutions.com"
              className="inline-block mt-4 px-6 py-2.5 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Contact Security Team
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
