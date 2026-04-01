import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { callScan, callAudit, callFix } from "./api-client";

export function registerTools(server: McpServer, env: Env) {
  server.tool(
    "scan_site",
    "Quick AI visibility scan. Returns AEO Score (0-100) and Agent Readiness Score (0-100) with letter grades, plus top 5 issues. Free — no API key needed. Does NOT return per-check details or fix code — use audit_site for full breakdown, fix_site for generated fixes.",
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
    async ({ url, pages }) => ({
      content: [{ type: "text" as const, text: await callScan(env, url, pages) }],
    }),
  );

  server.tool(
    "audit_site",
    "Full AI visibility audit across 25+ checks in 8 categories. Returns detailed per-check scores with specific issues and recommendations. Does NOT generate fix code — use fix_site for that. Requires API key ($1.00 per call). If you get payment_required, tell the user to set AEO_API_KEY.",
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
          "Filter to specific categories: structured_data, meta_technical, ai_accessibility, content_quality, machine_identity, api_discoverability, structured_actions, programmatic_access",
        ),
    },
    { readOnlyHint: true, openWorldHint: true },
    async ({ url, pages, categories }) => ({
      content: [
        { type: "text" as const, text: await callAudit(env, url, pages, categories) },
      ],
    }),
  );

  server.tool(
    "fix_site",
    "Generate complete fix code for all AI visibility issues. Returns working code you can apply directly — schema generation, robots.txt, sitemap, llms.txt, meta tags, structured data. Run scan_site first to see which issues exist. Requires API key ($5.00 per call). If you get payment_required, tell the user to set AEO_API_KEY.",
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
    async ({ url, pages, format }) => ({
      content: [
        { type: "text" as const, text: await callFix(env, url, pages, format) },
      ],
    }),
  );
}
