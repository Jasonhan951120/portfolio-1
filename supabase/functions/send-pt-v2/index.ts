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
    const { lead_id, name, email, service, origin, clinic_name, clinic_logo, clinic_phone, clinic_address, personalized_note, subject } = await req.json();

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });
    }


    const baseUrl = origin || "https://london-smile-dental.vercel.app";
    const ptLink = `${baseUrl}/pt/${lead_id}`;
    const practiceName = clinic_name || "London Smile Dental";

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #ffffff; 
            color: #1e293b; 
            line-height: 1.8; 
          }
          .wrapper { 
            width: 100%; 
            table-layout: fixed; 
            background-color: #ffffff; 
            padding: 80px 0; 
          }
          .container { 
            margin: 0 auto; 
            width: 100%; 
            max-width: 600px; 
            padding: 0 40px; 
          }
          .header { 
            padding-bottom: 60px; 
            text-align: left; 
          }
          .content { 
            padding-bottom: 60px; 
          }
          .clinic-logo { 
            max-height: 32px; 
            margin-bottom: 32px; 
          }
          .clinic-name { 
            font-size: 14px; 
            font-weight: 800; 
            letter-spacing: 0.2em; 
            text-transform: uppercase; 
            color: #0f172a; 
            margin: 0; 
          }
          .note-container { 
            margin: 0 0 60px; 
          }
          .note-text { 
            font-size: 18px; 
            color: #0f172a; 
            font-weight: 400; 
            white-space: pre-wrap; 
            margin: 0; 
          }
          .cta-container { 
            text-align: left; 
            margin-top: 60px; 
            padding-top: 60px; 
            border-top: 1px solid #f1f5f9; 
          }
          .cta-button { 
            background-color: #0f172a; 
            color: #ffffff !important; 
            padding: 24px 48px; 
            border-radius: 12px; 
            font-size: 16px; 
            font-weight: 700; 
            text-decoration: none; 
            display: inline-block; 
            transition: all 0.2s; 
          }
          .footer { 
            text-align: left; 
            padding-top: 80px; 
            color: #94a3b8; 
            font-size: 12px; 
            font-weight: 500; 
            letter-spacing: 0.02em;
          }
          .footer p { 
            margin: 6px 0; 
          }
          @media screen and (max-width: 600px) {
            .container { padding: 0 32px; }
            .note-text { font-size: 16px; }
            .wrapper { padding: 40px 0; }
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
              <div class="note-container">
                <p class="note-text">${(personalized_note || '').replace(/\n/g, '<br>')}</p>
              </div>

              <div class="cta-container">
                <a href="${ptLink}" class="cta-button">View Full Treatment Proposal →</a>
              </div>
            </div>
            <div class="footer">
              <p style="font-weight: 700; color: #0f172a; margin-bottom: 12px; font-size: 14px;">${practiceName}</p>
              <p>${clinic_address || ""}</p>
              <p>${clinic_phone || ""}</p>
              <div style="margin-top: 32px;">
                <a href="${baseUrl}" style="color: #64748b; text-decoration: none; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">Official Clinic Portal</a>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `PT Proposal <${FROM}>`,
        to: [email],
        subject: subject || `Your Bespoke ${service} Plan ✨`,
        html: htmlContent,
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
