import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

console.log("Reputation Autopilot Edge Function started!");

serve(async (req) => {
    try {
        const payload = await req.json()
        // Payload from PostgreSQL trigger on consultation_requests
        // Expected structure: { type: 'UPDATE', record: { id, name, status, ... } }

        if (payload.record && payload.record.status === 'Treated') {
            const patientName = payload.record.name || 'Patient';
            const clinicId = payload.record.clinic_id || 'default';
            console.log(`[Reputation Autopilot] Triggering automated review request for: ${patientName} at clinic ${clinicId}`);

            // Simulate WhatsApp Business API payload
            const whatsappPayload = {
                messaging_product: "whatsapp",
                to: payload.record.whatsapp_number || payload.record.phone || "00000000",
                type: "template",
                template: {
                    name: "luxury_review_request",
                    language: { code: "en_GB" },
                    components: [
                        { type: "body", parameters: [{ type: "text", text: patientName }] }
                    ]
                }
            };

            const simulatedMessage = `[WhatsApp API Log] Sent Template: "Hi ${patientName}, it was a pleasure welcoming you to the clinic. If you loved your clinical experience, we would be honoured by a Google review: https://g.page/r/clinic-link/review"`;
            console.log(simulatedMessage);

            return new Response(
                JSON.stringify({
                    success: true,
                    action: "whatsapp_review_requested",
                    payload: whatsappPayload,
                    timestamp: new Date().toISOString()
                }),
                { headers: { "Content-Type": "application/json" } },
            )
        }

        return new Response(
            JSON.stringify({ success: true, message: "No action required. Status not 'Treated'." }),
            { headers: { "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        )
    }
})
