import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM = "onboarding@resend.dev"; // Default Resend test email

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
    const { email, role, token, clinic_name, origin, invited_by } = await req.json();

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });
    }

    const baseUrl = origin || "http://localhost:5173";
    const inviteLink = `${baseUrl}/login?invite=${token}`;
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
        subject: `You've been invited to join ${practiceName} on AntiGravity ✨`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            </style>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    <tr>
                      <td style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 24px;">
                           <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0;">${practiceName}</h1>
                        </div>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
                          Hello,
                          <br><br>
                          You have been invited to join <strong>${practiceName}</strong> as a <strong>${role === 'admin' ? 'Clinic Administrator' : 'Staff Specialist'}</strong> on the AntiGravity Dental Platform.
                        </p>

                        <div style="background-color: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; border: 1px dashed #d1d5db; margin-bottom: 24px;">
                           <p style="color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0;">Your Secure Invite Link</p>
                           <a href="${inviteLink}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px;">
                             Accept Invitation
                           </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
                          If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="color: #3b82f6; font-size: 12px; word-break: break-all; margin: 0;">
                          ${inviteLink}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                          Powered by AntiGravity • Secure Dental Operations
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

    if (!res.ok) {
      const err = await res.text();
      console.error("Staff invite email error:", err);
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
