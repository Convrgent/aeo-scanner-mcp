import os
import json
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    name="aeo-scanner",
    instructions="AI search visibility audit. Returns three scores — AEO (search engine findability), GEO (citation readiness), Agent Readiness (agent interaction capability) — plus AI Identity Card and business profile detection. Returns actionable fix code.",
)

API_BASE = os.environ.get("AEO_API_URL", "https://scan.convrgent.ai")
AEO_API_KEY = os.environ.get("AEO_API_KEY")


def _get_paid_headers() -> dict:
    """Build headers for paid API calls."""
    headers = {"Content-Type": "application/json"}
    if AEO_API_KEY:
        headers["Authorization"] = f"Bearer {AEO_API_KEY}"
    return headers


def _payment_required_response() -> str:
    """Structured 402 response that agents can relay to their operators."""
    return json.dumps(
        {
            "error": "payment_required",
            "message": "This tool requires a paid API key.",
            "how_to_pay": {
                "stripe": "Get your API key at https://scan.convrgent.ai",
                "crypto": "Pay per call via x402 (USDC on Base). See https://scan.convrgent.ai",
            },
            "setup": "Set AEO_API_KEY in your MCP server config env vars.",
            "pricing": {"audit_site": "$1.00", "fix_site": "$5.00"},
            "tip": "scan_site is free — try it first to see your scores.",
        },
        indent=2,
    )


async def _handle_paid_request(endpoint: str, payload: dict) -> str:
    """Call a paid endpoint with proper 402 handling."""
    headers = _get_paid_headers()
    async with httpx.AsyncClient(timeout=180) as client:
        resp = await client.post(f"{API_BASE}{endpoint}", json=payload, headers=headers)
        if resp.status_code == 402:
            return _payment_required_response()
        if resp.status_code >= 400:
            try:
                error_data = resp.json()
            except Exception:
                error_data = {"raw": resp.text[:500]}
            return json.dumps(
                {
                    "error": "request_failed",
                    "status": resp.status_code,
                    "details": error_data,
                },
                indent=2,
            )
        return resp.text


@mcp.tool()
async def scan_site(url: str, pages: int = 5) -> str:
    """Quick AI visibility scan. Returns three scores: AEO Score (0-100,
    AI search engine findability), GEO Score (0-100, AI citation readiness),
    and Agent Readiness Score (0-100, AI agent interaction capability).
    Also returns an AI Identity Card (how AI perceives the brand),
    detected business profile (commerce/saas/media/general with which
    scores matter most), and top issues. Free — no API key needed.
    Use for fast assessment before diving deeper with audit_site.
    Run again after applying fixes to verify improvement."""
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            f"{API_BASE}/api/aeo/scan",
            json={"url": url, "pages": min(max(1, pages), 5)},
            headers={"Content-Type": "application/json"},
        )
        if resp.status_code >= 400:
            try:
                error_data = resp.json()
            except Exception:
                error_data = {"raw": resp.text[:500]}
            return json.dumps(
                {
                    "error": "scan_failed",
                    "status": resp.status_code,
                    "details": error_data,
                },
                indent=2,
            )
        return resp.text


@mcp.tool()
async def audit_site(
    url: str, pages: int = 5, categories: list[str] | None = None
) -> str:
    """Full AI visibility audit across 55+ checks in 12 categories:
    AEO (structured data, meta & technical, AI accessibility, content quality),
    GEO (brand narrative clarity, citation readiness, authority signals,
    entity definition), and Agent Readiness (machine identity, API
    discoverability, structured actions, programmatic access).
    Returns detailed per-check scores with specific issues, fix
    recommendations, AI Identity Card, and detected business profile.
    Requires API key (set AEO_API_KEY env var). $1.00 per call."""
    payload: dict = {"url": url, "pages": min(max(1, pages), 5)}
    if categories:
        payload["categories"] = categories
    return await _handle_paid_request("/api/aeo/audit", payload)


@mcp.tool()
async def fix_site(url: str, pages: int = 5, format: str = "generic") -> str:
    """Generate complete fix code for all AI visibility issues across
    AEO, GEO, and Agent Readiness. Returns working code that coding
    agents (Claude Code, Codex, Cursor) can apply directly. Includes
    schema generation, robots.txt fixes, sitemap fixes, llms.txt
    generation, structured data, citation signals, and entity markup.
    Also returns score projections with two tiers: quick wins (critical +
    high fixes only) and full implementation ceiling (all fixes).
    Set format to 'claude_code' for Claude Code optimized output.
    Requires API key (set AEO_API_KEY env var). $5.00 per call."""
    return await _handle_paid_request(
        "/api/aeo/fix",
        {"url": url, "pages": min(max(1, pages), 5), "format": format},
    )


@mcp.resource("aeo://reference/scoring-methodology")
async def scoring_methodology() -> str:
    """How AEO, GEO, and Agent Readiness scores are calculated across 55+ checks in 12 categories. Includes business profiles and AI Identity Card."""
    path = os.path.join(os.path.dirname(__file__), "..", "scoring-methodology.md")
    with open(path) as f:
        return f.read()


@mcp.prompt()
async def optimize_site(url: str, priority: str = "auto") -> str:
    """Full scan → audit → fix → verify workflow for optimizing a site's
    AI visibility across AEO, GEO, and Agent Readiness. Uses detected
    business profile to prioritize which scores matter most."""
    return f"""You are optimizing {url} for AI search visibility.

The scanner returns three scores:
- **AEO Score** — How well AI search engines can find and read the content
- **GEO Score** — How likely AI is to cite the site as a source (citation readiness)
- **Agent Readiness Score** — How easily AI agents can interact with the site programmatically

Workflow:
1. Call scan_site to get baseline scores (free)
2. Check the **businessProfile** in the response — it tells you which scores matter most:
   - commerce: AEO + GEO are primary, Agent Readiness secondary
   - saas: AEO + Agent Readiness are primary, GEO secondary
   - media: AEO + GEO are primary, Agent Readiness secondary
   - general: all three matter equally
3. Check the **aiIdentityCard** — it shows how AI currently perceives the brand. Pay attention to gaps (what AI doesn't know)
4. Report all three scores, the business profile, and key identity card gaps to the user
5. If user wants details, call audit_site for the full breakdown ($1.00 — requires API key)
6. Present findings organized by category, highlighting the categories that matter most for this business type
7. If user wants fixes, call fix_site to generate fix code ($5.00 — requires API key)
8. The fix response includes score projections with two tiers: "quick wins" and "full implementation ceiling" — share both
9. Apply the fix code to the project (if you have file access)
10. After applying fixes, call scan_site again to verify improvement (free)
11. Report the before/after comparison for all three scores

Priority focus: {priority}
If priority is "auto", use the detected business profile to decide emphasis.

If audit_site or fix_site returns a payment_required error, tell the user:
- Get an API key at https://scan.convrgent.ai
- Set it as AEO_API_KEY in your MCP config
- Or pay per call with USDC via x402 protocol
"""


if __name__ == "__main__":
    mcp.run()
