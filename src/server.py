import os
import json
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    name="aeo-scanner",
    instructions="AI search visibility audit. Returns three scores — AEO (search findability), GEO (citation readiness), Agent Readiness (agent interaction) — plus AI Identity Card with mention readiness and detected competitors, and business profile detection. Includes competitive gap analysis.",
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
            "pricing": {"audit_site": "$1.00", "compare_sites": "$3.00", "fix_site": "$5.00"},
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
    AI search findability), GEO Score (0-100, AI citation readiness),
    and Agent Readiness Score (0-100, AI agent interaction). Also returns
    AI Identity Card with mention readiness (0-100, predicts how likely AI
    will mention the brand), detected competitors, business profile
    (commerce/saas/media/general), and top issues. 58+ checks across
    12 categories. Free — no API key needed."""
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
    """Full AI visibility audit across 58+ checks in 12 categories:
    AEO (structured data, meta & technical, AI accessibility, content quality),
    GEO (brand narrative, citation readiness with 3 research-backed checks,
    authority signals, entity definition), and Agent Readiness (machine
    identity, API discoverability, structured actions, programmatic access).
    Returns AI Identity Card with mention readiness and detected competitors.
    Requires API key (set AEO_API_KEY env var). $1.00 per call."""
    payload: dict = {"url": url, "pages": min(max(1, pages), 5)}
    if categories:
        payload["categories"] = categories
    return await _handle_paid_request("/api/aeo/audit", payload)


@mcp.tool()
async def compare_sites(url: str, competitor_url: str, pages: int = 5) -> str:
    """Competitive gap analysis — scans two sites concurrently, shows
    side-by-side scores, category-by-category winners, competitive gaps
    (checks where competitor scored 20+ higher), and generated overtake
    fix code with projected scores after closing gaps. Use when the user
    wants to benchmark against a competitor or when scan_site detects
    competitors in the AI Identity Card.
    Requires API key (set AEO_API_KEY env var). $3.00 per call."""
    return await _handle_paid_request(
        "/api/aeo/compare",
        {"url": url, "competitorUrl": competitor_url, "maxPages": min(max(1, pages), 5)},
    )


@mcp.tool()
async def fix_site(url: str, pages: int = 5, format: str = "generic") -> str:
    """Generate complete fix code for all AI visibility issues across
    AEO, GEO, and Agent Readiness. Returns working code that coding
    agents can apply directly. Includes two-tier score projections:
    quick wins (critical + high fixes only) and full implementation
    ceiling (all fixes). Content recommendations include research citations.
    Set format to 'claude_code' for Claude Code optimized output.
    Requires API key (set AEO_API_KEY env var). $5.00 per call."""
    return await _handle_paid_request(
        "/api/aeo/fix",
        {"url": url, "pages": min(max(1, pages), 5), "format": format},
    )


@mcp.resource("aeo://reference/scoring-methodology")
async def scoring_methodology() -> str:
    """How AEO, GEO, and Agent Readiness scores are calculated across 58+ checks in 12 categories. Includes mention readiness, business profiles, and research sources."""
    path = os.path.join(os.path.dirname(__file__), "..", "scoring-methodology.md")
    with open(path) as f:
        return f.read()


@mcp.prompt()
async def optimize_site(url: str, priority: str = "auto") -> str:
    """Full scan → audit → compare → fix → verify workflow for optimizing
    a site's AI visibility. Uses detected business profile to prioritize
    which scores matter most. Includes competitive analysis when competitors
    are detected."""
    return f"""You are optimizing {url} for AI search visibility.

The scanner returns three scores plus mention readiness:
- **AEO Score** — How well AI search engines can find and read the content
- **GEO Score** — How likely AI is to cite the site as a source (citation readiness)
- **Agent Readiness Score** — How easily AI agents can interact with the site programmatically
- **Mention Readiness** (in AI Identity Card) — Predicts how likely AI will mention the brand (0-100)

Workflow:
1. Call scan_site to get baseline scores (free)
2. Check the **businessProfile** to decide emphasis:
   - commerce: AEO + GEO primary, Agent Readiness secondary
   - saas: AEO + Agent Readiness primary, GEO secondary
   - media: AEO + GEO primary, Agent Readiness secondary
   - general: all three equal
3. Check the **aiIdentityCard**:
   - mentionReadiness (0-100) — show score and key signals
   - detectedCompetitors — if found, suggest compare_sites
   - gaps — what AI doesn't know about the brand
4. Report all scores, mention readiness, profile, and gaps
5. If competitors detected, offer compare_sites ($3.00)
6. If user wants details, call audit_site ($1.00)
7. If user wants fixes, call fix_site ($5.00) — share both quick wins and full ceiling projections
8. Apply fix code if you have file access
9. Rescan to verify improvement (free)
10. Report before/after for all scores and mention readiness

Priority focus: {priority}
If priority is "auto", use the detected business profile to decide emphasis.

If any paid tool returns a payment_required error, tell the user:
- Get an API key at https://scan.convrgent.ai
- Set it as AEO_API_KEY in your MCP config
- Or pay per call with USDC via x402 protocol
"""


if __name__ == "__main__":
    mcp.run()
