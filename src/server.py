import os
import json
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    name="aeo-scanner",
    instructions="AI search visibility audit. Checks AEO score and Agent Readiness score for any website. Returns actionable fix code.",
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
    """Quick AI visibility scan. Returns AEO Score (0-100) and Agent
    Readiness Score (0-100) with letter grades, plus top issues found.
    Free to use — no API key needed. Use for fast assessment before
    diving deeper with audit_site. Run again after applying fixes to
    verify improvement."""
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
    """Full AI visibility audit across 25+ checks in 8 categories:
    structured data, meta & technical, AI accessibility, content quality,
    machine identity, API discoverability, structured actions, and
    programmatic access. Returns detailed per-check scores with
    specific issues and fix recommendations.
    Requires API key (set AEO_API_KEY env var). $1.00 per call."""
    payload: dict = {"url": url, "pages": min(max(1, pages), 5)}
    if categories:
        payload["categories"] = categories
    return await _handle_paid_request("/api/aeo/audit", payload)


@mcp.tool()
async def fix_site(url: str, pages: int = 5, format: str = "generic") -> str:
    """Generate complete fix code for all AI visibility issues.
    Returns a structured fix file that coding agents (Claude Code,
    Codex, Cursor) can apply directly. Includes schema generation,
    robots.txt fixes, sitemap fixes, llms.txt generation, and
    structured data additions. Not just recommendations — working code.
    Set format to 'claude_code' for Claude Code optimized output.
    Requires API key (set AEO_API_KEY env var). $5.00 per call."""
    return await _handle_paid_request(
        "/api/aeo/fix",
        {"url": url, "pages": min(max(1, pages), 5), "format": format},
    )


@mcp.resource("aeo://reference/scoring-methodology")
async def scoring_methodology() -> str:
    """How AEO and Agent Readiness scores are calculated across 25+ checks."""
    path = os.path.join(os.path.dirname(__file__), "..", "scoring-methodology.md")
    with open(path) as f:
        return f.read()


@mcp.prompt()
async def optimize_site(url: str, priority: str = "both") -> str:
    """Full scan → audit → fix → verify workflow for optimizing a site's
    AI visibility. Guides the agent through the complete process."""
    return f"""You are optimizing {url} for AI search visibility and agent readiness.

Workflow:
1. Call scan_site to get baseline scores (free)
2. Report the two scores and top issues to the user
3. If user wants to proceed, call audit_site for the full breakdown ($1.00 — requires API key)
4. Present the detailed findings organized by category
5. If user wants fixes, call fix_site to generate fix code ($5.00 — requires API key)
6. Apply the fix code to the project (if you have file access)
7. After applying fixes, call scan_site again to verify improvement (free)
8. Report the before/after comparison (e.g., "AEO: 61 → 96")

Priority focus: {priority}
Always present both scores but emphasize the priority area.

If audit_site or fix_site returns a payment_required error, tell the user:
- Get an API key at https://scan.convrgent.ai
- Set it as AEO_API_KEY in your MCP config
- Or pay per call with USDC via x402 protocol
"""


if __name__ == "__main__":
    mcp.run()
