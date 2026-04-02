# AEO Scanner — MCP Server

AI search visibility audit for any website. Three scores, one scan.

## What it does

- **AEO Score (0-100):** How well AI search engines (ChatGPT, Perplexity, Google AI Overviews) can find, read, and cite your content
- **GEO Score (0-100):** How likely AI is to cite your site as a source — citation readiness for AI-generated answers
- **Agent Readiness (0-100):** How easily AI agents can understand, interact with, and transact on your site
- **AI Identity Card:** How AI currently perceives your brand — and the gaps between reality and AI's perception
- **Business Profile:** Auto-detected business type (commerce/saas/media/general) with which scores matter most

## Quick start

**Remote server (recommended)** — zero install, just add the URL:

```bash
# Claude Code
claude mcp add --transport http aeo-scanner https://aeo-mcp.convrgent.ai/mcp

# Claude Desktop / Claude.ai
# Settings → Connectors → Add custom connector → https://aeo-mcp.convrgent.ai/mcp

# Cursor — add to .cursor/mcp.json
{ "aeo-scanner": { "url": "https://aeo-mcp.convrgent.ai/mcp" } }
```

Then ask your AI assistant: *"Scan example.com for AI visibility"*

**Alternative: local install** via PyPI (stdio transport):

```bash
claude mcp add aeo-scanner -- uvx aeo-scanner
```

## Tools

| Tool | What it does | Price |
|------|-------------|-------|
| `scan_site` | Quick triple-score scan + AI Identity Card + business profile + top issues | **Free** |
| `audit_site` | Full 55+ check breakdown across 12 categories (4 AEO + 4 GEO + 4 Agent) | $1.00 |
| `fix_site` | Generated fix code with two-tier score projections — apply directly with Claude Code | $5.00 |

## Free tier

`scan_site` works without any authentication. No API key, no wallet, no setup.

Rate limits: 20 scans/hour per IP, 5 per URL per day.

## Paid tools

`audit_site` and `fix_site` require an API key:

1. Get your key at [scan.convrgent.ai](https://scan.convrgent.ai)
2. Set `AEO_API_KEY` in your MCP config

Or pay per call with USDC via [x402 protocol](https://www.x402.org/) (Base network).

## Workflow

The included `optimize_site` prompt guides the full workflow:

1. **Scan** — get baseline scores + business profile + AI Identity Card (free)
2. **Audit** — see detailed breakdown by category, prioritized by business type ($1)
3. **Fix** — get working code with quick-win and full-ceiling projections ($5)
4. **Rescan** — verify improvement across all three scores (free)

## Scoring

55+ checks across 12 categories. See the built-in `aeo://reference/scoring-methodology` resource for full details, or read [scoring-methodology.md](scoring-methodology.md).

**AEO categories:** Structured Data (30%), Meta & Technical (20%), AI Accessibility (25%), Content Quality (25%)

**GEO categories:** Brand Narrative Clarity (25%), Citation Readiness (25%), Authority Signals (25%), Entity Definition (25%)

**Agent Readiness categories:** Machine Identity (30%), API Discoverability (25%), Structured Actions (25%), Programmatic Access (20%)

**Grades:** A (90+), B (75-89), C (60-74), D (40-59), F (0-39)

---

Built by [Convrgent](https://convrgent.ai) — AI visibility tools for agents.

<!-- mcp-name: io.github.Convrgent/aeo-scanner -->
