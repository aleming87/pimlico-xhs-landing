/**
 * Regulator landing-page data source.
 *
 * Each entry powers a /regulators/<slug> SEO landing page. The data
 * shape is rich on purpose — every field maps to either visible
 * content or schema. Adding a new regulator is a single object push.
 *
 * Field reference:
 *   slug                URL path segment, e.g. "ukgc"
 *   abbr                short authority code: "UKGC"
 *   name                full official name
 *   jurisdiction        country/region the authority operates in
 *   countryCode         ISO 3166-1 alpha-2 (used for hreflang + schema)
 *   vertical            one of: gambling | payments | crypto | ai
 *   established         year founded, used in schema and content
 *   officialUrl         link to the authority's own website
 *   summary             one-paragraph overview (160-200 chars), used in
 *                       meta description AND first body paragraph
 *   keyObligations      bullet list — what regulated firms must do
 *   coverageAreas       what XHS Copilot monitors for this authority
 *   licences            named licence/permit categories the authority issues
 *   recentFocus         what the authority has been emphasizing recently
 *   faqs                question/answer pairs for FAQPage schema
 *   relatedSlugs        adjacent regulators users might also want
 */

export const regulators = [
  {
    slug: 'ukgc',
    abbr: 'UKGC',
    name: 'UK Gambling Commission',
    jurisdiction: 'United Kingdom',
    countryCode: 'GB',
    vertical: 'gambling',
    established: 2007,
    officialUrl: 'https://www.gamblingcommission.gov.uk',
    summary:
      'The UK Gambling Commission (UKGC) regulates commercial gambling in Great Britain under the Gambling Act 2005, including online operators, software suppliers, lotteries and the National Lottery.',
    keyObligations: [
      'Hold an Operating Licence and a Personal Management Licence for senior staff',
      'Comply with the Licence Conditions and Codes of Practice (LCCP) and the Remote Technical Standards (RTS)',
      'Run robust customer due diligence, source-of-funds checks and affordability assessments',
      'File Regulatory Returns and report key events (KEs) within statutory timeframes',
      'Comply with the AML obligations under the Money Laundering Regulations 2017',
      'Implement safer-gambling controls, GAMSTOP integration and advertising restrictions under CAP/BCAP',
    ],
    coverageAreas: [
      'New consultations, calls for evidence and policy statements',
      'Changes to the LCCP, RTS and Remote Customer Interaction Guidance',
      'Enforcement actions, public statements and licence reviews',
      'Statutory levy developments and the gambling white paper roll-out',
      'Affordability and financial-risk check thresholds',
      'Technical standards updates, including game design and ADR rules',
    ],
    licences: [
      'Remote operating licence (B2C)',
      'Non-remote operating licence (land-based)',
      'B2B / supplier licence (gambling software, hosting)',
      'Personal Management Licence (PML) and Personal Functional Licence (PFL)',
      'Lottery operating and external lottery manager licences',
    ],
    recentFocus:
      'Implementation of the gambling white paper, financial risk and affordability checks, the statutory levy on operators, marketing and direct-marketing reform, and game-design changes for online slots.',
    faqs: [
      {
        q: 'How does XHS™ Copilot help with UKGC compliance?',
        a: 'XHS™ Copilot monitors every UKGC publication — LCCP changes, RTS updates, public statements, enforcement actions and consultations — and pushes plain-English impact notes into your team workspace within hours of release. AI-generated jurisdiction reports summarise the obligations specific to your licence type.',
      },
      {
        q: 'What licences does the UK Gambling Commission issue?',
        a: 'The UKGC issues Operating Licences (remote and non-remote), Personal Management Licences (PML) and Personal Functional Licences (PFL) for individuals in key roles, B2B / supplier licences for software and platform providers, and lottery operating licences. Each carries its own Licence Conditions and Codes of Practice.',
      },
      {
        q: 'When did the UK Gambling Commission come into being?',
        a: 'The UK Gambling Commission was established in 2007 under the Gambling Act 2005, replacing the Gaming Board for Great Britain. It became the regulator of the National Lottery in 2013.',
      },
      {
        q: 'What is the LCCP?',
        a: 'The Licence Conditions and Codes of Practice (LCCP) is the rulebook that every UKGC licensee must follow. It sets out social responsibility requirements, customer protection, anti-money laundering controls, marketing rules, complaints handling and reporting obligations.',
      },
      {
        q: 'How frequently does XHS™ Copilot detect UKGC changes?',
        a: 'Continuously. XHS™ Copilot ingests the UKGC website, the Public Register, statutory consultation feeds and the Regulatory Returns portal, and detects new content within hours of publication. Material changes are summarised by Lens™ AI and delivered to your Slack, Teams or email channel.',
      },
      {
        q: 'Is the UK Gambling Commission part of UK government?',
        a: 'Yes. The UK Gambling Commission is a non-departmental public body sponsored by the Department for Culture, Media and Sport (DCMS). It is independent in its decision-making but accountable to Parliament.',
      },
    ],
    relatedSlugs: ['mga', 'sga', 'fca', 'eba'],
  },
  {
    slug: 'mga',
    abbr: 'MGA',
    name: 'Malta Gaming Authority',
    jurisdiction: 'Malta',
    countryCode: 'MT',
    vertical: 'gambling',
    established: 2001,
    officialUrl: 'https://www.mga.org.mt',
    summary:
      'The Malta Gaming Authority (MGA) regulates all commercial gambling operations based in Malta. Its licence framework is one of the most widely-used in EU iGaming, covering B2C operators, B2B suppliers and the full range of game types from sportsbook to skill games.',
    keyObligations: [
      'Hold the appropriate MGA Gaming Service Licence (B2C) or Critical Gaming Supply Licence (B2B)',
      'Comply with the Gaming Act (Chapter 583) and the Player Protection Directive',
      'Maintain segregated player funds and a dedicated player-protection function',
      'Run KYC, EDD, source-of-funds and source-of-wealth checks proportionate to risk',
      'Report suspicious transactions to the FIAU under AML/CFT obligations',
      'File monthly gaming tax returns and annual compliance contribution',
    ],
    coverageAreas: [
      'Gaming Act amendments, directives and implementing regulations',
      'MGA policy documents, guidance notes and technical specifications',
      'Public enforcement actions, licence cancellations and administrative penalties',
      'Player Protection Directive updates, including affordability and protection rules',
      'AML/CFT guidance from the FIAU that applies to MGA licensees',
      'Cross-border equivalence decisions with other EU gaming regulators',
    ],
    licences: [
      'Gaming Service Licence (B2C) — covers casino, sports betting, poker and bingo',
      'Critical Gaming Supply Licence (B2B) — platforms, RNG, game studios',
      'Corporate Group Licence — for multi-brand operators',
      'Material Gaming Supply registration — ancillary suppliers',
      'Controlled Skill Games Licence — skill-based real-money games',
    ],
    recentFocus:
      'Affordability and player-protection enhancements, tighter KYC for high-risk jurisdictions, FIAU AML compliance reviews, and the continued expansion of B2B oversight over platform providers and game studios.',
    faqs: [
      {
        q: 'How does XHS™ Copilot help with MGA compliance?',
        a: 'XHS™ Copilot ingests every MGA publication — Gaming Act amendments, directives, policy documents, public-enforcement notices and FIAU AML guidance — and converts them into plain-English impact notes delivered to your team workspace. Lens™ AI generates jurisdiction reports keyed to your specific MGA licence type.',
      },
      {
        q: 'What licences does the Malta Gaming Authority issue?',
        a: 'The MGA issues Gaming Service Licences (B2C) covering four game categories — casino, sports betting, poker and bingo — and Critical Gaming Supply Licences (B2B) for platforms, RNG suppliers and game studios. It also maintains registers for material gaming suppliers and key function holders.',
      },
      {
        q: 'When was the Malta Gaming Authority established?',
        a: 'The Malta Gaming Authority was established in 2001 as the Lotteries and Gaming Authority. It was renamed the Malta Gaming Authority in 2015 and its licensing framework was completely restructured under the Gaming Act (Chapter 583) in 2018.',
      },
      {
        q: 'Is an MGA licence valid across the EU?',
        a: 'No. An MGA licence authorises operations from Malta and is widely respected across the EEA, but it does not automatically entitle a licensee to offer gambling in every EU member state. Many member states — Germany, France, Spain, Italy, Netherlands, Sweden — require local licensing in addition.',
      },
      {
        q: 'What is the MGA Player Protection Directive?',
        a: 'The Player Protection Directive is the MGA\'s cornerstone framework for safer gambling. It sets binding requirements on deposit, loss and session limits, self-exclusion, reality checks, affordability monitoring, and the identification and intervention with at-risk players.',
      },
    ],
    relatedSlugs: ['ukgc', 'sga', 'ksa', 'ggl'],
  },
  {
    slug: 'sga',
    abbr: 'SGA',
    name: 'Swedish Gambling Authority',
    jurisdiction: 'Sweden',
    countryCode: 'SE',
    vertical: 'gambling',
    established: 2018,
    officialUrl: 'https://www.spelinspektionen.se',
    summary:
      'The Swedish Gambling Authority (Spelinspektionen) regulates the Swedish gambling market under the Gambling Act of 2018, which opened the market to private operators while preserving a strict framework around responsible gambling, licensing and advertising.',
    keyObligations: [
      'Hold a licence for online commercial gambling, state gambling or gambling for public benefit',
      'Integrate with Spelpaus (the national self-exclusion register) in real time',
      'Respect the deposit-limit and loss-limit rules set under the Gambling Act',
      'Comply with the Swedish AML Act (2017:630) and report suspicious activity to the Financial Police',
      'Follow the restrictive advertising rules — moderation, no targeting at minors or self-excluded players',
      'Submit ongoing reporting to Spelinspektionen including technical, financial and customer data',
    ],
    coverageAreas: [
      'Gambling Act amendments and secondary regulations',
      'Spelinspektionen guidance, decisions and sanction notices',
      'Changes to Spelpaus operating rules and technical integration specs',
      'Government inquiries (SOU) that may reshape the framework',
      'Advertising standards updates from the Consumer Agency (Konsumentverket)',
      'B2B licensing developments for platform and game suppliers',
    ],
    licences: [
      'Online commercial gambling licence (betting, casino, poker, bingo)',
      'State gambling licence (operated by Svenska Spel AB)',
      'Gambling-for-public-benefit licence (associations and lotteries)',
      'Land-based commercial gambling licence (restaurants, hotels)',
      'B2B software supplier licence (from 1 July 2023)',
    ],
    recentFocus:
      'The B2B licensing regime, crackdowns on unlicensed operators targeting Swedish players, refinements to the bonus rules, heightened AML scrutiny, and continued pressure on advertising standards — particularly social-media influencer promotion.',
    faqs: [
      {
        q: 'How does XHS™ Copilot help with Spelinspektionen compliance?',
        a: 'XHS™ Copilot tracks every Spelinspektionen publication — sanction decisions, guidance notes, technical specifications, Spelpaus updates and Consumer Agency advertising rulings — and delivers plain-English impact notes to your team. Lens™ AI cross-references changes against your existing Swedish operations.',
      },
      {
        q: 'What is the Swedish Gambling Act?',
        a: 'The Swedish Gambling Act (Spellagen 2018:1138) re-regulated the Swedish gambling market in 2019. It introduced a licensing system for private operators, mandatory Spelpaus self-exclusion, a general duty of care toward players, and comprehensive advertising restrictions.',
      },
      {
        q: 'What is Spelpaus?',
        a: 'Spelpaus is Sweden\'s national self-exclusion register operated by Spelinspektionen. Every licensed operator must check Spelpaus in real time before allowing a player to gamble and must stop all direct marketing to registered self-exclusions. Participation is mandatory for all licensees.',
      },
      {
        q: 'Do B2B suppliers need a Swedish gambling licence?',
        a: 'Yes. From 1 July 2023, suppliers of gambling software and platforms used by licensed Swedish operators must hold a B2B licence from Spelinspektionen. This covers RNG suppliers, game studios, platform providers and other material suppliers.',
      },
      {
        q: 'What are the deposit limits under Swedish gambling rules?',
        a: 'Online commercial gambling licensees must offer mandatory deposit, loss and session limits that players set themselves. Temporary rules introduced during the pandemic imposed an SEK 5,000 weekly deposit cap on casino products — these have since been lifted, but operators remain obligated to offer binding self-set limits.',
      },
    ],
    relatedSlugs: ['ukgc', 'mga', 'ksa', 'ggl'],
  },
  {
    slug: 'fca',
    abbr: 'FCA',
    name: 'Financial Conduct Authority',
    jurisdiction: 'United Kingdom',
    countryCode: 'GB',
    vertical: 'payments',
    established: 2013,
    officialUrl: 'https://www.fca.org.uk',
    summary:
      'The Financial Conduct Authority (FCA) is the conduct regulator for the UK\'s financial services industry, overseeing around 50,000 firms across banking, payments, investments, insurance and consumer credit, and registering cryptoasset businesses for AML purposes.',
    keyObligations: [
      'Hold FCA authorisation for any regulated activity under FSMA 2000 — or register for cryptoasset AML supervision',
      'Comply with the FCA Handbook, including PRIN (Principles for Businesses) and SYSC',
      'Meet the Consumer Duty standard — delivering good outcomes for retail customers across price, products, service and understanding',
      'Follow the Senior Managers and Certification Regime (SMCR) for individual accountability',
      'Run UK-compliant AML, sanctions and financial-crime controls under the MLR 2017',
      'Report regulatory returns, breaches and material events through the RegData portal',
    ],
    coverageAreas: [
      'FCA Handbook changes — policy statements, consultation papers, guidance',
      'Consumer Duty implementation expectations and thematic reviews',
      'Financial-promotion rules, including the cryptoasset promotions regime',
      'Dear CEO letters, enforcement notices and final notices',
      'Changes to the Senior Managers and Certification Regime',
      'Cross-cutting initiatives: AI transparency, ESG disclosures, operational resilience, sandbox outcomes',
    ],
    licences: [
      'Full FSMA authorisation (banking, insurance, investment, mortgages, consumer credit)',
      'Payment Institution (PI) and Small Payment Institution (SPI) under PSRs 2017',
      'Electronic Money Institution (EMI) and Small EMI under EMRs 2011',
      'Cryptoasset AML registration under MLR 2017',
      'Consumer credit licensing (FCA took over from OFT in 2014)',
    ],
    recentFocus:
      'Consumer Duty enforcement and supervision, the cryptoasset financial-promotions regime, AI governance expectations for regulated firms, operational resilience under the DORA-equivalent rules, and the permissions-gateway "tougher authorisations" programme.',
    faqs: [
      {
        q: 'How does XHS™ Copilot help with FCA compliance?',
        a: 'XHS™ Copilot ingests the FCA Handbook delta feed, all policy and consultation papers, Dear CEO letters, enforcement notices and speeches. Every material change is summarised by Lens™ AI with impact notes targeted at your firm\'s permissions and business model.',
      },
      {
        q: 'What is the FCA Consumer Duty?',
        a: 'The Consumer Duty is a higher standard of conduct that requires FCA-regulated firms to deliver good outcomes for retail customers. It covers price and value, product design, customer support, and understanding. It came into force on 31 July 2023 for new and existing products, and 31 July 2024 for closed books.',
      },
      {
        q: 'When was the FCA established?',
        a: 'The FCA was established on 1 April 2013, splitting off from the former Financial Services Authority (FSA) alongside the Prudential Regulation Authority. It assumed consumer-credit regulation from the Office of Fair Trading on 1 April 2014.',
      },
      {
        q: 'Does the FCA regulate crypto?',
        a: 'Partly. The FCA supervises cryptoasset firms for anti-money-laundering purposes under the MLR 2017 and regulates financial promotions of cryptoassets in or to the UK under the cryptoasset promotions regime. A broader FSMA-based regulatory regime for cryptoassets is in development.',
      },
      {
        q: 'What is the FCA Handbook?',
        a: 'The FCA Handbook is the rulebook that sets out how authorised firms must conduct their business. It is organised into 10 blocks (High Level Standards, Prudential, Business, Conduct, Redress, Specialist, Listing, Dispute Resolution, Regulatory Processes, Handbook Guides) and is updated continuously through policy statements.',
      },
    ],
    relatedSlugs: ['eba', 'ukgc', 'mas', 'finma'],
  },
  {
    slug: 'eba',
    abbr: 'EBA',
    name: 'European Banking Authority',
    jurisdiction: 'European Union',
    countryCode: 'EU',
    vertical: 'payments',
    established: 2011,
    officialUrl: 'https://www.eba.europa.eu',
    summary:
      'The European Banking Authority (EBA) is the EU regulator that writes binding technical standards and guidelines for banks, payment institutions, electronic-money institutions and cryptoasset service providers under MiCA. Its rulebook applies across all 27 EU member states.',
    keyObligations: [
      'Comply with EBA Regulatory Technical Standards (RTS) and Implementing Technical Standards (ITS) incorporated into national law',
      'Follow EBA Guidelines in line with the "comply or explain" framework adopted by your national competent authority',
      'Meet the PSD2 strong customer authentication (SCA), open banking and incident-reporting RTS',
      'Apply the EBA ICT and security risk management Guidelines (aligned with DORA)',
      'Follow MiCA Level 2 technical standards for CASP authorisation, market abuse and whitepaper approval',
      'Report capital, liquidity and large-exposure data via EBA\'s supervisory reporting framework',
    ],
    coverageAreas: [
      'EBA Regulatory and Implementing Technical Standards (RTS/ITS) at draft, final and adopted stages',
      'EBA Guidelines, Recommendations and Opinions',
      'MiCA Level 2 and Level 3 deliverables — CASP, asset-referenced tokens, e-money tokens',
      'DORA Level 2 deliverables jointly with ESMA and EIOPA',
      'Q&A tool answers on the Single Rulebook',
      'Stress-test methodologies and results',
    ],
    licences: [
      'The EBA does not itself issue licences; member-state competent authorities authorise firms under EBA standards',
      'Banks authorised under CRD/CRR',
      'Payment institutions under PSD2 (soon PSD3 + PSR)',
      'Electronic-money institutions under EMD2',
      'Crypto-asset service providers under MiCA (from 30 December 2024)',
    ],
    recentFocus:
      'MiCA Level 2 and Level 3 output, DORA technical standards on ICT risk management and third-party oversight, PSD3/PSR preparation, AI-enabled banking supervision, and the integrated reporting framework simplifying bank supervisory reporting.',
    faqs: [
      {
        q: 'How does XHS™ Copilot help with EBA compliance?',
        a: 'XHS™ Copilot tracks every EBA consultation, draft and final RTS/ITS, Guidelines, Opinions and Q&A. Lens™ AI maps each change to the underlying Level 1 framework (CRD/CRR, PSD2, EMD2, MiCA, DORA) so your team sees exactly which obligations are moving.',
      },
      {
        q: 'Does the EBA issue licences to banks?',
        a: 'No. Authorisation is the responsibility of the member-state competent authority (or the ECB for significant institutions). The EBA writes the binding technical standards and common guidelines that all such authorisations must follow, giving effect to the EU Single Rulebook.',
      },
      {
        q: 'What is the EBA\'s role under MiCA?',
        a: 'Under the Markets in Crypto-Assets Regulation, the EBA supervises issuers of significant asset-referenced tokens and e-money tokens, and develops the Level 2 and Level 3 standards for CASP authorisation, prudential requirements, own-funds and market-abuse frameworks.',
      },
      {
        q: 'Where is the EBA based?',
        a: 'The EBA is headquartered in Paris, France. It relocated from London in 2019 following Brexit. It is one of the three European Supervisory Authorities alongside ESMA and EIOPA.',
      },
      {
        q: 'What is the Single Rulebook?',
        a: 'The Single Rulebook is the body of harmonised prudential rules that applies across the EU financial sector. It consists of the Level 1 directives and regulations (CRD, CRR, PSD2, EMD2, MiCA, DORA), plus EBA-drafted Level 2 technical standards and Level 3 guidelines.',
      },
    ],
    relatedSlugs: ['fca', 'mas', 'finma'],
  },
  {
    slug: 'mas',
    abbr: 'MAS',
    name: 'Monetary Authority of Singapore',
    jurisdiction: 'Singapore',
    countryCode: 'SG',
    vertical: 'payments',
    established: 1971,
    officialUrl: 'https://www.mas.gov.sg',
    summary:
      'The Monetary Authority of Singapore (MAS) is Singapore\'s integrated central bank and financial-services regulator. It supervises banking, capital markets, insurance, payments and digital assets under a single framework and has become one of the world\'s most cited regulators for digital-finance innovation.',
    keyObligations: [
      'Hold the appropriate MAS licence — bank, capital-markets services licence, insurer, major payment institution, or Digital Payment Token (DPT) service provider',
      'Comply with the MAS Notices, Guidelines and Codes applying to your licence class',
      'Meet the Cyber Hygiene and Technology Risk Management (TRM) Guidelines',
      'Follow the MAS AML/CFT Notices and UNSC/MAS sanctions obligations',
      'Run customer-facing conduct standards under the Fair Dealing Guidelines and the FAIR Framework',
      'Report regulatory, financial and incident data via MAS submission portals',
    ],
    coverageAreas: [
      'MAS Notices, Guidelines, Codes, Directives and FAQs',
      'Consultation papers, response papers and policy statements',
      'Enforcement actions, prohibition orders and financial penalties',
      'Payment Services Act and Digital Payment Token licensing developments',
      'Project Guardian, Project Orchid and other tokenisation / CBDC work',
      'AI risk-governance outputs including the Veritas programme',
    ],
    licences: [
      'Bank licence (full bank, wholesale bank, merchant bank, digital full bank, digital wholesale bank)',
      'Capital Markets Services (CMS) licence for fund management, dealing, advisory, custody',
      'Insurance licence (direct insurer, reinsurer, captive insurer)',
      'Major Payment Institution (MPI) and Standard Payment Institution (SPI) under the Payment Services Act',
      'Digital Payment Token (DPT) service provider licence',
    ],
    recentFocus:
      'Stablecoin regulation (SCS framework), expanded DPT service-provider rules, Project Guardian tokenisation work, AI risk-management expectations, cross-border retail payment linkages, and operational-resilience standards aligned with global peers.',
    faqs: [
      {
        q: 'How does XHS™ Copilot help with MAS compliance?',
        a: 'XHS™ Copilot tracks every MAS Notice, Guideline, Code, consultation and enforcement action across banking, capital markets, insurance, payments and digital assets. Lens™ AI maps each change to your firm\'s licence class and business activities.',
      },
      {
        q: 'When was MAS established?',
        a: 'The Monetary Authority of Singapore was established on 1 January 1971 under the MAS Act. It absorbed the functions of the Currency Board in 2002 and today serves as both Singapore\'s central bank and its integrated financial-services regulator.',
      },
      {
        q: 'What is the Payment Services Act?',
        a: 'The Payment Services Act (PS Act), which came into force on 28 January 2020, provides a single licensing framework for payment services in Singapore. It covers account issuance, domestic money transfer, cross-border money transfer, merchant acquisition, e-money issuance, and digital payment token services.',
      },
      {
        q: 'Does MAS regulate crypto?',
        a: 'Yes. Digital Payment Token (DPT) service providers must be licensed under the Payment Services Act. Separately, MAS has introduced a framework for the regulation of single-currency stablecoins issued in Singapore (the SCS framework) and supervises custody and exchange services.',
      },
      {
        q: 'What is Project Guardian?',
        a: 'Project Guardian is MAS\'s industry initiative exploring asset tokenisation. It tests institutional use cases — tokenised deposits, wealth-management products and foreign-exchange — in permissioned liquidity pools involving licensed financial institutions from across the world.',
      },
    ],
    relatedSlugs: ['fca', 'eba', 'finma'],
  },
]

export function getRegulator(slug) {
  return regulators.find((r) => r.slug === slug) || null
}

export function listRegulators() {
  return regulators
}
