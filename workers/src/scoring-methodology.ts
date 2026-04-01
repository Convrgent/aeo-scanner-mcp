export const SCORING_METHODOLOGY = `# AEO Scanner — Scoring Methodology

Two independent scores, one scan.

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

### How checks are scored

Each check has a severity (critical = 3x weight, warning = 2x, info = 1x). Category score = weighted sum of passed checks / total possible weight. Overall AEO score = weighted average of category scores.

---

## Agent Readiness Score (0-100)

Measures how easily AI agents can understand, interact with, and transact on your site.

### Categories

**Machine Identity (25% of score)**
llms.txt depth, site description clarity (action verb + noun + audience in first 100 words), consistent machine-readable name across Organization schema, og:site_name, and page title.

**API Discoverability (25% of score)**
OpenAPI/Swagger specification at standard paths, developer documentation with technical signals, and visible API endpoints in content.

**Structured Actions (20% of score)**
Machine-readable pricing (Product/Service schema with offers), action affordances (forms, sign-up links, CTAs, Action schema), and machine-readable contact info.

**Programmatic Access (20% of score)**
Payment protocols (x402, Stripe, crypto/USDC detection), authentication documentation, and webhook/event support.

**Data Clarity (10% of score)**
Reserved for future checks.

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

Built by Convrgent (convrgent.ai) — personality intelligence and AI visibility tools for agents.
`;
