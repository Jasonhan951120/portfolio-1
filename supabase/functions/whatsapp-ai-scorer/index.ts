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
        const { lead_id, message_text } = await req.json()

        if (!lead_id || !message_text) {
            throw new Error("Missing 'lead_id' or 'message_text'.")
        }

        // Initialize Supabase Client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Simulate LLM Processing to determine intent and potential_value
        const lowerMessage = message_text.toLowerCase()
        let intentScore = 30 // default low intent
        let potentialValue = 500 // default general consulting

        if (lowerMessage.includes('implant') || lowerMessage.includes('replace teeth')) {
            intentScore = 85
            potentialValue = 4500
        } else if (lowerMessage.includes('veneer') || lowerMessage.includes('smile makeover')) {
            intentScore = 90
            potentialValue = 6000
        } else if (lowerMessage.includes('invisalign') || lowerMessage.includes('straighten')) {
            intentScore = 75
            potentialValue = 3500
        } else if (lowerMessage.includes('pain') || lowerMessage.includes('emergency')) {
            intentScore = 95
            potentialValue = 800
        }

        // Slightly randomize for realism
        intentScore += Math.floor(Math.random() * 10) - 5
        intentScore = Math.max(1, Math.min(100, intentScore))

        // Update the consultation_requests table
        const { error: updateError } = await supabaseClient
            .from('consultation_requests')
            .update({
                intent_score: intentScore,
                potential_value: potentialValue
            })
            .eq('id', lead_id)

        if (updateError) throw updateError

        return new Response(JSON.stringify({
            success: true,
            ai_analysis: { intentScore, potentialValue }
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
