/**
 * Regulatory framework landing pages.
 *
 * Each entry powers /frameworks/<slug>. Pattern mirrors
 * /data/regulators.js but for named regulations (MiCA, PSD2, DORA,
 * EU AI Act, etc.) rather than authorities.
 *
 * Field reference:
 *   slug             URL segment, e.g. "mica"
 *   abbr             short code: "MiCA"
 *   name             full name
 *   jurisdiction     "European Union", "United Kingdom", etc.
 *   vertical         gambling | payments | crypto | ai
 *   inForce          date the framework came into effect (or phases)
 *   legalBasis       the underlying statute / directive / regulation number
 *   officialUrl      link to the canonical legal text
 *   summary          one-paragraph overview, doubles as meta description
 *   appliesTo        who has to comply
 *   keyRequirements  the binding obligations
 *   coverageAreas    what XHS Copilot tracks on this framework
 *   milestones       phased dates / implementation deadlines
 *   faqs             Q/A pairs for FAQPage schema
 *   relatedSlugs     adjacent frameworks
 *   relatedRegulators regulator slugs that supervise this framework
 */

export const frameworks = [
  {
    slug: 'mica',
    abbr: 'MiCA',
    name: 'Markets in Crypto-Assets Regulation',
    jurisdiction: 'European Union',
    vertical: 'crypto',
    inForce: '30 December 2024 (CASP); 30 June 2024 (stablecoins)',
    legalBasis: 'Regulation (EU) 2023/1114',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114',
    summary:
      'The Markets in Crypto-Assets Regulation (MiCA) is the EU\'s single rulebook for crypto. It creates a harmonised authorisation regime for crypto-asset service providers (CASPs), rules for asset-referenced tokens (ARTs) and e-money tokens (EMTs), and market-abuse standards — replacing 27 fragmented national regimes.',
    appliesTo: [
      'Crypto-asset service providers (exchanges, custodians, brokers, advisers, portfolio managers)',
      'Issuers of asset-referenced tokens (ARTs) and e-money tokens (EMTs)',
      'Issuers of crypto-assets other than ARTs/EMTs that publish a whitepaper',
      'Persons offering crypto-assets to the public or seeking admission to trading in the EU',
    ],
    keyRequirements: [
      'CASP authorisation from a national competent authority, with EU-wide passporting',
      'Whitepaper approval (with narrow exemptions) before any public offer or admission to trading',
      'Prudential, governance, conflict-of-interest, custody and outsourcing requirements',
      'Enhanced requirements for significant ARTs/EMTs supervised directly by the EBA',
      'Market-abuse provisions prohibiting insider dealing, unlawful disclosure and market manipulation',
      'Sanctions-screening, AML compliance under AMLD and future AMLR/AMLA supervision',
    ],
    coverageAreas: [
      'EBA and ESMA Level 2 Regulatory and Implementing Technical Standards',
      'Level 3 Guidelines on authorisation, market abuse, suitability, custody',
      'National competent authority (NCA) guidance and enforcement under MiCA',
      'ESMA Q&A and public statements on MiCA interpretation',
      'Transitional-measure decisions by member states under Article 143',
      'Cross-references with DORA, AMLR, the Transfer of Funds Regulation (TFR)',
    ],
    milestones: [
      '29 June 2023 — MiCA published in the Official Journal of the EU',
      '30 June 2024 — Titles III (ARTs) and IV (EMTs) came into effect',
      '30 December 2024 — Remaining provisions including Title V (CASP) came into effect',
      '1 July 2026 — end of the longest national transitional measure window',
    ],
    faqs: [
      {
        q: 'How does XHS™ Copilot help with MiCA compliance?',
        a: 'XHS™ Copilot tracks every EBA and ESMA technical standard, Q&A and guideline under MiCA, plus national competent authority decisions and transitional measures. Lens™ AI maps each change to the obligations specific to your entity type (CASP, ART issuer, EMT issuer, offeror).',
      },
      {
        q: 'When did MiCA come into force?',
        a: 'MiCA entered into application in two phases: the rules on asset-referenced tokens (Title III) and e-money tokens (Title IV) applied from 30 June 2024; all remaining provisions, including the CASP authorisation regime (Title V), applied from 30 December 2024.',
      },
      {
        q: 'Who needs a MiCA CASP licence?',
        a: 'Any legal person or undertaking whose occupation or business is the provision of one or more crypto-asset services to third parties on a professional basis in the EU. Services include custody, exchange of crypto-assets for fiat or other crypto-assets, operation of a trading platform, order execution, reception and transmission of orders, placement, portfolio management and advice.',
      },
      {
        q: 'Does MiCA cover Bitcoin?',
        a: 'MiCA covers services related to crypto-assets including Bitcoin (CASP activities such as custody, exchange, trading platforms). However, MiCA\'s issuer-focused rules on whitepapers and market-abuse only apply to offers, admissions and issuances in the EU — a permissionless asset like Bitcoin does not have an issuer subject to those rules.',
      },
      {
        q: 'What is the difference between an ART and an EMT under MiCA?',
        a: 'Asset-Referenced Tokens (ARTs) reference multiple fiat currencies, commodities or other crypto-assets to maintain a stable value. Electronic Money Tokens (EMTs) reference the value of one single official fiat currency. EMTs are regulated more tightly, with issuers requiring an EMI or credit-institution authorisation in addition to MiCA-specific approval.',
      },
    ],
    relatedSlugs: ['dora', 'psd2'],
    relatedRegulators: ['eba', 'fca'],
  },
  {
    slug: 'psd2',
    abbr: 'PSD2',
    name: 'Second Payment Services Directive',
    jurisdiction: 'European Union / United Kingdom',
    vertical: 'payments',
    inForce: '13 January 2018',
    legalBasis: 'Directive (EU) 2015/2366',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32015L2366',
    summary:
      'The Second Payment Services Directive (PSD2) is the foundational EU/UK framework for electronic payments. It introduced payment initiation and account information services, mandated strong customer authentication (SCA), opened bank data via APIs, and prescribed incident reporting and security obligations.',
    appliesTo: [
      'Banks and other account-servicing payment service providers',
      'Payment institutions (PIs) and small payment institutions (SPIs)',
      'Electronic-money institutions (EMIs) providing payment services',
      'Account information service providers (AISPs) and payment initiation service providers (PISPs)',
      'Merchants that process card-not-present transactions subject to SCA',
    ],
    keyRequirements: [
      'Authorisation or registration as a payment institution proportionate to service scope',
      'Strong Customer Authentication for remote electronic payments, unless an exemption applies',
      'Secure open-banking APIs for AISP and PISP access under Commission Delegated Regulation 2018/389',
      'Incident reporting to the competent authority within stringent timeframes',
      'Safeguarding of customer funds under segregation or insurance arrangements',
      'Complaint handling, disclosure and consumer-protection rules under Titles III and IV',
    ],
    coverageAreas: [
      'EBA Guidelines on SCA, on incident reporting, on outsourcing, on fraud reporting',
      'Commission Delegated Regulations under PSD2',
      'National competent authority guidance and enforcement decisions',
      'PSD3/PSR legislative process and its practical impact on PSD2 obligations',
      'Cross-references with the e-IDAS framework and DORA ICT standards',
      'Open Banking UK Standards maintained by OBIE / OBL',
    ],
    milestones: [
      '25 November 2015 — PSD2 published in the Official Journal',
      '13 January 2018 — PSD2 applicable in member states',
      '14 September 2019 — SCA and the Regulatory Technical Standards on SCA + CSC applied',
      '31 December 2020 — UK onshored PSD2 ahead of Brexit transition',
      'PSD3 / PSR expected — proposals published 28 June 2023',
    ],
    faqs: [
      {
        q: 'How does XHS™ Copilot help with PSD2 compliance?',
        a: 'XHS™ Copilot tracks every EBA Guideline, Commission Delegated Regulation, and NCA decision under PSD2 — SCA, incident reporting, outsourcing, fraud reporting, API access — and delivers plain-English impact notes keyed to your payment-institution type.',
      },
      {
        q: 'What is Strong Customer Authentication (SCA)?',
        a: 'SCA is an authentication based on two or more of: knowledge (something only the user knows), possession (something only the user has) and inherence (something the user is). Under PSD2 and the SCA RTS, it is mandatory for most remote electronic payments initiated by the payer, with narrow exemptions for low-value, low-risk and recurring transactions.',
      },
      {
        q: 'Is PSD2 still in force?',
        a: 'Yes. PSD2 remains the applicable regime in both the EU and the UK. The European Commission has proposed PSD3 + the Payment Services Regulation (PSR) to replace PSD2, published on 28 June 2023 and currently progressing through the EU legislative process.',
      },
      {
        q: 'What is the difference between AISPs and PISPs?',
        a: 'Account Information Service Providers (AISPs) are authorised to access account information via APIs, typically to aggregate accounts, provide budgeting or credit-assessment services. Payment Initiation Service Providers (PISPs) initiate payments on behalf of the payer directly from the payer\'s bank account.',
      },
      {
        q: 'Does PSD2 apply in the UK post-Brexit?',
        a: 'Yes. PSD2 was onshored into UK law via the Payment Services Regulations 2017 (as amended). The FCA supervises compliance. Many EBA PSD2 Guidelines have also been adopted — with modifications — by the UK\'s conduct and prudential authorities.',
      },
    ],
    relatedSlugs: ['dora', 'mica'],
    relatedRegulators: ['eba', 'fca', 'mas'],
  },
  {
    slug: 'dora',
    abbr: 'DORA',
    name: 'Digital Operational Resilience Act',
    jurisdiction: 'European Union',
    vertical: 'payments',
    inForce: '17 January 2025',
    legalBasis: 'Regulation (EU) 2022/2554',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2554',
    summary:
      'The Digital Operational Resilience Act (DORA) is the EU\'s harmonised regime for ICT risk management, incident reporting, resilience testing and third-party risk oversight across the financial sector. It applies to roughly 22,000 financial entities and their critical ICT providers.',
    appliesTo: [
      'Credit institutions, payment institutions, EMIs and account-information service providers',
      'Investment firms, trading venues, central counterparties, central securities depositories',
      'Insurance and reinsurance undertakings and insurance intermediaries',
      'UCITS and alternative investment fund managers',
      'Crypto-asset service providers authorised under MiCA',
      'Critical third-party ICT service providers designated by the ESAs',
    ],
    keyRequirements: [
      'ICT risk-management framework proportionate to size, nature and risk profile',
      'Major ICT-related incident classification, notification and reporting to NCAs',
      'Digital operational resilience testing programme, including threat-led penetration testing (TLPT) for significant entities',
      'Third-party ICT risk management including registers, concentration-risk monitoring and exit strategies',
      'Contractual provisions with ICT service providers aligned with DORA Article 30',
      'Oversight arrangements for critical ICT third-party providers (CTPPs) coordinated by the ESAs',
    ],
    coverageAreas: [
      'Level 2 Regulatory and Implementing Technical Standards from the ESAs',
      'Level 3 Guidelines and Q&A from EBA / ESMA / EIOPA',
      'Joint Committee publications on CTPP oversight',
      'National competent authority guidance on DORA supervision',
      'Cross-references with MiCA, PSD2/PSD3, CRD/CRR and the NIS2 Directive',
      'Practical supervisory expectations from the ECB, EIOPA-led colleges and joint examinations',
    ],
    milestones: [
      '27 December 2022 — DORA published in the Official Journal',
      '17 January 2023 — DORA entered into force (start of the 24-month transition)',
      '17 January 2025 — DORA fully applicable across the EU',
      '2025–2026 — rolling ESAs technical standards and Guidelines package',
    ],
    faqs: [
      {
        q: 'How does XHS™ Copilot help with DORA compliance?',
        a: 'XHS™ Copilot tracks every ESAs Level 2 and Level 3 deliverable, joint committee publication and NCA guidance under DORA. Lens™ AI maps each change to your firm type and flags obligations where the implementation window is tight.',
      },
      {
        q: 'When did DORA come into force?',
        a: 'DORA entered into force on 17 January 2023 and became fully applicable on 17 January 2025 after a 24-month transition period. Firms in scope were expected to be DORA-compliant by that application date.',
      },
      {
        q: 'Who does DORA apply to?',
        a: 'DORA applies to approximately 22,000 financial entities in the EU — credit institutions, investment firms, payment institutions, EMIs, insurers, fund managers, trading venues, CCPs, CSDs and MiCA-authorised CASPs — plus critical ICT third-party service providers designated by the ESAs.',
      },
      {
        q: 'What is threat-led penetration testing (TLPT) under DORA?',
        a: 'TLPT is advanced resilience testing modelled on real-world threat scenarios, carried out on live production systems by independent testers. Under DORA it is required for significant entities at least every three years, using a methodology aligned with the EU TIBER framework.',
      },
      {
        q: 'How does DORA relate to NIS2?',
        a: 'DORA is lex specialis for the financial sector — where DORA and NIS2 both cover a topic, DORA prevails for in-scope financial entities. However, NIS2 remains relevant for ICT service providers and adjacent entities that are not themselves regulated financial firms.',
      },
    ],
    relatedSlugs: ['mica', 'psd2'],
    relatedRegulators: ['eba'],
  },
  {
    slug: 'eu-ai-act',
    abbr: 'EU AI Act',
    name: 'Artificial Intelligence Act',
    jurisdiction: 'European Union',
    vertical: 'ai',
    inForce: '1 August 2024 (phased)',
    legalBasis: 'Regulation (EU) 2024/1689',
    officialUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689',
    summary:
      'The Artificial Intelligence Act is the EU\'s risk-based horizontal regulation for AI systems. It bans certain practices outright, imposes tough conformity-assessment requirements on high-risk AI, and sets transparency and governance obligations for general-purpose AI (GPAI) models.',
    appliesTo: [
      'Providers placing AI systems on the EU market or putting them into service',
      'Deployers of AI systems located in the EU',
      'Providers and deployers outside the EU where the output of the AI system is used in the EU',
      'Providers of general-purpose AI models with systemic risk',
      'Importers and distributors of AI systems in the EU market',
    ],
    keyRequirements: [
      'Prohibition on specified AI practices (social scoring, manipulative systems, real-time biometric ID in public spaces with narrow exceptions, emotion recognition at work/school, untargeted facial-recognition scraping)',
      'Conformity assessment, CE marking and post-market monitoring for high-risk AI systems listed in Annex III',
      'Technical documentation, record-keeping and log-retention for high-risk AI',
      'Human-oversight, accuracy, robustness, cybersecurity and data-governance requirements',
      'Transparency obligations for certain AI systems — chatbots, deepfakes, emotion-recognition, biometric categorisation',
      'GPAI model obligations including technical documentation, training-data summaries and — for systemic-risk models — additional evaluation and risk management',
    ],
    coverageAreas: [
      'European Commission delegated and implementing acts under the AI Act',
      'EU AI Office guidance and codes of practice for GPAI providers',
      'European Artificial Intelligence Board (EAIB) decisions and opinions',
      'National market-surveillance authority guidance and enforcement',
      'Cross-references with the GDPR, the Product Liability Directive, NIS2, DORA',
      'International interoperability work with NIST AI RMF, ISO/IEC 42001 and the Council of Europe Framework Convention',
    ],
    milestones: [
      '13 June 2024 — AI Act adopted',
      '1 August 2024 — Entry into force',
      '2 February 2025 — Prohibitions and AI-literacy obligations applicable',
      '2 August 2025 — GPAI, governance and notified-body provisions applicable',
      '2 August 2026 — Majority of high-risk AI system obligations applicable',
      '2 August 2027 — High-risk obligations for AI embedded in regulated products applicable',
    ],
    faqs: [
      {
        q: 'How does XHS™ Copilot help with EU AI Act compliance?',
        a: 'XHS™ Copilot tracks every Commission delegated and implementing act, AI Office code of practice, EAIB output and national market-surveillance guidance under the AI Act. Lens™ AI maps each update to your AI system\'s risk classification (prohibited, high-risk, limited-risk, minimal-risk, or GPAI).',
      },
      {
        q: 'When does the EU AI Act apply?',
        a: 'The AI Act entered into force on 1 August 2024 and applies in phases: prohibitions and AI literacy from 2 February 2025; GPAI, governance and notified bodies from 2 August 2025; most high-risk obligations from 2 August 2026; embedded-product high-risk obligations from 2 August 2027.',
      },
      {
        q: 'What AI practices does the AI Act ban?',
        a: 'The AI Act prohibits AI systems used for social scoring by public authorities, manipulative or exploitative techniques, real-time remote biometric identification in public spaces (with narrow law-enforcement exceptions), untargeted facial-recognition database scraping, emotion recognition in the workplace and in education, and biometric categorisation by sensitive attributes.',
      },
      {
        q: 'Does the AI Act apply to ChatGPT and other LLMs?',
        a: 'Yes. Foundation models and large language models fall under the general-purpose AI (GPAI) provisions. They face transparency, documentation and training-data summary requirements. Models with systemic risk — measured by compute and impact thresholds — face additional evaluation, risk-management and incident-reporting obligations.',
      },
      {
        q: 'Does the AI Act apply outside the EU?',
        a: 'Yes, extraterritorially. It applies to providers placing AI on the EU market from anywhere, and to providers and deployers outside the EU whose AI system output is used in the EU — similar in mechanism to the GDPR\'s territorial scope.',
      },
    ],
    relatedSlugs: ['mica', 'dora'],
    relatedRegulators: [],
  },
]

export function getFramework(slug) {
  return frameworks.find((f) => f.slug === slug) || null
}

export function listFrameworks() {
  return frameworks
}
