# AEO Scanner — Scoring Methodology

Two independent scores, one scan.

## AEO Score (0-100)

Measures how well AI search engines (ChatGPT, Perplexity, Google AI Overviews) can find, read, and cite your content.

### Categories

**Structured Data (30% of score)**
JSON-LD schema markup — Organization, WebSite, BreadcrumbList, FAQ, Article, Product schemas. Validates JSON-LD blocks are valid and contain required fields (name, url, logo, description, sameAs for Organization; headline, author, datePublished for Articles).

**Meta & Technical (20% of score)**
Canonical URLs, meta descriptions (50-160 chars), Open Graph tags, heading hierarchy (single H1, no gaps), language attribute, Twitter cards, robots.txt (must allow AI crawlers: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, OAI-SearchBot), and sitemap.xml with lastmod dates.

**AI Accessibility (25% of score)**
llms.txt (structured machine-readable site summary with sections, links, API info), llms-full.txt, definition blocks in first 500 words ("X is a Y" patterns), content structure (subheadings, lists, scannable paragraphs), and Q&A content format.

**Content Quality (25% of score)**
Data density (3+ statistics per 500 words), expert attribution (author meta, Person schema, credentials), content freshness signals (published/modified dates), content depth (300+ words minimum, 800+ for bonus), and unique value indicators (original research, case studies, proprietary data).

### How checks are scored

Each check has a severity (critical = 3x weight, warning = 2x, info = 1x). Category score = weighted sum of passed checks / total possible weight. Overall AEO score = weighted average of category scores.

---

## Agent Readiness Score (0-100)

Measures how easily AI agents can understand, interact with, and transact on your site.

### Categories

**Machine Identity (25% of score)**
llms.txt depth (scored on API info, pricing, auth details), site description clarity (action verb + noun + audience in first 100 words), consistent machine-readable name across Organization schema, og:site_name, and page title.

**API Discoverability (25% of score)**
OpenAPI/Swagger specification at standard paths, developer documentation with technical signals (API key, SDK, curl, REST, GraphQL, webhook references), and visible API endpoints in content.

**Structured Actions (20% of score)**
Machine-readable pricing (Product/Service schema with offers), action affordances (forms, sign-up links, CTAs, Action schema), and machine-readable contact info (contactPoint in Organization schema).

**Programmatic Access (20% of score)**
Payment protocols (x402, Stripe, crypto/USDC detection), authentication documentation, and webhook/event support (callback URLs, event-driven patterns).

**Data Clarity (10% of score)**
Reserved for future checks.

### How checks are scored

Agent checks use the actual score (0-100) of each check, weighted by severity. Category score = weighted average of check scores. Overall Agent Readiness = weighted average of category scores.

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

## What raises your AEO Score

- Complete JSON-LD schema (Organization + WebSite on homepage)
- robots.txt allowing AI crawlers
- /llms.txt with structured content
- Definition blocks in opening paragraphs
- 300+ words with data density
- Author attribution and freshness signals

## What raises your Agent Readiness Score

- Deep llms.txt with API docs, pricing, auth info
- OpenAPI spec or developer documentation
- Clear site description (what + who + for whom)
- Pricing in schema (Product with offers)
- Action affordances (forms, buttons, CTAs)
- Contact info in Organization schema
- Payment protocol support (x402, Stripe, crypto)
- Authentication docs and webhook support

---

## Multi-page scanning

When scanning multiple pages, site-wide checks (robots.txt, sitemap, llms.txt) are counted once. Per-page checks are aggregated across all scanned pages. Top issues are sorted by severity (critical first).

---

Built by [Convrgent](https://convrgent.ai) — tools for AI agents.
