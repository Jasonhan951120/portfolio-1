import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM = "onboarding@resend.dev"; // Use verified domain in production

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { lead_id, name, email, service, origin, clinic_name, clinic_logo, brand_color, clinic_phone, clinic_address, clinic_email, personalized_note } = await req.json();

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });
    }

    const baseUrl = origin || "https://london-smile-dental.vercel.app";
    const ptLink = `${baseUrl}/pt/${lead_id}`;
    const primaryColor = brand_color || "#18181b";
    const practiceName = clinic_name || "London Smile Dental";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `PT Proposal <${FROM}>`,
        to: [email],
        subject: `Your Personalized ${service} Treatment Plan ✨`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background-color: #ffffff; color: #18181b; }
              .container { max-width: 600px; margin: 0 auto; padding: 60px 24px; }
              .header { text-align: center; padding-bottom: 48px; }
              .clinic-name { font-size: 14px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin: 0; color: #71717a; }
              .divider { height: 1px; background-color: #f4f4f5; margin: 60px 0; }
              .main-content { margin-bottom: 48px; }
              .note-text { font-size: 18px; line-height: 1.8; color: #27272a; white-space: pre-wrap; margin: 0; }
              .cta-container { text-align: left; padding: 48px 0; border-top: 1px solid #f4f4f5; }
              .cta-button { background-color: #18181b; color: #ffffff !important; padding: 22px 48px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: 700; display: inline-block; transition: all 0.2s; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
              .footer { text-align: left; padding-top: 40px; color: #a1a1aa; font-size: 13px; line-height: 1.6; }
              .security-note { color: #a1a1aa; font-size: 13px; margin-top: 32px; font-weight: 500; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                ${clinic_logo ? `<img src="${clinic_logo}" alt="${practiceName}" style="max-height: 50px; margin-bottom: 12px;">` : `<p class="clinic-name">${practiceName}</p>`}
                <div style="width: 40px; height: 2px; background-color: #18181b; margin: 16px auto;"></div>
              </div>

              <h1 style="font-size: 32px; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 48px; color: #09090b; line-height: 1.1;">
                Your Personalized ${service} Plan
              </h1>
              
              <div class="main-content">
                <p class="note-text">${(personalized_note || '').replace(/\n/g, '<br>')}</p>
              </div>

              <div class="cta-container">
                <a href="${ptLink}" class="cta-button">View Full Treatment Plan →</a>
                <p class="security-note">This secure, personalized link will expire in 48 hours to protect your privacy.</p>
              </div>

              <div class="footer">
                <p style="font-weight: 700; color: #18181b; margin-bottom: 4px; font-size: 14px;">${practiceName}</p>
                <p style="margin: 0;">${clinic_address || "Executive Dental Care"}</p>
                <p style="margin: 4px 0;">${clinic_phone || ""}</p>
                <div style="margin-top: 24px;">
                  <a href="${baseUrl}" style="color: #71717a; text-decoration: none; border-bottom: 1px solid #71717a;">Visit Website</a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const resData = await res.json();
    console.log("Resend response:", resData);

    if (!res.ok) {
      console.error("Resend API error:", resData);
      return new Response(JSON.stringify({ error: resData.message || "Email provider error" }), { 
        status: res.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(JSON.stringify({ success: true, id: resData.id }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Edge function crash:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
