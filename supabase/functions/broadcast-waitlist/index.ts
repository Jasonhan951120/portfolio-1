import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { clinic_id } = await req.json()

        if (!clinic_id) {
            throw new Error("Missing 'clinic_id'.")
        }

        // Initialize Supabase Client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // Query waitlisted patients for this clinic
        const { data: waitlist, error } = await supabaseClient
            .from('consultation_requests')
            .select('id, name, phone')
            .eq('clinic_id', clinic_id)
            .eq('status', 'Waitlisted')

        if (error) {
            console.error("Database query error:", error);
            throw new Error("Failed to retrieve waitlist for broadcasting.");
        }

        const notifyCount = waitlist ? waitlist.length : 0;

        // Mock Automation: Send SMS/WhatsApp via Twilio
        if (notifyCount > 0) {
            waitlist.forEach(patient => {
                console.log(`[Twilio Mock] Sending Gap Filler Broadcast to ${patient.name} (${patient.phone || 'No phone...'})`);
                // Placeholder for actual HTTP fetch to Twilio API
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: `Broadcast initiated successfully for ${notifyCount} waitlisted patients.`,
            notified_count: notifyCount
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
