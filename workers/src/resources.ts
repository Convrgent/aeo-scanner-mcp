import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SCORING_METHODOLOGY } from "./scoring-methodology";

export function registerResources(server: McpServer) {
  server.resource(
    "scoring-methodology",
    "aeo://reference/scoring-methodology",
    {
      description:
        "How AEO, GEO, and Agent Readiness scores are calculated across 58+ checks in 12 categories. Includes mention readiness, business profiles, competitive analysis, and research sources.",
    },
    async () => ({
      contents: [
        {
          uri: "aeo://reference/scoring-methodology",
          mimeType: "text/markdown",
          text: SCORING_METHODOLOGY,
        },
      ],
    }),
  );
}
