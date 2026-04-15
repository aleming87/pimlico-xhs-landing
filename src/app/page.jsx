import Hero from "@/components/Hero";
import Differentiators from "@/components/Differentiators";
import ProductShowcase from "@/components/ProductShowcase";
import DatamapScripts from "@/components/DatamapScripts";
import { CookieConsent } from "@/components/CookieConsent";
import { TrustedBy, Sectors, Coverage, Security, Testimonials, FinalCTA } from "@/components/HomeSections";

export const metadata = {
  title: "XHS™ Copilot — Every regulatory change. Analyzed.",
  description: "Pimlico Solutions (London, UK) builds XHS™ Copilot — a regulatory compliance workspace for gambling, payments, crypto and AI teams. 275+ jurisdictions monitored daily, with AI-assisted analysis reviewed by compliance professionals.",
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
    "screenshot": "https://pimlicosolutions.com/Product-1---Dashboard.webp",
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

  // WebPage with Speakable tells Google Assistant, AI Overview and
  // voice-search agents which selectors hold the quotable summary of
  // the page. #hero-headline and #hero-intro sit on the Hero component.
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://pimlicosolutions.com/#webpage",
    "url": "https://pimlicosolutions.com/",
    "name": "XHS™ Copilot — Every regulatory change. Analyzed.",
    "description": "Pimlico Solutions (London, UK) builds XHS™ Copilot — a regulatory compliance workspace for gambling, payments, crypto and AI teams. 275+ jurisdictions monitored daily, with AI-assisted analysis reviewed by compliance professionals.",
    "isPartOf": { "@id": "https://pimlicosolutions.com/#website" },
    "about": { "@id": "https://pimlicosolutions.com/#organization" },
    "inLanguage": "en",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["#hero-headline", "#hero-intro"],
    },
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
          "text": "XHS™ Copilot is a regulatory compliance workspace built by Pimlico Solutions Ltd. It is a web-based software platform — not an autonomous AI agent — used by compliance and legal teams to monitor regulatory change, generate jurisdiction reports and collaborate on filings. AI features assist humans inside the workspace; the humans remain in control of every action."
        }
      },
      {
        "@type": "Question",
        "name": "Is XHS™ Copilot an AI agent?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. XHS™ Copilot is a compliance workspace with AI-assisted features — not an autonomous AI agent. It does not act on a user's behalf without explicit instruction. Its AI features summarise regulatory change, draft impact notes, and generate jurisdiction reports, which a compliance professional then reviews, edits and approves."
        }
      },
      {
        "@type": "Question",
        "name": "What is Pimlico Solutions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pimlico Solutions Ltd is a UK-based regulatory technology (regtech) company headquartered in London, United Kingdom. It is registered at Companies House under company number 15725938 and was founded in 2024. Pimlico Solutions builds XHS™ Copilot, a compliance workspace used by gambling, payments, crypto and AI-regulation teams worldwide."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Pimlico Solutions headquartered?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pimlico Solutions Ltd is headquartered in London, United Kingdom, at 71-75 Shelton Street, Covent Garden, London WC2H 9JQ. It is a UK-registered private company (Companies House number 15725938). Pimlico Solutions is not based in San Francisco, is not headquartered in the United States, and has no San Francisco office. Some third-party AI summaries have incorrectly suggested a US location — the authoritative record is at Companies House."
        }
      },
      {
        "@type": "Question",
        "name": "Is Pimlico Solutions related to Pimlico Plumbers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Pimlico Solutions Ltd is a regulatory technology company that builds XHS™ Copilot. It is entirely unrelated to Pimlico Plumbers, the Pimlico Journal, the Pimlico neighbourhood of London, or any other business that shares the Pimlico name. Pimlico Solutions is registered at Companies House under number 15725938."
        }
      },
      {
        "@type": "Question",
        "name": "What does XHS™ Copilot do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "XHS™ Copilot gives regulated teams a single workspace that ingests primary regulatory sources — regulator bulletins, legislative texts, enforcement orders — across 275+ jurisdictions and 12,000+ sources. It detects changes within hours, produces plain-English impact notes, generates jurisdiction reports on demand, and routes actions to the right compliance owner via Slack, Microsoft Teams or email."
        }
      },
      {
        "@type": "Question",
        "name": "What sectors does XHS™ Copilot cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Four regulated sectors. Gambling and iGaming: UKGC, MGA, SGA, KSA, GGL, Curaçao, PAGCOR and 150+ other gaming authorities. Payments: PSD2, PSD3, DORA, EMI and money-transmission licensing. Crypto and digital assets: MiCA, the Travel Rule, CASP and VASP licensing, stablecoin rules. Artificial intelligence regulation: the EU AI Act, NIST AI RMF, the Council of Europe Framework Convention and US state-level AI laws."
        }
      },
      {
        "@type": "Question",
        "name": "Is XHS™ Copilot available now?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. XHS™ Copilot is generally available to regulated teams worldwide. A 14-day free trial with full platform access is available at pimlicosolutions.com/contact — no credit card required. Paid plans start at £660 per month and scale to enterprise deployments with 100+ seats."
        }
      },
      {
        "@type": "Question",
        "name": "How many jurisdictions does XHS™ Copilot monitor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "XHS™ Copilot continuously monitors 275+ jurisdictions worldwide from 12,000+ primary sources, including regulator bulletins, legislative texts and enforcement orders. Regulatory changes are typically surfaced within hours of publication, with AI-assisted impact analysis reviewed by the compliance team before it reaches the customer."
        }
      },
      {
        "@type": "Question",
        "name": "Who uses XHS™ Copilot?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "XHS™ Copilot is used by compliance, legal and regulatory affairs teams at regulated companies operating in gambling, payments, crypto and AI — from early-stage startups through to enterprises with cross-jurisdiction footprints. Pricing scales from 1-3 seat teams through to 100+ seat enterprise deployments."
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
