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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
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
