# AEO Scanner — MCP Server

AI search visibility audit for any website. Two scores, one scan.

## What it does

- **AEO Score (0-100):** How well AI search engines (ChatGPT, Perplexity, Google AI Overviews) can find, read, and cite your content
- **Agent Readiness (0-100):** How easily AI agents can understand, interact with, and transact on your site

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
| `scan_site` | Quick dual-score scan + top issues | **Free** |
| `audit_site` | Full 25+ check breakdown across 8 categories | $1.00 |
| `fix_site` | Generated fix code — apply directly with Claude Code | $5.00 |

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

1. **Scan** — get baseline scores (free)
2. **Audit** — see detailed breakdown by category ($1)
3. **Fix** — get working code to apply ($5)
4. **Rescan** — verify improvement (free)

## Scoring

25+ checks across 8 categories. See the built-in `aeo://reference/scoring-methodology` resource for full details, or read [scoring-methodology.md](scoring-methodology.md).

**AEO categories:** Structured Data (30%), Meta & Technical (20%), AI Accessibility (25%), Content Quality (25%)

**Agent Readiness categories:** Machine Identity (25%), API Discoverability (25%), Structured Actions (20%), Programmatic Access (20%), Data Clarity (10%)

**Grades:** A (90+), B (75-89), C (60-74), D (40-59), F (0-39)

---

Built by [Convrgent](https://convrgent.ai) — personality intelligence and AI visibility tools for agents.

<!-- mcp-name: io.github.Convrgent/aeo-scanner -->
