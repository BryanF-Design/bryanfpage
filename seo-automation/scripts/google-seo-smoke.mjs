import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envFiles = [".env.local", ".env"];

function parseEnvValue(raw) {
  let value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return value.replace(/\\n/g, "\n");
}

function loadEnv() {
  const env = { ...process.env };

  for (const file of envFiles) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;

    const text = fs.readFileSync(filePath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = parseEnvValue(trimmed.slice(eq + 1));
      if (!(key in env)) env[key] = value;
    }
  }

  return env;
}

function isoDateDaysAgo(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function required(env, keys) {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

async function getAccessToken(env) {
  required(env, [
    "GOOGLE_OAUTH_CLIENT_ID",
    "GOOGLE_OAUTH_CLIENT_SECRET",
    "GOOGLE_OAUTH_REFRESH_TOKEN",
  ]);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      `OAuth refresh failed: ${data.error || response.status} ${data.error_description || ""}`.trim(),
    );
  }

  return data.access_token;
}

async function readSearchConsole(env, headers) {
  required(env, ["GSC_SITE_URL"]);

  const sitesResponse = await fetch("https://searchconsole.googleapis.com/webmasters/v3/sites", {
    headers,
  });
  const sitesData = await sitesResponse.json();
  const site = Array.isArray(sitesData.siteEntry)
    ? sitesData.siteEntry.find((entry) => entry.siteUrl === env.GSC_SITE_URL)
    : null;

  const endDate = isoDateDaysAgo(2);
  const startDate = isoDateDaysAgo(30);
  const queryResponse = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      env.GSC_SITE_URL,
    )}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 5,
      }),
    },
  );
  const queryData = await queryResponse.json();

  return {
    sitesStatus: sitesResponse.status,
    siteFound: Boolean(site),
    permissionLevel: site?.permissionLevel || null,
    queryStatus: queryResponse.status,
    dateRange: { startDate, endDate },
    queryRows: Array.isArray(queryData.rows) ? queryData.rows.length : 0,
    error: queryResponse.ok
      ? null
      : {
          status: queryData.error?.status || null,
          message: queryData.error?.message || null,
        },
  };
}

async function readGa4(env, headers) {
  required(env, ["GA4_PROPERTY_ID"]);

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${env.GA4_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }],
        limit: 5,
      }),
    },
  );
  const data = await response.json();

  return {
    status: response.status,
    rowCount: data.rowCount ?? null,
    dimensions: data.dimensionHeaders?.map((header) => header.name) || [],
    metrics: data.metricHeaders?.map((header) => header.name) || [],
    error: response.ok
      ? null
      : {
          status: data.error?.status || null,
          message: data.error?.message || null,
        },
  };
}

async function main() {
  const env = loadEnv();
  const authMode = env.GOOGLE_AUTH_MODE || "oauth";

  if (authMode !== "oauth") {
    throw new Error(`Unsupported GOOGLE_AUTH_MODE for this script: ${authMode}`);
  }

  const accessToken = await getAccessToken(env);
  const headers = { Authorization: `Bearer ${accessToken}` };

  const [searchConsole, ga4] = await Promise.all([
    readSearchConsole(env, headers),
    readGa4(env, headers),
  ]);

  const result = {
    checkedAt: new Date().toISOString(),
    authMode,
    siteUrl: env.SITE_URL || null,
    gscSiteUrl: env.GSC_SITE_URL || null,
    ga4PropertyId: env.GA4_PROPERTY_ID || null,
    searchConsole,
    ga4,
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        message: error.message,
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});
