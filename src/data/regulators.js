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
    relatedSlugs: ['mga', 'sga', 'ksa', 'ggl'],
  },
]

export function getRegulator(slug) {
  return regulators.find((r) => r.slug === slug) || null
}

export function listRegulators() {
  return regulators
}
