import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Initialize Supabase Client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Find leads stuck in 'New Lead' state for more than 3 days
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const { data: neglectedLeads, error: fetchError } = await supabaseClient
            .from('consultation_requests')
            .select('id, name, phone, potential_value')
            .eq('status', 'New Lead')
            .lt('created_at', threeDaysAgo.toISOString())
            .limit(50); // Process in batches

        if (fetchError) throw fetchError;

        const recoveredLeads = []

        for (const lead of neglectedLeads || []) {
            // Simulate sending a "Wake-up" WhatsApp message
            console.log(`Sending automated wake-up WhatsApp message to ${lead.name} at ${lead.phone}...`);

            // Mock API call to Twilio/WhatsApp goes here
            // e.g. await sendWhatsApp(lead.phone, `Hi ${lead.name}, still looking to upgrade your smile?`)

            // Mark as recovered
            const { error: updateError } = await supabaseClient
                .from('consultation_requests')
                .update({
                    recovered_by_ai: true,
                    status: 'Consultation Done' // Mocking immediate successful response for demo
                })
                .eq('id', lead.id);

            if (!updateError) {
                recoveredLeads.push({
                    id: lead.id,
                    name: lead.name,
                    value_saved: lead.potential_value
                })
            }
        }

        const totalValueSaved = recoveredLeads.reduce((sum, l) => sum + (l.value_saved || 0), 0);

        return new Response(JSON.stringify({
            success: true,
            message: `Successfully sent wake-up messages to ${recoveredLeads.length} leads.`,
            system_generated_revenue_potential: totalValueSaved,
            leads: recoveredLeads
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
