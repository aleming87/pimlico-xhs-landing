"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

// Sample articles data
const sampleArticles = [
  {
    id: 1,
    slug: 'eu-ai-act-compliance-guide-2026',
    title: 'EU AI Act Compliance Guide 2026: What Regulated Entities Need to Know',
    excerpt: 'A comprehensive overview of the EU AI Act requirements for financial services, gambling, and payments companies entering into force this year.',
    category: 'AI Regulation',
    author: 'Pimlico XHS™ Team',
    date: '2026-02-01',
    readTime: '8 min read',
    content: `
## Introduction

The EU AI Act represents the most comprehensive regulatory framework for artificial intelligence ever enacted. As of 2026, its provisions are entering into force in phases, with significant implications for regulated entities in financial services, gambling, and payments.

## Key Requirements for Regulated Entities

### Risk Classification

The AI Act introduces a risk-based classification system:

- **Unacceptable Risk**: AI systems that pose clear threats to safety, livelihoods, and rights are banned
- **High Risk**: AI systems in critical areas require strict compliance measures
- **Limited Risk**: AI systems with transparency obligations
- **Minimal Risk**: Most AI systems fall into this category with no specific obligations

### Compliance Timeline

| Milestone | Date | Requirements |
|-----------|------|--------------|
| Prohibited AI | February 2025 | Ban on unacceptable risk systems |
| General Purpose AI | August 2025 | GPAI model requirements |
| High-Risk Systems | August 2026 | Full compliance required |

## Implementation Steps

1. **AI System Inventory**: Catalog all AI systems in use across your organization
2. **Risk Assessment**: Classify each system according to the Act's risk categories
3. **Gap Analysis**: Identify areas requiring remediation
4. **Documentation**: Prepare technical documentation and conformity assessments
5. **Governance**: Establish AI governance frameworks and oversight mechanisms

## Financial Services Considerations

For financial services firms, many AI applications will fall into the high-risk category, including:

- Credit scoring and lending decisions
- Insurance pricing and claims assessment
- Fraud detection systems
- Investment advisory tools

## Gambling Sector Implications

Gambling operators using AI must pay particular attention to:

- Player risk profiling systems
- Responsible gambling intervention tools
- Marketing and personalization algorithms
- Anti-money laundering AI systems

## Payments Industry Impact

Payment service providers should focus on:

- Transaction monitoring AI
- KYC and customer onboarding automation
- Fraud prevention systems
- Risk assessment tools

## Conclusion

The EU AI Act presents both challenges and opportunities for regulated entities. Early preparation and a systematic approach to compliance will be essential for navigating this new regulatory landscape.

---

*For more information on how Pimlico XHS can help you achieve AI Act compliance, [contact our team](/contact).*
    `,
  },
  {
    id: 2,
    slug: 'psd3-implementation-timeline',
    title: 'PSD3 Implementation Timeline: Key Dates and Milestones',
    excerpt: 'Track the critical milestones for PSD3 compliance and understand how the new payment services directive will reshape the European payments landscape.',
    category: 'Payments',
    author: 'Pimlico XHS™ Team',
    date: '2026-01-28',
    readTime: '6 min read',
    content: `
## Overview of PSD3

The Payment Services Directive 3 (PSD3) and Payment Services Regulation (PSR) represent the next evolution of European payments regulation, building on the foundations established by PSD2.

## Key Changes from PSD2

### Enhanced Open Banking

PSD3 strengthens open banking provisions with:

- Mandatory dedicated interfaces (APIs) for account access
- Premium API services with SLA requirements
- Standardized API specifications across the EU

### Stronger Consumer Protection

- Extended liability protection for unauthorized transactions
- Enhanced transparency requirements for payment fees
- Improved complaint handling procedures

### Fraud Prevention

- New requirements for transaction monitoring
- Enhanced authentication standards
- Real-time fraud detection obligations

## Implementation Timeline

### Phase 1: Adoption (2025)

- Q1 2025: Final text adoption expected
- Q2 2025: Publication in Official Journal
- Q3 2025: Member State transposition begins

### Phase 2: Transition (2026)

- Q1 2026: Transposition deadline for most provisions
- Q2 2026: API compliance requirements effective
- Q4 2026: Full compliance deadline

### Phase 3: Enforcement (2027+)

- Ongoing supervisory reviews
- Cross-border enforcement coordination
- Regular compliance assessments

## Preparing Your Organization

1. **Gap Analysis**: Compare current operations against PSD3 requirements
2. **Technology Assessment**: Evaluate API infrastructure and security systems
3. **Process Updates**: Revise customer onboarding and authentication processes
4. **Training**: Ensure staff understand new obligations
5. **Documentation**: Update policies and procedures

## Conclusion

PSD3 represents a significant evolution in European payments regulation. Organizations should begin preparation now to ensure smooth compliance.

---

*Stay updated on PSD3 developments with Pimlico XHS regulatory monitoring.*
    `,
  },
];

export default function ArticlePage() {
  const params = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Check localStorage for custom articles first
    const savedArticles = localStorage.getItem('xhs-articles');
    let allArticles = [...sampleArticles];
    
    if (savedArticles) {
      allArticles = [...JSON.parse(savedArticles), ...sampleArticles];
    }

    const found = allArticles.find(a => a.slug === params.slug);
    setArticle(found);
  }, [params.slug]);

  if (!article) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
          <Link href="/insights" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            ← Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pimlico XHS™</span>
              <Image src="/Pimlico_Logo.png" alt="Pimlico" width={100} height={27} className="h-7 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="size-6">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="/" className="text-sm/6 font-semibold text-gray-900">Home</a>
            <a href="/ai" className="text-sm/6 font-semibold text-gray-900">AI</a>
            <a href="/payments" className="text-sm/6 font-semibold text-gray-900">Payments</a>
            <a href="/gambling" className="text-sm/6 font-semibold text-gray-900">Gambling</a>
            <a href="/insights" className="text-sm/6 font-semibold text-blue-600">Insights</a>
            <a href="/pricing" className="text-sm/6 font-semibold text-gray-900">Pricing</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/contact" className="inline-flex items-center rounded-md px-5 py-2.5 font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105">
              Book a demo <span aria-hidden="true" className="ml-1">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Article Content */}
      <article className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/insights" className="text-blue-600 hover:text-blue-500 text-sm">
              ← Back to Insights
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-medium">{article.category}</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-gray-600">{article.excerpt}</p>
            
            {/* Cover Image */}
            {article.image && (
              <div className="mt-6 rounded-xl overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-auto object-cover" />
              </div>
            )}
            
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs">XHS™</span>
              </div>
              <div>
                <p className="text-gray-900 font-medium">{article.author}</p>
                <p className="text-gray-500 text-sm">Pimlico XHS™</p>
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">{children}</h3>,
                p: ({children}) => <p className="text-gray-600 mb-4 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">{children}</ol>,
                li: ({children}) => <li className="text-gray-600">{children}</li>,
                strong: ({children}) => <strong className="text-gray-900 font-semibold">{children}</strong>,
                a: ({href, children}) => <a href={href} className="text-blue-600 hover:text-blue-500">{children}</a>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-500">{children}</blockquote>,
                code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm text-blue-700">{children}</code>,
                hr: () => <hr className="border-gray-200 my-8" />,
                table: ({children}) => <table className="w-full border-collapse my-6">{children}</table>,
                th: ({children}) => <th className="border border-gray-200 px-4 py-2 bg-gray-50 text-gray-900 text-left">{children}</th>,
                td: ({children}) => <td className="border border-gray-200 px-4 py-2 text-gray-600">{children}</td>,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 mb-4">Share this article</p>
            <div className="flex flex-wrap gap-3">
              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              
              {/* X (Twitter) */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </a>
              
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#0d65d9] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              
              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`Check out this article: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
              
              {/* Copy Link */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
