import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { registerTools } from "./tools";
import { registerResources } from "./resources";
import { registerPrompts } from "./prompts";

export class AeoScannerMcp extends McpAgent<Env> {
  server = new McpServer(
    { name: "aeo-scanner", version: "2.0.0" },
    {
      instructions:
        "AI search visibility audit for any website. Use scan_site first (free) to get baseline scores, then audit_site for detailed breakdown, then fix_site for working fix code. The optimize_site prompt guides the full workflow.",
    },
  );

  async init() {
    registerTools(this.server, this.env);
    registerResources(this.server);
    registerPrompts(this.server);
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return AeoScannerMcp.serve("/mcp").fetch(request, env, ctx);
    }

    // Health check / landing
    if (url.pathname === "/" || url.pathname === "/health") {
      return Response.json({
        name: "aeo-scanner",
        version: "2.0.0",
        description: "AI search visibility audit MCP server",
        mcpEndpoint: "/mcp",
        tools: ["scan_site (free)", "audit_site ($1.00)", "fix_site ($5.00)"],
        docs: "https://github.com/Convrgent/aeo-scanner-mcp",
        provider: "Convrgent (convrgent.ai)",
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
