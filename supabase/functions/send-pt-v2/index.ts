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
    const { lead_id, name, email, service, origin, clinic_name, clinic_logo, clinic_phone, clinic_address, personalized_note } = await req.json();

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });
    }

    const baseUrl = origin || "https://london-smile-dental.vercel.app";
    const ptLink = `${baseUrl}/pt/${lead_id}`;
    const practiceName = clinic_name || "London Smile Dental";

    // Build the HTML with Luxury Executive Aesthetic - UNBOXED LOOK
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background-color: #ffffff; color: #1e293b; line-height: 1.6; }
          .wrapper { width: 100%; table-layout: fixed; background-color: #ffffff; padding: 60px 0; }
          .container { margin: 0 auto; width: 100%; max-width: 600px; padding: 0 24px; }
          .header { padding-bottom: 48px; text-align: left; }
          .content { padding-bottom: 48px; }
          .clinic-logo { max-height: 32px; margin-bottom: 24px; }
          .clinic-name { font-size: 16px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #0f172a; margin: 0; }
          .h1 { font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; margin: 0 0 40px; line-height: 1.1; }
          .note-container { margin: 0 0 48px; }
          .note-text { font-size: 17px; color: #1e293b; font-weight: 400; white-space: pre-wrap; margin: 0; line-height: 1.8; }
          .cta-container { text-align: left; margin-top: 48px; padding-top: 48px; border-top: 1px solid #f1f5f9; }
          .cta-button { background-color: #0f172a; color: #ffffff !important; padding: 20px 40px; border-radius: 12px; font-size: 15px; font-weight: 700; text-decoration: none; display: inline-block; transition: all 0.2s; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.1); }
          .footer { text-align: left; padding-top: 60px; color: #94a3b8; font-size: 12px; font-weight: 500; }
          .footer p { margin: 4px 0; }
          @media screen and (max-width: 600px) {
            .h1 { font-size: 28px; }
            .container { padding: 0 20px; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              ${clinic_logo ? `<img src="${clinic_logo}" alt="${practiceName}" class="clinic-logo">` : `<p class="clinic-name">${practiceName}</p>`}
            </div>
            <div class="content">
              <h1 class="h1">Your Personalized ${service} Plan</h1>
              
              <div class="note-container">
                <p class="note-text">${(personalized_note || '').replace(/\n/g, '<br>')}</p>
              </div>

              <div class="cta-container">
                <a href="${ptLink}" class="cta-button">View My Bespoke Proposal →</a>
                <p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">This secure, personalized link will protect your clinical privacy.</p>
              </div>
            </div>
            <div class="footer">
              <p style="font-weight: 700; color: #0f172a; margin-bottom: 8px;">${practiceName}</p>
              <p>${clinic_address || ""}</p>
              <p>${clinic_phone || ""}</p>
              <div style="margin-top: 24px;">
                <a href="${baseUrl}" style="color: #64748b; text-decoration: none; border-bottom: 1px solid #e2e8f0;">Official Website</a>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // CRITICAL: Variable Leak Protection (Safety Regex)
    const bodyStart = htmlContent.indexOf('<body>');
    const headPart = htmlContent.substring(0, bodyStart);
    let bodyPart = htmlContent.substring(bodyStart);
    
    // Replace unparsed variables in the body only
    // bodyPart = bodyPart.replace(/\${[^}]*}/g, ' '); // No redaction needed here if we trust the values
    // bodyPart = bodyPart.replace(/\{[^}]*}/g, ' ');

    const finalHtml = headPart + bodyPart;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `PT Proposal <${FROM}>`,
        to: [email],
        subject: `Your Bespoke ${service} Plan ✨`,
        html: finalHtml,
      }),
    });

    const resData = await res.json();
    console.log("Resend response:", resData);

    if (!res.ok) {
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
