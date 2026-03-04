import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// Platform Configs
const META_CLIENT_ID = Deno.env.get("META_CLIENT_ID");
const META_CLIENT_SECRET = Deno.env.get("META_CLIENT_SECRET");
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    try {
        const { operation, platform, code, clinicId, redirectUri } = await req.json();

        if (operation === 'sync_metrics') {
            // Simulated metric fetching for demonstration
            const mockMetrics = {
                meta: { spend: 1250.40, clicks: 840, impressions: 45000 },
                google: { spend: 980.20, clicks: 620, impressions: 32000 }
            };

            const platforms = ['meta', 'google'];
            for (const p of platforms) {
                await supabase.from('ad_platform_metrics').insert({
                    clinic_id: clinicId,
                    platform: p,
                    spend: mockMetrics[p as keyof typeof mockMetrics].spend,
                    clicks: mockMetrics[p as keyof typeof mockMetrics].clicks,
                    impressions: mockMetrics[p as keyof typeof mockMetrics].impressions,
                    timestamp: new Date().toISOString()
                });
            }

            return new Response(JSON.stringify({ success: true, metrics: mockMetrics }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            });
        }

        if (!platform || !code || !clinicId) {
            throw new Error("Missing required parameters: platform, code, or clinicId");
        }

        let tokenData;

        if (code === 'simulated_authorized_code') {
            // Simulated success for demonstration
            tokenData = {
                access_token: 'simulated_access_token_' + platform,
                expires_in: 3600,
                refresh_token: 'simulated_refresh_token'
            };
        } else if (platform === 'meta') {
            // Exchange Code for Access Token (Meta)
            const resp = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${META_CLIENT_ID}&redirect_uri=${redirectUri}&client_secret=${META_CLIENT_SECRET}&code=${code}`);
            tokenData = await resp.json();
        } else if (platform === 'google') {
            // Exchange Code for Tokens (Google)
            const resp = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    client_id: GOOGLE_CLIENT_ID!,
                    client_secret: GOOGLE_CLIENT_SECRET!,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
                }),
            });
            tokenData = await resp.json();
        } else {
            throw new Error("Invalid platform");
        }

        if (tokenData.error) {
            throw new Error(tokenData.error_description || tokenData.error.message || "OAuth exchange failed");
        }

        // Persist to Database
        const { error: upsertError } = await supabase
            .from('ad_platform_connections')
            .upsert({
                clinic_id: clinicId,
                platform,
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token || null,
                expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
                status: 'active',
                last_synced: new Date().toISOString()
            }, { onConflict: 'clinic_id, platform' });

        if (upsertError) throw upsertError;

        return new Response(JSON.stringify({ success: true, message: `Successfully connected ${platform}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
