interface Env {
  MCP_OBJECT: DurableObjectNamespace<import("./src/index").AeoScannerMcp>;
  AEO_API_KEY: string;
  AEO_API_URL: string;
}
declare namespace Cloudflare {
  interface Env extends globalThis.Env {}
}
