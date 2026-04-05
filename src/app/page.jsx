import Hero from "@/components/Hero";
import Differentiators from "@/components/Differentiators";
import ProductShowcase from "@/components/ProductShowcase";
import DatamapScripts from "@/components/DatamapScripts";
import { CookieConsent } from "@/components/CookieConsent";
import { TrustedBy, Sectors, Coverage, Security, Testimonials, FinalCTA } from "@/components/HomeSections";

export const metadata = {
  title: "XHS\u2122 Copilot \u2014 Every regulatory change. Analyzed.",
  description: "Compliance workspaces for Gambling, Payments, Crypto and AI teams. 275+ jurisdictions sourced, analyzed, and delivered daily.",
}

export default function Page() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pimlico Solutions",
    "alternateName": "XHS\u2122 Copilot",
    "url": "https://pimlicosolutions.com",
    "logo": "https://pimlicosolutions.com/dual-logo.png",
    "description": "AI compliance workspaces for regulated teams. Every regulatory change. Analyzed.",
    "sameAs": [
      "https://www.linkedin.com/company/pimlico-solutions",
      "https://twitter.com/pimlicoxhs"
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "XHS\u2122 Copilot",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "660",
      "highPrice": "8800",
      "priceCurrency": "GBP",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "660",
        "priceCurrency": "GBP",
        "billingDuration": "P1M"
      }
    },
    "description": "AI compliance workspaces for regulated teams. Monitor, analyze, and collaborate on Gambling, Payments, Crypto, and AI regulations across 275+ jurisdictions.",
    "operatingSystem": "Web",
    "featureList": "Regulatory monitoring, Jurisdiction reports, Lens AI analysis, Slack and Teams integration, Team collaboration, Real-time change detection"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
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
