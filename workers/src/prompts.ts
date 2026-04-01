import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrompts(server: McpServer) {
  server.prompt(
    "optimize_site",
    "Full scan → audit → fix → verify workflow for optimizing a site's AI visibility.",
    {
      url: z.string().describe("Website URL to optimize"),
      priority: z
        .enum(["aeo", "agent_readiness", "both"])
        .default("both")
        .describe("Which score to prioritize"),
    },
    ({ url, priority }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `You are optimizing ${url} for AI search visibility and agent readiness.

Workflow:
1. Call scan_site to get baseline scores (free)
2. Report the two scores and top issues to the user
3. If user wants to proceed, call audit_site for the full breakdown ($1.00 — requires API key)
4. Present the detailed findings organized by category
5. If user wants fixes, call fix_site to generate fix code ($5.00 — requires API key)
6. Apply the fix code to the project (if you have file access)
7. After applying fixes, call scan_site again to verify improvement (free)
8. Report the before/after comparison (e.g., "AEO: 61 → 96")

Priority focus: ${priority}
Always present both scores but emphasize the priority area.

If audit_site or fix_site returns a payment_required error, tell the user:
- Get an API key at https://scan.convrgent.ai
- Set it as AEO_API_KEY in the MCP server config
- Or pay per call with USDC via x402 protocol`,
          },
        },
      ],
    }),
  );
}
