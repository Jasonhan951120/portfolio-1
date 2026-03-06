import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const payload = await req.json();

        // WhatsApp webhook verification (GET request with hub.challenge)
        if (req.method === 'GET') {
            const url = new URL(req.url);
            const mode = url.searchParams.get('hub.mode');
            const token = url.searchParams.get('hub.verify_token');
            const challenge = url.searchParams.get('hub.challenge');

            if (mode && token) {
                if (mode === 'subscribe' && token === Deno.env.get('WHATSAPP_VERIFY_TOKEN')) {
                    return new Response(challenge, { status: 200 });
                }
            }
            return new Response('Forbidden', { status: 403 });
        }

        // Process incoming message
        // WhatsApp structure: payload.entry[0].changes[0].value.messages[0]
        const entry = payload.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (!message) {
            // Not a message event (could be a status update)
            return new Response('OK', { status: 200 });
        }

        const fromNumber = message.from; // Sender's phone number
        const body = message.text?.body; // Message content

        if (!fromNumber || !body) {
            return new Response('Missing info', { status: 200 });
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Identity matching logic
        const { data: leadMatch } = await supabase
            .from('consultation_requests')
            .select('id, clinic_id')
            .eq('phone', fromNumber)
            .limit(1)
            .maybeSingle();

        const messageData = {
            clinic_id: leadMatch?.clinic_id || null, // Best effort
            lead_id: leadMatch?.id || null,
            sender_raw: fromNumber,
            channel: 'whatsapp',
            content: body,
            direction: 'inbound',
            is_read: false
        };

        const { error: insertError } = await supabase
            .from('messages')
            .insert([messageData]);

        if (insertError) {
            throw insertError;
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Error processing WhatsApp webhook:', error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
