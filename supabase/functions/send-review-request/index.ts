import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

console.log("Reputation Autopilot Edge Function started!");

serve(async (req) => {
    try {
        const payload = await req.json()
        // Payload from PostgreSQL trigger on consultation_requests
        // Expected structure: { type: 'UPDATE', record: { id, name, status, ... } }

        if (payload.record && payload.record.status === 'Treated') {
            const patientName = payload.record.name || 'Patient';
            console.log(`[Reputation Autopilot] Triggering automated review request for: ${patientName}`);

            // Simulate SMS/WhatsApp send
            const message = `Hi ${patientName}, it was great seeing you! If you loved your treatment, we'd appreciate a quick Google review: https://g.page/r/clinic-link/review`;

            // In a real scenario, integrate twilio or whatsapp cloud API here.

            return new Response(
                JSON.stringify({
                    success: true,
                    action: "sent_review_request",
                    message: message,
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
