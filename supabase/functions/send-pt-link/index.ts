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
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; padding-bottom: 40px; }
              .clinic-name { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; text-transform: uppercase; margin: 0; }
              .divider { height: 1px; background-color: #f4f4f5; margin: 40px 0; }
              .note-container { background-color: #f8f9fa; border-radius: 16px; padding: 32px; border: 1px solid #f1f1f1; margin: 48px 0; }
              .note-text { font-size: 16px; line-height: 1.8; color: #1e293b; white-space: pre-wrap; margin: 0; font-family: 'Inter', serif; }
              .cta-container { text-align: center; padding: 32px 0; }
              .cta-button { background-color: #18181b; color: #ffffff !important; padding: 20px 48px; border-radius: 9999px; text-decoration: none; font-size: 16px; font-weight: 700; display: inline-block; transition: all 0.2s; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
              .footer { text-align: center; padding-top: 60px; color: #a1a1aa; font-size: 12px; }
              .security-note { color: #8c8c8c; font-size: 12px; margin-top: 24px; font-weight: 500; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                ${clinic_logo ? `<img src="${clinic_logo}" alt="${practiceName}" style="max-height: 50px; margin-bottom: 12px;">` : `<p class="clinic-name">${practiceName}</p>`}
                <div style="width: 40px; height: 2px; background-color: #18181b; margin: 16px auto;"></div>
              </div>

              <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 32px;">A Private Invitation</h1>
              
              <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Dear ${name},</p>
              
              <div class="note-container">
                <p class="note-text">${(personalized_note || '').replace(/\n/g, '<br>')}</p>
              </div>

              <div class="cta-container">
                <a href="${ptLink}" class="cta-button">View My Bespoke Smile Transformation →</a>
                <p class="security-note">This secure, personalized link will expire in 48 hours to protect your privacy.</p>
              </div>

              <div class="divider"></div>

              <div class="footer">
                <p style="font-weight: 700; color: #71717a; margin-bottom: 4px;">${practiceName}</p>
                <p style="margin: 0;">${clinic_address || "Exclusive Dental Care"}</p>
                <p style="margin: 4px 0;">${clinic_phone || ""}</p>
                <div style="margin-top: 20px;">
                  <a href="${baseUrl}" style="color: #71717a; text-decoration: underline;">Visit Website</a>
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
