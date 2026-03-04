import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * google-oauth-callback
 * Handles the Google Ads OAuth 2.0 redirect.
 * Requests read-only access to Google Ads Insights.
 */

Deno.serve(async (req: Request) => {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const clinicId = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";

    if (error || !code || !clinicId) {
        return Response.redirect(`${FRONTEND_URL}/dashboard?google_connect=error`, 302);
    }

    const CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
    const CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/google-oauth-callback`;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!CLIENT_ID || !CLIENT_SECRET) {
        return Response.redirect(`${FRONTEND_URL}/dashboard?google_connect=unconfigured`, 302);
    }

    try {
        // Exchange authorization code for tokens
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "authorization_code",
            }),
        });
        const tokenData = await tokenRes.json();

        if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

        // Upsert connection in Supabase
        await fetch(`${SUPABASE_URL}/rest/v1/clinic_ad_connections`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
                "apikey": SUPABASE_SERVICE_KEY!,
                "Prefer": "resolution=merge-duplicates",
            },
            body: JSON.stringify({
                clinic_id: clinicId,
                platform: "google",
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                token_expires_at: tokenData.expires_in
                    ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
                    : null,
                account_name: "Google Ads Account",
                status: "connected",
            }),
        });

        return Response.redirect(`${FRONTEND_URL}/dashboard?google_connect=success&tab=settings`, 302);
    } catch (err) {
        console.error("Google OAuth error:", err);
        return Response.redirect(`${FRONTEND_URL}/dashboard?google_connect=error`, 302);
    }
});
