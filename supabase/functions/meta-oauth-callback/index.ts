import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * meta-oauth-callback
 * Handles the redirect from Meta after OAuth authorization.
 * Exchanges the code for tokens and stores them securely.
 *
 * Flow:
 * 1. Meta redirects to: /functions/v1/meta-oauth-callback?code=XXX&state=clinicId
 * 2. We exchange code for access + refresh tokens
 * 3. Store in clinic_ad_connections table
 * 4. Redirect admin back to /dashboard with success flag
 */

Deno.serve(async (req: Request) => {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const clinicId = url.searchParams.get("state"); // we pass clinicId as state
    const error = url.searchParams.get("error");

    const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";

    if (error || !code || !clinicId) {
        return Response.redirect(`${FRONTEND_URL}/dashboard?meta_connect=error`, 302);
    }

    const APP_ID = Deno.env.get("META_APP_ID");
    const APP_SECRET = Deno.env.get("META_APP_SECRET");
    const REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/meta-oauth-callback`;

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!APP_ID || !APP_SECRET) {
        return Response.redirect(`${FRONTEND_URL}/dashboard?meta_connect=unconfigured`, 302);
    }

    try {
        // Exchange code for long-lived token
        const tokenRes = await fetch(
            `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${APP_SECRET}&code=${code}`
        );
        const tokenData = await tokenRes.json();

        if (tokenData.error) throw new Error(tokenData.error.message);

        // Fetch ad accounts for this user
        const accountsRes = await fetch(
            `https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_id&access_token=${tokenData.access_token}`
        );
        const accountsData = await accountsRes.json();
        const firstAccount = accountsData.data?.[0];

        // Upsert into Supabase
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
                platform: "meta",
                access_token: tokenData.access_token,
                token_expires_at: tokenData.expires_in
                    ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
                    : null,
                account_id: firstAccount?.account_id || null,
                account_name: firstAccount?.name || "Meta Ads Account",
                status: "connected",
            }),
        });

        return Response.redirect(`${FRONTEND_URL}/dashboard?meta_connect=success&tab=settings`, 302);
    } catch (err) {
        console.error("Meta OAuth error:", err);
        return Response.redirect(`${FRONTEND_URL}/dashboard?meta_connect=error`, 302);
    }
});
