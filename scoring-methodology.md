# AEO Scanner — Scoring Methodology

Three independent scores, one scan. Plus AI Identity Card with mention readiness, and business profile detection.

## AEO Score (0-100)

Measures how well AI search engines (ChatGPT, Perplexity, Google AI Overviews) can find, read, and cite your content.

### Categories

**Structured Data (30% of score)**
JSON-LD schema markup — Organization, WebSite, BreadcrumbList, FAQ, Article, Product schemas. LocalBusiness is treated as an Organization subtype. Validates JSON-LD blocks are valid and contain required fields.

**Meta & Technical (20% of score)**
Canonical URLs, meta descriptions (50-160 chars), Open Graph tags, heading hierarchy (single H1, no gaps), language attribute, Twitter cards, robots.txt (must allow AI crawlers: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, OAI-SearchBot), and sitemap.xml with lastmod dates.

**AI Accessibility (25% of score)**
llms.txt (structured machine-readable site summary), llms-full.txt, definition blocks in first 500 words, content structure (subheadings, lists, scannable paragraphs), and Q&A content format.

**Content Quality (25% of score)**
Data density (3+ statistics per 500 words), expert attribution (author meta, Person schema, credentials), content freshness signals (published/modified dates), content depth, and unique value indicators (original research, case studies, proprietary data). Note: content length has near-zero correlation with AI citations (53% of cited pages are under 1,000 words, WhyShy 2025). Only pages under 50 words get critical severity.

---

## GEO Score (0-100)

Measures how likely AI is to cite your site as a source — your citation readiness for AI-generated answers.

### Categories

**Brand Narrative Clarity (25% of score)**
Clear, consistent brand story that AI can extract and summarize. Mission statements, value propositions, and unique differentiators in machine-parseable formats.

**Citation Readiness (25% of score)**
8 checks measuring content formatted for AI citation:
- Quotable Brand Claims — attributable statements AI can cite
- Comparison Content — "vs" and "alternative to" patterns
- Statistic Attribution — sourced data points
- List Format Answers — structured, scannable answers
- Citable Passage Blocks — 134-167 word self-contained passages (optimal length per Princeton KDD 2024)
- **Factual Sentence Density** — % of sentences with concrete facts (numbers, dates, definitions). Definitional phrasing gets 36.2% citation rate vs 20.2% vague (Victorino Group)
- **Answer Frontloading** — % of factual sentences in first 30% of content. 44.2% of AI citations come from first 30% of page (Growth Memo, 1.2M ChatGPT responses)
- **Inline Source Citations** — citations per 1,000 words to external authoritative sources. "Cite Sources" is #1 GEO strategy at +115% visibility (Princeton KDD 2024)

**Authority Signals (25% of score)**
Author credentials, publication history, industry recognition, backlink quality indicators, and E-E-A-T markers.

**Entity Definition (25% of score)**
How well the site defines itself as a distinct entity — consistent naming, entity relationships, knowledge graph signals, and Wikipedia-style definitional content.

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

## AI Identity Card

Shows how AI currently perceives the brand:

- **brandName** — the name AI associates with the site
- **summary** — how AI would describe the business in one sentence
- **category** — the industry/niche AI places the site in
- **confidence** — how confident the detection is
- **citableClaims** — specific claims AI could cite from the site
- **verifiedPresence** — where AI can verify the brand exists (schema, social, directories)
- **gaps** — what AI doesn't know about the brand
- **mentionReadiness** (0-100) — predicts how likely AI engines are to mention the brand, based on 12 research-backed signals
- **mentionSignals** — array of signals with present/absent status, points, and research source
- **detectedCompetitors** — competitor names extracted from "vs" and "alternative to" patterns

### Mention Readiness Research Basis
Sites on 4+ platforms are 2.8x more likely to appear in ChatGPT (Digital Bloom 2025). However, only 9.2% of URLs are consistent across AI search results (SparkToro), which is why mention readiness uses structural signals rather than live checks.

---

## Business Profiles

| Profile | Primary Scores | Secondary Score | Examples |
|---------|---------------|-----------------|----------|
| commerce | AEO + GEO | Agent Readiness | E-commerce, retail, physical products |
| saas | AEO + Agent Readiness | GEO | Software platforms, developer tools, APIs |
| media | AEO + GEO | Agent Readiness | Publishers, blogs, news, content sites |
| general | All three equal | — | Mixed or undetected business type |

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

## Research Sources

- Princeton GEO paper (KDD 2024): 9 optimization strategies, "Cite Sources" = +115% visibility
- Growth Memo (1.2M ChatGPT responses): 44.2% citations from first 30%, top 30 domains = 67% per topic
- Victorino Group: 20.6% entity density, 36.2% definitional citation rate
- Cornell University: +28% visibility from quantitative claims
- Penfriend 2025: formatted content 28-40% more likely cited
- WhyShy 2025: content length has near-zero correlation with citations
- SparkToro: 9.2% URL consistency in AI search
- Digital Bloom 2025: sites on 4+ platforms are 2.8x more likely in ChatGPT

---

Built by [Convrgent](https://convrgent.ai) — AI visibility tools for agents.
