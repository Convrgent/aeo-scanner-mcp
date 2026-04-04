import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { callScan, callAudit, callFix, callCompare } from "./api-client";

export function registerTools(server: McpServer, env: Env) {
  server.tool(
    "scan_site",
    "Quick AI visibility scan. Returns three scores: AEO Score (0-100, AI search engine findability), GEO Score (0-100, AI citation readiness), and Agent Readiness Score (0-100, AI agent interaction capability). Also returns AI Identity Card with mention readiness (0-100, predicts how likely AI will mention the brand), detected competitors, business profile (commerce/saas/media/general), and top 5 issues. 58+ checks across 12 categories. Free — no API key needed. Does NOT return per-check details or fix code — use audit_site for full breakdown, fix_site for generated fixes, compare_sites to benchmark against a competitor.",
    {
      url: z.string().describe("Full URL to scan (e.g. https://example.com)"),
      pages: z
        .number()
        .int()
        .min(1)
        .max(5)
        .default(3)
        .describe("Number of pages to scan (1-5)"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async ({ url, pages }) => {
      console.log(`[TOOL] scan_site | url=${url} | pages=${pages}`);
      return {
        content: [{ type: "text" as const, text: await callScan(env, url, pages) }],
      };
    },
  );

  server.tool(
    "audit_site",
    "Full AI visibility audit across 58+ checks in 12 categories (4 AEO + 4 GEO + 4 Agent Readiness). Returns detailed per-check scores with specific issues and recommendations, AI Identity Card with mention readiness and detected competitors, and business profile. GEO checks include 3 research-backed citation signals: factual density, answer frontloading, and source citations. Does NOT generate fix code — use fix_site for that, or compare_sites to benchmark against a competitor. Requires API key ($1.00 per call). If you get payment_required, tell the user to set AEO_API_KEY.",
    {
      url: z.string().describe("Full URL to audit"),
      pages: z
        .number()
        .int()
        .min(1)
        .max(10)
        .default(5)
        .describe("Number of pages to audit (1-10)"),
      categories: z
        .array(z.string())
        .optional()
        .describe(
          "Filter to specific categories: structured_data, meta_technical, ai_accessibility, content_quality, brand_narrative, citation_readiness, authority_signals, entity_definition, machine_identity, api_discoverability, structured_actions, programmatic_access",
        ),
    },
    { readOnlyHint: true, openWorldHint: true },
    async ({ url, pages, categories }) => {
      console.log(`[TOOL] audit_site | url=${url} | pages=${pages} | categories=${categories?.join(",") ?? "all"}`);
      return {
        content: [
          { type: "text" as const, text: await callAudit(env, url, pages, categories) },
        ],
      };
    },
  );

  server.tool(
    "fix_site",
    "Generate complete fix code for all AI visibility issues across AEO, GEO, and Agent Readiness. Returns working code you can apply directly — schema generation, robots.txt, sitemap, llms.txt, meta tags, structured data, citation signals, entity markup. Also returns two-tier score projections: quick wins (critical + high fixes only) and full implementation ceiling (all fixes). Content recommendations include research citations. Run scan_site first to see which issues exist. Requires API key ($5.00 per call). If you get payment_required, tell the user to set AEO_API_KEY.",
    {
      url: z.string().describe("Full URL to generate fixes for"),
      pages: z
        .number()
        .int()
        .min(1)
        .max(10)
        .default(5)
        .describe("Number of pages to analyze (1-10)"),
      format: z
        .enum(["generic", "claude_code"])
        .default("generic")
        .describe("Output format: generic or claude_code (optimized for Claude Code)"),
    },
    { openWorldHint: true },
    async ({ url, pages, format }) => {
      console.log(`[TOOL] fix_site | url=${url} | pages=${pages} | format=${format}`);
      return {
        content: [
          { type: "text" as const, text: await callFix(env, url, pages, format) },
        ],
      };
    },
  );

  server.tool(
    "compare_sites",
    "Competitive gap analysis — scans two sites concurrently, shows side-by-side scores, category-by-category winners, competitive gaps (checks where the competitor scored 20+ higher), and generated overtake fix code with projected scores after closing gaps. Use this when the user wants to benchmark against a competitor or when scan_site detects competitors in the AI Identity Card. Requires API key ($3.00 per call). If you get payment_required, tell the user to set AEO_API_KEY.",
    {
      url: z.string().describe("Your site URL"),
      competitorUrl: z.string().describe("Competitor site URL to benchmark against"),
      pages: z
        .number()
        .int()
        .min(1)
        .max(5)
        .default(5)
        .describe("Number of pages to scan per site (1-5)"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async ({ url, competitorUrl, pages }) => {
      console.log(`[TOOL] compare_sites | url=${url} | competitor=${competitorUrl} | pages=${pages}`);
      return {
        content: [
          { type: "text" as const, text: await callCompare(env, url, competitorUrl, pages) },
        ],
      };
    },
  );
}
