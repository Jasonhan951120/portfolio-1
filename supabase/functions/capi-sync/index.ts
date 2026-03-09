import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function hashSHA256(message: string) {
    const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
    // Using Web Crypto API which is globally available in Deno
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { lead } = await req.json()

        if (!lead || !lead.id) {
            throw new Error("Missing 'lead' data.")
        }

        // Hash PII for GDPR compliance
        const hashedEmail = lead.email ? await hashSHA256(lead.email) : null;
        const hashedPhone = lead.phone ? await hashSHA256(lead.phone) : null;

        console.log(`[CAPI Sync] Processing Lead ID: ${lead.id}`);
        console.log(`[CAPI Sync] Hashed Email: ${hashedEmail}`);
        console.log(`[CAPI Sync] Hashed Phone: ${hashedPhone}`);
        console.log(`[CAPI Sync] Value Sent: £${lead.potential_value}`);
        console.log(`[CAPI Sync] FBCLID: ${lead.fbclid}`);

        // Mock API call to Meta Conversions API
        // await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events`, { ... })

        return new Response(JSON.stringify({
            success: true,
            message: "CAPI event processed securely.",
            hashed_data: { em: hashedEmail, ph: hashedPhone },
            value: lead.potential_value
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
