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
        const { lead_id, name, email, service } = await req.json();

        if (!RESEND_API_KEY) {
            console.error("RESEND_API_KEY not set");
            return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });
        }

        const ptLink = `https://london-smile-dental.vercel.app/pt/${lead_id}`;

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: `London Smile Dental <${FROM}>`,
                to: [email],
                subject: `Your Personalized ${service} Treatment Plan — London Smile ✨`,
                html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333;">
            <div style="text-align:center;margin-bottom:30px;">
                <h1 style="color:#1a1a2e;font-size:24px;margin-bottom:5px;">London Smile Dental</h1>
                <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0;">Exclusive Patient Presentation</p>
            </div>
            
            <h2 style="color:#1a1a2e;font-size:20px;">Hello ${name},</h2>
            <p style="color:#555;line-height:1.6;font-size:15px;">
              Thank you for inquiring about <strong>${service}</strong>. As promised, our clinical team has prepared a personalized 3D treatment presentation just for you.
            </p>
            
            <div style="background:#f8fafc;padding:25px;border-radius:12px;margin:30px 0;text-align:center;border:1px solid #e2e8f0;">
              <h3 style="margin:0 0 15px 0;color:#1a1a2e;font-size:18px;">Your Custom Treatment Plan</h3>
              <p style="margin:0 0 25px 0;color:#64748b;font-size:14px;">Review your clinical status, 3D simulations, timeframe, and exact transparent pricing.</p>
              
              <a href="${ptLink}"
                 style="display:inline-block;padding:16px 36px;background:#1a1a2e;color:white;text-decoration:none;border-radius:12px;font-weight:bold;font-size:15px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
                View My Presentation →
              </a>
              <p style="margin:15px 0 0 0;font-size:11px;color:#94a3b8;">*This secure link is generated uniquely for you.</p>
            </div>
            
            <p style="color:#555;line-height:1.6;font-size:15px;">
              Take your time to review the details. When you are ready, you can securely confirm your consultation slot directly through the presentation link.
            </p>
            
            <hr style="border:none;border-top:1px solid #eee;margin:30px 0;" />
            
            <table style="width:100%;">
              <tr>
                <td style="font-size:12px;color:#888;line-height:1.5;">
                  <strong>The London Smile Team</strong><br/>
                  123 Harley Street, London W1G 6AB<br/>
                  📞 020 7123 4567<br/>
                  <a href="https://london-smile-dental.vercel.app/" style="color:#3b82f6;text-decoration:none;">londonsmiledental.com</a>
                </td>
              </tr>
            </table>
          </div>
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
