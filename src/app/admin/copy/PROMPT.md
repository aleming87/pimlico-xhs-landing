# 📝 Copy Page — LLM Prompt Guide

## What This Feature Does
The Copy page generates **platform-specific social media and email copy** for published articles. It creates variations optimised for LinkedIn, Twitter/X, Instagram, Email, and Newsletter formats. Copy is generated per article and saved for the publishing stage.

Pipeline position: Ideas → Drafting → Collateral → **Copy** → Publishing

## What I Need From You (User Input)
When I select an article and a platform, generate copy in the appropriate format. I may also ask for variations using different templates.

### Platforms & Constraints

| Platform | Max Chars | Tone | Hashtags |
|---|---|---|---|
| **LinkedIn** | 3,000 | Professional, authoritative | 3-4 |
| **Twitter/X** | 280 | Concise, punchy | 2-3 |
| **Instagram** | 2,200 | Engaging, visual | 8-10 |
| **Email** | No limit | Informative, direct | 0 |
| **Newsletter** | No limit | Insightful, authoritative | 0 |

### Copy Templates Available

1. **📢 Announcement** — Straightforward news-style post about the article
2. **💡 Thought Leadership** — Positions Pimlico as an expert, adds commentary
3. **❓ Question Hook** — Opens with a question to drive engagement
4. **📊 Data Point** — Leads with a statistic or data-driven insight
5. **📖 Story Hook** — Narrative-style opening that draws readers in

## Output Format
Generate copy that I can paste directly. Include the platform, template used, and character count:

### For LinkedIn
```
PLATFORM: LinkedIn
TEMPLATE: Thought Leadership
CHARS: 847

The EU AI Act's prohibited practices provisions have been live for a year — and enforcement is finally arriving.

In our latest analysis, we break down what the first enforcement actions mean for firms operating across the EU:

🔹 Which practices are most likely to trigger action
🔹 How national supervisory authorities are coordinating
🔹 Practical compliance steps for cross-border operations

The firms that engage proactively now will have a significant advantage as high-risk system requirements land in August 2026.

Read the full analysis: pimlicosolutions.com/insights/eu-ai-act-enforcement-q1-2026

#AIAct #AIRegulation #RegulatoryCompliance #Pimlico
```

### For Twitter/X
```
PLATFORM: Twitter/X
TEMPLATE: Question Hook
CHARS: 248

Is your AI system ready for the EU's first enforcement actions?

The AI Act's prohibited practices rules are now being actively enforced. Our latest analysis covers what to expect 👇

pimlicosolutions.com/insights/eu-ai-act-enforcement-q1-2026

#AIAct #EURegulation
```

### For Email
```
PLATFORM: Email
TEMPLATE: Announcement
SUBJECT: EU AI Act — First Enforcement Actions: What You Need to Know

BODY:
Dear [Name],

The EU AI Office is preparing to issue its first enforcement actions under the AI Act's prohibited practices provisions. This marks a significant milestone in the regulation of artificial intelligence across Europe.

In our latest analysis, we examine:

• Which practices are most likely to trigger enforcement action
• The role of national supervisory authorities in cross-border coordination
• Practical compliance steps your organisation should take now

The high-risk AI system requirements become applicable in August 2026, making early engagement with the enforcement framework essential.

Read the full analysis →
pimlicosolutions.com/insights/eu-ai-act-enforcement-q1-2026

Best regards,
Pimlico XHS™ Team
```

## Generating Variations
When I ask for variations, generate 2-3 alternative versions of the same post using different hooks:

```
--- VARIATION 1 (Announcement) ---
[Copy text]

--- VARIATION 2 (Question Hook) ---
[Copy text]

--- VARIATION 3 (Data Point) ---
[Copy text]
```

## Custom Templates
I can save any generated copy as a custom template for reuse. When saving, the system captures:
- Template name
- The copy text with `{ARTICLE_SLUG}` placeholder for article-specific URLs
- Platform association
- Created date

When I ask you to create a reusable template, use this placeholder format:
```
Our latest insight on {CATEGORY}: "{TITLE}"

{EXCERPT}

🔗 pimlicosolutions.com/insights/{SLUG}

{HASHTAGS}
```

## Copy Best Practices for Pimlico XHS

### LinkedIn
- Open with a bold statement or insight (not "We're excited to share...")
- Use line breaks for readability
- Bullet points with emoji markers (🔹, ✅, 📌)
- End with a link and 3-4 relevant hashtags
- Professional but not stiff — authoritative yet accessible

### Twitter/X
- Lead with the hook — question, statistic, or bold claim
- Keep under 250 chars to leave room for engagement
- One link, 2-3 hashtags
- Use thread format for complex topics (mark as "1/3", "2/3" etc.)

### Instagram
- More conversational, emoji-rich
- Open with a hook in the first line (only first line shows before "...more")
- Heavy hashtag usage (8-10) at the end
- Include a CTA: "Link in bio" or "Save this post"

### Email
- Clear subject line with the key topic
- Bullet points for key takeaways
- Professional formatting
- Clear CTA button text

### Newsletter
- Context-rich, assumes an informed audience
- Can be longer and more analytical
- Include cross-references to previous articles
- Forward-looking outlook at the end

## Workflow Integration
- Select an article from the dropdown (shows all published + drafted articles)
- Choose a platform tab
- Apply a template or write custom copy
- Save — copy is persisted to localStorage and available in the Publishing stage
- Image preview shows the article's cover image for reference
- Copy history tracks all generated variations
