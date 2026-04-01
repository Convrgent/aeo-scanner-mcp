# AEO Scanner — MCP Server

AI search visibility audit for any website. Two scores, one scan.

## What it does

- **AEO Score (0-100):** How well AI search engines (ChatGPT, Perplexity, Google AI Overviews) can find, read, and cite your content
- **Agent Readiness (0-100):** How easily AI agents can understand, interact with, and transact on your site

## Quick start

```bash
# Claude Code — one command
claude mcp add aeo-scanner -- uvx aeo-scanner

# Cursor — add to .cursor/mcp.json
{ "aeo-scanner": { "command": "uvx", "args": ["aeo-scanner"] } }
```

Then ask your AI assistant: *"Scan example.com for AI visibility"*

## Tools

| Tool | What it does | Price |
|------|-------------|-------|
| `scan_site` | Quick dual-score scan + top issues | **Free** |
| `audit_site` | Full 25+ check breakdown across 8 categories | $1.00 |
| `fix_site` | Generated fix code — apply directly with Claude Code | $5.00 |

## Free tier

`scan_site` works without any authentication. No API key, no wallet, no setup. Just install and scan.

Rate limits: 20 scans/hour per IP, 5 per URL per day.

## Paid tools

`audit_site` and `fix_site` require an API key:

1. Get your key at [scan.convrgent.ai](https://scan.convrgent.ai)
2. Add it to your MCP config:

```json
{
  "aeo-scanner": {
    "command": "uvx",
    "args": ["aeo-scanner"],
    "env": {
      "AEO_API_KEY": "your-api-key"
    }
  }
}
```

Or pay per call with USDC via [x402 protocol](https://www.x402.org/) (Base network).

## Workflow

The included `optimize_site` prompt guides the full workflow:

1. **Scan** — get baseline scores (free)
2. **Audit** — see detailed breakdown by category ($1)
3. **Fix** — get working code to apply ($5)
4. **Rescan** — verify improvement (free)

## Context cost

~1,000 tokens at startup. 40x lighter than GitHub MCP.

## Scoring

25+ checks across 8 categories. See the built-in `aeo://reference/scoring-methodology` resource for full details, or read [scoring-methodology.md](scoring-methodology.md).

**AEO categories:** Structured Data (30%), Meta & Technical (20%), AI Accessibility (25%), Content Quality (25%)

**Agent Readiness categories:** Machine Identity (25%), API Discoverability (25%), Structured Actions (20%), Programmatic Access (20%), Data Clarity (10%)

**Grades:** A (90+), B (75-89), C (60-74), D (40-59), F (0-39)

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AEO_API_KEY` | For paid tools | API key from scan.convrgent.ai |
| `AEO_API_URL` | No | Override API base URL (default: https://aeo.convrgent.ai) |

---

Built by [Convrgent](https://convrgent.ai) — personality intelligence and AI visibility tools for agents.
