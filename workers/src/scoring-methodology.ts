export const SCORING_METHODOLOGY = `# AEO Scanner — Scoring Methodology

Three independent scores, one scan. Plus AI Identity Card and business profile detection.

## AEO Score (0-100)

Measures how well AI search engines (ChatGPT, Perplexity, Google AI Overviews) can find, read, and cite your content.

### Categories

**Structured Data (30% of score)**
JSON-LD schema markup — Organization, WebSite, BreadcrumbList, FAQ, Article, Product schemas. Validates JSON-LD blocks are valid and contain required fields.

**Meta & Technical (20% of score)**
Canonical URLs, meta descriptions (50-160 chars), Open Graph tags, heading hierarchy (single H1, no gaps), language attribute, Twitter cards, robots.txt (must allow AI crawlers: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, OAI-SearchBot), and sitemap.xml with lastmod dates.

**AI Accessibility (25% of score)**
llms.txt (structured machine-readable site summary), llms-full.txt, definition blocks in first 500 words, content structure (subheadings, lists, scannable paragraphs), and Q&A content format.

**Content Quality (25% of score)**
Data density (3+ statistics per 500 words), expert attribution (author meta, Person schema, credentials), content freshness signals (published/modified dates), content depth (300+ words minimum), and unique value indicators (original research, case studies, proprietary data).

---

## GEO Score (0-100)

Measures how likely AI is to cite your site as a source — your citation readiness for AI-generated answers.

### Categories

**Brand Narrative Clarity (25% of score)**
Clear, consistent brand story that AI can extract and summarize. Includes mission statements, value propositions, and unique differentiators in machine-parseable formats.

**Citation Readiness (25% of score)**
Content formatted for AI citation — attributed statistics, quotable claims with sources, structured data points, and expert quotes that AI models can extract and reference.

**Authority Signals (25% of score)**
Signals that establish the site as a trustworthy source — author credentials, publication history, industry recognition, backlink quality indicators, and E-E-A-T markers.

**Entity Definition (25% of score)**
How well the site defines itself as a distinct entity that AI can recognize — consistent naming, entity relationships, knowledge graph signals, and Wikipedia-style definitional content.

---

## Agent Readiness Score (0-100)

Measures how easily AI agents can understand, interact with, and transact on your site.

### Categories

**Machine Identity (30% of score)**
llms.txt depth, site description clarity (action verb + noun + audience in first 100 words), consistent machine-readable name across Organization schema, og:site_name, and page title.

**API Discoverability (25% of score)**
OpenAPI/Swagger specification at standard paths, developer documentation with technical signals, and visible API endpoints in content.

**Structured Actions (25% of score)**
Machine-readable pricing (Product/Service schema with offers), action affordances (forms, sign-up links, CTAs, Action schema), and machine-readable contact info.

**Programmatic Access (20% of score)**
Payment protocols (x402, Stripe, crypto/USDC detection), authentication documentation, and webhook/event support.

---

## Business Profiles

The scanner detects the site's business type and returns which scores matter most:

| Profile | Primary Scores | Secondary Score | Examples |
|---------|---------------|-----------------|----------|
| commerce | AEO + GEO | Agent Readiness | E-commerce, retail, physical products |
| saas | AEO + Agent Readiness | GEO | Software platforms, developer tools, APIs |
| media | AEO + GEO | Agent Readiness | Publishers, blogs, news, content sites |
| general | All three equal | — | Mixed or undetected business type |

## AI Identity Card

Shows how AI currently perceives the brand:
- **brandName** — the name AI associates with the site
- **summary** — how AI would describe the business in one sentence
- **category** — the industry/niche AI places the site in
- **citableClaims** — specific claims AI could cite from the site
- **verifiedPresence** — where AI can verify the brand exists (schema, social, directories)
- **gaps** — what AI doesn't know about the brand (the most actionable insight)

---

## Letter Grades

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 90-100 | Excellent — optimized for AI visibility |
| B | 75-89 | Good — strong fundamentals, minor gaps |
| C | 60-74 | Fair — basics met, significant room for improvement |
| D | 40-59 | Poor — major gaps in AI optimization |
| F | 0-39 | Failing — critical elements missing |

---

## Score Projections

The fix tool returns two projection tiers:
- **Quick wins** — projected scores after applying only critical + high priority fixes
- **Full implementation ceiling** — projected scores after applying all fixes

---

Built by Convrgent (convrgent.ai) — AI visibility tools for agents.
`;
