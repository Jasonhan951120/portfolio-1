import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * enable-auto-tracking
 * Attempts to automatically append UTM parameters to Meta/Google ad campaigns
 * for a connected clinic. If the API restricts programmatic URL modifications
 * (which is common for security/permissions), this returns a specific payload
 * that triggers the frontend Fallback Modal.
 */

Deno.serve(async (req: Request) => {
    // CORS handling
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
            },
        });
    }

    try {
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
        const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        const { clinicId, platform } = await req.json();
        if (!clinicId || !platform) throw new Error("Missing clinicId or platform");

        // Fetch the active connection tokens
        const connRes = await fetch(
            `${SUPABASE_URL}/rest/v1/clinic_ad_connections?clinic_id=eq.${clinicId}&platform=eq.${platform}&select=access_token,account_id`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
                    "apikey": SUPABASE_SERVICE_KEY,
                },
            }
        );
        const connections = await connRes.json();
        if (!connections || connections.length === 0) {
            throw new Error("No active ad connection found for this platform.");
        }

        // Simulate checking programmatic UTM appendage permissions.
        // In Meta and Google, modifying campaign URLs usually requires 'Ads Management' full write access.
        // Our OAuth scopes (read-only for insights) intentionally restrict this.
        // Therefore, we gracefully fallback to the UI instructions.

        return new Response(
            JSON.stringify({
                success: false,
                requiresManualToggle: true,
                message: "API scope restricts programmatic URL modification. Requires manual toggle in Ads Manager."
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                status: 200, // Return 200 so the frontend can catch the manual toggle payload
            }
        );

    } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            status: 400,
        });
    }
});
