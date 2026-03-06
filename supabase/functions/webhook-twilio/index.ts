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
        // Twilio sends data as application/x-www-form-urlencoded
        const formData = await req.formData();
        const fromNumber = formData.get('From')?.toString();
        const body = formData.get('Body')?.toString();
        const to = formData.get('To')?.toString(); // Our Twilio number

        if (!fromNumber || !body) {
            return new Response(JSON.stringify({ error: 'Missing From or Body' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Identity matching logic
        // Attempt to match the sender's phone number to a lead in the CRM
        const { data: leadMatch } = await supabase
            .from('consultation_requests')
            .select('id, clinic_id')
            .eq('phone', fromNumber)
            .limit(1)
            .maybeSingle();

        // If no lead match, we might assign it to a default clinic or leave clinic_id null.
        // For this prototype, we'll assume a default clinic_id if not matched, or handle it dynamically.
        // We will just insert what we know.
        const messageData = {
            clinic_id: leadMatch?.clinic_id || null, // Best effort
            lead_id: leadMatch?.id || null,
            sender_raw: fromNumber,
            channel: 'sms',
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

        // Return empty TwiML response to acknowledge receipt
        return new Response('<Response></Response>', {
            headers: { ...corsHeaders, 'Content-Type': 'text/xml' },
            status: 200,
        });

    } catch (error) {
        console.error('Error processing Twilio webhook:', error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
