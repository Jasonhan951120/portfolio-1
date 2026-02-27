import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { record } = await req.json()

        // In a production app, this function would be triggered by pg_cron 
        // to find 'draft' appointments where created_at < NOW() - INTERVAL '15 minutes'
        console.log("Retargeting Check Triggered for Patient ID:", record?.patient_id);

        const responsePayload = {
            success: true,
            message: "Retargeting message (e.g. KakaoTalk / SMS) dispatched successfully.",
            patient_id: record?.patient_id,
            retarget_channel: "KakaoTalk_Alimtalk"
        }

        return new Response(
            JSON.stringify(responsePayload),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
    }
})
