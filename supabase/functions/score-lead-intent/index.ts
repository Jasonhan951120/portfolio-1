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
        const { record } = await req.json()

        // 1. Initialize Supabase
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 2. Prepare Prompt (Anonymized)
        const prompt = `Analyze this dental lead:
Treatment: ${record.service}
Notes: ${record.notes || 'No message provided'}

Tasks:
1. Assign an Intent Score (1-100) based on urgency and clarity of the message.
2. Estimate Potential Value in GBP (£).
3. Provide a 1-sentence "AI Summary" for the clinical staff.

Return ONLY JSON:
{ "intent_score": number, "potential_value": number, "ai_summary": "string" }`

        // 3. Call OpenAI
        const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: "json_object" }
            }),
        })

        if (!openAiResponse.ok) {
            const errText = await openAiResponse.text();
            throw new Error(`OpenAI API error ${openAiResponse.status}: ${errText}`);
        }

        const aiData = await openAiResponse.json()
        const content = JSON.parse(aiData.choices[0].message.content)

        // 4. Update Lead Record
        const { error } = await supabaseClient
            .from('consultation_requests')
            .update({
                intent_score: content.intent_score,
                potential_value: content.potential_value,
                ai_summary: content.ai_summary
            })
            .eq('id', record.id)

        if (error) throw error

        return new Response(JSON.stringify({ success: true, analysis: content }), {
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
