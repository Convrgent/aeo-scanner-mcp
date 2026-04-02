import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrompts(server: McpServer) {
  server.prompt(
    "optimize_site",
    "Full scan → audit → fix → verify workflow for optimizing a site's AI visibility across AEO, GEO, and Agent Readiness.",
    {
      url: z.string().describe("Website URL to optimize"),
      priority: z
        .enum(["aeo", "geo", "agent_readiness", "auto"])
        .default("auto")
        .describe("Which score to prioritize. Use 'auto' to let the detected business profile decide."),
    },
    ({ url, priority }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `You are optimizing ${url} for AI search visibility.

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
3. Check the **aiIdentityCard** — it shows how AI currently perceives the brand. Pay attention to gaps (what AI doesn't know about the brand)
4. Report all three scores, the business profile, and key identity card gaps to the user
5. If user wants details, call audit_site for the full breakdown ($1.00 — requires API key)
6. Present findings organized by category, highlighting the categories that matter most for this business type
7. If user wants fixes, call fix_site to generate fix code ($5.00 — requires API key)
8. The fix response includes score projections with two tiers: "quick wins" (critical + high fixes) and "full implementation ceiling" — share both
9. Apply the fix code to the project (if you have file access)
10. After applying fixes, call scan_site again to verify improvement (free)
11. Report the before/after comparison for all three scores

Priority focus: ${priority}
If priority is "auto", use the detected business profile to decide emphasis.

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
