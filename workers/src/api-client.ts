const DEFAULT_API_URL = "https://scan.convrgent.ai";

function getApiUrl(env: Env): string {
  return env.AEO_API_URL || DEFAULT_API_URL;
}

function getPaidHeaders(env: Env): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (env.AEO_API_KEY) {
    headers["Authorization"] = `Bearer ${env.AEO_API_KEY}`;
  }
  return headers;
}

function paymentRequiredResponse(): string {
  return JSON.stringify(
    {
      error: "payment_required",
      message: "This tool requires a paid API key.",
      how_to_pay: {
        stripe: "Get your API key at https://scan.convrgent.ai",
        crypto:
          "Pay per call via x402 (USDC on Base). See https://scan.convrgent.ai",
      },
      setup: "Set AEO_API_KEY as a Cloudflare Worker secret.",
      pricing: { audit_site: "$1.00", fix_site: "$5.00" },
      tip: "scan_site is free — try it first to see your scores.",
    },
    null,
    2,
  );
}

export async function callScan(
  env: Env,
  url: string,
  pages: number,
): Promise<string> {
  const resp = await fetch(`${getApiUrl(env)}/api/aeo/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, pages: Math.min(Math.max(1, pages), 5) }),
  });

  if (resp.status === 429) {
    const error = await resp.text();
    return JSON.stringify(
      {
        error: "rate_limited",
        status: 429,
        details: tryParseJson(error),
        recovery: "Wait a few minutes and try again, or try a different URL.",
      },
      null,
      2,
    );
  }

  if (resp.status >= 400) {
    const error = await resp.text();
    return JSON.stringify(
      {
        error: "scan_failed",
        status: resp.status,
        details: tryParseJson(error),
        recovery: "Check the URL is correct and publicly accessible. Some sites block automated scanners.",
      },
      null,
      2,
    );
  }

  return resp.text();
}

export async function callAudit(
  env: Env,
  url: string,
  pages: number,
  categories?: string[],
): Promise<string> {
  const payload: Record<string, unknown> = {
    url,
    maxPages: Math.min(Math.max(1, pages), 10),
  };
  if (categories?.length) payload.categories = categories;

  return handlePaidRequest(env, "/api/aeo/audit", payload);
}

export async function callFix(
  env: Env,
  url: string,
  pages: number,
  format: string,
): Promise<string> {
  return handlePaidRequest(env, "/api/aeo/fix", {
    url,
    maxPages: Math.min(Math.max(1, pages), 10),
    format,
  });
}

async function handlePaidRequest(
  env: Env,
  endpoint: string,
  payload: Record<string, unknown>,
): Promise<string> {
  const resp = await fetch(`${getApiUrl(env)}${endpoint}`, {
    method: "POST",
    headers: getPaidHeaders(env),
    body: JSON.stringify(payload),
  });

  if (resp.status === 402) {
    return paymentRequiredResponse();
  }

  if (resp.status >= 400) {
    const error = await resp.text();
    return JSON.stringify(
      {
        error: "request_failed",
        status: resp.status,
        details: tryParseJson(error),
      },
      null,
      2,
    );
  }

  return resp.text();
}

function tryParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 500) };
  }
}
