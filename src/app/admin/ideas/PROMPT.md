# 💡 Ideas Page — LLM Prompt Guide

## What This Feature Does
The Ideas page is the **entry point** of the Pimlico XHS content pipeline. It captures regulatory intelligence ideas — topics, angles, enforcement actions, market trends — that will be developed into full articles.

Ideas flow: **Ideas → Drafting → Collateral → Copy → Publishing**

## What I Need From You (User Input)
When I give you a topic, regulation, enforcement action, or market trend, generate an idea entry with these fields:

1. **Title** — A clear, specific headline (max 120 chars). Include the regulation name, jurisdiction, and angle.
2. **Description** — 2-4 sentences explaining the angle, why it matters, key points to cover, and any sources.
3. **Priority** — One of: `high` | `medium` | `low`
   - **High**: Breaking enforcement actions, new legislation entering force, urgent consultations closing soon
   - **Medium**: Ongoing regulatory developments, market trends, implementation updates
   - **Low**: Background research, opinion pieces, evergreen content
4. **Tags** — Select from these categories:
   - `AI Regulation`, `Payments`, `Gambling`, `Crypto`, `Cross-sector`
   - `Enforcement Action`, `New Legislation`, `Consultation`, `Market Trend`, `Opinion Piece`
5. **Notes** — Source links, references, related articles, or additional context.

## Output Format
Return your response as a structured block I can paste or use:

```
TITLE: [Specific headline about the regulatory topic]
PRIORITY: [high/medium/low]
TAGS: [comma-separated from the list above]
DESCRIPTION:
[2-4 sentence summary of the angle, significance, and key points]
NOTES:
[Source URLs, related regulations, cross-references]
```

## Example Output

```
TITLE: EU AI Act — First Enforcement Actions Expected Q1 2026 Under Prohibited Practices Rules
PRIORITY: high
TAGS: AI Regulation, Enforcement Action, New Legislation
DESCRIPTION:
The EU AI Act's prohibited practices provisions took effect on 2 Feb 2025, and regulators are now expected to issue first enforcement actions in Q1 2026. This article should analyse which practices are most likely to trigger action, the role of national supervisory authorities, and practical compliance steps for firms operating across multiple member states.
NOTES:
- Source: EU AI Office press release (Jan 2026)
- Cross-ref: Our previous article on AI Act implementation timeline
- Related: DORA enforcement parallels in financial services
```

## For Bulk Generation (Markdown Upload)
If generating multiple ideas at once, format as a markdown file:

```markdown
# EU AI Act First Enforcement Actions Q1 2026
The prohibited practices provisions are now live...
#AIRegulation #EnforcementAction

---

# MiCA Stablecoin Reserve Requirements — Compliance Gap Analysis
Latest data shows 40% of stablecoin issuers...
#Crypto #NewLegislation

---

# UK Gambling Commission Affordability Checks — Industry Response
The UKGC's new affordability framework...
#Gambling #Consultation
```

Each `# Heading` becomes a separate idea. `#hashtags` are auto-detected as tags. `---` separators divide ideas.

## Workflow Integration
- Ideas can be **Accepted** or **Rejected** via buttons on each card
- Only **Accepted** ideas show the "Move to Drafting →" button
- Moving to drafting transports the title, description, tags, and detected category
- The priority dropdown can be changed inline at any time
