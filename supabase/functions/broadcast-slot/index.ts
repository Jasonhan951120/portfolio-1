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
        const { slot_id } = await req.json()

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get Slot Details
        const { data: slot, error: slotError } = await supabaseClient
            .from('cancelled_slots')
            .select('*')
            .eq('id', slot_id)
            .single()

        if (slotError) throw slotError

        // 2. Find Matching Waitlist Leads
        const { data: matches, error: matchError } = await supabaseClient
            .rpc('find_matches_for_slot', { slot_id })

        if (matchError) throw matchError

        // 3. Simulated WhatsApp Broadcast
        // In production, loop through matches and call Twilio/Meta WhatsApp API
        console.log(`Broadcasting to ${matches.length} matches for ${slot.service_name} at ${slot.start_time}`)

        // Update matches to 'notified'
        const leadIds = matches.map((m: any) => m.lead_id)
        await supabaseClient
            .from('consultation_requests')
            .update({ waitlist_status: 'notified' })
            .in('id', leadIds)

        return new Response(JSON.stringify({ success: true, count: matches.length }), {
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
