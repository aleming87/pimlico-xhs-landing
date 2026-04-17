/**
 * Compliance glossary data source.
 *
 * Each entry powers a /glossary/<slug> landing page with DefinedTerm
 * schema markup. Low-visibility SEO play — in sitemap, not in nav.
 *
 * Field reference:
 *   slug          URL path segment
 *   term          display name / heading
 *   abbr          abbreviation if applicable (null otherwise)
 *   definition    one-paragraph plain-language definition
 *   context       why it matters for regulated firms
 *   verticals     which XHS verticals this applies to
 *   relatedSlugs  links to other glossary terms
 *   seeAlso       external references (regulator docs, legislation)
 */

export const glossaryTerms = [
  {
    slug: 'kyc',
    term: 'Know Your Customer',
    abbr: 'KYC',
    definition:
      'Know Your Customer (KYC) is the process financial institutions and regulated businesses use to verify the identity of their clients before and during the business relationship. KYC procedures include collecting government-issued identification, proof of address, and — for corporate clients — verifying beneficial ownership structures.',
    context:
      'KYC is a foundational obligation under anti-money-laundering regulations worldwide. Failure to maintain adequate KYC processes is one of the most common grounds for enforcement action. Regulators such as the UKGC, FCA, MGA and MAS all mandate KYC as a condition of licensing.',
    verticals: ['gambling', 'payments', 'crypto'],
    relatedSlugs: ['aml', 'cdd', 'edd', 'pep'],
    seeAlso: [
      { label: 'FATF Recommendation 10', url: 'https://www.fatf-gafi.org/en/topics/fatf-recommendations.html' },
    ],
  },
  {
    slug: 'aml',
    term: 'Anti-Money Laundering',
    abbr: 'AML',
    definition:
      'Anti-Money Laundering (AML) refers to the set of laws, regulations and procedures designed to prevent criminals from disguising illegally obtained funds as legitimate income. AML frameworks require regulated entities to implement customer identification, transaction monitoring, record-keeping and suspicious-activity reporting.',
    context:
      'AML compliance is a universal requirement across gambling, payments, crypto and financial services. The EU Anti-Money Laundering Directives (AMLD4, AMLD5, AMLD6) and the US Bank Secrecy Act set baseline standards. Non-compliance can result in criminal liability for individuals and multi-million-pound fines for firms.',
    verticals: ['gambling', 'payments', 'crypto'],
    relatedSlugs: ['kyc', 'cdd', 'sar', 'pep'],
    seeAlso: [
      { label: 'EU AMLD5 text', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32018L0843' },
    ],
  },
  {
    slug: 'cdd',
    term: 'Customer Due Diligence',
    abbr: 'CDD',
    definition:
      'Customer Due Diligence (CDD) is the standard level of checks a regulated entity must perform to understand who a customer is and what risk they present. CDD typically involves verifying the customer\'s identity, understanding the nature and purpose of the business relationship, and ongoing monitoring of transactions.',
    context:
      'CDD sits between simplified due diligence (SDD) for low-risk clients and enhanced due diligence (EDD) for higher-risk situations. Most regulators expect CDD to be completed before onboarding. The depth and frequency of ongoing CDD varies by jurisdiction and risk appetite.',
    verticals: ['gambling', 'payments', 'crypto'],
    relatedSlugs: ['kyc', 'edd', 'aml', 'pep'],
    seeAlso: [
      { label: 'JMLSG Guidance (UK)', url: 'https://www.jmlsg.org.uk/' },
    ],
  },
  {
    slug: 'edd',
    term: 'Enhanced Due Diligence',
    abbr: 'EDD',
    definition:
      'Enhanced Due Diligence (EDD) is a more rigorous form of customer scrutiny applied when a business relationship or transaction presents a higher risk of money laundering or terrorist financing. EDD measures include obtaining additional documentation on source of wealth and source of funds, more frequent transaction reviews, and senior management sign-off.',
    context:
      'EDD is triggered by specific risk factors: politically exposed persons (PEPs), high-risk jurisdictions, complex corporate structures, unusually large transactions, or adverse media. Under the EU Anti-Money Laundering Directives and the UK Money Laundering Regulations, EDD is mandatory in these scenarios — not discretionary.',
    verticals: ['gambling', 'payments', 'crypto'],
    relatedSlugs: ['cdd', 'pep', 'kyc', 'aml'],
    seeAlso: [
      { label: 'FATF Guidance on PEPs', url: 'https://www.fatf-gafi.org/en/publications/fatf-recommendations/documents/peps-r12-r22.html' },
    ],
  },
  {
    slug: 'sar',
    term: 'Suspicious Activity Report',
    abbr: 'SAR',
    definition:
      'A Suspicious Activity Report (SAR) is a formal filing made by a regulated entity to its national Financial Intelligence Unit (FIU) when it identifies activity that may indicate money laundering, terrorist financing or other financial crime. In the UK, SARs are filed with the National Crime Agency (NCA); in the US, with the Financial Crimes Enforcement Network (FinCEN).',
    context:
      'Failing to file a SAR when there are grounds for suspicion is a criminal offence in most jurisdictions. The obligation to report is personal — it falls on the individual who forms the suspicion, not just the compliance function. Tipping off a subject about a SAR is also a criminal offence.',
    verticals: ['gambling', 'payments', 'crypto'],
    relatedSlugs: ['aml', 'kyc', 'pep'],
    seeAlso: [
      { label: 'NCA SAR reporting (UK)', url: 'https://www.nationalcrimeagency.gov.uk/what-we-do/crime-threats/money-laundering-and-illicit-finance/suspicious-activity-reports' },
    ],
  },
  {
    slug: 'pep',
    term: 'Politically Exposed Person',
    abbr: 'PEP',
    definition:
      'A Politically Exposed Person (PEP) is an individual who holds or has held a prominent public function — such as a head of state, senior government official, judge, military officer or senior executive of a state-owned enterprise. Family members and close associates of PEPs are also classified as PEPs under most regulatory frameworks.',
    context:
      'PEPs are considered higher risk for corruption and money laundering because of their access to public funds and influence. Regulated entities must apply enhanced due diligence to PEPs, including senior management approval for the relationship, source-of-wealth verification and ongoing enhanced monitoring. PEP status does not imply wrongdoing — it is a risk classification.',
    verticals: ['gambling', 'payments', 'crypto'],
    relatedSlugs: ['edd', 'kyc', 'aml', 'cdd'],
    seeAlso: [
      { label: 'FATF Recommendation 12', url: 'https://www.fatf-gafi.org/en/topics/fatf-recommendations.html' },
    ],
  },
  {
    slug: 'travel-rule',
    term: 'Travel Rule',
    abbr: null,
    definition:
      'The Travel Rule requires financial institutions and virtual asset service providers (VASPs) to collect, retain and transmit originator and beneficiary information when transferring funds or virtual assets above a certain threshold. Originally introduced by FATF Recommendation 16 for wire transfers, it has been extended to crypto-asset transfers under FATF guidance and the EU Transfer of Funds Regulation (TFR).',
    context:
      'For crypto businesses, the Travel Rule is one of the most operationally complex compliance requirements. It requires real-time data exchange between counterparty VASPs — which means technical integration with travel-rule protocols (TRISA, OpenVASP, Sygna). Non-compliance risks loss of banking relationships and regulatory sanctions.',
    verticals: ['crypto', 'payments'],
    relatedSlugs: ['vasp', 'aml', 'kyc'],
    seeAlso: [
      { label: 'FATF Updated Guidance on VAs and VASPs', url: 'https://www.fatf-gafi.org/en/publications/fatf-recommendations/documents/guidance-rba-virtual-assets-2021.html' },
    ],
  },
  {
    slug: 'sca',
    term: 'Strong Customer Authentication',
    abbr: 'SCA',
    definition:
      'Strong Customer Authentication (SCA) is a security requirement under the EU Payment Services Directive (PSD2) and the UK Payment Services Regulations that mandates multi-factor authentication for electronic payments. SCA requires at least two of three elements: something the customer knows (password or PIN), something the customer has (phone or hardware token), and something the customer is (biometric).',
    context:
      'SCA applies to customer-initiated online payments, contactless transactions above cumulative limits, and access to payment accounts. Exemptions exist for low-value transactions, trusted beneficiaries and transactions assessed as low risk via Transaction Risk Analysis (TRA). Payment service providers must implement SCA or apply valid exemptions — incorrect application leads to declined transactions and regulatory scrutiny.',
    verticals: ['payments'],
    relatedSlugs: ['casp'],
    seeAlso: [
      { label: 'EBA RTS on SCA', url: 'https://www.eba.europa.eu/regulation-and-policy/payment-services-and-electronic-money/regulatory-technical-standards-on-strong-customer-authentication-and-common-and-secure-communication' },
    ],
  },
  {
    slug: 'consumer-duty',
    term: 'Consumer Duty',
    abbr: null,
    definition:
      'The Consumer Duty is a UK Financial Conduct Authority (FCA) standard that requires regulated firms to deliver good outcomes for retail customers. Introduced in July 2023, it sets higher expectations across four outcome areas: products and services, price and value, consumer understanding, and consumer support.',
    context:
      'Consumer Duty goes beyond existing Treating Customers Fairly (TCF) principles by requiring firms to actively evidence good customer outcomes rather than simply avoiding harm. It affects product governance, marketing materials, fee structures and complaint handling. Firms must conduct annual outcome assessments and boards must review them. The FCA has signaled it as a priority enforcement area.',
    verticals: ['payments', 'gambling'],
    relatedSlugs: ['kyc', 'sca'],
    seeAlso: [
      { label: 'FCA Consumer Duty', url: 'https://www.fca.org.uk/firms/consumer-duty' },
    ],
  },
  {
    slug: 'casp',
    term: 'Crypto-Asset Service Provider',
    abbr: 'CASP',
    definition:
      'A Crypto-Asset Service Provider (CASP) is the regulatory classification used under the EU Markets in Crypto-Assets Regulation (MiCA) for firms that provide services related to crypto-assets — including exchanges, custody providers, brokers, advisors and portfolio managers. CASPs must be authorized in an EU member state and comply with MiCA\'s conduct, governance and prudential requirements.',
    context:
      'MiCA creates a single EU-wide authorization regime for CASPs, replacing the patchwork of national registrations. Authorized CASPs can passport services across all 27 member states. Requirements include minimum capital, governance arrangements, complaints handling, conflicts-of-interest policies and ongoing supervisory reporting. Existing registered firms had a transitional period to obtain full CASP authorization.',
    verticals: ['crypto'],
    relatedSlugs: ['vasp', 'travel-rule', 'aml'],
    seeAlso: [
      { label: 'MiCA full text', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114' },
    ],
  },
  {
    slug: 'vasp',
    term: 'Virtual Asset Service Provider',
    abbr: 'VASP',
    definition:
      'A Virtual Asset Service Provider (VASP) is the FATF term for any business that conducts exchange, transfer, safekeeping or administration of virtual assets, or provides financial services related to the issuance or sale of virtual assets. The term is used in FATF guidance and in national laws that implement FATF standards outside the EU.',
    context:
      'VASP is the global-standard term (used by FATF, and adopted in national legislation by the UK, Singapore, Hong Kong, Japan and others), while CASP is the EU-specific term under MiCA. Both refer to broadly the same category of businesses but carry different regulatory obligations depending on jurisdiction. VASPs must comply with AML/CFT requirements, including the Travel Rule, customer due diligence and suspicious-activity reporting.',
    verticals: ['crypto'],
    relatedSlugs: ['casp', 'travel-rule', 'aml', 'kyc'],
    seeAlso: [
      { label: 'FATF definition of VASP', url: 'https://www.fatf-gafi.org/en/publications/fatf-recommendations/documents/guidance-rba-virtual-assets-2021.html' },
    ],
  },
  {
    slug: 'stablecoin',
    term: 'Stablecoin',
    abbr: null,
    definition:
      'A stablecoin is a type of crypto-asset designed to maintain a stable value relative to a reference asset — typically a fiat currency such as USD, EUR or GBP. Stability mechanisms include full fiat reserves (e.g. USDC, USDT), over-collateralized crypto reserves (e.g. DAI), or algorithmic supply adjustments. Under MiCA, stablecoins are classified as either Asset-Referenced Tokens (ARTs) or E-Money Tokens (EMTs).',
    context:
      'Stablecoins are the most regulated category of crypto-asset because they function as a medium of exchange and store of value, overlapping with traditional payment instruments. Under MiCA, issuers of significant stablecoins face capital requirements, reserve segregation, redemption rights and direct EBA supervision. The UK is developing a parallel regime under the Financial Services and Markets Act 2023. Compliance teams must track requirements in both EU and UK regimes.',
    verticals: ['crypto', 'payments'],
    relatedSlugs: ['casp', 'vasp', 'travel-rule'],
    seeAlso: [
      { label: 'MiCA Title III (ARTs) and Title IV (EMTs)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114' },
    ],
  },
]

export function listGlossaryTerms() {
  return glossaryTerms
}

export function getGlossaryTerm(slug) {
  return glossaryTerms.find((t) => t.slug === slug) || null
}
