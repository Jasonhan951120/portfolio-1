import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req: Request) => {
    // Foundation for Stripe Signature Verification
    // In a real production scenario, you would use the stripe-node library to verify the signature
    // const signature = req.headers.get("stripe-signature");

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const event = await req.json();

        console.log(`🔔 Received event: ${event.type}`);

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const clinicId = session.metadata?.clinic_id;
                const customerId = session.customer;
                const subscriptionId = session.subscription;

                if (clinicId) {
                    console.log(`✅ Activating subscription for clinic: ${clinicId}`);
                    await supabase
                        .from("clinics")
                        .update({
                            subscription_status: "active",
                            stripe_customer_id: customerId,
                            subscription_id: subscriptionId,
                        })
                        .eq("id", clinicId);
                }
                break;
            }

            case "customer.subscription.deleted":
            case "customer.subscription.updated": {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                const status = subscription.status;

                // Map Stripe status to our DB status
                let dbStatus = "none";
                if (status === "active") dbStatus = "active";
                else if (status === "past_due") dbStatus = "past_due";
                else if (status === "trialing") dbStatus = "trialing";

                console.log(`ℹ️ Updating subscription status for customer ${customerId} to ${dbStatus}`);

                await supabase
                    .from("clinics")
                    .update({ subscription_status: dbStatus })
                    .eq("stripe_customer_id", customerId);
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (err) {
        console.error("Webhook Error:", err);
        return new Response(JSON.stringify({ error: String(err) }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
});
