import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SCORING_METHODOLOGY } from "./scoring-methodology";

export function registerResources(server: McpServer) {
  server.resource(
    "scoring-methodology",
    "aeo://reference/scoring-methodology",
    {
      description:
        "How AEO and Agent Readiness scores are calculated across 25+ checks in 8 categories.",
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
