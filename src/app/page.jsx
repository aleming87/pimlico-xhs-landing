import Hero from "@/components/Hero";
import Differentiators from "@/components/Differentiators";
import ProductShowcase from "@/components/ProductShowcase";
import DatamapScripts from "@/components/DatamapScripts";
import { CookieConsent } from "@/components/CookieConsent";
import { TrustedBy, Sectors, Coverage, Security, Testimonials, FinalCTA } from "@/components/HomeSections";

export const metadata = {
  title: "XHS™ Copilot — Every regulatory change. Analyzed.",
  description: "Pimlico Solutions builds XHS™ Copilot — AI-powered compliance workspaces for gambling, payments, crypto, and AI teams. 275+ jurisdictions monitored daily.",
}

export default function Page() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "XHS™ Copilot",
    "alternateName": ["XHS Copilot", "Pimlico XHS"],
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Regulatory Compliance Software",
    "creator": {
      "@type": "Organization",
      "name": "Pimlico Solutions",
      "url": "https://pimlicosolutions.com"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "660",
      "highPrice": "8800",
      "priceCurrency": "GBP",
      "offerCount": "4"
    },
    "description": "XHS™ Copilot is a regulatory intelligence platform that monitors 275+ jurisdictions across gambling, payments, crypto, and AI regulation. It delivers AI-generated jurisdiction reports, real-time regulatory change detection, and collaborative compliance workspaces for legal and compliance teams.",
    "operatingSystem": "Web",
    "screenshot": "https://pimlicosolutions.com/cta-bg.jpg",
    "featureList": [
      "Real-time regulatory monitoring across 275+ jurisdictions",
      "AI-generated jurisdiction reports and analysis",
      "Gambling, payments, crypto, and AI compliance coverage",
      "Collaborative team workspaces with project tracking",
      "Regulatory change alerts and notifications",
      "Watchlists and custom research tools",
      "Slack and Microsoft Teams integration"
    ],
    "audience": {
      "@type": "BusinessAudience",
      "audienceType": "Compliance teams, legal teams, regulatory affairs professionals"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://pimlicosolutions.com",
      },
    ],
  };

  // FAQ schema is the single biggest lever for Google AI Overviews and
  // SGE-style answer boxes on brand queries. Questions below are the
  // exact queries we want Pimlico Solutions / XHS Copilot to answer
  // for — including disambiguation from unrelated "Pimlico" entities.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is XHS™ Copilot?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "XHS™ Copilot is an AI-powered regulatory compliance workspace built by Pimlico Solutions Ltd. It monitors 275+ jurisdictions across gambling, payments, crypto, and AI regulation, delivering real-time change detection, AI-generated jurisdiction reports, watchlists, and collaborative tools for legal and compliance teams."
        }
      },
      {
        "@type": "Question",
        "name": "What is Pimlico Solutions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pimlico Solutions Ltd is a UK-based regulatory technology (regtech) company headquartered in London, founded in 2024 and registered at Companies House under number 15725938. It builds XHS™ Copilot — an AI-powered compliance platform used by gambling, payments, crypto, and AI compliance teams worldwide."
        }
      },
      {
        "@type": "Question",
        "name": "Is Pimlico Solutions related to Pimlico Plumbers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Pimlico Solutions Ltd is a regulatory technology company that builds the XHS™ Copilot compliance platform. It is entirely unrelated to Pimlico Plumbers, the Pimlico Journal, the Pimlico neighbourhood of London, or any other business that shares the Pimlico name. Pimlico Solutions is registered at Companies House under number 15725938."
        }
      },
      {
        "@type": "Question",
        "name": "What industries does XHS™ Copilot cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "XHS™ Copilot covers four regulated verticals: gambling (UKGC, MGA, and 150+ gaming authorities), payments (PSD2, PSD3, DORA, EMI licensing), crypto and digital assets (MiCA, Travel Rule, VASP licensing, stablecoin rules), and artificial intelligence regulation (EU AI Act, NIST AI RMF, state-level AI laws)."
        }
      },
      {
        "@type": "Question",
        "name": "How many jurisdictions does XHS™ Copilot monitor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "XHS™ Copilot continuously monitors 275+ jurisdictions worldwide from 12,000+ primary sources, including regulator bulletins, legislative texts, and enforcement orders. Updates are delivered daily with AI-generated analysis and change detection."
        }
      },
      {
        "@type": "Question",
        "name": "Who uses XHS™ Copilot?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "XHS™ Copilot is used by compliance teams, legal teams, and regulatory affairs professionals at companies operating in gambling, payments, crypto, and AI — from early-stage startups through to enterprises with cross-jurisdiction footprints. Pricing scales from 1-3 seat teams through to 100+ seat enterprise deployments."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Pimlico Solutions headquartered?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pimlico Solutions Ltd is headquartered at 71-75 Shelton Street, Covent Garden, London WC2H 9JQ, United Kingdom."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a free trial of XHS™ Copilot?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. XHS™ Copilot offers a 14-day free trial with full platform access and no credit card required. Teams can sign up at pimlicosolutions.com/contact or go directly to xhsdata.ai/register."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
        <Hero />
        <TrustedBy />
        <Differentiators />
        <ProductShowcase />
        <Sectors />
        <Coverage />
        <Testimonials />
        <Security />
        <FinalCTA />
      </main>
      <CookieConsent />
      <DatamapScripts />
    </>
  );
}
