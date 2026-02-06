# ✏️ Drafting Page — LLM Prompt Guide

## What This Feature Does
The Drafting page is where ideas become **full articles**. It has a complete article editor with metadata fields, taxonomy tagging, markdown/visual editing, and a live preview. Articles are published to the Pimlico XHS insights section.

Pipeline position: Ideas → **Drafting** → Collateral → Copy → Publishing

## What I Need From You (User Input)
When I give you a topic (or an idea from the Ideas pipeline), generate a complete article with all metadata fields filled:

### Required Fields

1. **Title** — Clear, SEO-friendly article headline (50-80 chars ideal)
2. **Slug** — URL-safe version: `eu-ai-act-enforcement-q1-2026`
3. **Excerpt** — 1-2 sentence summary for cards and social sharing (max 280 chars)
4. **Category** — One of: `AI Regulation` | `Payments` | `Crypto` | `Gambling`
5. **Tags** — From the Pimlico taxonomy (see below)
6. **Content** — Full article body in **Markdown** format
7. **Read Time** — Calculate from word count (÷200 wpm, round up)

### Pimlico Taxonomy Tags (Select Relevant)

**Vertical**: Gambling, Payments, Crypto, AI
**Topic**: Online Licensing, Land Licensing, Age Verification, Affordability, Self Exclusion, Slot Design, Ad Content, Financial Promotions, Open Banking, VASP Licensing, Stablecoins, AI Frameworks, AI Risk Tiers, AI Governance Controls, GenAI Labelling, Enforcement Actions, MiCA Implementation, PSD2 Implementation, DORA Implementation
**Jurisdiction**: European Union, United Kingdom, United States, Germany, France, Italy, Spain, Malta, Gibraltar, Isle of Man, Netherlands, Sweden, Australia, Singapore, Hong Kong, United Arab Emirates
**Type**: Primary Law, Secondary Law, Guideline, Consultation, Enforcement Decision, Press Release
**Stage**: Proposal, Consultation Open, Adoption, Entry Into Force, Application, Review

## Output Format — Markdown File
Generate a `.md` file that can be directly uploaded via the "Import .md → Auto-fill" button. The system will auto-detect all fields:

```markdown
# EU AI Act — First Enforcement Actions Signal New Era of AI Accountability

The European Union's AI Office is poised to issue its first enforcement actions under the AI Act's prohibited practices provisions, marking a pivotal moment in global AI regulation.

## Background

The EU AI Act entered into force on 1 August 2024, with its prohibited practices provisions becoming applicable on 2 February 2025. These provisions ban AI systems that deploy subliminal manipulation, exploit vulnerabilities of specific groups, enable social scoring by public authorities, and use real-time remote biometric identification in public spaces (with narrow exceptions).

## Key Developments

### Enforcement Readiness

The AI Office, established within the European Commission, has been building its enforcement capabilities throughout 2025:

- **Staffing**: Over 140 specialists recruited across technical, legal, and policy domains
- **Complaints**: An estimated 200+ formal complaints received since February 2025
- **Coordination**: Bilateral agreements signed with 22 national supervisory authorities

### Expected First Actions

Industry sources indicate enforcement actions are most likely in three areas:

- **Emotion recognition in workplace settings** — Several complaints target AI systems used in hiring and employee monitoring
- **Social scoring by private entities** — The boundary between legitimate credit scoring and prohibited social scoring remains contested
- **Subliminal manipulation in consumer apps** — Dark pattern enforcement overlapping with existing consumer protection

## Implications for Firms

Organisations operating in the EU should take immediate steps:

1. **Audit existing AI systems** against the prohibited practices list
2. **Document risk assessments** for high-risk AI applications
3. **Establish incident reporting** channels aligned with AI Office requirements
4. **Monitor national implementation** — enforcement approaches will vary across member states

## What Comes Next

The high-risk AI system requirements become applicable in August 2026, significantly expanding the compliance burden. Firms that engage proactively with the enforcement framework now will be better positioned for the next wave of obligations.

---

*This analysis is provided by Pimlico XHS™ for informational purposes. It does not constitute legal advice.*
```

## How Auto-Detection Works
When you upload this `.md` file, the system automatically:
- **Title**: Extracted from the first `# Heading`
- **Slug**: Generated from title (`eu-ai-act-first-enforcement-actions-signal-new-era-of-ai-accountability`)
- **Excerpt**: First body paragraph (before the next heading)
- **Category**: Keyword-scored — "AI" keywords → `AI Regulation`, "payment/PSD2" → `Payments`, etc.
- **Tags**: Matched against the full taxonomy from content (e.g. mentions "European Union" → adds that tag)
- **Read Time**: Word count ÷ 200, rounded up
- **Content**: Everything after the title

## Article Structure Best Practices
For Pimlico XHS articles, follow this structure:

1. **Opening paragraph** — The hook. State the key development and why it matters. (This becomes the excerpt)
2. **Background** — Context for readers who aren't deeply familiar
3. **Key Developments** — The meat. Use `###` subheadings for distinct points
4. **Implications for Firms** — Practical, actionable takeaways. Use numbered lists.
5. **What Comes Next** — Forward-looking outlook
6. **Disclaimer** — Standard Pimlico disclaimer

## Workflow Integration
- Ideas moved to drafting appear in a blue inbox at the top of the page
- Click "Use as draft →" to populate title, slug, excerpt, category, and tags from the idea
- After publishing, the article appears in the Articles library
- Save as draft to come back later, or publish immediately
