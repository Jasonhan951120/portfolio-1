import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * sync-ad-metrics
 * Scheduled daily cron — fetches aggregate ad metrics from Meta + Google
 * and upserts into clinic_ad_metrics table.
 *
 * Deploy with: supabase functions deploy sync-ad-metrics --no-verify-jwt
 * Schedule via: Supabase Dashboard > Edge Functions > Schedules (or pg_cron)
 */

Deno.serve(async (_req: Request) => {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        "apikey": SUPABASE_SERVICE_KEY,
    };

    // Fetch all active ad connections
    const connectionsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/clinic_ad_connections?status=eq.connected&select=*`,
        { headers }
    );
    if (!connectionsRes.ok) throw new Error(`Connections fetch failed ${connectionsRes.status}: ${await connectionsRes.text()}`);
    const connections: any[] = await connectionsRes.json();

    const today = new Date().toISOString().split("T")[0];
    const results: any[] = [];

    for (const conn of connections) {
        try {
            if (conn.platform === "meta") {
                await syncMetaMetrics(conn, today, SUPABASE_URL, headers);
                results.push({ clinic_id: conn.clinic_id, platform: "meta", status: "synced" });
            } else if (conn.platform === "google") {
                await syncGoogleMetrics(conn, today, SUPABASE_URL, headers);
                results.push({ clinic_id: conn.clinic_id, platform: "google", status: "synced" });
            }

            // Update last_synced_at
            const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/clinic_ad_connections?id=eq.${conn.id}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({ last_synced_at: new Date().toISOString() }),
            });
            if (!patchRes.ok) throw new Error(`PATCH conn failed: ${patchRes.status}`);
        } catch (err) {
            console.error(`Sync failed for clinic ${conn.clinic_id} / ${conn.platform}:`, err);
            results.push({ clinic_id: conn.clinic_id, platform: conn.platform, status: "error", error: String(err) });
        }
    }

    return new Response(JSON.stringify({ synced: results.length, results }), {
        headers: { "Content-Type": "application/json" },
    });
});

async function syncMetaMetrics(conn: any, date: string, supabaseUrl: string, headers: any) {
    const META_API_VERSION = "v19.0";
    const accountId = conn.account_id?.replace("act_", "") || "";
    if (!accountId) return;

    const res = await fetch(
        `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/insights?` +
        `fields=impressions,clicks,spend,campaign_name&time_range={"since":"${date}","until":"${date}"}` +
        `&access_token=${conn.access_token}`
    );
    if (!res.ok) throw new Error(`Meta API error ${res.status}: ${await res.text()}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    for (const row of data.data || []) {
        const dbRes = await fetch(`${supabaseUrl}/rest/v1/clinic_ad_metrics`, {
            method: "POST",
            headers: { ...headers, "Prefer": "resolution=merge-duplicates" },
            body: JSON.stringify({
                clinic_id: conn.clinic_id,
                platform: "meta",
                date,
                impressions: parseInt(row.impressions || "0"),
                clicks: parseInt(row.clicks || "0"),
                spend_gbp: parseFloat(row.spend || "0"),
                ctr: row.clicks && row.impressions ? parseFloat(row.clicks) / parseFloat(row.impressions) : 0,
                cpc_gbp: row.clicks && row.spend ? parseFloat(row.spend) / parseFloat(row.clicks) : 0,
                campaign_name: row.campaign_name || "All Campaigns",
            }),
        });
        if (!dbRes.ok) throw new Error(`Supa DB fail meta ${dbRes.status}: ${await dbRes.text()}`);
    }
}

async function syncGoogleMetrics(conn: any, date: string, supabaseUrl: string, headers: any) {
    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

    // Refresh the access token first
    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            refresh_token: conn.refresh_token,
            grant_type: "refresh_token",
        }),
    });
    if (!refreshRes.ok) throw new Error(`Google OAuth error ${refreshRes.status}: ${await refreshRes.text()}`);
    
    const refreshData = await refreshRes.json();
    if (refreshData.error) throw new Error(refreshData.error_description || refreshData.error);

    const accessToken = refreshData.access_token;
    const accountId = conn.account_id || "";
    if (!accountId) return;

    // Query Google Ads API for campaign metrics
    const query = `
    SELECT
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros
    FROM campaign
    WHERE segments.date = '${date}'
      AND campaign.status = 'ENABLED'
  `;

    const gaRes = await fetch(
        `https://googleads.googleapis.com/v14/customers/${accountId}/googleAds:searchStream`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "developer-token": Deno.env.get("GOOGLE_ADS_DEVELOPER_TOKEN") || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        }
    );
    if (!gaRes.ok) throw new Error(`Google Ads API error ${gaRes.status}: ${await gaRes.text()}`);
    const gaData = await gaRes.json();

    for (const batch of gaData) {
        for (const row of batch.results || []) {
            const dbRes = await fetch(`${supabaseUrl}/rest/v1/clinic_ad_metrics`, {
                method: "POST",
                headers: { ...headers, "Prefer": "resolution=merge-duplicates" },
                body: JSON.stringify({
                    clinic_id: conn.clinic_id,
                    platform: "google",
                    date,
                    impressions: parseInt(row.metrics?.impressions || "0"),
                    clicks: parseInt(row.metrics?.clicks || "0"),
                    spend_gbp: (parseInt(row.metrics?.cost_micros || "0") / 1_000_000),
                    campaign_name: row.campaign?.name || "All Campaigns",
                }),
            });
            if (!dbRes.ok) throw new Error(`Supa DB fail google ${dbRes.status}: ${await dbRes.text()}`);
        }
    }
}
