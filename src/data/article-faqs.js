/**
 * Article FAQs — slug-keyed map of question/answer pairs that get rendered
 * on `/insights/<slug>` pages and emitted as Schema.org FAQPage JSON-LD.
 *
 * Why this is a separate file (not on the article model in Supabase):
 *   The /api/articles route is backed by a Supabase `news_articles` table
 *   that doesn't currently carry an FAQ column, and we don't want to
 *   couple FAQ content to the article publisher edge function. Keeping
 *   FAQs as a static frontend lookup means:
 *     - Authoring is in version control (reviewable, diff-able)
 *     - No migration / data-pipeline coupling
 *     - SSR page.jsx and CSR ArticlePageClient.jsx can share one source
 *     - Adding FAQs to a new slug is a single PR
 *
 * Google's FAQPage policy requires the answers be visible on the page —
 * NOT just in JSON-LD. ArticlePageClient.jsx renders the FAQ section
 * accordingly. Removing the section without removing the schema would
 * trigger a manual penalty.
 *
 * Authoring guidelines:
 *   - 4-6 FAQs per article, 30-150 words per answer
 *   - Questions should match real search queries (use Google "People
 *     also ask" + Search Console for inspiration)
 *   - Answer with concrete facts, dates, jurisdictions — not marketing
 *   - First answer should be self-contained (it's the most likely
 *     AI Overview candidate)
 *   - Keep all claims grounded in the article body to avoid drift
 *
 * Slugs MUST match the published Supabase row exactly (the runtime lookup
 * uses `article.slug`). Verify with `GET /api/articles` if unsure.
 */

export const articleFaqs = {
  'eu-ai-act-compliance-dates-to-calendar-for-2026-2028': [
    {
      question: 'What is the next major EU AI Act compliance date?',
      answer: 'August 2 2026 is the step-change. From that date the Annex III high-risk regime starts to apply and the Article 50 transparency duties begin across the EU. Each Member State must also have designated its national competent authorities, adopted national penalty laws and established at least one AI regulatory sandbox under Article 57 by the same date.',
    },
    {
      question: 'What does the Digital Omnibus package change about the AI Act timetable?',
      answer: 'The Commission\u2019s Digital Omnibus proposal would link the start of the high-risk regime to the availability of harmonised standards and other compliance-support tools, while imposing a maximum cap on any slippage. It is framed as an implementation-feasibility change rather than a wholesale delay, but it could shift specific obligations later than the current August 2 2026 baseline.',
    },
    {
      question: 'Which AI systems fall under the high-risk regime?',
      answer: 'Two pathways: the Annex III list (which includes credit scoring, insurance pricing, recruitment, biometric identification and several other use cases) and the Annex I product-linked pathway covering safety-component AI in regulated products. Article 6 sets out the classification rules. Each high-risk system requires governance, documentation, logging, monitoring and lifecycle change-control under Chapter III.',
    },
    {
      question: 'What does Article 50 of the EU AI Act actually require?',
      answer: 'Article 50 imposes transparency duties on specific use cases and content types — for example, notifying individuals when they\u2019re interacting with an AI system, labelling deepfakes and AI-generated content, and disclosing emotion-recognition or biometric categorisation. From August 2 2026, providers and deployers must be able to deliver those notices and keep records of when users were informed and how labelling was applied.',
    },
    {
      question: 'How should regulated firms prepare ahead of August 2026?',
      answer: 'Treat \u201cdate readiness\u201d as a deliverable. Maintain an AI inventory mapped to the Article 6 classification rules, build a single compliance calendar against the August 2 2026 and August 2 2027 milestones, run an Article 50 implementation sprint covering disclosure wording and delivery channels, design a control set for high-risk systems aligned to Chapter III, and align internal escalation routes to each Member State\u2019s competent authority under Article 70.',
    },
  ],

  'finland-s-gambling-act-introduces-licensing-for-betting-and-online-casino-games': [
    {
      question: 'When can operators apply for a Finnish gambling licence?',
      answer: 'The National Police Board opens licence applications on March 1 2026. The licensed competitive market is scheduled to start operating from July 1 2027. Until end-June 2027 Veikkaus remains the only lawful provider and marketer of gambling services in mainland Finland during the transition period.',
    },
    {
      question: 'Which gambling products fall under the new Finnish licensing regime?',
      answer: 'Licensing covers betting games, online slot and casino games, and online money bingo. Veikkaus retains its monopoly for lotteries, scratch cards, and physical slot machines and casino games. The reform is explicitly hybrid \u2014 competition for some products, monopoly retained for others.',
    },
    {
      question: 'Who supervises gambling in Finland under the new regime?',
      answer: 'During the transition period (until June 30 2027), supervision continues under the existing arrangements. From July 1 2027, licensing and supervision duties are expected to sit with a new Finnish Supervisory Authority. The Ministry of the Interior led the legislative reform; Parliament adopted the Gambling Act on December 16 2025 and the President approved it on January 16 2026.',
    },
    {
      question: 'What marketing rules apply to licensed Finnish operators?',
      answer: 'Marketing is permitted but only within statutory restrictions. The Act prohibits certain tools and methods, requires specific marketing information be provided, regulates sponsorship arrangements and bans direct marketing. Operators should plan policy, approvals, monitoring and recordkeeping around these constraints, with extra rigour on sponsorship and affiliate channels.',
    },
    {
      question: 'What should cross-border operators do during the transition period?',
      answer: 'Veikkaus is the only lawful provider and marketer in mainland Finland until end-June 2027. Operators planning to enter under the licensed regime should focus on application readiness for the March 1 2026 window \u2014 governance, fit-and-proper documentation, AML controls, marketing governance \u2014 while ensuring no operational or promotional activity targets Finnish customers during the transition without lawful basis.',
    },
  ],

  'uk-gambling-commission-enacts-promotion-and-wagering-rule-changes': [
    {
      question: 'When did the new UK gambling promotion and wagering rules come into force?',
      answer: 'The amended LCCP Social Responsibility Code 5.1.1 came into force on January 19 2026 (the implementation date was moved from the original December 19 2025). UK licensees must run all live and scheduled promotions against the new requirements from that date forward.',
    },
    {
      question: 'What is the 10x wagering cap and what does it apply to?',
      answer: 'Where an incentive uses play-through mechanics, the total wagering requirement must not exceed 10 times the bonus amount before funds become withdrawable. This applies regardless of game-contribution weightings, so bonus engines need automated rule checks to catch edge cases where weighted contributions push effective wagering above 10x.',
    },
    {
      question: 'What does the ban on mixed-product incentives mean for UK operators?',
      answer: 'A single incentive can no longer span more than one product type \u2014 betting, casino, bingo and lottery cannot be combined in one offer. Multiple products within the same type are still allowed (for example, different lottery formats together), but cross-type bundles like \u201cfree bet plus free spins\u201d are out. Marketing and CRM teams need to retire any creative or template that mixes product types.',
    },
    {
      question: 'Are early-completion bonus uplifts still allowed?',
      answer: 'No. The value or amount of an incentive must not be altered or increased because qualifying activity is reached within a shorter time than the whole offer period. Mechanics like \u201chit your wagering target in 3 days, get an extra \u00a350\u201d are now non-compliant. Reward design should treat the full offer period as the only valid evaluation window.',
    },
    {
      question: 'What controls do high-value or VIP incentives need?',
      answer: 'Incentives designated \u201chigh value\u201d, \u201cVIP\u201d or equivalent must be offered in a way consistent with the licensing objectives and the Commission\u2019s VIP customer guidance. Operators should evidence affordability checks, source-of-funds verification and player-protection assessments before granting such incentives, and document the decision trail.',
    },
    {
      question: 'How are travel and accommodation incentives affected?',
      answer: 'Where incentives include free or subsidised travel or accommodation to encourage attendance at a premises, they must not be offered on terms that directly relate to the level of a customer\u2019s prospective gambling. Tying a hotel comp to expected wagering volume is no longer compliant.',
    },
  ],
};

/** Convenience helper: returns the FAQ array for a slug, or null if none. */
export function getArticleFaqs(slug) {
  if (!slug) return null;
  const faqs = articleFaqs[slug];
  return Array.isArray(faqs) && faqs.length > 0 ? faqs : null;
}
