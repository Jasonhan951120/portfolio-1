import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const FROM = "onboarding@resend.dev";

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
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
    const { email, role, token, clinic_name, origin } = await req.json();

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({
        success: false,
        error: "RESEND_API_KEY not set"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const practiceName = clinic_name || "London Smile Dental";
    const inviteLink = `${origin || "http://localhost:5173"}/login?invite=${token}`;
    const roleTitle = role === 'admin' ? 'Clinic Administrator' : 'Staff Specialist';

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: `You've been invited to join ${practiceName} on AntiGravity ✨`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            </style>
          </head>
          <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 60px 0;">
              <tr>
                <td align="center">
                  <table width="560" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; border-radius: 24px; border: 1px solid #1f1f1f; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);">
                    <!-- Header with Gradient -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #1e1e1e 0%, #000000 100%); padding: 60px 40px; text-align: center; border-bottom: 1px solid #1f1f1f;">
                        <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: -0.02em;">AntiGravity</h1>
                        <p style="color: #888888; font-size: 14px; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.2em;">Secure Dental OS</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 60px 50px;">
                        <p style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0 0 24px 0;">
                          Welcome to the future of dentistry.
                        </p>
                        
                        <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 40px 0;">
                          You have been invited to join <strong style="color: #ffffff;">${practiceName}</strong> as a <strong style="color: #ffffff;">${roleTitle}</strong>. Access your new clinical workspace through the secure gateway below.
                        </p>

                        <!-- CTA Button -->
                        <div style="text-align: center; margin-bottom: 40px;">
                          <a href="${inviteLink}" style="display: inline-block; background: #ffffff; color: #000000; text-decoration: none; font-weight: 700; font-size: 16px; padding: 18px 45px; border-radius: 14px; box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);">
                            Accept Invitation
                          </a>
                        </div>

                        <!-- Info Card -->
                        <div style="background-color: #111111; border-radius: 16px; padding: 24px; border: 1px solid #1f1f1f;">
                          <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">
                            <strong>Security Note:</strong> This invitation is unique to your account. If you cannot click the button, copy the link below:
                            <br><br>
                            <span style="color: #444444; word-break: break-all; font-family: monospace; font-size: 12px;">${inviteLink}</span>
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #000000; padding: 40px; text-align: center; border-top: 1px solid #1f1f1f;">
                        <p style="color: #444444; font-size: 13px; margin: 0;">
                          © 2026 AntiGravity Labs. All rights reserved.<br>
                          Precision-engineered for modern clinical workflows.
                        </p>
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

    const resText = await res.text();
    if (!res.ok) {
      return new Response(JSON.stringify({ success: false, error: `Resend Error: ${resText}` }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(JSON.stringify({ success: true, data: JSON.parse(resText) }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
