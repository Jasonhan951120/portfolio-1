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
    const { lead_id, name, email, service, origin, clinic_name, clinic_logo, brand_color, clinic_phone, clinic_address, clinic_email } = await req.json();

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });
    }

    const baseUrl = origin || "https://london-smile-dental.vercel.app";
    const ptLink = `${baseUrl}/pt/${lead_id}`;
    const primaryColor = brand_color || "#1a1a2e";
    const practiceName = clinic_name || "London Smile Dental";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${practiceName} <${FROM}>`,
        to: [email],
        subject: `Your Personalized ${service} Treatment Plan — ${practiceName} ✨`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
            </style>
          </head>
          <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
                    <!-- Header -->
                    <tr>
                      <td align="center" style="padding-bottom: 40px;">
                        ${clinic_logo ? `<img src="${clinic_logo}" alt="${practiceName}" style="max-height: 60px; width: auto; margin-bottom: 20px;">` : `<h1 style="color: #000000; font-family: 'Playfair Display', serif; font-size: 28px; margin: 0; letter-spacing: -0.02em;">${practiceName}</h1>`}
                        <p style="color: #999999; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; margin: 8px 0 0 0;">Exclusive Patient Presentation</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 0 40px;">
                        <h2 style="color: #000000; font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Hello ${name},</h2>
                        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                          Thank you for inquiring about <strong style="color: #000000;">${service}</strong>. As promised, our clinical team has prepared a personalized 3D treatment presentation just for you.
                        </p>
                        
                        <!-- CTA Card -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 24px; border-collapse: separate;">
                          <tr>
                            <td align="center" style="padding: 48px 40px;">
                              <h3 style="color: #000000; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">Your Custom Treatment Plan</h3>
                              <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0 0 32px 0;">Review your clinical status, 3D simulations, timeframe, and exact transparent pricing.</p>
                              
                              <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td align="center" bgcolor="${primaryColor}" style="border-radius: 12px;">
                                    <a href="${ptLink}" target="_blank" style="display: inline-block; padding: 18px 48px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.02em;">
                                      View My Presentation →
                                    </a>
                                  </td>
                                </tr>
                              </table>
                              <p style="color: #bbbbbb; font-size: 11px; margin: 24px 0 0 0;">*This secure link is generated uniquely for you.</p>
                            </td>
                          </tr>
                        </table>

                        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6; margin: 32px 0 0 0;">
                          Take your time to review the details. When you are ready, you can securely confirm your consultation slot directly through the presentation link.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 60px 40px 40px 40px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #f0f0f0; padding-top: 32px;">
                          <tr>
                            <td style="color: #999999; font-size: 12px; line-height: 1.8;">
                              <strong style="color: #000000; font-size: 13px;">The ${practiceName} Team</strong><br/>
                              ${clinic_address || "123 Harley Street, London W1G 6AB"}<br/>
                              ${clinic_phone ? `📞 ${clinic_phone}<br/>` : ""}
                              <a href="${baseUrl}" style="color: ${primaryColor}; text-decoration: none; font-weight: 600;">Visit our website</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Patient email error:", err);
      throw new Error(err);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
});
