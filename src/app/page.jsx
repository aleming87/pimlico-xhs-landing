import Hero from "@/components/Hero";
import Differentiators from "@/components/Differentiators";
import ProductShowcase from "@/components/ProductShowcase";
import DatamapScripts from "@/components/DatamapScripts";
import { CookieConsent } from "@/components/CookieConsent";
import { TrustedBy, Sectors, Coverage, Security, Testimonials, FinalCTA } from "@/components/HomeSections";

export const metadata = {
  title: "Pimlico XHS\u2122 - Regulatory AI workspaces",
  description: "AI-agentic monitoring, analysis & collaboration for regulated teams.",
}

export default function Page() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pimlico XHS",
    "url": "https://pimlicosolutions.com",
    "logo": "https://pimlicosolutions.com/xhs-logo-blue.png",
    "description": "AI compliance workspaces for regulated teams",
    "sameAs": [
      "https://www.linkedin.com/company/pimlico-solutions",
      "https://twitter.com/pimlicoxhs"
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Pimlico XHS",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "250",
      "highPrice": "750",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "250",
        "priceCurrency": "USD",
        "billingDuration": "P1M"
      }
    },
    "description": "AI compliance workspaces for regulated teams. Monitor, analyse, and collaborate on AI, Payments, and Gambling regulations across 250+ jurisdictions.",
    "operatingSystem": "Web",
    "featureList": "Regulatory monitoring, AI compliance, Payments compliance, Real-time updates, Team collaboration"
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
